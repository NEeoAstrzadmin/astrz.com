import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Player, players } from "@/data/players";
import { FaCrown, FaUserEdit, FaTrash, FaArrowLeft, FaPlus, FaSave, FaUserCog } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newPlayerMode, setNewPlayerMode] = useState(false);

  // Form state for player data
  const [formData, setFormData] = useState({
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
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
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
    // In a real app, this would send data to an API
    // For this demo, just display what would be saved
    console.log("Saving player data:", formData);
    alert("In a real application, this would save the player data to the database.");
    setEditMode(false);
    setNewPlayerMode(false);
  };

  const handleDeletePlayer = () => {
    // In a real app, this would send a delete request to an API
    if (selectedPlayerId) {
      const confirmed = window.confirm("Are you sure you want to delete this player?");
      if (confirmed) {
        console.log("Deleting player with rank:", selectedPlayerId);
        alert("In a real application, this would delete the player from the database.");
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
                            <Button 
                              variant="destructive" 
                              onClick={handleDeletePlayer}
                            >
                              <FaTrash className="mr-1" /> Delete
                            </Button>
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
    </div>
  );
}