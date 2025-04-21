import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
