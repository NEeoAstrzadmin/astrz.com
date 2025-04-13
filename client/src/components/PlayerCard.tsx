import { Player } from "@/data/players";

interface PlayerCardProps {
  player: Player;
  tierColor: string;
}

export default function PlayerCard({ player, tierColor }: PlayerCardProps) {
  // Extract first letter of name for avatar
  const firstLetter = player.name.charAt(0).toUpperCase();
  
  // Generate a description based on rank
  const getDescription = (rank: number) => {
    if (rank === 1) return "Top player";
    if (rank <= 3) return "Elite fighter";
    if (rank <= 5) return "Master combatant";
    if (rank <= 10) return "Veteran player";
    if (rank <= 15) return "Rising star";
    if (rank <= 20) return "Skilled fighter";
    return "Challenger";
  };

  return (
    <div className="player-card min-w-[240px] bg-surface rounded-lg border border-gray-800 overflow-hidden flex-shrink-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-2" style={{ backgroundColor: tierColor }}></div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="player-rank text-xs px-2 py-1 bg-gray-800 rounded-full">#{player.rank}</span>
          <span className="font-mono font-medium" style={{ color: tierColor }}>{player.points} pts</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
            <span className="font-medium">{firstLetter}</span>
          </div>
          <div>
            <h3 className="font-bold">{player.name}</h3>
            <p className="text-xs text-gray-400">{getDescription(player.rank)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
