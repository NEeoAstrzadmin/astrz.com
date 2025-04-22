import React from "react";
import { Player } from "@/data/players";
import { getPlayerBadge, getAllPlayerBadges, getNextBadge, getPointsForNextBadge } from "@/lib/badgeSystem";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface PlayerBadgeProps {
  player: Player;
  showAll?: boolean;
  showNextBadge?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Component to display player badges based on their points
 */
export function PlayerBadges({ 
  player, 
  showAll = false, 
  showNextBadge = false,
  size = "md",
  className = ""
}: PlayerBadgeProps) {
  // Get the current highest badge or all badges based on the showAll prop
  const badges = showAll ? getAllPlayerBadges(player) : [getPlayerBadge(player)];
  const nextBadge = showNextBadge ? getNextBadge(player) : null;
  const pointsNeeded = nextBadge ? getPointsForNextBadge(player) : null;
  
  // Size classes based on the size prop
  const sizeClasses = {
    sm: "text-xs p-1",
    md: "text-sm p-1.5",
    lg: "text-base p-2"
  };
  
  const iconSizeClasses = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg"
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map(badge => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                className={`${sizeClasses[size]} flex items-center gap-1.5 animate-shimmer`} 
                style={{ 
                  backgroundColor: `${badge.color}25`, // 25% opacity background
                  color: badge.color,
                  borderColor: `${badge.color}70`, // 70% opacity border
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: `0 0 8px ${badge.color}40` // Subtle glow effect
                }}
              >
                <badge.icon className={iconSizeClasses[size]} />
                {badge.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.name}</p>
              <p className="text-sm opacity-80">{badge.description}</p>
              <p className="text-xs mt-1">Requires {badge.pointThreshold}+ points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {showNextBadge && nextBadge && (
        <div className="w-full mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Next Badge: {nextBadge.name}</span>
            <span>{player.points}/{nextBadge.pointThreshold} points</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <div 
                    className="h-full animate-pulse" 
                    style={{ 
                      width: `${(player.points / nextBadge.pointThreshold) * 100}%`,
                      backgroundColor: nextBadge.color,
                      boxShadow: `0 0 10px ${nextBadge.color}`
                    }}
                  ></div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Need {pointsNeeded} more points for {nextBadge.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}