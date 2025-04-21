import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  rank: integer("rank").notNull(),
  name: text("name").notNull(),
  points: integer("points").notNull().default(0),
  recentMatches: text("recent_matches").default(""),
  isRetired: boolean("is_retired").default(false),
  peakPoints: integer("peak_points").default(0),
  combatTitle: text("combat_title"),
  // Stats stored directly in the player table for simplicity
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  winStreak: integer("win_streak").default(0),
  kills: integer("kills").default(0),
  teamChampion: integer("team_champion").default(0),
  mcSatChampion: integer("mc_sat_champion").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New table to track head-to-head player matches
export const playerMatchups = pgTable("player_matchups", {
  playerId: integer("player_id").notNull().references(() => players.id, { onDelete: 'cascade' }),
  opponentId: integer("opponent_id").notNull().references(() => players.id, { onDelete: 'cascade' }),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  lastMatchDate: timestamp("last_match_date").defaultNow(),
}, (table) => {
  return {
    // Composite primary key for player-opponent pair
    pk: primaryKey({ columns: [table.playerId, table.opponentId] }),
  };
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlayerMatchupSchema = createInsertSchema(playerMatchups);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertPlayerMatchup = z.infer<typeof insertPlayerMatchupSchema>;
export type PlayerMatchup = typeof playerMatchups.$inferSelect;
