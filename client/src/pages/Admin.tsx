import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Player, 
  createPlayer, 
  updatePlayer, 
  deletePlayer, 
  recordMatch, 
  fetchMatchupBetweenPlayers 
} from "@/data/players";
import { usePlayerContext } from "@/contexts/PlayerContext";
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
  const { activePlayers, retiredPlayers, refreshPlayers } = usePlayerContext();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newPlayerMode, setNewPlayerMode] = useState(false);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<{
    opponentId: number;
  }>({
    opponentId: 0
  });
  
  // State to store opponent matchup data
  const [matchupData, setMatchupData] = useState<{
    wins: number;
    losses: number;
    lastMatchDate: string | null;
  } | null>(null);

  // Define the form data type for admin use
  type AdminPlayerData = {
    id?: number;
    rank: number;
    name: string;
    points: number;
    recentMatches: string;
    isRetired: boolean;
    peakPoints: number;
    wins: number;
    losses: number;
    winStreak: number;
    kills: number;
    teamChampion: number;
    mcSatChampion: number;
  };
  
  // Form state for player data
  const [formData, setFormData] = useState<AdminPlayerData>({
    rank: 0,
    name: "",
    points: 0,
    recentMatches: "",
    isRetired: false,
    peakPoints: 0,
    wins: 0,
    losses: 0,
    winStreak: 0,
    kills: 0,
    teamChampion: 0,
    mcSatChampion: 0
  });

  // All players combined for select lists
  const allPlayers = [...activePlayers, ...retiredPlayers];

  const handleSelectPlayer = (playerId: number) => {
    const player = allPlayers.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayerId(playerId);
      // Create a new object with all the player properties
      setFormData({
        id: player.id,
        rank: player.rank,
        name: player.name,
        points: player.points || 0,
        recentMatches: player.recentMatches || "",
        isRetired: player.isRetired || false,
        peakPoints: player.peakPoints || 0,
        wins: player.wins || 0,
        losses: player.losses || 0,
        winStreak: player.winStreak || 0,
        kills: player.kills || 0,
        teamChampion: player.teamChampion || 0,
        mcSatChampion: player.mcSatChampion || 0
      });
      setEditMode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle all properties as top-level 
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isRetired: checked
    }));
  };

  const handleResetForm = () => {
    if (selectedPlayerId) {
      const player = allPlayers.find(p => p.id === selectedPlayerId);
      if (player) {
        // Reset to current player data
        setFormData({
          id: player.id,
          rank: player.rank,
          name: player.name,
          points: player.points || 0,
          recentMatches: player.recentMatches || "",
          isRetired: player.isRetired || false,
          peakPoints: player.peakPoints || 0,
          wins: player.wins || 0,
          losses: player.losses || 0,
          winStreak: player.winStreak || 0,
          kills: player.kills || 0,
          teamChampion: player.teamChampion || 0,
          mcSatChampion: player.mcSatChampion || 0
        });
      }
    } else {
      setFormData({
        rank: allPlayers.length + 1,
        name: "",
        points: 0,
        recentMatches: "",
        isRetired: false,
        peakPoints: 0,
        wins: 0,
        losses: 0,
        winStreak: 0,
        kills: 0,
        teamChampion: 0,
        mcSatChampion: 0
      });
    }
    setEditMode(false);
  };

  const handleNewPlayer = () => {
    setSelectedPlayerId(null);
    setFormData({
      rank: activePlayers.length + 1,
      name: "",
      points: 0,
      recentMatches: "",
      isRetired: false,
      peakPoints: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      kills: 0,
      teamChampion: 0,
      mcSatChampion: 0
    });
    setNewPlayerMode(true);
    setEditMode(true);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (newPlayerMode) {
        // Add new player
        await createPlayer({
          rank: formData.rank,
          name: formData.name,
          points: formData.points,
          recentMatches: formData.recentMatches,
          isRetired: formData.isRetired,
          peakPoints: formData.peakPoints,
          wins: formData.wins,
          losses: formData.losses,
          winStreak: formData.winStreak,
          kills: formData.kills,
          teamChampion: formData.teamChampion,
          mcSatChampion: formData.mcSatChampion
        });
      } else if (selectedPlayerId) {
        // Update existing player
        await updatePlayer(selectedPlayerId, {
          rank: formData.rank,
          name: formData.name,
          points: formData.points,
          recentMatches: formData.recentMatches,
          isRetired: formData.isRetired,
          peakPoints: formData.peakPoints,
          wins: formData.wins,
          losses: formData.losses,
          winStreak: formData.winStreak,
          kills: formData.kills,
          teamChampion: formData.teamChampion,
          mcSatChampion: formData.mcSatChampion
        });
      }
      
      // Refresh data
      await refreshPlayers();
      
      // Show feedback and reset UI state
      alert("Player data has been updated!");
      setEditMode(false);
      setNewPlayerMode(false);
    } catch (err) {
      console.error("Error saving player:", err);
      setError("Failed to save player data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlayer = async () => {
    if (selectedPlayerId) {
      const confirmed = window.confirm("Are you sure you want to delete this player?");
      if (confirmed) {
        try {
          setSaving(true);
          setError(null);
          
          await deletePlayer(selectedPlayerId);
          await refreshPlayers();
          
          alert("Player has been deleted!");
          
          // Reset the form and selection
          setSelectedPlayerId(null);
          setFormData({
            rank: 0,
            name: "",
            points: 0,
            recentMatches: "",
            isRetired: false,
            peakPoints: 0,
            wins: 0,
            losses: 0,
            winStreak: 0,
            kills: 0,
            teamChampion: 0,
            mcSatChampion: 0
          });
        } catch (err) {
          console.error("Error deleting player:", err);
          setError("Failed to delete player. Please try again.");
        } finally {
          setSaving(false);
        }
      }
    }
  };
  
  // Fetch matchup data when opponent or player changes
  useEffect(() => {
    const fetchMatchupData = async () => {
      if (selectedPlayerId && matchData.opponentId > 0) {
        try {
          const matchup = await fetchMatchupBetweenPlayers(selectedPlayerId, matchData.opponentId);
          if (matchup) {
            setMatchupData({
              wins: matchup.wins || 0,
              losses: matchup.losses || 0,
              lastMatchDate: matchup.lastMatchDate || null
            });
          } else {
            // No matchup history yet
            setMatchupData({
              wins: 0,
              losses: 0,
              lastMatchDate: null
            });
          }
        } catch (err) {
          console.error("Error fetching matchup data:", err);
          setMatchupData(null);
        }
      } else {
        setMatchupData(null);
      }
    };
    
    fetchMatchupData();
  }, [selectedPlayerId, matchData.opponentId]);

  // Handles match dialog input changes
  const handleMatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setMatchData(prev => {
      if (name === 'opponentId') {
        return {
          ...prev,
          opponentId: Number(value)
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
      opponentId: 0,
      playerKills: 0
    });
    
    setMatchDialogOpen(true);
  };
  
  // Handles the submission of a new match
  const handleMatchSubmit = async () => {
    if (!selectedPlayerId || !matchData.opponentId) {
      alert("Please select an opponent");
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Record match using the API
      await recordMatch(
        selectedPlayerId,  // Winner ID
        matchData.opponentId, // Loser ID
        matchData.playerKills
      );
      
      // Refresh player data
      await refreshPlayers();
      
      // Reset the selected player's form data
      const updatedPlayer = allPlayers.find(p => p.id === selectedPlayerId);
      if (updatedPlayer) {
        setFormData({
          id: updatedPlayer.id,
          rank: updatedPlayer.rank,
          name: updatedPlayer.name,
          points: updatedPlayer.points || 0,
          recentMatches: updatedPlayer.recentMatches || "",
          isRetired: updatedPlayer.isRetired || false,
          peakPoints: updatedPlayer.peakPoints || 0,
          wins: updatedPlayer.wins || 0,
          losses: updatedPlayer.losses || 0,
          winStreak: updatedPlayer.winStreak || 0,
          kills: updatedPlayer.kills || 0, 
          teamChampion: updatedPlayer.teamChampion || 0,
          mcSatChampion: updatedPlayer.mcSatChampion || 0
        });
      }
      
      // Close dialog and show success message
      setMatchDialogOpen(false);
      alert("Match recorded successfully!");
    } catch (err) {
      console.error("Error recording match:", err);
      setError("Failed to record match. Please try again.");
    } finally {
      setSaving(false);
    }
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
                {activePlayers.concat(retiredPlayers).map(player => (
                  <div 
                    key={player.id}
                    className={`p-3 hover:bg-gray-800/30 cursor-pointer flex items-center justify-between ${
                      selectedPlayerId === player.id ? 'bg-purple-900/20 border-l-4 border-purple-500' : ''
                    }`}
                    onClick={() => handleSelectPlayer(player.id)}
                  >
                    <div className="flex items-center">
                      {player.rank <= 3 && player.rank > 0 && (
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
                          <Label htmlFor="wins">Wins</Label>
                          <Input 
                            id="wins" 
                            name="wins" 
                            type="number" 
                            value={formData.wins || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="losses">Losses</Label>
                          <Input 
                            id="losses" 
                            name="losses" 
                            type="number" 
                            value={formData.losses || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="winStreak">Win Streak</Label>
                          <Input 
                            id="winStreak" 
                            name="winStreak" 
                            type="number" 
                            value={formData.winStreak || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="kills">Kills</Label>
                          <Input 
                            id="kills" 
                            name="kills" 
                            type="number" 
                            value={formData.kills || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="teamChampion">Team Champion</Label>
                          <Input 
                            id="teamChampion" 
                            name="teamChampion" 
                            type="number" 
                            value={formData.teamChampion || 0} 
                            onChange={handleInputChange} 
                            disabled={!editMode}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mcSatChampion">MC SAT Champion</Label>
                          <Input 
                            id="mcSatChampion" 
                            name="mcSatChampion" 
                            type="number" 
                            value={formData.mcSatChampion || 0} 
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
              Select the opponent that {formData.name} defeated. Stats will be automatically updated.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opponentId" className="text-right">
                Opponent
              </Label>
              <select
                id="opponentId"
                name="opponentId"
                className="col-span-3 flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={matchData.opponentId}
                onChange={handleMatchInputChange}
              >
                <option value={0}>Select opponent...</option>
                {allPlayers
                  .filter(p => p.id !== selectedPlayerId)
                  .map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name} (Rank: {player.rank})
                    </option>
                  ))}
              </select>
            </div>
            
            {matchData.opponentId > 0 && matchupData && (
              <div className="col-span-4 my-2">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Match History</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-b from-green-900/20 to-green-900/10 p-2 rounded-lg border border-green-700/20">
                      <div className="text-xs text-gray-400">Wins against this opponent</div>
                      <div className="text-xl font-bold text-green-400">{matchupData.wins}</div>
                    </div>
                    <div className="bg-gradient-to-b from-red-900/20 to-red-900/10 p-2 rounded-lg border border-red-700/20">
                      <div className="text-xs text-gray-400">Losses against this opponent</div>
                      <div className="text-xl font-bold text-red-400">{matchupData.losses}</div>
                    </div>
                  </div>
                  {matchupData.lastMatchDate && (
                    <div className="text-xs text-gray-400 mt-2">
                      Last match: {new Date(matchupData.lastMatchDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
            
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
            
            {matchData.opponentId > 0 && (
              <div className="col-span-4 text-sm text-gray-400 mt-2 p-3 bg-purple-900/10 border border-purple-900/20 rounded">
                <p className="mb-2">Match points will be calculated based on:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Rank difference between players</li>
                  <li>Win/loss record bonus (every 10 net wins = +1 point)</li>
                  <li>Kill count (more kills = more points)</li>
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMatchDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMatchSubmit}
              className="bg-green-600 hover:bg-green-700"
              disabled={saving || !matchData.opponentId}
            >
              {saving ? "Saving..." : "Record Match"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}