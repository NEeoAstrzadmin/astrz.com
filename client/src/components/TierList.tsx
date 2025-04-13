import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/data/players";
import { FaCrown, FaTrophy } from "react-icons/fa";

interface LeaderboardProps {
  players: Player[];
}

// Define rank tiers based on points
interface RankTier {
  name: string;
  color: string;
  minPoints: number;
  backgroundColor: string;
}

export default function Leaderboard({ players }: LeaderboardProps) {
  const [rowVisibility, setRowVisibility] = useState<Record<number, boolean>>({});
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [animatedRanks, setAnimatedRanks] = useState<Record<number, boolean>>({});

  // Colors for the leaderboard
  const goldColor = "#FFD700";
  const silverColor = "#C0C0C0";
  const bronzeColor = "#CD7F32";
  
  // Define rank tiers with color schemes
  const rankTiers: RankTier[] = [
    { name: "Astrz Prime", color: "#FF6B6B", minPoints: 250, backgroundColor: "rgba(255, 107, 107, 0.15)" },
    { name: "Astrz Vanguard", color: "#4D96FF", minPoints: 180, backgroundColor: "rgba(77, 150, 255, 0.15)" },
    { name: "Astrz Challenger", color: "#9FE6A0", minPoints: 100, backgroundColor: "rgba(159, 230, 160, 0.15)" },
    { name: "Astrz Edge", color: "#FFBD35", minPoints: 0, backgroundColor: "rgba(255, 189, 53, 0.15)" }
  ];
  
  // Get player's rank tier based on points
  const getPlayerRankTier = (points: number): RankTier => {
    return rankTiers.find(tier => points >= tier.minPoints) || rankTiers[rankTiers.length - 1];
  };
  
  // Get crown color based on rank position
  const getCrownColor = (rank: number) => {
    if (rank === 1) return goldColor;
    if (rank === 2) return silverColor;
    if (rank === 3) return bronzeColor;
    return "";
  };
  
  // Handle player selection
  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowMatchHistory(true);
  };
  
  // Render match history badges
  const renderMatchHistory = (matches: string = "") => {
    return matches.split('').map((result, index) => {
      const isWin = result === 'W';
      return (
        <div 
          key={index}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            isWin 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {result}
        </div>
      );
    });
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
        
        // Animate rank badges after row appears
        setTimeout(() => {
          setAnimatedRanks(prev => ({
            ...prev,
            [player.rank]: true
          }));
        }, 300);
      }, index * 50);
    });
  }, [players]);

  // Sort players by rank
  const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('match-history-modal');
      if (modal && !modal.contains(e.target as Node)) {
        setShowMatchHistory(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section id="leaderboard" className="space-y-6 relative">
      <div className="bg-gray-900/60 border border-purple-900/50 rounded-lg overflow-hidden shadow-xl animate-glow">
        <div className="bg-purple-900/30 border-b border-purple-900/50 py-4 px-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="text-purple-400 mr-2 animate-bounce">
              <FaCrown />
            </span>
            Astrz Rankings
          </h2>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-800 bg-gray-800/50 text-sm font-medium text-gray-400">
          <div className="col-span-1">RANK</div>
          <div className="col-span-7">PLAYER</div>
          <div className="col-span-4 text-right">POINTS</div>
        </div>
        
        {/* Rank Tiers Legend */}
        <div className="flex flex-wrap justify-between p-3 border-b border-gray-800 gap-2 animate-shimmer">
          {rankTiers.map((tier, index) => (
            <div 
              key={index}
              className="flex items-center hover:scale-110 transition-transform"
              style={{ color: tier.color }}
            >
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: tier.color }}
              ></div>
              <span className="text-xs font-medium">{tier.name}</span>
            </div>
          ))}
        </div>
        
        {/* Player Rows */}
        <div className="divide-y divide-gray-800/60">
          {sortedPlayers.map((player) => {
            const isTopThree = player.rank <= 3;
            const crownColor = getCrownColor(player.rank);
            const playerTier = getPlayerRankTier(player.points);
            
            return (
              <div 
                key={player.rank} 
                className={`grid grid-cols-12 py-3 px-4 items-center transition-all duration-300 ${
                  rowVisibility[player.rank] ? 'opacity-100' : 'opacity-0'
                } ${isTopThree ? 'bg-gray-800/40 hover:bg-gray-800/60' : 'hover:bg-gray-900/70'} hover:translate-x-1 transition-transform`}
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
                
                <div className="col-span-7 flex items-center">
                  {/* Animated Rank Badge */}
                  <div 
                    className={`mr-2 text-xs font-bold px-2 py-0.5 rounded-md transition-all duration-500 whitespace-nowrap overflow-hidden ${
                      animatedRanks[player.rank] ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
                    } ${
                      player.rank % 2 === 0 ? 'animate-pulse' : ''
                    }`}
                    style={{ 
                      backgroundColor: playerTier.backgroundColor,
                      color: playerTier.color,
                      borderLeft: `2px solid ${playerTier.color}`,
                      boxShadow: `0 0 8px ${playerTier.color}30`
                    }}
                  >
                    {playerTier.name}
                  </div>
                  
                  {/* Player Name */}
                  <div 
                    className="font-medium text-white hover:text-purple-300 cursor-pointer transition-colors"
                    onClick={() => handlePlayerClick(player)}
                  >
                    {player.name}
                  </div>
                </div>
                
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
      
      {/* Match History Modal */}
      {showMatchHistory && selectedPlayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            id="match-history-modal"
            className="bg-gray-900 border border-purple-600 rounded-lg shadow-xl max-w-md w-full p-5 animate-fadeIn"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3 animate-bounce"
                  style={{ 
                    backgroundColor: selectedPlayer.rank <= 3 ? `${getCrownColor(selectedPlayer.rank)}20` : 'rgba(139, 92, 246, 0.2)',
                    boxShadow: selectedPlayer.rank <= 3 ? `0 0 10px ${getCrownColor(selectedPlayer.rank)}80` : '0 0 10px rgba(139, 92, 246, 0.5)'
                  }}
                >
                  {selectedPlayer.rank <= 3 ? (
                    <FaCrown style={{ color: getCrownColor(selectedPlayer.rank) }} />
                  ) : (
                    <FaTrophy className="text-purple-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center">
                    {selectedPlayer.name}
                    <span 
                      className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                      style={{ 
                        backgroundColor: getPlayerRankTier(selectedPlayer.points).backgroundColor,
                        color: getPlayerRankTier(selectedPlayer.points).color
                      }}
                    >
                      {getPlayerRankTier(selectedPlayer.points).name}
                    </span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">Rank: {selectedPlayer.rank}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-purple-400 text-sm font-mono">{selectedPlayer.points} pts</span>
                  </div>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowMatchHistory(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="my-4 border-t border-gray-800"></div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Recent duel performances (last 7 matches)</h4>
              <div className="flex items-center justify-between space-x-2">
                {renderMatchHistory(selectedPlayer.recentMatches)}
              </div>
              
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-green-400 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  W: Wins ({selectedPlayer.recentMatches?.split('').filter(m => m === 'W').length || 0})
                </span>
                <span className="text-red-400 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  L: Losses ({selectedPlayer.recentMatches?.split('').filter(m => m === 'L').length || 0})
                </span>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-gray-800">
              <button 
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                onClick={() => setShowMatchHistory(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
