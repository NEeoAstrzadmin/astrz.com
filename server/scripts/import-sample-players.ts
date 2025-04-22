/**
 * Import sample players for testing the Astrz Combat Leaderboard
 */
import { storage } from "../storage";

async function importSamplePlayers() {
  console.log("Starting player import...");

  // Sample player data
  const players = [
    { 
      rank: 1, 
      name: "Wido", 
      points: 302, 
      recentMatches: "WWWWLWW",
      wins: 496,
      losses: 156,
      winStreak: 7,
      kills: 1270,
      teamChampion: 4,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 2, 
      name: "Ellies V", 
      points: 272, 
      recentMatches: "WWLWWLW",
      wins: 488,
      losses: 136,
      winStreak: 1,
      kills: 1202,
      teamChampion: 4,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 3, 
      name: "Sycthy", 
      points: 267, 
      recentMatches: "WLWLWWW",
      wins: 780,
      losses: 202,
      winStreak: 3,
      kills: 1702,
      teamChampion: 5,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 4, 
      name: "Rexo", 
      points: 236, 
      recentMatches: "WLWWWWL",
      wins: 346,
      losses: 197,
      winStreak: 4,
      kills: 1011,
      teamChampion: 2,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 5, 
      name: "Evo", 
      points: 212, 
      recentMatches: "LWWWLWW",
      wins: 198,
      losses: 100,
      winStreak: 3,
      kills: 587,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 6, 
      name: "Darky", 
      points: 210, 
      recentMatches: "WWWLLWW",
      wins: 198,
      losses: 97,
      winStreak: 8,
      kills: 611,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 7, 
      name: "Blom", 
      points: 201, 
      recentMatches: "WLLLWWW",
      wins: 193,
      losses: 100,
      winStreak: 1,
      kills: 560,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 8, 
      name: "Blazo", 
      points: 190, 
      recentMatches: "WWLWWLL",
      wins: 184,
      losses: 97,
      winStreak: 2,
      kills: 544,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 9, 
      name: "spectro", 
      points: 186, 
      recentMatches: "WLWWWLL",
      wins: 250,
      losses: 139,
      winStreak: 5,
      kills: 802,
      teamChampion: 6,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 10, 
      name: "Doni", 
      points: 177, 
      recentMatches: "LWWWWLW",
      wins: 175,
      losses: 122,
      winStreak: 5,
      kills: 511,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 11, 
      name: "Reterno", 
      points: 171, 
      recentMatches: "LWWWLLW",
      wins: 171,
      losses: 123,
      winStreak: 4,
      kills: 501,
      teamChampion: 0,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 12, 
      name: "kelk", 
      points: 164, 
      recentMatches: "WLWLWLW",
      wins: 200,
      losses: 136,
      winStreak: 4,
      kills: 711,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 13, 
      name: "Me", 
      points: 152, 
      recentMatches: "WWLLWLW",
      wins: 155,
      losses: 92,
      winStreak: 3,
      kills: 398,
      teamChampion: 0,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 14, 
      name: "yolo", 
      points: 145, 
      recentMatches: "LWWLWLW",
      wins: 286,
      losses: 167,
      winStreak: 3,
      kills: 833,
      teamChampion: 2,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 15, 
      name: "big A", 
      points: 138, 
      recentMatches: "LWLWWWL",
      wins: 280,
      losses: 165,
      winStreak: 3,
      kills: 829,
      teamChampion: 3,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 16, 
      name: "Unded", 
      points: 131, 
      recentMatches: "LLWWWLW",
      wins: 200,
      losses: 101,
      winStreak: 2,
      kills: 766,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 17, 
      name: "Unio", 
      points: 127, 
      recentMatches: "WWLLWLW",
      wins: 199,
      losses: 100,
      winStreak: 2,
      kills: 760,
      teamChampion: 2,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 18, 
      name: "Winder", 
      points: 120, 
      recentMatches: "LWLWWLL",
      wins: 189,
      losses: 96,
      winStreak: 2,
      kills: 756,
      teamChampion: 2,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 19, 
      name: "Vran", 
      points: 116, 
      recentMatches: "WLLWWLL",
      wins: 201,
      losses: 103,
      winStreak: 2,
      kills: 772,
      teamChampion: 0,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 20, 
      name: "Crysto", 
      points: 112, 
      recentMatches: "WLWLWLL",
      wins: 211,
      losses: 105,
      winStreak: 2,
      kills: 791,
      teamChampion: 3,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 21, 
      name: "Morpho", 
      points: 106, 
      recentMatches: "WLLWLWL",
      wins: 213,
      losses: 104,
      winStreak: 2,
      kills: 797,
      teamChampion: 3,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 22, 
      name: "Void", 
      points: 96, 
      recentMatches: "LWLLWWL",
      wins: 241,
      losses: 118,
      winStreak: 1,
      kills: 818,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 23, 
      name: "Ravv", 
      points: 88, 
      recentMatches: "LLWWLLL",
      wins: 90,
      losses: 65,
      winStreak: 1,
      kills: 256,
      teamChampion: 0,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 24, 
      name: "Polo", 
      points: 82, 
      recentMatches: "WLLWLLL",
      wins: 198,
      losses: 111,
      winStreak: 1,
      kills: 300,
      teamChampion: 3,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 25, 
      name: "Retoro", 
      points: 78, 
      recentMatches: "LWLLLWL",
      wins: 200,
      losses: 105,
      winStreak: 1,
      kills: 295,
      teamChampion: 3,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 26, 
      name: "Neo H", 
      points: 71, 
      recentMatches: "WLLWWLL",
      wins: 790,
      losses: 280,
      winStreak: 12,
      kills: 1750,
      teamChampion: 5,
      mcSatChampion: 0,
      isRetired: true,
      peakPoints: 427
    },
    { 
      rank: 27, 
      name: "Raivo", 
      points: 68, 
      recentMatches: "WLLLWLL",
      wins: 100,
      losses: 65,
      winStreak: 1,
      kills: 211,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 28, 
      name: "Tron T", 
      points: 60, 
      recentMatches: "LLWLLWL",
      wins: 110,
      losses: 77,
      winStreak: 1,
      kills: 215,
      teamChampion: 1,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 29, 
      name: "Inferno", 
      points: 60, 
      recentMatches: "LLLWLWL",
      wins: 115,
      losses: 81,
      winStreak: 2,
      kills: 211,
      teamChampion: 2,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 30, 
      name: "Rutner", 
      points: 67, 
      recentMatches: "LLWLLWL",
      wins: 98,
      losses: 60,
      winStreak: 1,
      kills: 200,
      teamChampion: 0,
      mcSatChampion: 0,
      isRetired: false
    },
    { 
      rank: 31, 
      name: "Jka", 
      points: 65, 
      recentMatches: "LLWLLWL",
      wins: 695,
      losses: 200,
      winStreak: 8,
      kills: 1700,
      teamChampion: 4,
      mcSatChampion: 0,
      isRetired: true,
      peakPoints: 411
    }
  ];

  // Import each player
  for (const player of players) {
    try {
      await storage.createPlayer(player);
      console.log(`Imported player: ${player.name}`);
    } catch (error) {
      console.error(`Error importing player ${player.name}:`, error);
    }
  }

  console.log("Player import completed!");
}

// Run the import
importSamplePlayers().catch(console.error);