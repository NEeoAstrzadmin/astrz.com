import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerSchema } from "@shared/schema";
import { z } from "zod";

// Player routes
export async function registerRoutes(app: Express): Promise<Server> {
  // Get all players
  app.get("/api/players", async (_req: Request, res: Response) => {
    try {
      const activePlayers = await storage.getActivePlayersSortedByRank();
      const retiredPlayers = await storage.getRetiredPlayers();
      
      res.json({
        active: activePlayers,
        retired: retiredPlayers
      });
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  // Get a specific player
  app.get("/api/players/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      console.error("Error fetching player:", error);
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  // Create a new player
  app.post("/api/players", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPlayerSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ error: validatedData.error });
      }
      
      const newPlayer = await storage.createPlayer(validatedData.data);
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ error: "Failed to create player" });
    }
  });

  // Update a player
  app.put("/api/players/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      const validatedData = insertPlayerSchema.partial().safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ error: validatedData.error });
      }
      
      const updatedPlayer = await storage.updatePlayer(id, validatedData.data);
      res.json(updatedPlayer);
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  // Delete a player
  app.delete("/api/players/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePlayer(id);
      
      if (!success) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      res.json({ message: "Player deleted successfully" });
    } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({ error: "Failed to delete player" });
    }
  });

  // Record a match between two players
  app.post("/api/matches", async (req: Request, res: Response) => {
    try {
      const matchSchema = z.object({
        winnerId: z.number(),
        loserId: z.number(),
        winnerKills: z.number().default(0)
      });
      
      const validatedData = matchSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ error: validatedData.error });
      }
      
      await storage.recordMatch(
        validatedData.data.winnerId,
        validatedData.data.loserId,
        validatedData.data.winnerKills
      );
      
      res.json({ message: "Match recorded successfully" });
    } catch (error) {
      console.error("Error recording match:", error);
      res.status(500).json({ error: "Failed to record match" });
    }
  });

  // Update all player ranks based on points
  app.post("/api/players/update-ranks", async (_req: Request, res: Response) => {
    try {
      await storage.updateRanks();
      res.json({ message: "Ranks updated successfully" });
    } catch (error) {
      console.error("Error updating ranks:", error);
      res.status(500).json({ error: "Failed to update ranks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
