import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Player } from "@/data/players";
import { 
  FaTimes, FaUserAlt, FaChartBar, FaRegListAlt, FaCrown,
  FaRegCalendarAlt, FaCrosshairs, FaChessKnight, FaTrophy,
  FaSkull, FaFire, FaMedal, FaShieldAlt
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateCombatTitle, generateDistinctiveTitle } from "@/lib/titleGenerator";
import { PlayerBadges } from "./PlayerBadges";
import { getPlayerBadge, getNextBadge, getPointsForNextBadge } from "@/lib/badgeSystem";

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
  
  // Get player badge and tier information from the badge system
  const playerBadge = useMemo(() => getPlayerBadge(player), [player]);
  const nextBadge = useMemo(() => getNextBadge(player), [player]);
  const pointsForNextBadge = useMemo(() => getPointsForNextBadge(player), [player]);
  
  // Memoized function to get color for rank tier based on the badge
  const getRankTierColor = useCallback(() => {
    return { 
      color: playerBadge.color, 
      bg: `${playerBadge.color}15` // Add 15% opacity version for background
    };
  }, [playerBadge]);
  
  // Memoized function to get rank tier name based on the badge
  const getRankTierName = useCallback(() => {
    return playerBadge.name;
  }, [playerBadge]);
  
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="relative bg-gradient-to-b from-gray-900/95 to-gray-950/95 rounded-xl shadow-2xl max-w-2xl w-full animate-scaleIn overflow-hidden border border-gray-800"
        style={{ 
          maxHeight: '85vh',
          boxShadow: `0 0 40px ${getRankTierColor().color}30, 0 0 100px ${getRankTierColor().color}10`
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-20 left-30 w-2 h-2 bg-purple-500/50 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-3 h-3 bg-indigo-500/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500/70 via-indigo-500/70 to-purple-500/70"></div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 hover:rotate-90 transform duration-300 bg-gray-800/80 hover:bg-gray-700/80 p-2 rounded-full border border-gray-700/50"
        >
          <FaTimes size={16} />
        </button>
        
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-indigo-900/20 z-0"></div>
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
            <svg className="absolute top-0 right-0 opacity-10" width="300" height="300" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: getRankTierColor().color, stopOpacity: 0.5}} />
                  <stop offset="100%" style={{stopColor: "#6366F1", stopOpacity: 0.2}} />
                </linearGradient>
              </defs>
              <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="url(#grad)" strokeWidth="0.5" />
              <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="url(#grad)" strokeWidth="0.5" />
              <path d="M0,70 Q25,20 50,70 T100,70" fill="none" stroke="url(#grad)" strokeWidth="0.5" />
              <path d="M0,80 Q25,30 50,80 T100,80" fill="none" stroke="url(#grad)" strokeWidth="0.5" />
              <path d="M0,90 Q25,40 50,90 T100,90" fill="none" stroke="url(#grad)" strokeWidth="0.5" />
            </svg>
          </div>
          
          <div className="p-8 relative z-1">
            <div className="flex items-center space-x-5">
              {/* Player Avatar */}
              <div className="relative">
                <div 
                  className="relative w-18 h-18 rounded-xl p-5 border transition-all duration-300 transform hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${getRankTierColor().color}20, transparent)`,
                    borderColor: `${getRankTierColor().color}40`,
                    boxShadow: `0 0 20px ${getRankTierColor().color}20`
                  }}
                >
                  <playerBadge.icon size={36} className="text-white" style={{ color: getRankTierColor().color }} />
                  
                  {/* Animated pulse effect */}
                  <div className="absolute inset-0 rounded-xl border-2 opacity-50 animate-pingSlower" 
                    style={{ borderColor: `${getRankTierColor().color}30` }}></div>
                </div>
                
                {/* Rank indicator for top 3 */}
                {player.rank <= 3 && (
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg"
                    style={{
                      background: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : '#CD7F32',
                      borderColor: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <span className="text-xs font-bold text-gray-900">{player.rank}</span>
                  </div>
                )}
              </div>
              
              {/* Player Info */}
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-white to-gray-300 inline-block text-transparent bg-clip-text">
                      {player.name}
                    </span>
                  </h3>
                  
                  {/* Retired badge */}
                  {player.isRetired && (
                    <Badge 
                      variant="outline" 
                      className="ml-3 bg-gray-800/80 text-gray-300 border-gray-600 px-2"
                    >
                      Retired Legend
                    </Badge>
                  )}
                </div>
                
                {/* Combat Title */}
                <div className="mt-2 flex items-center">
                  <FaChessKnight className="text-purple-500 mr-2" size={14} />
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                    {player.combatTitle || generateDistinctiveTitle(player)}
                  </span>
                </div>
                
                {/* Player stats */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-gray-800/60 rounded-lg px-2 py-1 border border-gray-700/50">
                    <div className="flex items-center mr-2">
                      <div 
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: getRankTierColor().color }}
                      ></div>
                      <span className="text-xs font-medium" style={{ color: getRankTierColor().color }}>
                        {getRankTierName()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Tier</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-800/60 rounded-lg px-2 py-1 border border-gray-700/50">
                    <FaTrophy className="text-yellow-500 mr-1 text-xs" />
                    <span className="text-xs text-white font-medium mr-1">#{player.rank}</span>
                    <span className="text-xs text-gray-400">Rank</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-800/60 rounded-lg px-2 py-1 border border-gray-700/50">
                    <FaSkull className="text-red-500 mr-1 text-xs" />
                    <span className="text-xs text-white font-medium mr-1">{formatNumber(player.kills || 0)}</span>
                    <span className="text-xs text-gray-400">Kills</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-800/60 rounded-lg px-2 py-1 border border-gray-700/50">
                    <FaFire className="text-orange-500 mr-1 text-xs" />
                    <span className="text-xs text-white font-medium mr-1">{winRate}%</span>
                    <span className="text-xs text-gray-400">Win Rate</span>
                  </div>
                </div>
                
                {/* Player badges */}
                <div className="mt-4">
                  <PlayerBadges player={player} showAll={true} size="sm" className="flex-wrap gap-1" />
                </div>
              </div>
            </div>
            
            {/* Combat Points & Progress */}
            <div className="mt-6 bg-gray-800/30 rounded-lg p-4 border border-gray-700/40 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mr-3">
                    <FaTrophy size={14} className="text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-300 font-medium">Combat Points</span>
                    <div className="flex items-center mt-0.5">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                        {formatNumber(player.points)}
                      </span>
                      
                      {player.isRetired && player.peakPoints && (
                        <div className="flex items-center ml-2 bg-gray-800/80 px-2 py-0.5 rounded-md border border-gray-700/50">
                          <span className="text-xs text-gray-400 mr-1">Peak:</span>
                          <span className="text-xs text-yellow-400 font-medium">{formatNumber(player.peakPoints)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {nextBadge && pointsForNextBadge && !player.isRetired && (
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Next Tier</div>
                    <div className="flex items-center">
                      <nextBadge.icon className="mr-1 text-xs" style={{ color: nextBadge.color }} />
                      <span className="text-sm font-medium" style={{ color: nextBadge.color }}>
                        {nextBadge.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({pointsForNextBadge} pts needed)
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative h-3 bg-gray-900/80 rounded-full overflow-hidden mt-2 border border-gray-800/80">
                <div 
                  className="absolute inset-0 h-full rounded-full overflow-hidden bg-gray-800/50"
                  style={{ 
                    width: `${progress}%`,
                    background: `linear-gradient(to right, ${getRankTierColor().color}, ${nextBadge ? nextBadge.color : getRankTierColor().color})`,
                    boxShadow: `0 0 10px ${getRankTierColor().color}50`
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="shimmer-effect absolute inset-0"></div>
                </div>
                
                {/* Progress markers */}
                <div className="absolute inset-0 flex items-center">
                  {[0, 25, 50, 75, 100].map((marker) => (
                    <div 
                      key={marker} 
                      className="absolute h-3 flex flex-col items-center justify-center"
                      style={{ left: `${marker}%` }}
                    >
                      <div 
                        className={`w-0.5 h-1.5 ${marker <= progress ? 'bg-white/70' : 'bg-gray-700/50'}`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
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