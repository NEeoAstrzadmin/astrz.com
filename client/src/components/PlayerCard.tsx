
import { Player } from "@/data/players";

interface PlayerCardProps {
  player: Player;
  onClose: () => void;
}

export default function PlayerCard({ player, onClose }: PlayerCardProps) {
  const getStatusColor = () => {
    if (player.isRetired) return "text-gray-400";
    return player.rank <= 3 ? "text-yellow-400" : "text-green-400";
  };

  const getStatusText = () => {
    if (player.isRetired) return "Retired";
    if (player.rank <= 3) return "Elite";
    if (player.rank <= 10) return "Active - Veteran";
    return "Active";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-600 rounded-lg shadow-xl max-w-md w-full p-5 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {player.name}
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                ({getStatusText()})
              </span>
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-400 text-sm">Rank: {player.rank}</span>
              <span className="text-gray-500">•</span>
              <span className="text-purple-400 text-sm font-mono">{player.points} pts</span>
              {player.isRetired && player.peakPoints && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-yellow-400 text-sm font-mono">Peak: {player.peakPoints} pts</span>
                </>
              )}
            </div>
          </div>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {player.stats && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Wins</span>
                <p className="text-green-400 font-mono text-lg">{player.stats.wins}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Losses</span>
                <p className="text-red-400 font-mono text-lg">{player.stats.losses}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Win Streak</span>
                <p className="text-yellow-400 font-mono text-lg">{player.stats.winStreak}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Kills</span>
                <p className="text-purple-400 font-mono text-lg">{player.stats.kills}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Team Champion</span>
                <p className="text-blue-400 font-mono text-lg">{player.stats.teamChampion}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">MC SAT Champion</span>
                <p className="text-orange-400 font-mono text-lg">{player.stats.mcSatChampion}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-800">
          <button 
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
