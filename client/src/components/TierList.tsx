import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/data/players";
import { FaCrown } from "react-icons/fa";

interface LeaderboardProps {
  players: Player[];
}

export default function Leaderboard({ players }: LeaderboardProps) {
  const [rowVisibility, setRowVisibility] = useState<Record<number, boolean>>({});

  // Colors for the leaderboard
  const purpleAccent = "hsl(265 91% 58%)";
  const goldColor = "#FFD700";
  const silverColor = "#C0C0C0";
  const bronzeColor = "#CD7F32";
  
  // Get crown color based on rank
  const getCrownColor = (rank: number) => {
    if (rank === 1) return goldColor;
    if (rank === 2) return silverColor;
    if (rank === 3) return bronzeColor;
    return "";
  };

  // Animate rows with staggered delay
  useEffect(() => {
    // Sort players by rank for proper animation
    const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);
    
    sortedPlayers.forEach((player, index) => {
      setTimeout(() => {
        setRowVisibility(prev => ({
          ...prev,
          [player.rank]: true
        }));
      }, index * 50); // Faster animation
    });
  }, [players]);

  // Sort players by rank
  const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);

  return (
    <section id="leaderboard" className="space-y-6">
      <div className="bg-gray-900/60 border border-purple-900/50 rounded-lg overflow-hidden shadow-xl">
        <div className="bg-purple-900/30 border-b border-purple-900/50 py-4 px-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="text-purple-400 mr-2">
              <FaCrown />
            </span>
            Astrz Combat Leaderboard
          </h2>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-800 bg-gray-800/50 text-sm font-medium text-gray-400">
          <div className="col-span-1">RANK</div>
          <div className="col-span-7">PLAYER</div>
          <div className="col-span-4 text-right">POINTS</div>
        </div>
        
        {/* Player Rows */}
        <div className="divide-y divide-gray-800/60">
          {sortedPlayers.map((player) => {
            const isTopThree = player.rank <= 3;
            const crownColor = getCrownColor(player.rank);
            
            return (
              <div 
                key={player.rank} 
                className={`grid grid-cols-12 py-3 px-4 items-center transition-all duration-300 ${
                  rowVisibility[player.rank] ? 'opacity-100' : 'opacity-0'
                } ${isTopThree ? 'bg-gray-800/40 hover:bg-gray-800/60' : 'hover:bg-gray-900/70'}`}
                style={{ 
                  transform: rowVisibility[player.rank] ? 'translateY(0)' : 'translateY(5px)',
                  borderLeft: isTopThree ? `4px solid ${crownColor}` : undefined
                }}
              >
                <div className="col-span-1 font-mono font-semibold flex items-center">
                  {player.rank <= 3 && (
                    <FaCrown 
                      className="mr-1.5 inline" 
                      style={{ color: crownColor }}
                      size={player.rank === 1 ? 18 : 14}
                    />
                  )}
                  <span className={player.rank <= 3 ? "hidden md:inline" : ""}>
                    {player.rank}.
                  </span>
                </div>
                <div className="col-span-7 font-medium text-white">{player.name}</div>
                <div 
                  className={`col-span-4 text-right font-mono ${
                    player.rank === 1 
                      ? 'text-yellow-400 font-bold' 
                      : player.rank <= 3 
                        ? 'text-purple-300 font-semibold' 
                        : 'text-gray-300'
                  }`}
                >
                  {player.points} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
