import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { Player } from "../../client/src/data/players";

// Initialize OpenAI client on the server side
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

const router = Router();

// Interface for prediction request
interface PredictionRequest {
  player: Player;
  allPlayers: Player[];
}

// Interface for prediction response
interface PredictionResult {
  predictedRank: number;
  predictedPoints: number;
  winProbability: number;
  improvementAreas: string[];
  strengthAreas: string[];
  commentary: string;
}

// Interface for improvement request
interface ImprovementRequest {
  player: Player;
}

// Interface for matchup request
interface MatchupRequest {
  player: Player;
  opponent: Player;
}

// Interface for matchup response
interface MatchupResult {
  winProbability: number;
  predictedScore: string;
  analysis: string;
}

// Generate player predictions
router.post("/predict", async (req: Request, res: Response) => {
  try {
    const { player, allPlayers } = req.body as PredictionRequest;
    
    if (!player) {
      return res.status(400).json({ error: "Player data is required" });
    }
    
    // Create prompt with player data
    const prompt = createPredictionPrompt(player, allPlayers || []);
    
    // Get prediction from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are an expert esports analyst specializing in competitive gaming statistics and predictions. Provide detailed analysis of player performance and make predictions about future rankings."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse and return the result
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    const prediction: PredictionResult = {
      predictedRank: result.predictedRank || player.rank,
      predictedPoints: result.predictedPoints || player.points,
      winProbability: result.winProbability || 0.5,
      improvementAreas: result.improvementAreas || ["No data available"],
      strengthAreas: result.strengthAreas || ["No data available"],
      commentary: result.commentary || "Analysis not available"
    };
    
    return res.json(prediction);
  } catch (error: any) {
    console.error("AI prediction error:", error);
    return res.status(500).json({ 
      error: "Failed to generate prediction", 
      details: error.message 
    });
  }
});

// Generate improvement tips for a player
router.post("/improvement-tips", async (req: Request, res: Response) => {
  try {
    const { player } = req.body as ImprovementRequest;
    
    if (!player) {
      return res.status(400).json({ error: "Player data is required" });
    }
    
    const winRate = player.stats 
      ? Math.round((player.stats.wins / (player.stats.wins + player.stats.losses || 1)) * 100) 
      : 0;
      
    const prompt = `
Player: ${player.name}
Rank: ${player.rank}
Points: ${player.points}
Win Rate: ${winRate}%
Wins: ${player.stats?.wins || 0}
Losses: ${player.stats?.losses || 0}
Current Win Streak: ${player.stats?.winStreak || 0}
Total Kills: ${player.stats?.kills || 0}

Based on this player's statistics, provide 3 specific tips to improve their competitive performance. 
Format the response as a JSON array of strings.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are an expert gaming coach who specializes in improving player performance in competitive games."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return res.json({ tips: result.tips || ["Focus on improving your win rate", "Study top players' strategies", "Work on maintaining longer win streaks"] });
  } catch (error: any) {
    console.error("Error generating improvement tips:", error);
    return res.status(500).json({ 
      error: "Failed to generate improvement tips",
      details: error.message 
    });
  }
});

// Predict matchup outcome between two players
router.post("/matchup", async (req: Request, res: Response) => {
  try {
    const { player, opponent } = req.body as MatchupRequest;
    
    if (!player || !opponent) {
      return res.status(400).json({ error: "Both player and opponent data are required" });
    }
    
    const prompt = `
PLAYER 1: ${player.name}
- Rank: ${player.rank}
- Points: ${player.points}
- Wins: ${player.stats?.wins || 0}
- Losses: ${player.stats?.losses || 0}
- Win Streak: ${player.stats?.winStreak || 0}
- Kills: ${player.stats?.kills || 0}

PLAYER 2: ${opponent.name}
- Rank: ${opponent.rank}
- Points: ${opponent.points}
- Wins: ${opponent.stats?.wins || 0}
- Losses: ${opponent.stats?.losses || 0}
- Win Streak: ${opponent.stats?.winStreak || 0}
- Kills: ${opponent.stats?.kills || 0}

Predict the outcome if these two players competed against each other. Provide:
1. Win probability for Player 1 (as a decimal between 0-1)
2. A potential match score (e.g., "3-2")
3. Brief analysis of how the match would likely play out

Format as a JSON object with these fields:
{
  "winProbability": number,
  "predictedScore": string,
  "analysis": string
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are an expert esports analyst who specializes in predicting match outcomes based on player statistics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    const matchupResult: MatchupResult = {
      winProbability: result.winProbability || 0.5,
      predictedScore: result.predictedScore || "3-2",
      analysis: result.analysis || "Analysis not available."
    };
    
    return res.json(matchupResult);
  } catch (error: any) {
    console.error("Error predicting match outcome:", error);
    return res.status(500).json({ 
      error: "Failed to predict match outcome",
      details: error.message 
    });
  }
});

/**
 * Create a comprehensive prompt for AI analysis
 */
function createPredictionPrompt(player: Player, allPlayers: Player[]): string {
  // Get top 5 players for comparison
  const topPlayers = allPlayers
    .filter(p => !p.isRetired)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);
  
  // Calculate player stats summaries
  const winRate = player.stats 
    ? Math.round((player.stats.wins / (player.stats.wins + player.stats.losses || 1)) * 100) 
    : 0;
  
  // Build the prompt
  return `
Analyze this player's performance data and predict future performance:

PLAYER: ${player.name}
CURRENT RANK: ${player.rank}
CURRENT POINTS: ${player.points}

STATISTICS:
- Wins: ${player.stats?.wins || 0}
- Losses: ${player.stats?.losses || 0}
- Win Rate: ${winRate}%
- Current Win Streak: ${player.stats?.winStreak || 0}
- Total Kills: ${player.stats?.kills || 0}
- Team Championship Wins: ${player.stats?.teamChampion || 0}

TOP COMPETITORS:
${topPlayers.map(p => `- Rank #${p.rank}: ${p.name} (${p.points} points)`).join("\n")}

Analyze this data and provide:
1. Predicted rank change in next competitions
2. Predicted points in next month
3. Win probability against similarly ranked players (as a decimal between 0-1)
4. 2-3 areas where the player can improve
5. 2-3 strength areas of this player
6. Brief commentary on overall performance trajectory

Format your response as a JSON object with these fields:
{
  "predictedRank": number,
  "predictedPoints": number,
  "winProbability": number,
  "improvementAreas": string[],
  "strengthAreas": string[],
  "commentary": string
}
`;
}

export default router;