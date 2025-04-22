import { useState, useEffect, useMemo, useCallback, memo } from "react";
import PlayerCard from "./PlayerCard";
// AI prediction component removed to optimize RAM usage
import { Player } from "@/data/players";
import { 
  FaCrown, FaTrophy, FaSkull, FaFireAlt, FaUserTimes, 
  FaChartLine, FaCog, FaInfoCircle, FaMedal,
  FaShieldAlt, FaBolt, FaFighterJet, FaChessKnight,
  FaRobot, FaBrain
} from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateCombatTitle, generateDistinctiveTitle } from "@/lib/titleGenerator";
import { PlayerBadges } from "./PlayerBadges";
import { getPlayerBadge, badges, retiredBadge } from "@/lib/badgeSystem";

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

// Memoized player row to avoid unnecessary re-renders
const PlayerRow = memo(({ 
  player, 
  index, 
  isTopThree, 
  crownColor, 
  playerTier, 
  isVisible, 
  onClick, 
  formatNumber 
}: { 
  player: Player;
  index: number;
  isTopThree: boolean;
  crownColor: string;
  playerTier: RankTier;
  isVisible: boolean;
  onClick: (player: Player) => void;
  formatNumber: (num: number) => string;
}) => {
  // Get the player's badge for custom styling
  const badge = getPlayerBadge(player);
  
  return (
    <div 
      key={player.rank} 
      className={`grid grid-cols-12 py-4 px-5 items-center ${
        isTopThree ? 'bg-gray-900/40' : 'bg-gray-900/20'
      } hover:translate-x-1 transition-all transform cursor-pointer card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ 
        borderLeft: `4px solid ${isTopThree ? crownColor : badge.color}`,
        borderTop: `1px solid ${badge.color}20`,
        borderBottom: `1px solid ${badge.color}20`,
        background: `linear-gradient(to right, ${badge.color}10, transparent)`,
        boxShadow: `inset 0 0 20px ${badge.color}10`,
        transitionDelay: `${index * 30}ms`
      }}
      onClick={() => onClick(player)}
    >
      <div className="col-span-1 font-mono text-lg font-semibold flex items-center">
        {player.rank <= 3 && !player.isRetired && (
          <FaCrown 
            className="mr-2 inline" 
            style={{ color: crownColor }}
            size={player.rank === 1 ? 18 : 14}
          />
        )}
        <span className={`${isTopThree ? "text-white" : "text-gray-500"} ${player.rank <= 3 ? "hidden md:inline" : ""}`}>
          {player.rank}
        </span>
      </div>
      
      <div className="col-span-5 md:col-span-4 flex items-center">
        {/* Player Name and Combat Title */}
        <div className="font-medium text-white hover:text-purple-300 transition-colors text-md">
          {player.name}
          
          {/* Combat title */}
          <div className="text-xs text-gray-400 flex items-center mt-0.5">
            <FaChessKnight className="text-purple-500 mr-1 opacity-75" size={10} />
            <span className="text-gray-400 hover:text-purple-300 transition-colors">
              {player.combatTitle || generateDistinctiveTitle(player)}
            </span>
          </div>
          
          {/* Rank Badge - Only shown on medium and larger screens */}
          <div className="hidden md:block mt-1">
            <Badge 
              className="text-[10px] font-normal"
              style={{ 
                backgroundColor: playerTier.backgroundColor,
                color: playerTier.color,
                borderLeft: `2px solid ${playerTier.color}`
              }}
            >
              {playerTier.name}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="col-span-3 md:col-span-4 text-center">
        <div className="flex items-center justify-center">
          {/* Combat Badge - Using our new badge system */}
          <div className="flex flex-col md:flex-row items-center justify-center">
            <PlayerBadges player={player} size="sm" />
          </div>
        </div>
      </div>
      
      <div 
        className={`col-span-3 text-right font-mono font-bold text-lg ${
          player.isRetired
            ? 'text-gray-400'
            : player.rank === 1 
              ? 'text-yellow-400' 
              : player.rank <= 3 
                ? 'text-white' 
                : 'text-purple-400'
        }`}
      >
        {formatNumber(player.points)}
      </div>
    </div>
  );
});

export default function Leaderboard({ players }: LeaderboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  // AI prediction functionality removed to optimize RAM usage
  const [visibleRows, setVisibleRows] = useState<Record<string, boolean>>({});

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
  
  // Memoized function to get player's rank tier based on points
  const getPlayerRankTier = useCallback((points: number, isRetired?: boolean): RankTier => {
    if (isRetired) {
      return {
        name: "Retired Legend",
        color: silverColor,
        minPoints: 0,
        backgroundColor: "rgba(192, 192, 192, 0.15)"
      };
    }
    return rankTiers.find(tier => points >= tier.minPoints) || rankTiers[rankTiers.length - 1];
  }, [rankTiers, silverColor]);
  
  // Memoized function to get crown color based on rank position
  const getCrownColor = useCallback((rank: number) => {
    if (rank === 1) return goldColor;
    if (rank === 2) return silverColor;
    if (rank === 3) return bronzeColor;
    return "";
  }, [goldColor, silverColor, bronzeColor]);
  
  // Memoized handler for player selection
  const handlePlayerClick = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setShowPlayerCard(true);
  }, []);

  // Memoize filtered and sorted player lists
  const activePlayers = useMemo(() => 
    players.filter(player => !player.isRetired),
    [players]
  );
  
  const retiredPlayers = useMemo(() => 
    players.filter(player => player.isRetired),
    [players]
  );
  
  // Sort by different criteria - memoized to avoid redundant calculations
  const sortedByRank = useMemo(() => 
    [...activePlayers].sort((a, b) => a.rank - b.rank),
    [activePlayers]
  );
  
  // Include all players (both active and retired) in the kill rankings
  const sortedByKills = useMemo(() => 
    [...players].sort((a, b) => (b.kills || 0) - (a.kills || 0)),
    [players]
  );
  
  const sortedByWinStreak = useMemo(() => 
    [...activePlayers].sort((a, b) => (b.winStreak || 0) - (a.winStreak || 0)),
    [activePlayers]
  );

  // Memoized function to handle staggered animation - reduced memory usage
  const setupStaggeredAnimation = useCallback(() => {
    const categories = ['overall', 'kills', 'winstreak', 'retired'];
    // Initialize visible rows state with all false values first
    const initialVisibleState: Record<string, boolean> = {};
    
    // Update in a single batch to avoid multiple re-renders
    categories.forEach(category => {
      const source = 
        category === 'overall' ? sortedByRank :
        category === 'kills' ? sortedByKills :
        category === 'winstreak' ? sortedByWinStreak :
        retiredPlayers;
      
      source.forEach((player, index) => {
        // Stagger the animation with setTimeout
        setTimeout(() => {
          setVisibleRows(prev => ({
            ...prev,
            [`${category}-${player.rank}`]: true
          }));
        }, 15 * index); // Reduced delay for faster animation
      });
    });
  }, [sortedByRank, sortedByKills, sortedByWinStreak, retiredPlayers]);
  
  // Run animation setup only once on component mount
  useEffect(() => {
    setupStaggeredAnimation();
  }, [setupStaggeredAnimation]);

  // Memoized function to format large numbers with commas
  const formatNumber = useCallback((num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  return (
    <section id="leaderboard" className="space-y-6 relative">
      {/* Header Controls */}
      <div className="flex justify-end items-center mb-3">
        {/* AI prediction button removed to optimize RAM usage */}
        
        {/* Admin Panel Link */}
        <Link href="/admin" className="text-sm text-gray-300 hover:text-purple-400 flex items-center gap-1.5 bg-gray-800/70 px-4 py-1.5 rounded-md transition-colors hover:bg-gray-700/70 border border-gray-700/50">
          <FaCog className="text-xs" /> <span>Admin Panel</span>
        </Link>
      </div>

      <div className="bg-gray-900/80 border border-purple-900/40 rounded-lg overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/30 border-b border-purple-900/50 py-5 px-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="text-purple-400 mr-3 animate-bounce">
              <FaCrown />
            </span>
            Astrz Combat Rankings
          </h2>
          <p className="text-gray-400 text-sm mt-1">Tracking the most competitive players in the Astrz universe</p>
        </div>
        
        <Tabs defaultValue="overall" className="w-full">
          <div className="bg-gray-800/80 backdrop-blur-sm">
            <TabsList className="w-full rounded-none border-b border-gray-700 h-auto py-3 justify-center gap-1 px-4 bg-transparent">
              <TabsTrigger 
                value="overall" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-700 data-[state=active]:to-purple-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <FaTrophy className="mr-2 text-yellow-500" /> Overall Rankings
              </TabsTrigger>
              <TabsTrigger 
                value="kills" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-700 data-[state=active]:to-purple-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <FaSkull className="mr-2 text-red-500" /> Top Kills
              </TabsTrigger>
              <TabsTrigger 
                value="winstreak" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-700 data-[state=active]:to-purple-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <FaFireAlt className="mr-2 text-orange-500" /> Win Streaks
              </TabsTrigger>
              <TabsTrigger 
                value="retired" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-700 data-[state=active]:to-purple-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <FaUserTimes className="mr-2 text-gray-300" /> Hall of Fame
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Rank Tiers Legend */}
          <div className="flex flex-wrap justify-center p-3 border-b border-gray-800 gap-4 bg-gray-900/60">
            <TooltipProvider>
              {badges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div 
                      className="flex items-center hover:scale-110 transition-transform cursor-help bg-gray-900 px-2 py-1 rounded-lg"
                      style={{ 
                        color: badge.color,
                        borderLeft: `2px solid ${badge.color}`,
                        boxShadow: `0 0 10px ${badge.color}30`
                      }}
                    >
                      <badge.icon className="mr-1.5 text-xs" />
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900 border border-purple-900/50">
                    <p className="text-xs font-medium">{badge.name}</p>
                    <p className="text-xs opacity-80">{badge.description}</p>
                    <p className="text-xs mt-1">Min. points: {badge.pointThreshold}+</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center hover:scale-110 transition-transform cursor-help bg-gray-900 px-2 py-1 rounded-lg"
                    style={{ 
                      color: retiredBadge.color,
                      borderLeft: `2px solid ${retiredBadge.color}`,
                      boxShadow: `0 0 10px ${retiredBadge.color}30`
                    }}
                  >
                    <retiredBadge.icon className="mr-1.5 text-xs" />
                    <span className="text-xs font-medium">Retired Legend</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900 border border-purple-900/50">
                  <p className="text-xs">{retiredBadge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        
          {/* Overall Rankings Tab */}
          <TabsContent value="overall" className="m-0 animate-fadeIn">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-12 py-3 px-5 border-b border-gray-800 backdrop-blur-sm bg-gray-900/90 text-sm font-medium text-gray-400">
              <div className="col-span-1">RANK</div>
              <div className="col-span-5 md:col-span-4">PLAYER</div>
              <div className="col-span-3 md:col-span-4 text-center">COMBAT BADGE</div>
              <div className="col-span-3 text-right">POINTS</div>
            </div>
            
            {/* Player Rows - Using optimized PlayerRow component */}
            <div className="divide-y divide-gray-800/50">
              {sortedByRank.map((player, index) => {
                const isTopThree = player.rank <= 3;
                const crownColor = getCrownColor(player.rank);
                const playerTier = getPlayerRankTier(player.points, player.isRetired);
                const isVisible = visibleRows[`overall-${player.rank}`];
                
                return (
                  <PlayerRow
                    key={player.id || player.rank}
                    player={player}
                    index={index}
                    isTopThree={isTopThree}
                    crownColor={crownColor}
                    playerTier={playerTier}
                    isVisible={isVisible}
                    onClick={handlePlayerClick}
                    formatNumber={formatNumber}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Kills Ranking Tab */}
          <TabsContent value="kills" className="m-0 animate-fadeIn">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-12 py-3 px-5 border-b border-gray-800 backdrop-blur-sm bg-gray-900/90 text-sm font-medium text-gray-400">
              <div className="col-span-1">RANK</div>
              <div className="col-span-6 md:col-span-7">PLAYER</div>
              <div className="col-span-5 md:col-span-4 text-right">KILLS</div>
            </div>
            
            {/* Player Rows */}
            <div className="divide-y divide-gray-800/50">
              {sortedByKills.slice(0, 20).map((player, index) => {
                const isTopThree = index < 3;
                const crownColor = getCrownColor(index + 1);
                const playerTier = getPlayerRankTier(player.points, player.isRetired);
                const isVisible = visibleRows[`kills-${player.rank}`];
                const killValue = player.kills || 0;
                
                return (
                  <div 
                    key={player.rank} 
                    className={`grid grid-cols-12 py-4 px-5 items-center hover:bg-gray-800/30 ${
                      isTopThree ? 'bg-gray-800/20' : ''
                    } hover:translate-x-1 transition-all transform cursor-pointer card-hover ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ 
                      borderLeft: isTopThree ? `4px solid ${crownColor}` : undefined,
                      transitionDelay: `${index * 30}ms`
                    }}
                    onClick={() => handlePlayerClick(player)}
                  >
                    <div className="col-span-1 font-mono text-lg font-semibold flex items-center">
                      {isTopThree && (
                        <FaSkull 
                          className="mr-2 inline animate-pulse" 
                          style={{ color: crownColor }}
                          size={index === 0 ? 18 : 14}
                        />
                      )}
                      <span className="text-gray-500">
                        {index + 1}
                      </span>
                    </div>
                    
                    <div className="col-span-6 md:col-span-7 flex items-center">
                      {/* Player Name */}
                      <div className="font-medium text-white hover:text-purple-300 transition-colors text-md">
                        {player.name}
                        
                        {player.isRetired && (
                          <Badge variant="outline" className="ml-2 bg-gray-800/80 text-gray-300 border-gray-600 text-[10px]">
                            Retired
                          </Badge>
                        )}
                        
                        {/* Combat title */}
                        <div className="text-xs text-gray-400 flex items-center mt-0.5">
                          <FaChessKnight className="text-purple-500 mr-1 opacity-75" size={10} />
                          <span className="text-gray-400 hover:text-purple-300 transition-colors">
                            {player.combatTitle || generateDistinctiveTitle(player)}
                          </span>
                        </div>
                        
                        {/* Player tier badge - only on medium screens and up */}
                        <div className="hidden md:block mt-1">
                          <Badge 
                            className="text-[10px] font-normal"
                            style={{ 
                              backgroundColor: playerTier.backgroundColor,
                              color: playerTier.color,
                              borderLeft: `2px solid ${playerTier.color}`
                            }}
                          >
                            {playerTier.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-5 md:col-span-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-lg font-bold text-red-400">
                          {formatNumber(killValue)}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">Total Kills</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Win Streak Tab */}
          <TabsContent value="winstreak" className="m-0 animate-fadeIn">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-12 py-3 px-5 border-b border-gray-800 backdrop-blur-sm bg-gray-900/90 text-sm font-medium text-gray-400">
              <div className="col-span-1">RANK</div>
              <div className="col-span-6 md:col-span-7">PLAYER</div>
              <div className="col-span-5 md:col-span-4 text-right">WIN STREAK</div>
            </div>
          </TabsContent>
          
          {/* Hall of Fame Tab */}
          <TabsContent value="halloffame" className="m-0 animate-fadeIn">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-12 py-3 px-5 border-b border-gray-800 backdrop-blur-sm bg-gray-900/90 text-sm font-medium text-gray-400">
              <div className="col-span-1">RANK</div>
              <div className="col-span-5 md:col-span-5">PLAYER</div>
              <div className="col-span-3 text-center">LEGACY</div>
              <div className="col-span-3 text-right">PEAK POINTS</div>
            </div>
            
            {/* Player Rows */}
            <div className="divide-y divide-gray-800/50">
              {players.filter(p => p.isRetired).sort((a, b) => (b.peakPoints || 0) - (a.peakPoints || 0)).map((player, index) => {
                const isTopThree = index < 3;
                const crownColor = getCrownColor(index + 1);
                const isVisible = visibleRows[`halloffame-${player.rank}`] !== false;
                const peakValue = player.peakPoints || player.points;
                const silverColor = "rgba(192, 192, 192, 0.8)";
                
                return (
                  <div 
                    key={player.rank} 
                    className={`grid grid-cols-12 py-4 px-5 items-center hover:bg-gray-800/30 ${
                      isTopThree ? 'bg-gradient-to-r from-gray-800/40 to-transparent' : ''
                    } hover:translate-x-1 transition-all transform cursor-pointer card-hover ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ 
                      borderLeft: isTopThree ? `4px solid ${crownColor}` : undefined,
                      transitionDelay: `${index * 30}ms`
                    }}
                    onClick={() => handlePlayerClick(player)}
                  >
                    <div className="col-span-1 font-mono text-lg font-semibold flex items-center">
                      {isTopThree && (
                        <FaMedal 
                          className="mr-2 inline animate-pulse" 
                          style={{ color: crownColor }}
                          size={index === 0 ? 18 : 14}
                        />
                      )}
                      <span className="text-gray-500">
                        {index + 1}
                      </span>
                    </div>
                    
                    <div className="col-span-5 flex items-center">
                      {/* Player Name */}
                      <div className="font-medium text-white hover:text-purple-300 transition-colors text-md flex items-center">
                        <div>
                          {player.name}
                          
                          {/* Combat title */}
                          <div className="text-xs text-gray-400 flex items-center mt-0.5">
                            <FaChessKnight className="text-gray-400 mr-1 opacity-75" size={10} />
                            <span className="text-gray-400 hover:text-purple-300 transition-colors">
                              {player.combatTitle || generateDistinctiveTitle(player)}
                            </span>
                          </div>
                          
                          {/* Retired status badge */}
                          <div className="mt-1">
                            <Badge 
                              className="text-[10px] font-normal"
                              style={{ 
                                backgroundColor: "rgba(192, 192, 192, 0.15)",
                                color: silverColor,
                                borderLeft: `2px solid ${silverColor}`
                              }}
                            >
                              Retired Legend
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-3 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center text-gray-300 bg-gray-800/50 rounded-md px-2 py-1">
                          <FaTrophy className="mr-2 text-yellow-500" size={14} />
                          <span className="text-sm font-medium">
                            {player.teamChampion || 0} Championships
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{player.wins || 0} Total Wins</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-xl font-bold text-yellow-400">
                          {peakValue}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">All-Time Best</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {players.filter(p => p.isRetired).length === 0 && (
                <div className="p-16 text-center text-gray-400">
                  <FaUserTimes size={32} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">No retired players found</p>
                  <p className="text-sm text-gray-500 mt-2">Retired legends will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Retired Players Tab */}
          <TabsContent value="retired" className="m-0 animate-fadeIn">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-12 py-3 px-5 border-b border-gray-800 backdrop-blur-sm bg-gray-900/90 text-sm font-medium text-gray-400">
              <div className="col-span-1">#</div>
              <div className="col-span-6 md:col-span-7">PLAYER</div>
              <div className="col-span-5 md:col-span-4 text-right">PEAK POINTS</div>
            </div>
            
            {/* Player Rows */}
            <div className="divide-y divide-gray-800/50">
              {retiredPlayers.sort((a, b) => (b.peakPoints || 0) - (a.peakPoints || 0)).map((player, index) => {
                const isTopThree = index < 3;
                const crownColor = getCrownColor(index + 1);
                const isVisible = visibleRows[`retired-${player.rank}`];
                
                return (
                  <div 
                    key={player.rank} 
                    className={`grid grid-cols-12 py-4 px-5 items-center hover:bg-gray-800/30 ${
                      isTopThree ? 'bg-gradient-to-r from-gray-800/40 to-transparent' : ''
                    } hover:translate-x-1 transition-all transform cursor-pointer card-hover ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ 
                      borderLeft: isTopThree ? `4px solid ${crownColor}` : undefined,
                      transitionDelay: `${index * 30}ms`
                    }}
                    onClick={() => handlePlayerClick(player)}
                  >
                    <div className="col-span-1 font-mono text-lg font-semibold flex items-center">
                      {isTopThree && (
                        <FaMedal 
                          className="mr-2 inline animate-pulse" 
                          style={{ color: crownColor }}
                          size={index === 0 ? 18 : 14}
                        />
                      )}
                      <span className="text-gray-500">
                        {index + 1}
                      </span>
                    </div>
                    
                    <div className="col-span-6 md:col-span-7 flex items-center">
                      {/* Player Name */}
                      <div className="font-medium text-white hover:text-purple-300 transition-colors text-md flex items-center">
                        <div>
                          {player.name}
                          
                          {/* Combat title */}
                          <div className="text-xs text-gray-400 flex items-center mt-0.5">
                            <FaChessKnight className="text-gray-400 mr-1 opacity-75" size={10} />
                            <span className="text-gray-400 hover:text-purple-300 transition-colors">
                              {player.combatTitle || generateDistinctiveTitle(player)}
                            </span>
                          </div>
                          
                          {/* Retired status badge */}
                          <div className="mt-1">
                            <Badge 
                              className="text-[10px] font-normal"
                              style={{ 
                                backgroundColor: "rgba(192, 192, 192, 0.15)",
                                color: silverColor,
                                borderLeft: `2px solid ${silverColor}`
                              }}
                            >
                              Retired Legend
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Career stat */}
                        <div className="ml-4 hidden md:block">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center text-xs text-gray-400 hover:text-white">
                                  <FaInfoCircle className="mr-1.5 text-purple-500" />
                                  <span className="text-sm">Career Stats</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="w-60">
                                <div className="space-y-1 p-1">
                                  <p className="text-xs"><span className="text-green-400">Wins:</span> {player.wins || 0}</p>
                                  <p className="text-xs"><span className="text-red-400">Losses:</span> {player.losses || 0}</p>
                                  <p className="text-xs"><span className="text-purple-400">Total Kills:</span> {player.kills || 0}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-5 md:col-span-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-xl font-bold text-yellow-400">
                          {player.peakPoints}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">All-Time Peak</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {retiredPlayers.length === 0 && (
                <div className="p-16 text-center text-gray-400">
                  <FaUserTimes size={32} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">No retired players found</p>
                  <p className="text-sm text-gray-500 mt-2">Retired legends will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Player Card */}
      {showPlayerCard && selectedPlayer && (
        <PlayerCard
          player={selectedPlayer}
          onClose={() => setShowPlayerCard(false)}
        />
      )}
      
      {/* AI Prediction component removed to optimize RAM usage */}
    </section>
  );
}
