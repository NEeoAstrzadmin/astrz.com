import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Player } from "@/data/players";
import { 
  FaTimes, FaCrown, FaUserAlt, FaTrophy, FaSkull, 
  FaFire, FaMedal, FaChartBar, FaRegListAlt, 
  FaRegCalendarAlt, FaShieldAlt, FaCrosshairs, FaChessKnight
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateCombatTitle, generateDistinctiveTitle } from "@/lib/titleGenerator";

interface PlayerCardProps {
  player: Player;
  onClose: () => void;
}

// Create memoized component for better performance
const PlayerCard = memo(({ player, onClose }: PlayerCardProps) => {
  const [progress, setProgress] = useState(0);
  const [statAnimate, setStatAnimate] = useState(false);
  
  // Memoize calculated values to prevent recalculation on re-renders
  const winRate = useMemo(() => {
    return player.wins !== undefined && (player.wins + (player.losses || 0) > 0)
      ? Math.round((player.wins / (player.wins + (player.losses || 0))) * 100) 
      : 0;
  }, [player.wins, player.losses]);

  // Memoized format function to prevent re-creation on re-renders
  const formatNumber = useCallback((num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);
  
  // Memoized function to get color for rank tier
  const getRankTierColor = useCallback(() => {
    if (player.isRetired) return { color: "#C0C0C0", bg: "rgba(192, 192, 192, 0.15)" };
    
    if (player.points >= 250) return { color: "#FF6B6B", bg: "rgba(255, 107, 107, 0.15)" };
    if (player.points >= 180) return { color: "#4D96FF", bg: "rgba(77, 150, 255, 0.15)" };
    if (player.points >= 100) return { color: "#9FE6A0", bg: "rgba(159, 230, 160, 0.15)" };
    return { color: "#FFBD35", bg: "rgba(255, 189, 53, 0.15)" };
  }, [player.isRetired, player.points]);
  
  // Memoized function to get rank tier name
  const getRankTierName = useCallback(() => {
    if (player.isRetired) return "Retired Legend";
    
    if (player.points >= 250) return "Astrz Prime";
    if (player.points >= 180) return "Astrz Vanguard";
    if (player.points >= 100) return "Astrz Challenger";
    return "Astrz Edge";
  }, [player.isRetired, player.points]);
  
  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => setProgress(Math.min(100, player.points / 3)), 100);
    const statTimer = setTimeout(() => setStatAnimate(true), 300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(statTimer);
    };
  }, [player.points]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div 
        className="relative bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/50 rounded-xl shadow-2xl max-w-lg w-full animate-scaleIn overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 hover:rotate-90 transform duration-300"
        >
          <FaTimes size={20} />
        </button>
        
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/20 z-0"></div>
          
          <div className="p-6 relative z-1">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-900/40 rounded-full p-3 border border-purple-500/30 shadow-lg animate-pulse">
                <FaUserAlt size={30} className="text-purple-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-white">{player.name}</h3>
                  {player.rank <= 3 && !player.isRetired && (
                    <FaCrown 
                      size={16} 
                      className={player.rank === 1 ? "text-yellow-400" : player.rank === 2 ? "text-gray-300" : "text-amber-600"} 
                    />
                  )}
                </div>
                
                <div className="flex items-center mt-1">
                  <Badge 
                    variant="outline" 
                    className="mr-2 text-xs px-2 py-0.5"
                    style={{ 
                      backgroundColor: getRankTierColor().bg,
                      color: getRankTierColor().color,
                      borderColor: `${getRankTierColor().color}50`
                    }}
                  >
                    {getRankTierName()}
                  </Badge>
                  
                  <span className="text-sm text-gray-400">Rank #{player.rank}</span>
                </div>
                
                {/* Combat Title */}
                <div className="mt-2 flex items-center">
                  <FaChessKnight className="text-purple-500 mr-2" size={14} />
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                    {player.combatTitle || generateDistinctiveTitle(player)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Points bar */}
            <div className="mt-5">
              <div className="flex justify-between items-center mb-1.5 text-sm">
                <div className="text-gray-400 flex items-center">
                  <FaTrophy size={12} className="text-yellow-500 mr-1.5" />
                  Combat Points
                </div>
                <div className="font-mono font-medium text-white">
                  {player.isRetired && player.peakPoints 
                    ? (
                      <span>
                        <span className="text-gray-300">{player.points}</span>
                        <span className="text-gray-500 mx-1">/</span>
                        <span className="text-yellow-400">{player.peakPoints}</span>
                        <span className="text-xs text-gray-500 ml-1">(Peak)</span>
                      </span>
                    )
                    : (
                      <span className="text-purple-300">{player.points} 
                        <span className="text-xs text-gray-500 ml-1">pts</span>
                      </span>
                    )
                  }
                </div>
              </div>
              <Progress 
                value={progress} 
                className="h-2.5 bg-gray-800" 
              />
            </div>
          </div>
        </div>
        
        {/* Stats area with scrollable content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[50vh] styled-scrollbar">
          {/* Match record */}
          {player.wins !== undefined && (
            <div className={`transition-all duration-500 ${statAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h4 className="text-sm text-gray-400 mb-3 flex items-center">
                <FaChartBar className="mr-2 text-purple-400" />
                Match Statistics
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gradient-to-b from-green-900/20 to-green-900/10 p-4 rounded-lg border border-green-700/20 hover:border-green-500/50 transition-all float-on-hover">
                  <div className="text-green-400 font-bold text-2xl">{player.wins || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Wins</div>
                  <div className="h-1 mt-2 bg-gray-800 rounded-full overflow-hidden w-full">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 animate-shimmer"
                      style={{ width: `${Math.min(100, ((player.wins || 0) / ((player.wins || 0) + (player.losses || 0) || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-red-900/20 to-red-900/10 p-4 rounded-lg border border-red-700/20 hover:border-red-500/50 transition-all float-on-hover">
                  <div className="text-red-400 font-bold text-2xl">{player.losses || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">Losses</div>
                  <div className="h-1 mt-2 bg-gray-800 rounded-full overflow-hidden w-full">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-400 animate-shimmer"
                      style={{ width: `${Math.min(100, ((player.losses || 0) / ((player.wins || 0) + (player.losses || 0) || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-blue-900/20 to-blue-900/10 p-4 rounded-lg border border-blue-700/20 hover:border-blue-500/50 transition-all float-on-hover">
                  <div className="text-blue-400 font-bold text-2xl">{winRate}%</div>
                  <div className="text-xs text-gray-400 mt-1">Win Rate</div>
                  <div className="flex justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 mx-0.5 rounded-full ${i < Math.floor(winRate / 20) ? 'bg-blue-400' : 'bg-gray-700'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Combat Statistics */}
          {player.kills !== undefined && (
            <div className={`transition-all duration-500 delay-200 ${statAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h4 className="text-sm text-gray-400 mb-3 flex items-center">
                <FaRegListAlt className="mr-2 text-purple-400" />
                Combat Statistics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 hover:border-red-500/40 transition-all float-on-hover">
                  <div className="bg-red-900/30 p-2 rounded-full animate-pulse">
                    <FaSkull className="text-red-400" size={16} />
                  </div>
                  <div className="w-full">
                    <div className="text-xs text-gray-400">Total Kills</div>
                    <div className="font-bold text-white text-lg flex items-center">
                      {formatNumber(player.kills || 0)}
                      <div className="ml-2 flex items-end">
                        {Array.from({ length: Math.min(5, Math.ceil((player.kills || 0) / 80)) }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 mx-0.5 bg-red-500 rounded-t-sm"
                            style={{ 
                              height: `${4 + (i * 2)}px`,
                              opacity: 1 - (i * 0.15)
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 hover:border-orange-500/40 transition-all float-on-hover">
                  <div className="bg-orange-900/30 p-2 rounded-full animate-pulse">
                    <FaFire className="text-orange-400" size={16} />
                  </div>
                  <div className="w-full">
                    <div className="text-xs text-gray-400">Win Streak</div>
                    <div className="font-bold text-white text-lg flex items-center">
                      {player.winStreak || 0}
                      <div className="ml-2 flex">
                        {Array.from({ length: Math.min(5, player.winStreak || 0) }).map((_, i) => (
                          <div 
                            key={i} 
                            style={{ 
                              opacity: 1 - (i * 0.2),
                              animation: 'pulse 1.5s infinite',
                              animationDelay: `${i * 0.2}s`
                            }}
                          >
                            <FaFire size={10} className="text-orange-500 mx-0.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Achievements */}
          {(player.teamChampion !== undefined || player.mcSatChampion !== undefined) && (
            <div className={`transition-all duration-500 delay-300 ${statAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h4 className="text-sm text-gray-400 mb-3 flex items-center">
                <FaMedal className="mr-2 text-purple-400" />
                Achievements
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 hover:border-yellow-500/40 transition-all float-on-hover">
                  <div className="bg-yellow-900/30 p-2 rounded-full animate-pulse">
                    <FaShieldAlt className="text-yellow-400" size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Team Champion</div>
                    <div className="font-bold text-white text-lg">
                      {player.teamChampion || 0}
                      {(player.teamChampion || 0) > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          time{(player.teamChampion || 0) > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {(player.teamChampion || 0) > 0 && (
                      <div className="flex mt-1">
                        {Array.from({ length: Math.min(3, player.teamChampion || 0) }).map((_, i) => (
                          <div key={i} className="mr-1">
                            <FaMedal 
                              size={10} 
                              className="text-yellow-500" 
                              style={{ 
                                opacity: 1 - (i * 0.3),
                                animation: 'pulse 1.5s infinite',
                                animationDelay: `${i * 0.2}s`
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 hover:border-blue-500/40 transition-all float-on-hover">
                  <div className="bg-blue-900/30 p-2 rounded-full animate-pulse">
                    <FaCrosshairs className="text-blue-400" size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">MC SAT Champion</div>
                    <div className="font-bold text-white text-lg">
                      {player.mcSatChampion || 0}
                      {(player.mcSatChampion || 0) > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          time{(player.mcSatChampion || 0) > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {(player.mcSatChampion || 0) > 0 && (
                      <div className="flex mt-1">
                        {Array.from({ length: Math.min(3, player.mcSatChampion || 0) }).map((_, i) => (
                          <div key={i} className="mr-1">
                            <FaTrophy 
                              size={9} 
                              className="text-blue-400" 
                              style={{ 
                                opacity: 1 - (i * 0.3),
                                animation: 'pulse 1.5s infinite',
                                animationDelay: `${i * 0.2}s`
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Recent matches section removed as requested */}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-center bg-gray-900/60">
          <div className="text-xs text-gray-500">
            {player.isRetired 
              ? "Retired from active competition" 
              : "Active player"
            }
          </div>
        </div>
      </div>
    </div>
  );
});

export default PlayerCard;