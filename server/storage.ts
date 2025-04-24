import { users, players, playerMatchups, type User, type InsertUser, type Player, type InsertPlayer, type PlayerMatchup } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

// Helper function to reverse a match score (e.g. "3-2" becomes "2-3")
function reverseScore(score: string): string {
  const parts = score.split('-');
  if (parts.length === 2) {
    return `${parts[1]}-${parts[0]}`;
  }
  return score;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Player methods
  getAllPlayers(): Promise<Player[]>;
  getActivePlayersSortedByRank(): Promise<Player[]>;
  getRetiredPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<boolean>;
  updateRanks(): Promise<void>;
  recordMatch(
    winnerId: number, 
    loserId: number, 
    winnerKills?: number, 
    winnerData?: { kills?: number, winStreak?: number },
    matchData?: { location?: string, score?: string, matchDate?: string }
  ): Promise<void>;
  calculatePointsForMatch(winnerRank: number, loserRank: number): number;
  
  // Player matchup methods
  getPlayerMatchups(playerId: number): Promise<PlayerMatchup[]>;
  getMatchupBetweenPlayers(playerId: number, opponentId: number): Promise<PlayerMatchup | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getActivePlayersSortedByRank(): Promise<Player[]> {
    return await db.select()
      .from(players)
      .where(eq(players.isRetired, false))
      .orderBy(players.rank);
  }

  async getRetiredPlayers(): Promise<Player[]> {
    return await db.select()
      .from(players)
      .where(eq(players.isRetired, true))
      .orderBy(desc(players.points));
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db.insert(players).values(player).returning();
    await this.updateRanks();
    return newPlayer;
  }

  async updatePlayer(id: number, playerData: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [updatedPlayer] = await db
      .update(players)
      .set({
        ...playerData,
        updatedAt: new Date(),
      })
      .where(eq(players.id, id))
      .returning();
    
    if (playerData.points) {
      await this.updateRanks();
    }
    
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    const result = await db.delete(players).where(eq(players.id, id)).returning({ id: players.id });
    if (result.length === 0) {
      return false;
    }
    await this.updateRanks();
    return true;
  }

  async updateRanks(): Promise<void> {
    // Get all active players sorted by points
    const activePlayers = await db.select()
      .from(players)
      .where(eq(players.isRetired, false))
      .orderBy(desc(players.points));

    // Update ranks sequentially
    for (let i = 0; i < activePlayers.length; i++) {
      const newRank = i + 1;
      await db.update(players)
        .set({ rank: newRank })
        .where(eq(players.id, activePlayers[i].id));
    }
  }

  async recordMatch(
    winnerId: number, 
    loserId: number, 
    winnerKills: number = 0, 
    winnerData?: { kills?: number, winStreak?: number },
    matchData?: { location?: string, score?: string, matchDate?: string }
  ): Promise<void> {
    // Get winner and loser
    const [winner] = await db.select().from(players).where(eq(players.id, winnerId));
    const [loser] = await db.select().from(players).where(eq(players.id, loserId));

    if (!winner || !loser) {
      throw new Error("Players not found");
    }

    // Calculate points based on rank difference
    const pointsGained = this.calculatePointsForMatch(winner.rank, loser.rank);
    
    // Calculate points based on win/loss ratio
    // If a player has more wins than losses, they get extra points
    const winLossDifference = (winner.wins ?? 0) - (winner.losses ?? 0);
    const bonusPoints = winLossDifference > 0 ? Math.min(3, Math.floor(winLossDifference / 10)) : 0;
    
    const totalPointsGained = pointsGained + bonusPoints;

    // Set the default values for custom stats
    const updatedKills = (winner.kills ?? 0) + (winnerKills || 0);
    const updatedWinStreak = winnerData?.winStreak !== undefined 
      ? winnerData.winStreak 
      : (winner.winStreak ?? 0) + 1;

    // Update winner stats with custom values if provided
    await db.update(players)
      .set({
        wins: (winner.wins ?? 0) + 1,
        winStreak: updatedWinStreak,
        kills: updatedKills,
        points: (winner.points ?? 0) + totalPointsGained,
        peakPoints: Math.max((winner.peakPoints ?? 0), (winner.points ?? 0) + totalPointsGained),
        updatedAt: new Date()
      })
      .where(eq(players.id, winnerId));

    // Calculate points to deduct from loser (about 1/3 of what winner gained, minimum 1)
    const pointsToDeduct = Math.max(1, Math.ceil(totalPointsGained / 3));
    
    // Update loser stats
    await db.update(players)
      .set({
        losses: (loser.losses ?? 0) + 1,
        winStreak: 0,
        points: Math.max(0, (loser.points ?? 0) - pointsToDeduct), // Ensure points don't go below 0
        updatedAt: new Date()
      })
      .where(eq(players.id, loserId));

    // Update head-to-head matchup stats for both players
    
    // For winner against loser
    const [existingWinnerMatchup] = await db
      .select()
      .from(playerMatchups)
      .where(and(
        eq(playerMatchups.playerId, winnerId),
        eq(playerMatchups.opponentId, loserId)
      ));
    
    const matchDate = matchData?.matchDate ? new Date(matchData.matchDate) : new Date();
    
    if (existingWinnerMatchup) {
      await db.update(playerMatchups)
        .set({
          wins: (existingWinnerMatchup.wins ?? 0) + 1,
          lastMatchDate: matchDate,
          lastMatchLocation: matchData?.location || existingWinnerMatchup.lastMatchLocation,
          lastMatchScore: matchData?.score || existingWinnerMatchup.lastMatchScore
        })
        .where(and(
          eq(playerMatchups.playerId, winnerId),
          eq(playerMatchups.opponentId, loserId)
        ));
    } else {
      await db.insert(playerMatchups)
        .values({
          playerId: winnerId,
          opponentId: loserId,
          wins: 1,
          losses: 0,
          lastMatchDate: matchDate,
          lastMatchLocation: matchData?.location,
          lastMatchScore: matchData?.score
        });
    }
    
    // For loser against winner
    const [existingLoserMatchup] = await db
      .select()
      .from(playerMatchups)
      .where(and(
        eq(playerMatchups.playerId, loserId),
        eq(playerMatchups.opponentId, winnerId)
      ));
    
    if (existingLoserMatchup) {
      await db.update(playerMatchups)
        .set({
          losses: (existingLoserMatchup.losses ?? 0) + 1,
          lastMatchDate: matchDate,
          lastMatchLocation: matchData?.location || existingLoserMatchup.lastMatchLocation,
          lastMatchScore: matchData?.score ? reverseScore(matchData.score) : existingLoserMatchup.lastMatchScore
        })
        .where(and(
          eq(playerMatchups.playerId, loserId),
          eq(playerMatchups.opponentId, winnerId)
        ));
    } else {
      await db.insert(playerMatchups)
        .values({
          playerId: loserId,
          opponentId: winnerId,
          wins: 0,
          losses: 1,
          lastMatchDate: matchDate,
          lastMatchLocation: matchData?.location,
          lastMatchScore: matchData?.score ? reverseScore(matchData.score) : undefined
        });
    }

    // Update ranks after the match
    await this.updateRanks();
  }
  
  // Get all matchups for a player
  async getPlayerMatchups(playerId: number): Promise<PlayerMatchup[]> {
    return await db
      .select()
      .from(playerMatchups)
      .where(eq(playerMatchups.playerId, playerId))
      .orderBy(desc(playerMatchups.lastMatchDate));
  }
  
  // Get specific matchup between two players
  async getMatchupBetweenPlayers(playerId: number, opponentId: number): Promise<PlayerMatchup | undefined> {
    const [matchup] = await db
      .select()
      .from(playerMatchups)
      .where(and(
        eq(playerMatchups.playerId, playerId),
        eq(playerMatchups.opponentId, opponentId)
      ));
    
    return matchup;
  }

  calculatePointsForMatch(winnerRank: number, loserRank: number): number {
    const rankDifference = winnerRank - loserRank;
    
    // If winner has better rank (lower number) than loser
    if (rankDifference < 0) {
      // Higher-ranked player beating lower-ranked player gets fewer points
      // The bigger the rank gap, the fewer points awarded
      return 1; // Minimum points for an expected win
    } 
    // If winner has worse rank (higher number) than loser
    else if (rankDifference > 0) {
      // Lower-ranked player beating higher-ranked player gets more points
      // The bigger the rank gap, the more points awarded
      // Maximum 10 points for beating someone much higher ranked
      return Math.min(10, 1 + Math.floor(rankDifference / 3));
    }
    // Same rank players
    else {
      return 3; // Base points for beating same-ranked player
    }
  }
}

export const storage = new DatabaseStorage();
