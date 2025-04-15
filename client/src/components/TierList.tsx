import { useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/data/players";
import { FaCrown, FaTrophy, FaSkull, FaUserAlt, FaUserTimes } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

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
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerCard, setShowPlayerCard] = useState(false);

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
  const getPlayerRankTier = (points: number, isRetired?: boolean): RankTier => {
    if (isRetired) {
      return {
        name: "Retired Legend",
        color: silverColor,
        minPoints: 0,
        backgroundColor: "rgba(192, 192, 192, 0.15)"
      };
    }
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
    setShowPlayerCard(true);
  };

  // Sort by different criteria
  const sortedByRank = [...players].sort((a, b) => a.rank - b.rank);
  const sortedByKills = [...players].sort((a, b) => {
    if (!a.stats?.kills) return 1;
    if (!b.stats?.kills) return -1;
    return b.stats.kills - a.stats.kills;
  });
  const retiredPlayers = [...players].filter(player => player.isRetired);

  return (
    <section id="leaderboard" className="space-y-6 relative">
      {/* Admin Panel Link */}
      <div className="flex justify-end mb-2">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-purple-400 flex items-center gap-1 bg-gray-800/50 px-3 py-1 rounded-md transition-colors">
          <span className="text-xs">Admin Panel</span>
        </Link>
      </div>

      <div className="bg-gray-900/60 border border-purple-900/50 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-purple-900/30 border-b border-purple-900/50 py-4 px-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="text-purple-400 mr-2">
              <FaCrown />
            </span>
            Astrz Rankings
          </h2>
        </div>
        
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="w-full rounded-none border-b border-gray-800 bg-gray-800/50 h-auto py-2 justify-start gap-2 px-4">
            <TabsTrigger value="overall" className="data-[state=active]:bg-purple-700">
              <FaTrophy className="mr-2" /> Overall
            </TabsTrigger>
            <TabsTrigger value="kills" className="data-[state=active]:bg-purple-700">
              <FaSkull className="mr-2" /> Top Kills
            </TabsTrigger>
            <TabsTrigger value="retired" className="data-[state=active]:bg-purple-700">
              <FaUserTimes className="mr-2" /> Retired Players
            </TabsTrigger>
          </TabsList>

          {/* Rank Tiers Legend */}
          <div className="flex flex-wrap justify-between p-3 border-b border-gray-800 gap-2">
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
            <div 
              className="flex items-center hover:scale-110 transition-transform"
              style={{ color: silverColor }}
            >
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: silverColor }}
              ></div>
              <span className="text-xs font-medium">Retired Legend</span>
            </div>
          </div>
        
          {/* Overall Rankings Tab */}
          <TabsContent value="overall" className="m-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-800 bg-gray-800/50 text-sm font-medium text-gray-400">
              <div className="col-span-1">RANK</div>
              <div className="col-span-7">PLAYER</div>
              <div className="col-span-4 text-right">POINTS</div>
            </div>
            
            {/* Player Rows */}
            <div className="divide-y divide-gray-800/60">
              {sortedByRank.map((player) => {
                const isTopThree = player.rank <= 3;
                const crownColor = getCrownColor(player.rank);
                const playerTier = getPlayerRankTier(player.points, player.isRetired);
                
                return (
                  <div 
                    key={player.rank} 
                    className={`grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-800/30 ${
                      isTopThree ? 'bg-gray-800/20' : ''
                    } hover:translate-x-1 transition-transform`}
                    style={{ 
                      borderLeft: isTopThree ? `4px solid ${crownColor}` : undefined
                    }}
                  >
                    <div className="col-span-1 font-mono font-semibold flex items-center">
                      {player.rank <= 3 && !player.isRetired && (
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
                      {/* Rank Badge */}
                      <div 
                        className="mr-2 text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{ 
                          backgroundColor: playerTier.backgroundColor,
                          color: playerTier.color,
                          borderLeft: `2px solid ${playerTier.color}`
                        }}
                      >
                        {playerTier.name}
                      </div>
                      
                      {/* Player Name */}
                      <div 
                        className="font-medium text-white hover:text-purple-300 cursor-pointer transition-colors flex items-center"
                        onClick={() => handlePlayerClick(player)}
                      >
                        {player.name}
                        {player.isRetired && (
                          <span className="ml-2 text-xs px-1 py-0.5 bg-gray-700 text-gray-300 rounded-md">Retired</span>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      className={`col-span-4 text-right font-mono ${
                        player.isRetired
                          ? 'text-gray-400'
                          : player.rank === 1 
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
          </TabsContent>

          {/* Kills Ranking Tab */}
          <TabsContent value="kills" className="m-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-800 bg-gray-800/50 text-sm font-medium text-gray-400">
              <div className="col-span-1">RANK</div>
              <div className="col-span-7">PLAYER</div>
              <div className="col-span-4 text-right">KILLS</div>
            </div>
            
            {/* Player Rows */}
            <div className="divide-y divide-gray-800/60">
              {sortedByKills.slice(0, 20).map((player, index) => {
                const isTopThree = index < 3;
                const crownColor = getCrownColor(index + 1);
                const playerTier = getPlayerRankTier(player.points, player.isRetired);
                
                return (
                  <div 
                    key={player.rank} 
                    className={`grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-800/30 ${
                      isTopThree ? 'bg-gray-800/20' : ''
                    } hover:translate-x-1 transition-transform`}
                    style={{ 
                      borderLeft: isTopThree ? `4px solid ${crownColor}` : undefined
                    }}
                  >
                    <div className="col-span-1 font-mono font-semibold flex items-center">
                      {isTopThree && (
                        <FaSkull 
                          className="mr-1.5 inline" 
                          style={{ color: crownColor }}
                          size={index === 0 ? 18 : 14}
                        />
                      )}
                      <span className={isTopThree ? "hidden md:inline" : ""}>
                        {index + 1}.
                      </span>
                    </div>
                    
                    <div className="col-span-7 flex items-center">
                      {/* Rank Badge */}
                      <div 
                        className="mr-2 text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{ 
                          backgroundColor: playerTier.backgroundColor,
                          color: playerTier.color,
                          borderLeft: `2px solid ${playerTier.color}`
                        }}
                      >
                        {playerTier.name}
                      </div>
                      
                      {/* Player Name */}
                      <div 
                        className="font-medium text-white hover:text-purple-300 cursor-pointer transition-colors flex items-center"
                        onClick={() => handlePlayerClick(player)}
                      >
                        {player.name}
                        {player.isRetired && (
                          <span className="ml-2 text-xs px-1 py-0.5 bg-gray-700 text-gray-300 rounded-md">Retired</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-4 text-right font-mono text-purple-300">
                      {player.stats?.kills || 0} kills
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Retired Players Tab */}
          <TabsContent value="retired" className="m-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-800 bg-gray-800/50 text-sm font-medium text-gray-400">
              <div className="col-span-1">RANK</div>
              <div className="col-span-7">PLAYER</div>
              <div className="col-span-4 text-right">PEAK POINTS</div>
            </div>
            
            {/* Player Rows */}
            <div className="divide-y divide-gray-800/60">
              {retiredPlayers.sort((a, b) => (b.peakPoints || 0) - (a.peakPoints || 0)).map((player, index) => {
                const isTopThree = index < 3;
                const crownColor = getCrownColor(index + 1);
                
                return (
                  <div 
                    key={player.rank} 
                    className={`grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-800/30 ${
                      isTopThree ? 'bg-gray-800/20' : ''
                    } hover:translate-x-1 transition-transform`}
                    style={{ 
                      borderLeft: isTopThree ? `4px solid ${crownColor}` : undefined
                    }}
                  >
                    <div className="col-span-1 font-mono font-semibold flex items-center">
                      {isTopThree && (
                        <FaUserTimes 
                          className="mr-1.5 inline" 
                          style={{ color: crownColor }}
                          size={index === 0 ? 18 : 14}
                        />
                      )}
                      <span className={isTopThree ? "hidden md:inline" : ""}>
                        {index + 1}.
                      </span>
                    </div>
                    
                    <div className="col-span-7 flex items-center">
                      {/* Rank Badge */}
                      <div 
                        className="mr-2 text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{ 
                          backgroundColor: "rgba(192, 192, 192, 0.15)",
                          color: silverColor,
                          borderLeft: `2px solid ${silverColor}`
                        }}
                      >
                        Retired Legend
                      </div>
                      
                      {/* Player Name */}
                      <div 
                        className="font-medium text-white hover:text-purple-300 cursor-pointer transition-colors"
                        onClick={() => handlePlayerClick(player)}
                      >
                        {player.name}
                      </div>
                    </div>
                    
                    <div className="col-span-4 text-right font-mono text-yellow-400">
                      {player.peakPoints} pts
                    </div>
                  </div>
                );
              })}
              {retiredPlayers.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No retired players found.
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
    </section>
  );
}
