import { Player } from "@/data/players";

/**
 * NOTE: This store is deprecated in favor of using the PlayerContext
 * See client/src/contexts/PlayerContext.tsx for the new implementation
 * 
 * This file is kept only for reference and compatibility with existing code.
 */

// Placeholder exports to avoid breaking changes
export const addPlayer = (_newPlayer: Omit<Player, 'id'>) => {
  console.warn('playerStore is deprecated, use PlayerContext instead');
};

export const updatePlayer = (_updatedPlayer: Player) => {
  console.warn('playerStore is deprecated, use PlayerContext instead');
};

export const deletePlayer = (_id: number) => {
  console.warn('playerStore is deprecated, use PlayerContext instead');
};

// Empty array to avoid breaking existing code
export const usePlayers = () => {
  console.warn('playerStore is deprecated, use PlayerContext instead');
  return [] as Player[];
};