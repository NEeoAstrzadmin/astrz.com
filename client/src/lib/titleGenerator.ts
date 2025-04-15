import { Player } from "@/data/players";

// Title components
const prefixes = [
  "Supreme", "Elite", "Legendary", "Master", "Apex", 
  "Prime", "Veteran", "Champion", "Dominant", "Ultimate",
  "Grand", "Royal", "Mystic", "Celestial", "Immortal",
  "Eternal", "Epic", "Heroic", "Mighty", "Unstoppable"
];

const combatNouns = [
  "Warrior", "Striker", "Assassin", "Defender", "Hunter", 
  "Slayer", "Conqueror", "Destroyer", "Guardian", "Gladiator",
  "Commander", "Warlord", "Vanquisher", "Sentinel", "Enforcer",
  "Vanguard", "Marauder", "Protector", "Juggernaut", "Executioner"
];

const specialties = [
  "of the Shadows", "of the Arena", "of the Storm", "of Victory", "of Precision",
  "of Dominance", "of the Void", "of the Abyss", "of Annihilation", "of Carnage",
  "of the Elite", "of the Cosmos", "of the Nexus", "of Destruction", "of Legend",
  "of Mayhem", "of Triumph", "of Conquest", "of Glory", "of the Inferno"
];

// Adjectives based on specific stats
const killAdjectives = [
  "Lethal", "Deadly", "Savage", "Merciless", "Brutal",
  "Ruthless", "Ferocious", "Vicious", "Bloodthirsty", "Relentless"
];

const streakAdjectives = [
  "Unbeaten", "Flawless", "Invincible", "Undefeated", "Unstoppable",
  "Dominant", "Overwhelming", "Sovereign", "Supreme", "Undisputed"
];

const teamAdjectives = [
  "Coordinated", "Strategic", "Tactical", "Unified", "Synchronized",
  "Cohesive", "Allied", "Cooperative", "United", "Formidable"
];

/**
 * Generate a unique title for a player based on their stats
 */
export function generateCombatTitle(player: Player): string {
  if (!player.stats) return "Novice Combatant";
  
  const { wins, losses, kills, winStreak, teamChampion } = player.stats;
  const titles: string[] = [];
  
  // Title based on player rank
  if (player.rank === 1) {
    titles.push("Sovereign of the Arena");
  } else if (player.rank <= 3) {
    titles.push("Elite Champion");
  } else if (player.rank <= 10) {
    titles.push("Distinguished Combatant");
  }
  
  // Title based on win rate
  const winRate = wins / (wins + losses || 1);
  if (winRate >= 0.8) {
    titles.push(`${getRandomItem(streakAdjectives)} Victor`);
  } else if (winRate >= 0.6) {
    titles.push(`Accomplished Duelist`);
  }
  
  // Title based on kills
  if (kills > 400) {
    titles.push(`${getRandomItem(killAdjectives)} Decimator`);
  } else if (kills > 250) {
    titles.push(`${getRandomItem(killAdjectives)} Hunter`);
  } else if (kills > 150) {
    titles.push(`${getRandomItem(killAdjectives)} Striker`);
  }
  
  // Title based on win streak
  if (winStreak >= 15) {
    titles.push(`Unstoppable Force`);
  } else if (winStreak >= 10) {
    titles.push(`${getRandomItem(streakAdjectives)} Dominator`);
  } else if (winStreak >= 5) {
    titles.push(`Win Streak Master`);
  }
  
  // Title based on team championship
  if (teamChampion >= 3) {
    titles.push(`Legendary Team Leader`);
  } else if (teamChampion >= 1) {
    titles.push(`${getRandomItem(teamAdjectives)} Team Captain`);
  }
  
  // Generate random title if no specific title is earned or 20% chance to get random title anyway
  if (titles.length === 0 || Math.random() < 0.2) {
    const prefix = getRandomItem(prefixes);
    const noun = getRandomItem(combatNouns);
    const specialty = Math.random() < 0.5 ? getRandomItem(specialties) : "";
    
    return `${prefix} ${noun}${specialty ? " " + specialty : ""}`;
  }
  
  // Return a random title from the earned ones
  return getRandomItem(titles);
}

/**
 * Get a random item from an array
 */
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generate a distinct title based on the player's most outstanding stat
 */
export function generateDistinctiveTitle(player: Player): string {
  if (!player.stats) return "Novice";
  
  const { wins, losses, kills, winStreak, teamChampion } = player.stats;
  const winRate = wins / (wins + losses || 1);
  
  // Find the player's distinctive trait
  if (player.isRetired) {
    return "Retired Legend";
  } else if (player.rank === 1) {
    return "Supreme Champion";
  } else if (teamChampion >= 3) {
    return "Team Dynasty";
  } else if (winStreak >= 10) {
    return "Undefeated Force";
  } else if (kills > 400) {
    return "Elite Assassin";
  } else if (winRate >= 0.75 && wins >= 20) {
    return "Victory Master";
  } else if (player.rank <= 5) {
    return "Top Contender";
  } else {
    // Generate based on their tier
    if (player.points >= 250) return "Astrz Sovereign";
    if (player.points >= 180) return "Astrz Enforcer";
    if (player.points >= 100) return "Astrz Warrior";
    return "Astrz Recruit";
  }
}