import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/data/players";

interface TierConfig {
  name: string;
  title: string;
  color: string;
  minPoints?: number;
  maxPoints?: number;
}

interface TierListProps {
  players: Player[];
}

export default function TierList({ players }: TierListProps) {
  const [tierVisibility, setTierVisibility] = useState<Record<string, boolean>>({
    S: false,
    A: false,
    B: false,
    C: false,
    D: false
  });

  // Define tier configurations
  const tiers: TierConfig[] = [
    { name: "S", title: "S Tier", color: "#FF6B6B", minPoints: 880 },
    { name: "A", title: "A Tier", color: "#FFD166", minPoints: 820, maxPoints: 879 },
    { name: "B", title: "B Tier", color: "#06D6A0", minPoints: 770, maxPoints: 819 },
    { name: "C", title: "C Tier", color: "#118AB2", minPoints: 700, maxPoints: 769 },
    { name: "D", title: "D Tier", color: "#7678ED", maxPoints: 699 }
  ];

  // Filter players by tier
  const getPlayersInTier = (tier: TierConfig) => {
    return players.filter(player => {
      if (tier.minPoints && tier.maxPoints) {
        return player.points >= tier.minPoints && player.points <= tier.maxPoints;
      } else if (tier.minPoints) {
        return player.points >= tier.minPoints;
      } else if (tier.maxPoints) {
        return player.points <= tier.maxPoints;
      }
      return false;
    });
  };

  // Animate tiers with staggered delay
  useEffect(() => {
    tiers.forEach((tier, index) => {
      setTimeout(() => {
        setTierVisibility(prev => ({
          ...prev,
          [tier.name]: true
        }));
      }, index * 150);
    });
  }, []);

  return (
    <section id="tierList" className="space-y-8">
      {tiers.map((tier) => {
        const playersInTier = getPlayersInTier(tier);
        if (playersInTier.length === 0) return null;

        return (
          <div
            key={tier.name}
            className={`tier-card tier-${tier.name.toLowerCase()} transition-opacity duration-500 ${
              tierVisibility[tier.name] ? 'opacity-100' : 'opacity-0'
            } mb-8 bg-gray-900 rounded-lg overflow-hidden border border-gray-800`}
            style={{ transform: tierVisibility[tier.name] ? 'translateY(0)' : 'translateY(10px)' }}
          >
            <div 
              className="flex items-center py-3 px-4 border-b border-gray-800" 
              style={{ backgroundColor: `${tier.color}15` }}>
              <div 
                className="w-12 h-12 flex items-center justify-center rounded-lg mr-4"
                style={{ backgroundColor: tier.color }}
              >
                <span className="text-xl font-bold text-white">{tier.name}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{tier.title}</h2>
              <div 
                className="ml-4 px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${tier.color}20`,
                  color: tier.color 
                }}
              >
                {tier.minPoints && tier.maxPoints
                  ? `${tier.minPoints}-${tier.maxPoints} points`
                  : tier.minPoints
                  ? `${tier.minPoints}+ points`
                  : `Below ${tier.maxPoints} points`}
              </div>
            </div>
            
            <div className="tier-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {playersInTier.map((player) => (
                <PlayerCard 
                  key={player.rank} 
                  player={player} 
                  tierColor={tier.color} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
