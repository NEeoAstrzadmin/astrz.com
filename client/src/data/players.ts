export interface Player {
  rank: number;
  name: string;
  points: number;
  recentMatches?: string;
  isRetired?: boolean;
  peakPoints?: number;
  combatTitle?: string;
  stats?: {
    wins: number;
    losses: number;
    winStreak: number;
    kills: number;
    teamChampion: number;
    mcSatChampion: number;
  }
}

// Event system for player data changes
type Listener = () => void;
const listeners: Listener[] = [];

// Subscribe to player data changes
export const subscribeToPlayerChanges = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Notify all listeners of player data changes
export const notifyPlayerChanges = () => {
  listeners.forEach(listener => listener());
};

// Export mutable players array
export const players: Player[] = [
  { 
    rank: 1, 
    name: "Wido", 
    points: 302, 
    recentMatches: "WWWWLWW",
    stats: {
      wins: 496,
      losses: 156,
      winStreak: 7,
      kills: 1270,
      teamChampion: 4,
      mcSatChampion: 0
    }
  },
  { 
    rank: 2, 
    name: "Ellies V", 
    points: 272, 
    recentMatches: "WWLWWLW",
    stats: {
      wins: 488,
      losses: 136,
      winStreak: 1,
      kills: 1202,
      teamChampion: 4,
      mcSatChampion: 0
    }
  },
  { 
    rank: 3, 
    name: "Sycthy", 
    points: 267, 
    recentMatches: "WLWLWWW",
    stats: {
      wins: 780,
      losses: 202,
      winStreak: 3,
      kills: 1702,
      teamChampion: 5,
      mcSatChampion: 0
    }
  },
  { 
    rank: 4, 
    name: "Rexo", 
    points: 236, 
    recentMatches: "WLWWWWL",
    stats: {
      wins: 346,
      losses: 197,
      winStreak: 4,
      kills: 1011,
      teamChampion: 2,
      mcSatChampion: 0
    }
  },
  { 
    rank: 5, 
    name: "Evo", 
    points: 212, 
    recentMatches: "LWWWLWW",
    stats: {
      wins: 198,
      losses: 100,
      winStreak: 3,
      kills: 587,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 6, 
    name: "Darky", 
    points: 210, 
    recentMatches: "WWWLLWW",
    stats: {
      wins: 198,
      losses: 97,
      winStreak: 8,
      kills: 611,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 7, 
    name: "Blom", 
    points: 201, 
    recentMatches: "WLLLWWW",
    stats: {
      wins: 193,
      losses: 100,
      winStreak: 1,
      kills: 560,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 8, 
    name: "Blazo", 
    points: 190, 
    recentMatches: "WWLWWLL",
    stats: {
      wins: 184,
      losses: 97,
      winStreak: 2,
      kills: 544,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 9, 
    name: "spectro", 
    points: 186, 
    recentMatches: "WLWWWLL",
    stats: {
      wins: 250,
      losses: 139,
      winStreak: 5,
      kills: 802,
      teamChampion: 6,
      mcSatChampion: 0
    }
  },
  { 
    rank: 10, 
    name: "Doni", 
    points: 177, 
    recentMatches: "LWWWWLW",
    stats: {
      wins: 175,
      losses: 122,
      winStreak: 5,
      kills: 511,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 11, 
    name: "Reterno", 
    points: 171, 
    recentMatches: "LWWWLLW",
    stats: {
      wins: 171,
      losses: 123,
      winStreak: 4,
      kills: 501,
      teamChampion: 0,
      mcSatChampion: 0
    }
  },
  { 
    rank: 12, 
    name: "kelk", 
    points: 164, 
    recentMatches: "WLWLWLW",
    stats: {
      wins: 200,
      losses: 136,
      winStreak: 4,
      kills: 711,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 13, 
    name: "Me", 
    points: 152, 
    recentMatches: "WWLLWLW",
    stats: {
      wins: 155,
      losses: 92,
      winStreak: 3,
      kills: 398,
      teamChampion: 0,
      mcSatChampion: 0
    }
  },
  { 
    rank: 14, 
    name: "yolo", 
    points: 145, 
    recentMatches: "LWWLWLW",
    stats: {
      wins: 286,
      losses: 167,
      winStreak: 3,
      kills: 833,
      teamChampion: 2,
      mcSatChampion: 0
    }
  },
  { 
    rank: 15, 
    name: "big A", 
    points: 138, 
    recentMatches: "LWLWWWL",
    stats: {
      wins: 280,
      losses: 165,
      winStreak: 3,
      kills: 829,
      teamChampion: 3,
      mcSatChampion: 0
    }
  },
  { 
    rank: 16, 
    name: "Unded", 
    points: 131, 
    recentMatches: "LLWWWLW",
    stats: {
      wins: 200,
      losses: 101,
      winStreak: 2,
      kills: 766,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 17, 
    name: "Unio", 
    points: 127, 
    recentMatches: "WWLLWLW",
    stats: {
      wins: 199,
      losses: 100,
      winStreak: 2,
      kills: 760,
      teamChampion: 2,
      mcSatChampion: 0
    }
  },
  { 
    rank: 18, 
    name: "Winder", 
    points: 120, 
    recentMatches: "LWLWWLL",
    stats: {
      wins: 189,
      losses: 96,
      winStreak: 2,
      kills: 756,
      teamChampion: 2,
      mcSatChampion: 0
    }
  },
  { 
    rank: 19, 
    name: "Vran", 
    points: 116, 
    recentMatches: "WLLWWLL",
    stats: {
      wins: 201,
      losses: 103,
      winStreak: 2,
      kills: 772,
      teamChampion: 0,
      mcSatChampion: 0
    }
  },
  { 
    rank: 20, 
    name: "Crysto", 
    points: 112, 
    recentMatches: "WLWLWLL",
    stats: {
      wins: 211,
      losses: 105,
      winStreak: 2,
      kills: 791,
      teamChampion: 3,
      mcSatChampion: 0
    }
  },
  { 
    rank: 21, 
    name: "Morpho", 
    points: 106, 
    recentMatches: "WLLWLWL",
    stats: {
      wins: 213,
      losses: 104,
      winStreak: 2,
      kills: 797,
      teamChampion: 3,
      mcSatChampion: 0
    }
  },
  { 
    rank: 22, 
    name: "Void", 
    points: 96, 
    recentMatches: "LWLLWWL",
    stats: {
      wins: 241,
      losses: 118,
      winStreak: 1,
      kills: 818,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 23, 
    name: "Ravv", 
    points: 88, 
    recentMatches: "LLWWLLL",
    stats: {
      wins: 90,
      losses: 65,
      winStreak: 1,
      kills: 256,
      teamChampion: 0,
      mcSatChampion: 0
    }
  },
  { 
    rank: 24, 
    name: "Polo", 
    points: 82, 
    recentMatches: "WLLWLLL",
    stats: {
      wins: 198,
      losses: 111,
      winStreak: 1,
      kills: 300,
      teamChampion: 3,
      mcSatChampion: 0
    }
  },
  { 
    rank: 25, 
    name: "Retoro", 
    points: 78, 
    recentMatches: "LWLLLWL",
    stats: {
      wins: 200,
      losses: 105,
      winStreak: 1,
      kills: 295,
      teamChampion: 3,
      mcSatChampion: 0
    }
  },
  { 
    rank: 26, 
    name: "Neo H", 
    points: 71, 
    recentMatches: "WLLWWLL",
    isRetired: true,
    peakPoints: 427,
    stats: {
      wins: 790,
      losses: 280,
      winStreak: 12,
      kills: 1750,
      teamChampion: 5,
      mcSatChampion: 0
    }
  },
  { 
    rank: 27, 
    name: "Raivo", 
    points: 68, 
    recentMatches: "WLLLWLL",
    stats: {
      wins: 100,
      losses: 65,
      winStreak: 1,
      kills: 211,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 28, 
    name: "Tron T", 
    points: 60, 
    recentMatches: "LLWLLWL",
    stats: {
      wins: 110,
      losses: 77,
      winStreak: 1,
      kills: 215,
      teamChampion: 1,
      mcSatChampion: 0
    }
  },
  { 
    rank: 29, 
    name: "Inferno", 
    points: 60, 
    recentMatches: "LLLWLWL",
    stats: {
      wins: 115,
      losses: 81,
      winStreak: 2,
      kills: 211,
      teamChampion: 2,
      mcSatChampion: 0
    }
  },
  { 
    rank: 30, 
    name: "Rutner", 
    points: 67, 
    recentMatches: "LLWLLWL",
    stats: {
      wins: 98,
      losses: 60,
      winStreak: 1,
      kills: 200,
      teamChampion: 0,
      mcSatChampion: 0
    }
  },
  { 
    rank: 31, 
    name: "Jka", 
    points: 65, 
    recentMatches: "LLWLLWL",
    isRetired: true,
    peakPoints: 411,
    stats: {
      wins: 695,
      losses: 200,
      winStreak: 8,
      kills: 1700,
      teamChampion: 4,
      mcSatChampion: 0
    }
  }
];
