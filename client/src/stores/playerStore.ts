import { Player, players as initialPlayers } from "@/data/players";
import { useState, useEffect } from "react";

// Store the players list in a module-scoped variable
let players = [...initialPlayers];
let listeners: (() => void)[] = [];

// Function to notify all listeners when the players list changes
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Add a player to the list
export const addPlayer = (newPlayer: Player) => {
  // Generate a valid rank if not provided
  if (!newPlayer.rank) {
    const maxRank = Math.max(...players.map(p => p.rank));
    newPlayer.rank = maxRank + 1;
  }
  players = [...players, newPlayer];
  notifyListeners();
};

// Update a player in the list
export const updatePlayer = (updatedPlayer: Player) => {
  players = players.map(player =>
    player.rank === updatedPlayer.rank ? updatedPlayer : player
  );
  notifyListeners();
};

// Delete a player from the list
export const deletePlayer = (rank: number) => {
  players = players.filter(player => player.rank !== rank);
  notifyListeners();
};

// Hook to subscribe to changes in the players list
export const usePlayers = () => {
  const [state, setState] = useState(players);

  useEffect(() => {
    // Add listener
    const listener = () => setState([...players]);
    listeners.push(listener);

    // Return cleanup function to remove listener
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return state;
};