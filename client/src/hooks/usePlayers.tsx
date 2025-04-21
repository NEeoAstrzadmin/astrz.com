import { useState, useEffect } from 'react';
import { Player, fetchPlayers } from '@/data/players';

/**
 * Custom hook to fetch and manage player data from the database
 */
export function usePlayers() {
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
    refreshPlayers();
    
    // Set up an interval to refresh the data every 30 seconds
    const intervalId = setInterval(refreshPlayers, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    activePlayers,
    retiredPlayers,
    allPlayers: [...activePlayers, ...retiredPlayers],
    loading,
    error,
    refreshPlayers
  };
}