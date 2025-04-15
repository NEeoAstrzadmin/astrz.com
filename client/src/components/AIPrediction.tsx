import { useState, useEffect } from "react";
import { Player } from "@/data/players";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FaBrain, FaChartLine, FaLightbulb, FaRandom, 
  FaRobot, FaTrophy, FaExclamationTriangle, 
  FaCheckCircle, FaStar, FaArrowUp, FaArrowDown, 
  FaChess, FaMedal, FaCrosshairs
} from "react-icons/fa";
import { generatePlayerPrediction, PredictionResult, generateImprovementTips, predictMatchOutcome } from "@/lib/aiPredictions";

interface AIPredictionProps {
  player: Player;
  allPlayers: Player[];
  onClose: () => void;
}

export default function AIPrediction({ player, allPlayers, onClose }: AIPredictionProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [improvementTips, setImprovementTips] = useState<string[]>([]);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [matchPrediction, setMatchPrediction] = useState<{
    winProbability: number;
    predictedScore: string;
    analysis: string;
  } | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("prediction");
  const [error, setError] = useState<string | null>(null);

  // Generate prediction on mount
  useEffect(() => {
    const getPrediction = async () => {
      try {
        setLoading(true);
        const result = await generatePlayerPrediction(player, allPlayers);
        setPrediction(result);
        
        // Also get improvement tips
        const tips = await generateImprovementTips(player);
        setImprovementTips(tips);
        
        setLoading(false);
      } catch (err) {
        setError("Unable to generate prediction at this time.");
        setLoading(false);
      }
    };
    
    getPrediction();
  }, [player, allPlayers]);
  
  // Handle opponent selection
  const handleOpponentChange = async (opponentId: string) => {
    const selectedOpponent = allPlayers.find(p => p.name === opponentId);
    if (!selectedOpponent) return;
    
    setOpponent(selectedOpponent);
    setMatchLoading(true);
    
    try {
      const result = await predictMatchOutcome(player, selectedOpponent);
      setMatchPrediction(result);
    } catch (err) {
      console.error("Failed to predict match:", err);
    } finally {
      setMatchLoading(false);
    }
  };
  
  // Format percentage
  const formatPercent = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Calculate rank change
  const getRankChange = () => {
    if (!prediction) return 0;
    const currentRank = player.rank;
    const predictedRank = prediction.predictedRank;
    return currentRank - predictedRank; // Positive means improvement (e.g., rank 5 → rank 3 is +2)
  };
  
  // Render rank change indicator
  const renderRankChange = () => {
    const change = getRankChange();
    if (change === 0) return <span className="text-gray-400">No change</span>;
    
    return change > 0 ? (
      <span className="text-green-400 flex items-center">
        <FaArrowUp className="mr-1" /> Improve by {change} {change === 1 ? 'rank' : 'ranks'}
      </span>
    ) : (
      <span className="text-red-400 flex items-center">
        <FaArrowDown className="mr-1" /> Drop by {Math.abs(change)} {Math.abs(change) === 1 ? 'rank' : 'ranks'}
      </span>
    );
  };
  
  // Points change calculation
  const getPointsChange = () => {
    if (!prediction) return 0;
    return prediction.predictedPoints - player.points;
  };
  
  // Format point change
  const renderPointsChange = () => {
    const change = getPointsChange();
    if (change === 0) return <span className="text-gray-400">No change</span>;
    
    return change > 0 ? (
      <span className="text-green-400 flex items-center">
        <FaArrowUp className="mr-1" /> +{change} points
      </span>
    ) : (
      <span className="text-red-400 flex items-center">
        <FaArrowDown className="mr-1" /> {change} points
      </span>
    );
  };

  // Get active players (not retired)
  const activePlayers = allPlayers.filter(p => !p.isRetired && p.name !== player.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <Card className="relative max-w-2xl w-full animate-scaleIn overflow-hidden max-h-[90vh] bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/50 shadow-2xl">
        {/* Close button */}
        <Button 
          onClick={onClose}
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10 hover:bg-gray-800/70"
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400 hover:text-white transition-colors hover:rotate-90 transform duration-300">
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
          </svg>
        </Button>
        
        {/* Header */}
        <CardHeader className="pb-4 border-b border-gray-800 bg-gradient-to-r from-purple-900/50 to-indigo-900/30">
          <div className="flex items-center">
            <div className="bg-purple-900/40 rounded-full p-3 border border-purple-500/30 shadow-lg animate-pulse mr-4">
              <FaBrain size={24} className="text-purple-300" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Combat AI Predictions</CardTitle>
              <CardDescription className="text-gray-400">
                AI-powered performance analysis for {player.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <Tabs 
            defaultValue="prediction" 
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/70 p-1 mx-0 h-14 rounded-none">
              <TabsTrigger 
                value="prediction" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-700 data-[state=active]:to-purple-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <div className="flex flex-col items-center text-xs sm:text-sm">
                  <FaChartLine className="mb-1" />
                  Predictions
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="improvement" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-700 data-[state=active]:to-purple-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <div className="flex flex-col items-center text-xs sm:text-sm">
                  <FaLightbulb className="mb-1" />
                  Improvement Tips
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="matchups" 
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-700 data-[state=active]:to-purple-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <div className="flex flex-col items-center text-xs sm:text-sm">
                  <FaCrosshairs className="mb-1" />
                  Matchup Analysis
                </div>
              </TabsTrigger>
            </TabsList>
            
            {/* Predictions Tab */}
            <TabsContent value="prediction" className="p-6 space-y-6">
              {error ? (
                <div className="text-center py-8">
                  <FaExclamationTriangle size={32} className="text-amber-500 mx-auto mb-4" />
                  <h3 className="text-gray-300 text-lg font-semibold mb-2">Prediction Unavailable</h3>
                  <p className="text-gray-400">{error}</p>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Analyzing player data...</p>
                </div>
              ) : prediction ? (
                <>
                  {/* Rank Prediction */}
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-gray-300 flex items-center">
                        <FaChess className="mr-2 text-purple-400" />
                        Rank Prediction
                      </h3>
                      {renderRankChange()}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-sm text-gray-400 mb-1">Current Rank</div>
                        <div className="text-2xl font-bold text-white">{player.rank}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-sm text-gray-400 mb-1">Predicted Rank</div>
                        <div className="text-2xl font-bold text-purple-300">{prediction.predictedRank}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Points Prediction */}
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-gray-300 flex items-center">
                        <FaTrophy className="mr-2 text-yellow-400" />
                        Points Prediction
                      </h3>
                      {renderPointsChange()}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-sm text-gray-400 mb-1">Current Points</div>
                        <div className="text-2xl font-bold text-white">{player.points}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-sm text-gray-400 mb-1">Predicted Points</div>
                        <div className="text-2xl font-bold text-purple-300">{prediction.predictedPoints}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Win Probability */}
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <h3 className="text-gray-300 flex items-center mb-2">
                      <FaRandom className="mr-2 text-blue-400" />
                      Win Probability vs Similar Ranked Players
                    </h3>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm text-gray-400">Probability</span>
                      <span className="text-sm font-bold text-blue-300">{formatPercent(prediction.winProbability)}</span>
                    </div>
                    <Progress 
                      value={prediction.winProbability * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  {/* Areas Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Improvement Areas */}
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                      <h3 className="text-gray-300 flex items-center mb-3">
                        <FaExclamationTriangle className="mr-2 text-amber-400" />
                        Areas To Improve
                      </h3>
                      <ul className="space-y-2">
                        {prediction.improvementAreas.map((area, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-amber-500 mr-2 mt-0.5">•</span>
                            <span className="text-gray-300 text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Strength Areas */}
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                      <h3 className="text-gray-300 flex items-center mb-3">
                        <FaCheckCircle className="mr-2 text-green-400" />
                        Player Strengths
                      </h3>
                      <ul className="space-y-2">
                        {prediction.strengthAreas.map((area, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-0.5">•</span>
                            <span className="text-gray-300 text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Commentary */}
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <h3 className="text-gray-300 flex items-center mb-3">
                      <FaRobot className="mr-2 text-purple-400" />
                      AI Commentary
                    </h3>
                    <div className="text-gray-300 text-sm leading-relaxed bg-gray-900/50 p-3 rounded-md border border-gray-800/50">
                      {prediction.commentary}
                    </div>
                  </div>
                </>
              ) : null}
            </TabsContent>
            
            {/* Improvement Tips Tab */}
            <TabsContent value="improvement" className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Generating improvement tips...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/10 p-5 rounded-lg border border-purple-800/30">
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <FaLightbulb className="text-yellow-400 mr-3" size={20} />
                      Performance Improvement Tips
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Our AI coach has analyzed {player.name}'s performance data and generated these personalized tips to improve combat effectiveness.
                    </p>
                    
                    <div className="space-y-4 mt-6">
                      {improvementTips.map((tip, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/40">
                          <div className="flex items-start">
                            <div className="bg-purple-900/40 rounded-full p-2 mr-3 mt-1">
                              <FaStar className="text-yellow-400" size={16} />
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">Tip #{index + 1}</h4>
                              <p className="text-gray-300 text-sm">{tip}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                    <h4 className="text-gray-300 font-medium mb-2 flex items-center">
                      <FaMedal className="text-purple-400 mr-2" />
                      Performance Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 p-3 rounded-md">
                        <div className="text-sm text-gray-400">Win Rate</div>
                        <div className="text-xl font-bold text-white">
                          {player.stats 
                            ? Math.round((player.stats.wins / (player.stats.wins + player.stats.losses || 1)) * 100) 
                            : 0}%
                        </div>
                        <Progress value={player.stats 
                            ? Math.round((player.stats.wins / (player.stats.wins + player.stats.losses || 1)) * 100) 
                            : 0} 
                          className="h-1.5 mt-1" />
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-md">
                        <div className="text-sm text-gray-400">Current Streak</div>
                        <div className="text-xl font-bold text-white">
                          {player.stats?.winStreak || 0}
                        </div>
                        <div className="flex mt-1">
                          {Array.from({ length: Math.min(5, player.stats?.winStreak || 0) }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-2 h-2 rounded-full bg-orange-500 mr-1"
                              style={{ opacity: 1 - (i * 0.15) }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Matchup Analysis Tab */}
            <TabsContent value="matchups" className="p-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/10 p-5 rounded-lg border border-purple-800/30">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <FaCrosshairs className="text-red-400 mr-3" size={20} />
                    Matchup Analysis
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Select an opponent to see how {player.name} would perform in a head-to-head matchup.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                      <div className="text-sm text-gray-400 mb-1">Player</div>
                      <div className="font-bold text-white">{player.name}</div>
                      <Badge className="mt-1" style={{
                        backgroundColor: player.points >= 250 ? "rgba(255, 107, 107, 0.15)" :
                                         player.points >= 180 ? "rgba(77, 150, 255, 0.15)" :
                                         player.points >= 100 ? "rgba(159, 230, 160, 0.15)" :
                                         "rgba(255, 189, 53, 0.15)",
                        color: player.points >= 250 ? "#FF6B6B" :
                               player.points >= 180 ? "#4D96FF" :
                               player.points >= 100 ? "#9FE6A0" :
                               "#FFBD35",
                      }}>
                        Rank #{player.rank}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">VS</div>
                      <Select onValueChange={handleOpponentChange}>
                        <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select opponent" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {activePlayers.map(p => (
                            <SelectItem key={p.name} value={p.name}>
                              {p.name} (Rank #{p.rank})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                      {opponent ? (
                        <>
                          <div className="text-sm text-gray-400 mb-1">Opponent</div>
                          <div className="font-bold text-white">{opponent.name}</div>
                          <Badge className="mt-1" style={{
                            backgroundColor: opponent.points >= 250 ? "rgba(255, 107, 107, 0.15)" :
                                             opponent.points >= 180 ? "rgba(77, 150, 255, 0.15)" :
                                             opponent.points >= 100 ? "rgba(159, 230, 160, 0.15)" :
                                             "rgba(255, 189, 53, 0.15)",
                            color: opponent.points >= 250 ? "#FF6B6B" :
                                   opponent.points >= 180 ? "#4D96FF" :
                                   opponent.points >= 100 ? "#9FE6A0" :
                                   "#FFBD35",
                          }}>
                            Rank #{opponent.rank}
                          </Badge>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">No opponent selected</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {matchLoading ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Analyzing matchup...</p>
                  </div>
                ) : matchPrediction && opponent ? (
                  <div className="space-y-4">
                    {/* Win Probability */}
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-gray-300 flex items-center mb-3">
                        <FaRandom className="mr-2 text-blue-400" />
                        Win Probability vs {opponent.name}
                      </h4>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Probability</span>
                        <span className="text-sm font-bold text-blue-300">{formatPercent(matchPrediction.winProbability)}</span>
                      </div>
                      <Progress 
                        value={matchPrediction.winProbability * 100} 
                        className="h-3"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>50%</span>
                        <span>High</span>
                      </div>
                    </div>
                    
                    {/* Predicted Score */}
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-gray-300 flex items-center mb-3">
                        <FaChartLine className="mr-2 text-green-400" />
                        Predicted Score
                      </h4>
                      <div className="bg-gray-900/50 p-4 rounded-md text-center">
                        <div className="grid grid-cols-3 items-center">
                          <div className="text-right pr-3">
                            <div className="text-sm text-gray-400">{player.name}</div>
                            <div className="text-xl font-bold text-white">{matchPrediction.predictedScore.split('-')[0]}</div>
                          </div>
                          <div className="text-xl font-bold text-gray-500">-</div>
                          <div className="text-left pl-3">
                            <div className="text-sm text-gray-400">{opponent.name}</div>
                            <div className="text-xl font-bold text-white">{matchPrediction.predictedScore.split('-')[1]}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Analysis */}
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                      <h4 className="text-gray-300 flex items-center mb-3">
                        <FaRobot className="mr-2 text-purple-400" />
                        Match Analysis
                      </h4>
                      <div className="text-gray-300 text-sm leading-relaxed bg-gray-900/50 p-3 rounded-md border border-gray-800/50">
                        {matchPrediction.analysis}
                      </div>
                    </div>
                  </div>
                ) : opponent ? (
                  <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <FaExclamationTriangle size={32} className="text-amber-500 mx-auto mb-4" />
                    <h3 className="text-gray-300 text-lg font-semibold mb-2">Analysis Unavailable</h3>
                    <p className="text-gray-400">Unable to generate matchup prediction at this time.</p>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <FaCrosshairs size={32} className="text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Select an opponent to see matchup analysis</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Footer */}
        <CardFooter className="bg-gray-900/80 py-4 border-t border-gray-800">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            Close Analysis
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}