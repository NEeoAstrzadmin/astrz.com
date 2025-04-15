import { Player } from "@/data/players";
import { apiRequest } from "@/lib/queryClient";

export interface PredictionResult {
  predictedRank: number;
  predictedPoints: number;
  winProbability: number;
  improvementAreas: string[];
  strengthAreas: string[];
  commentary: string;
}

/**
 * Generate AI predictions for player performance using the server API
 */
export async function generatePlayerPrediction(
  player: Player,
  allPlayers: Player[]
): Promise<PredictionResult> {
  try {
    // Call the server API endpoint
    const response = await apiRequest<PredictionResult>('/api/ai/predict', {
      method: 'POST',
      body: JSON.stringify({ player, allPlayers }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response;
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
 * Generate performance improvement tips based on player statistics
 */
export async function generateImprovementTips(player: Player): Promise<string[]> {
  try {
    // Call the server API endpoint
    const response = await apiRequest<{ tips: string[] }>('/api/ai/improvement-tips', {
      method: 'POST',
      body: JSON.stringify({ player }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.tips || ["Focus on improving your win rate", "Study top players' strategies", "Work on maintaining longer win streaks"];
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
    // Call the server API endpoint
    const response = await apiRequest<{
      winProbability: number;
      predictedScore: string;
      analysis: string;
    }>('/api/ai/matchup', {
      method: 'POST',
      body: JSON.stringify({ player, opponent }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error predicting match outcome:", error);
    
    return {
      winProbability: 0.5,
      predictedScore: "Unable to predict",
      analysis: "Match prediction unavailable at this time."
    };
  }
}