import React, { createContext, useContext, useState, ReactNode } from "react";
import { Player, players as initialPlayers } from "@/data/players";

interface PlayerContextType {
  players: Player[];
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (rank: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const addPlayer = (newPlayer: Player) => {
    setPlayers((currentPlayers) => {
      // Generate a valid rank if not provided
      if (!newPlayer.rank) {
        const maxRank = Math.max(...currentPlayers.map(p => p.rank));
        newPlayer.rank = maxRank + 1;
      }
      return [...currentPlayers, newPlayer];
    });
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.rank === updatedPlayer.rank ? updatedPlayer : player
      )
    );
  };

  const deletePlayer = (rank: number) => {
    setPlayers((currentPlayers) =>
      currentPlayers.filter((player) => player.rank !== rank)
    );
  };

  return (
    <PlayerContext.Provider value={{ players, addPlayer, updatePlayer, deletePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayers() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayers must be used within a PlayerProvider");
  }
  return context;
}