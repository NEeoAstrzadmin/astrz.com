import OpenAI from "openai";
import { Player } from "@/data/players";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made server-side
});

export interface PredictionResult {
  predictedRank: number;
  predictedPoints: number;
  winProbability: number;
  improvementAreas: string[];
  strengthAreas: string[];
  commentary: string;
}

/**
 * Generate AI predictions for player performance
 */
export async function generatePlayerPrediction(
  player: Player,
  allPlayers: Player[]
): Promise<PredictionResult> {
  try {
    // Create prompt with player data
    const prompt = createPredictionPrompt(player, allPlayers);
    
    // Get prediction from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
    
    return {
      predictedRank: result.predictedRank || player.rank,
      predictedPoints: result.predictedPoints || player.points,
      winProbability: result.winProbability || 0.5,
      improvementAreas: result.improvementAreas || ["No data available"],
      strengthAreas: result.strengthAreas || ["No data available"],
      commentary: result.commentary || "Analysis not available"
    };
  } catch (error) {
    console.error("AI prediction error:", error);
    // Return fallback data if prediction fails
    return {
      predictedRank: player.rank,
      predictedPoints: player.points,
      winProbability: 0.5,
      improvementAreas: ["Analysis currently unavailable"],
      strengthAreas: ["Analysis currently unavailable"],
      commentary: "Unable to generate prediction at this time."
    };
  }
}

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

/**
 * Generate performance improvement tips based on player statistics
 */
export async function generateImprovementTips(player: Player): Promise<string[]> {
  try {
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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
    return result.tips || ["Focus on improving your win rate", "Study top players' strategies", "Work on maintaining longer win streaks"];
  } catch (error) {
    console.error("Error generating improvement tips:", error);
    return ["Focus on improving your win rate", "Study top players' strategies", "Work on maintaining longer win streaks"];
  }
}

/**
 * Generate match predictions against a specific opponent
 */
export async function predictMatchOutcome(player: Player, opponent: Player): Promise<{
  winProbability: number;
  predictedScore: string;
  analysis: string;
}> {
  try {
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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
    
    return {
      winProbability: result.winProbability || 0.5,
      predictedScore: result.predictedScore || "3-2",
      analysis: result.analysis || "Analysis not available."
    };
  } catch (error) {
    console.error("Error predicting match outcome:", error);
    
    return {
      winProbability: 0.5,
      predictedScore: "Unable to predict",
      analysis: "Match prediction unavailable at this time."
    };
  }
}