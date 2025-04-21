import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Player, 
  fetchPlayers, 
  createPlayer as apiCreatePlayer,
  updatePlayer as apiUpdatePlayer,
  deletePlayer as apiDeletePlayer 
} from "@/data/players";

interface PlayerContextType {
  activePlayers: Player[];
  retiredPlayers: Player[];
  allPlayers: Player[];
  loading: boolean;
  error: string | null;
  addPlayer: (player: Omit<Player, 'id'>) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  deletePlayer: (id: number) => Promise<void>;
  refreshPlayers: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [retiredPlayers, setRetiredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPlayers = async () => {
    try {
      setLoading(true);
      const data = await fetchPlayers();
      setActivePlayers(data.active);
      setRetiredPlayers(data.retired);
      setError(null);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to load players. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial data load only
    refreshPlayers();
    
    // No automatic refresh interval to reduce RAM usage
    // Data will only refresh after explicit user actions
    
    return () => {}; // No cleanup needed
  }, []);

  const addPlayer = async (newPlayer: Omit<Player, 'id'>) => {
    try {
      await apiCreatePlayer(newPlayer);
      await refreshPlayers();
    } catch (err) {
      console.error('Error adding player:', err);
      setError('Failed to add player. Please try again.');
    }
  };

  const updatePlayer = async (player: Player) => {
    try {
      await apiUpdatePlayer(player.id, player);
      await refreshPlayers();
    } catch (err) {
      console.error('Error updating player:', err);
      setError('Failed to update player. Please try again.');
    }
  };

  const deletePlayer = async (id: number) => {
    try {
      await apiDeletePlayer(id);
      await refreshPlayers();
    } catch (err) {
      console.error('Error deleting player:', err);
      setError('Failed to delete player. Please try again.');
    }
  };

  const allPlayers = [...activePlayers, ...retiredPlayers];

  return (
    <PlayerContext.Provider value={{ 
      activePlayers, 
      retiredPlayers, 
      allPlayers,
      loading, 
      error, 
      addPlayer, 
      updatePlayer, 
      deletePlayer,
      refreshPlayers
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
}