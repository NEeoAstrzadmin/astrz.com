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
    <div className="player-card bg-gray-800 rounded-md border border-gray-700 overflow-hidden transition-colors duration-200 hover:bg-gray-750">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center mr-3" style={{ backgroundColor: `${tierColor}30`, color: tierColor }}>
              <span className="font-medium text-sm">#{player.rank}</span>
            </div>
            <div>
              <h3 className="font-bold text-white">{player.name}</h3>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-400">{getDescription(player.rank)}</p>
                <span className="text-xs font-mono ml-3 px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${tierColor}20`, color: tierColor }}>
                  {player.points} pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
