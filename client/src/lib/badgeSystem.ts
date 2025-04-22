import { Player } from "@/data/players";
import { FaCrown, FaTrophy, FaStar, FaFire, FaChess, FaShieldAlt, FaBolt, FaFighterJet } from "react-icons/fa";

/**
 * Badge definitions with point thresholds and icons
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any; // React icon component
  color: string;
  pointThreshold: number;
}

/**
 * Available badges in the system, ordered by point threshold (highest first)
 */
export const badges: Badge[] = [
  {
    id: 'supreme-champion',
    name: 'Supreme Champion',
    description: 'Reached the pinnacle of combat excellence',
    icon: FaCrown,
    color: '#FFD700', // Gold
    pointThreshold: 300
  },
  {
    id: 'master-tactician',
    name: 'Master Tactician',
    description: 'A brilliant strategist in the arena',
    icon: FaChess,
    color: '#C0C0C0', // Silver
    pointThreshold: 250
  },
  {
    id: 'elite-warrior',
    name: 'Elite Warrior',
    description: 'One of the most formidable fighters',
    icon: FaShieldAlt,
    color: '#4D96FF', // Blue
    pointThreshold: 200
  },
  {
    id: 'combat-veteran',
    name: 'Combat Veteran',
    description: 'Experienced and respected combatant',
    icon: FaTrophy,
    color: '#9FE6A0', // Green
    pointThreshold: 150
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Rapidly ascending through the ranks',
    icon: FaStar,
    color: '#FFBD35', // Orange
    pointThreshold: 100
  },
  {
    id: 'arena-initiate',
    name: 'Arena Initiate',
    description: 'Beginning the journey of combat mastery',
    icon: FaFire,
    color: '#FF6B6B', // Red
    pointThreshold: 50
  },
  {
    id: 'combat-novice',
    name: 'Combat Novice',
    description: 'Taking first steps in competitive combat',
    icon: FaBolt,
    color: '#C77DFF', // Purple
    pointThreshold: 0
  }
];

/**
 * Special badges for retired players
 */
export const retiredBadge: Badge = {
  id: 'retired-legend',
  name: 'Retired Legend',
  description: 'A legendary fighter who has left the arena',
  icon: FaFighterJet,
  color: '#C0C0C0', // Silver
  pointThreshold: 0
};

/**
 * Get the highest badge a player has earned based on their points
 */
export function getPlayerBadge(player: Player): Badge {
  if (player.isRetired) {
    return retiredBadge;
  }
  
  // Find the highest badge the player qualifies for
  return badges.find(badge => player.points >= badge.pointThreshold) || badges[badges.length - 1];
}

/**
 * Get all badges a player has earned (for displaying multiple badges)
 */
export function getAllPlayerBadges(player: Player): Badge[] {
  if (player.isRetired) {
    return [retiredBadge];
  }
  
  // Return all badges the player has qualified for
  return badges.filter(badge => player.points >= badge.pointThreshold);
}

/**
 * Get the next badge a player can earn
 */
export function getNextBadge(player: Player): Badge | null {
  if (player.isRetired) {
    return null;
  }
  
  // Find the next badge the player hasn't earned yet
  const nextBadges = badges.filter(badge => player.points < badge.pointThreshold);
  return nextBadges.length > 0 ? nextBadges[nextBadges.length - 1] : null;
}

/**
 * Calculate points needed for the next badge
 */
export function getPointsForNextBadge(player: Player): number | null {
  const nextBadge = getNextBadge(player);
  if (!nextBadge) {
    return null;
  }
  
  return nextBadge.pointThreshold - player.points;
}