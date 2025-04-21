import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Player, players, notifyPlayerChanges } from "@/data/players";
import { usePlayers } from "@/hooks/usePlayers";
import { FaCrown, FaUserEdit, FaTrash, FaArrowLeft, FaPlus, FaSave, FaUserCog, FaMagic, FaTrophy } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newPlayerMode, setNewPlayerMode] = useState(false);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchData, setMatchData] = useState<{
    opponent: string;
    result: "W" | "L";
    playerKills: number;
  }>({
    opponent: "",
    result: "W",
    playerKills: 0
  });

  // Define a more specific player type for admin use with required fields
  type AdminPlayerData = {
    rank: number;
    name: string;
    points: number;
    recentMatches: string;
    isRetired: boolean;
    peakPoints: number;
    stats: {
      wins: number;
      losses: number;
      winStreak: number;
      kills: number;
      teamChampion: number;
      mcSatChampion: number;
    }
  };
  
  // Form state for player data
  const [formData, setFormData] = useState<AdminPlayerData>({
    rank: 0,
    name: "",
    points: 0,
    recentMatches: "",
    isRetired: false,
    peakPoints: 0,
    stats: {
      wins: 0,
      losses: 0,
      winStreak: 0,
      kills: 0,
      teamChampion: 0,
      mcSatChampion: 0
    }
  });

  const handleSelectPlayer = (playerId: number) => {
    const player = players.find(p => p.rank === playerId);
    if (player) {
      setSelectedPlayerId(playerId);
      // Create a new object with all the player properties
      setFormData({
        rank: player.rank,
        name: player.name,
        points: player.points,
        recentMatches: player.recentMatches || "",
        isRetired: player.isRetired || false,
        peakPoints: player.peakPoints || 0,
        stats: {
          wins: player.stats?.wins || 0,
          losses: player.stats?.losses || 0,
          winStreak: player.stats?.winStreak || 0,
          kills: player.stats?.kills || 0,
          teamChampion: player.stats?.teamChampion || 0,
          mcSatChampion: player.stats?.mcSatChampion || 0
        }
      });
      setEditMode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (stats)
      const [parent, child] = name.split('.');
      if (parent === 'stats') {
        setFormData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            [child]: type === 'number' ? Number(value) : value
          }
        }));
      }
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isRetired: checked
    }));
  };

  const handleResetForm = () => {
    if (selectedPlayerId) {
      const player = players.find(p => p.rank === selectedPlayerId);
      if (player) {
        // Create a new object with all the player properties and default values
        setFormData({
          rank: player.rank,
          name: player.name,
          points: player.points,
          recentMatches: player.recentMatches || "",
          isRetired: player.isRetired || false,
          peakPoints: player.peakPoints || 0,
          stats: {
            wins: player.stats?.wins || 0,
            losses: player.stats?.losses || 0,
            winStreak: player.stats?.winStreak || 0,
            kills: player.stats?.kills || 0,
            teamChampion: player.stats?.teamChampion || 0,
            mcSatChampion: player.stats?.mcSatChampion || 0
          }
        });
      }
    } else {
      setFormData({
        rank: players.length + 1,
        name: "",
        points: 0,
        recentMatches: "",
        isRetired: false,
        peakPoints: 0,
        stats: {
          wins: 0,
          losses: 0,
          winStreak: 0,
          kills: 0,
          teamChampion: 0,
          mcSatChampion: 0
        }
      });
    }
    setEditMode(false);
  };

  const handleNewPlayer = () => {
    setSelectedPlayerId(null);
    setFormData({
      rank: players.length + 1,
      name: "",
      points: 0,
      recentMatches: "",
      isRetired: false,
      peakPoints: 0,
      stats: {
        wins: 0,
        losses: 0,
        winStreak: 0,
        kills: 0,
        teamChampion: 0,
        mcSatChampion: 0
      }
    });
    setNewPlayerMode(true);
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    // For this demo, update the players array directly
    console.log("Saving player data:", formData);
    
    if (newPlayerMode) {
      // Add new player
      players.push(formData as Player);
    } else {
      // Update existing player
      const playerIndex = players.findIndex(p => p.rank === selectedPlayerId!);
      if (playerIndex !== -1) {
        // Create a new player object combining the existing player and form data
        const updatedPlayer: Player = {
          ...players[playerIndex],
          rank: formData.rank,
          name: formData.name,
          points: formData.points,
          recentMatches: formData.recentMatches,
          isRetired: formData.isRetired,
          peakPoints: formData.peakPoints,
          stats: {
            wins: formData.stats.wins,
            losses: formData.stats.losses,
            winStreak: formData.stats.winStreak,
            kills: formData.stats.kills,
            teamChampion: formData.stats.teamChampion,
            mcSatChampion: formData.stats.mcSatChampion
          }
        };
        
        players[playerIndex] = updatedPlayer;
      }
    }
    
    // Notify all subscribers of the change
    notifyPlayerChanges();
    
    // Show feedback and reset UI state
    alert("Player data has been updated!");
    setEditMode(false);
    setNewPlayerMode(false);
  };

  const handleDeletePlayer = () => {
    if (selectedPlayerId) {
      const confirmed = window.confirm("Are you sure you want to delete this player?");
      if (confirmed) {
        console.log("Deleting player with rank:", selectedPlayerId);
        
        // Find the index of the player in the array and remove it
        const playerIndex = players.findIndex(p => p.rank === selectedPlayerId);
        if (playerIndex !== -1) {
          players.splice(playerIndex, 1);
          notifyPlayerChanges();
          alert("Player has been deleted!");
        }
        
        // Reset the form and selection
        setSelectedPlayerId(null);
        setFormData({
          rank: 0,
          name: "",
          points: 0,
          recentMatches: "",
          isRetired: false,
          peakPoints: 0,
          stats: {
            wins: 0,
            losses: 0,
            winStreak: 0,
            kills: 0,
            teamChampion: 0,
            mcSatChampion: 0
          }
        });
      }
    }
  };
  
  // Handles match dialog input changes
  const handleMatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setMatchData(prev => {
      if (name === 'result') {
        // Ensure result is typed correctly
        return {
          ...prev,
          result: value as 'W' | 'L'
        };
      } else if (name === 'playerKills') {
        return {
          ...prev,
          playerKills: Number(value)
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });
  };
  
  // Opens the match dialog
  const handleAddMatch = () => {
    if (!selectedPlayerId) return;
    
    setMatchData({
      opponent: "",
      result: "W",
      playerKills: 0
    });
    
    setMatchDialogOpen(true);
  };
  
  // Handles the submission of a new match
  const handleMatchSubmit = () => {
    if (!selectedPlayerId) return;
    
    const playerIndex = players.findIndex(p => p.rank === selectedPlayerId);
    if (playerIndex === -1) return;
    
    const player = players[playerIndex];
    // Ensure recentMatches is always a string
    const existingMatches = player.recentMatches || "";
    const newRecentMatches = (matchData.result + existingMatches).slice(0, 10);
    const isWin = matchData.result === "W";
    
    // Calculate new stats
    const newStats = {
      wins: player.stats?.wins || 0,
      losses: player.stats?.losses || 0,
      winStreak: player.stats?.winStreak || 0,
      kills: (player.stats?.kills || 0) + matchData.playerKills,
      teamChampion: player.stats?.teamChampion || 0,
      mcSatChampion: player.stats?.mcSatChampion || 0
    };
    
    // Update win/loss stats
    if (isWin) {
      newStats.wins += 1;
      newStats.winStreak += 1;
    } else {
      newStats.losses += 1;
      newStats.winStreak = 0; // Reset win streak on loss
    }
    
    // Calculate points change based on win/loss
    const pointsChange = isWin 
      ? 10 + Math.floor(matchData.playerKills / 2) 
      : -5;
    
    // Update the player object with new stats
    const updatedPlayer: Player = {
      ...player,
      points: player.points + pointsChange,
      recentMatches: newRecentMatches,
      stats: newStats
    };
    
    // If current points exceed peak points, update peak points
    if (updatedPlayer.points > (player.peakPoints || 0)) {
      updatedPlayer.peakPoints = updatedPlayer.points;
    }
    
    players[playerIndex] = updatedPlayer;
    
    // Update form data to reflect the changes
    setFormData({
      ...formData,
      points: updatedPlayer.points,
      recentMatches: updatedPlayer.recentMatches || "",
      peakPoints: updatedPlayer.peakPoints || 0,
      stats: {
        ...newStats
      }
    });
    
    // Notify subscribers and close dialog
    notifyPlayerChanges();
    setMatchDialogOpen(false);
    
    alert(`Match recorded successfully! ${isWin ? 'Win' : 'Loss'} - ${pointsChange > 0 ? '+' : ''}${pointsChange} points`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-sans antialiased">
      <header className="bg-gray-900/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FaUserCog className="mr-2 text-purple-400" />
            Admin Panel
          </h1>
          <Link href="/" className="flex items-center text-gray-400 hover:text-white">
            <FaArrowLeft className="mr-1" /> Back to Rankings
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-900/60 border border-purple-900/50 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left sidebar - Player list */}
            <div className="border-r border-gray-800">
              <div className="p-4 border-b border-gray-800 bg-gray-800/50 flex justify-between items-center">
                <h2 className="font-medium text-white">Player List</h2>
                <Button 
                  size="sm" 
                  onClick={handleNewPlayer}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FaPlus className="mr-1" /> New Player
                </Button>
              </div>
              <div className="h-[70vh] overflow-y-auto divide-y divide-gray-800/60">
                {players.sort((a, b) => a.rank - b.rank).map(player => (
                  <div 
                    key={player.rank}
                    className={`p-3 hover:bg-gray-800/30 cursor-pointer flex items-center justify-between ${
                      selectedPlayerId === player.rank ? 'bg-purple-900/20 border-l-4 border-purple-500' : ''
                    }`}
                    onClick={() => handleSelectPlayer(player.rank)}
                  >
                    <div className="flex items-center">
                      {player.rank <= 3 && (
                        <FaCrown 
                          className="mr-2" 
                          color={player.rank === 1 ? "#FFD700" : player.rank === 2 ? "#C0C0C0" : "#CD7F32"} 
                          size={14} 
                        />
                      )}
                      <div>
                        <span className="font-medium text-white">{player.name}</span>
                        <div className="flex items-center text-xs">
                          <span className="text-gray-400">Rank: {player.rank}</span>
                          <span className="mx-1 text-gray-600">•</span>
                          <span className="text-purple-400">{player.points} pts</span>
                        </div>
                      </div>
                    </div>
                    {player.isRetired && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Retired</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right section - Player details */}
            <div className="col-span-2 p-6">
              {selectedPlayerId || newPlayerMode ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                      {newPlayerMode ? "Create New Player" : `Player: ${formData.name}`}
                    </h2>
                    <div className="space-x-2">
                      {!editMode ? (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditMode(true)}
                            className="border-purple-600 text-purple-400 hover:bg-purple-900/20"
                          >
                            <FaUserEdit className="mr-1" /> Edit
                          </Button>
                          {!newPlayerMode && (
                            <>
                              <Button 
                                variant="outline"
                                onClick={handleAddMatch}
                                className="border-green-600 text-green-400 hover:bg-green-900/20"
                              >
                                <FaTrophy className="mr-1" /> Add Match
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={handleDeletePlayer}
                              >
                                <FaTrash className="mr-1" /> Delete
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={handleResetForm}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveChanges}
                          >
                            <FaSave className="mr-1" /> Save
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Player Details</TabsTrigger>
                      <TabsTrigger value="stats">Player Stats</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Player Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name || ''} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rank">Rank Position</Label>
                          <Input 
                            id="rank" 
                            name="rank" 
                            type="number" 
                            value={formData.rank || ''} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="points">Current Points</Label>
                          <Input 
                            id="points" 
                            name="points" 
                            type="number" 
                            value={formData.points || ''} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="recentMatches">Recent Matches (e.g. WWLWLW)</Label>
                          <Input 
                            id="recentMatches" 
                            name="recentMatches" 
                            value={formData.recentMatches || ''} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2 my-4">
                            <Switch 
                              id="isRetired" 
                              checked={formData.isRetired || false} 
                              onCheckedChange={handleSwitchChange}
                              disabled={!editMode}
                            />
                            <Label htmlFor="isRetired">Retired Player</Label>
                          </div>
                        </div>
                        {(formData.isRetired || false) && (
                          <div>
                            <Label htmlFor="peakPoints">Peak Points</Label>
                            <Input 
                              id="peakPoints" 
                              name="peakPoints" 
                              type="number" 
                              value={formData.peakPoints || ''} 
                              onChange={handleInputChange} 
                              disabled={!editMode}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="stats">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="stats.wins">Wins</Label>
                          <Input 
                            id="stats.wins" 
                            name="stats.wins" 
                            type="number" 
                            value={formData.stats?.wins || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stats.losses">Losses</Label>
                          <Input 
                            id="stats.losses" 
                            name="stats.losses" 
                            type="number" 
                            value={formData.stats?.losses || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stats.winStreak">Win Streak</Label>
                          <Input 
                            id="stats.winStreak" 
                            name="stats.winStreak" 
                            type="number" 
                            value={formData.stats?.winStreak || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stats.kills">Kills</Label>
                          <Input 
                            id="stats.kills" 
                            name="stats.kills" 
                            type="number" 
                            value={formData.stats?.kills || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stats.teamChampion">Team Champion</Label>
                          <Input 
                            id="stats.teamChampion" 
                            name="stats.teamChampion" 
                            type="number" 
                            value={formData.stats?.teamChampion || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stats.mcSatChampion">MC SAT Champion</Label>
                          <Input 
                            id="stats.mcSatChampion" 
                            name="stats.mcSatChampion" 
                            type="number" 
                            value={formData.stats?.mcSatChampion || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <FaUserEdit size={40} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium mb-2">No Player Selected</h3>
                  <p>Select a player from the list or create a new one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Match Recording Dialog */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Record Match Result</DialogTitle>
            <DialogDescription>
              Enter match details for {formData.name}. Stats will be automatically updated.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opponent" className="text-right">
                Opponent
              </Label>
              <Input
                id="opponent"
                name="opponent"
                className="col-span-3 bg-gray-800 border-gray-700"
                value={matchData.opponent}
                onChange={handleMatchInputChange}
                placeholder="Enter opponent name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="result" className="text-right">
                Result
              </Label>
              <select
                id="result"
                name="result"
                className="col-span-3 flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={matchData.result}
                onChange={handleMatchInputChange}
              >
                <option value="W">Win</option>
                <option value="L">Loss</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="playerKills" className="text-right">
                Kills
              </Label>
              <Input
                id="playerKills"
                name="playerKills"
                type="number"
                className="col-span-3 bg-gray-800 border-gray-700"
                value={matchData.playerKills}
                onChange={handleMatchInputChange}
                min="0"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMatchDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMatchSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              <FaMagic className="mr-2" /> Update Stats
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}