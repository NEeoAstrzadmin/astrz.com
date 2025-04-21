import { useState, useEffect } from 'react';
import { Player, players, subscribeToPlayerChanges } from '@/data/players';

/**
 * Custom hook to access and watch for changes in the players data
 */
export function usePlayers() {
  const [playersList, setPlayersList] = useState<Player[]>(players);

  useEffect(() => {
    // Subscribe to changes in the players array
    const unsubscribe = subscribeToPlayerChanges(() => {
      setPlayersList([...players]);
    });

    // Cleanup subscription when component unmounts
    return unsubscribe;
  }, []);

  return playersList;
}