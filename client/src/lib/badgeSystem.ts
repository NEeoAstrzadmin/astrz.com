import { Player } from "@/data/players";
import { FaCrown, FaTrophy, FaStar, FaFire, FaChess, FaShieldAlt, FaBolt, FaFighterJet, FaSkull } from "react-icons/fa";

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
    id: 'astrz-prime',
    name: 'Astrz Prime',
    description: 'Reached the pinnacle of combat excellence',
    icon: FaCrown,
    color: '#FFD700', // Gold
    pointThreshold: 300
  },
  {
    id: 'astrz-warbringer',
    name: 'Astrz Warbringer',
    description: 'A devastating force on the battlefield',
    icon: FaSkull,
    color: '#FF4500', // Red-orange
    pointThreshold: 240
  },
  {
    id: 'astrz-vanguard',
    name: 'Astrz Vanguard',
    description: 'Leading the charge in combat',
    icon: FaShieldAlt,
    color: '#1E90FF', // Dodger blue
    pointThreshold: 180
  },
  {
    id: 'astrz-enforcer',
    name: 'Astrz Enforcer',
    description: 'Imposing order through combat prowess',
    icon: FaFire, // Using FaFire for Enforcer badge
    color: '#9932CC', // Dark orchid (purple)
    pointThreshold: 120
  },
  {
    id: 'astrz-cadet',
    name: 'Astrz Cadet',
    description: 'Beginning the journey to combat excellence',
    icon: FaStar,
    color: '#32CD32', // Lime green
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