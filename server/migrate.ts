import { db } from "./db";
import { players, users, playerMatchups } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sql } from "drizzle-orm";
import { pool } from "./db";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function runMigration() {
  console.log("Starting database migration...");
  
  try {
    // Create tables using raw SQL since db.getSchema() is not available
    console.log("Creating tables if they don't exist...");
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL
      )
    `);
    
    // Create players table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "players" (
        "id" SERIAL PRIMARY KEY,
        "rank" INTEGER NOT NULL,
        "name" TEXT NOT NULL,
        "points" INTEGER NOT NULL DEFAULT 0,
        "recent_matches" TEXT DEFAULT '',
        "is_retired" BOOLEAN DEFAULT false,
        "peak_points" INTEGER DEFAULT 0,
        "combat_title" TEXT,
        "wins" INTEGER DEFAULT 0,
        "losses" INTEGER DEFAULT 0,
        "win_streak" INTEGER DEFAULT 0,
        "kills" INTEGER DEFAULT 0,
        "team_champion" INTEGER DEFAULT 0,
        "mc_sat_champion" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create player_matchups table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "player_matchups" (
        "player_id" INTEGER NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
        "opponent_id" INTEGER NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
        "wins" INTEGER DEFAULT 0,
        "losses" INTEGER DEFAULT 0,
        "last_match_date" TIMESTAMP DEFAULT NOW(),
        "last_match_location" TEXT,
        "last_match_score" TEXT,
        PRIMARY KEY ("player_id", "opponent_id")
      )
    `);
    
    console.log("Tables created successfully");
    
    // Check if admin user exists
    const existingUser = await db.select().from(users).where(sql`username = 'NeoAdmin'`);
    
    // Create admin user if it doesn't exist
    if (existingUser.length === 0) {
      console.log("Creating admin user...");
      await db.insert(users).values({
        username: "NeoAdmin",
        password: await hashPassword("qazwshfaubba1271da__2111ffaaASdaa22F")
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
    
    // Also create session store table for connect-pg-simple
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" VARCHAR NOT NULL COLLATE "default",
        "sess" JSON NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration().then(() => process.exit(0));