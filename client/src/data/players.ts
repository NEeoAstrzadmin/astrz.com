export interface Player {
  rank: number;
  name: string;
  points: number;
  recentMatches?: string;
  isRetired?: boolean;
  peakPoints?: number;
  stats?: {
    wins: number;
    losses: number;
    winStreak: number;
    kills: number;
    teamChampion: number;
    mcSatChampion: number;
  }
}

export const players: Player[] = [
  { rank: 1, name: "Wido", points: 302, recentMatches: "WWWWLWW", stats: { wins: 278, losses: 156, winStreak: 15, kills: 534, teamChampion: 4, mcSatChampion: 0 } },
  { rank: 2, name: "Ellies V", points: 272, recentMatches: "WWLWWLW", stats: { wins: 245, losses: 178, winStreak: 11, kills: 423, teamChampion: 3, mcSatChampion: 0 } },
  { rank: 3, name: "Sycthy", points: 267, recentMatches: "WLWLWWW", stats: { wins: 234, losses: 167, winStreak: 10, kills: 401, teamChampion: 2, mcSatChampion: 0 } },
  { rank: 4, name: "Rexo", points: 236, recentMatches: "WLWWWWL", stats: { wins: 212, losses: 156, winStreak: 9, kills: 368, teamChampion: 2, mcSatChampion: 0 } },
  { rank: 5, name: "Evo", points: 212, recentMatches: "LWWWLWW", stats: { wins: 198, losses: 145, winStreak: 8, kills: 343, teamChampion: 1, mcSatChampion: 0 } },
  { rank: 6, name: "Darky", points: 207, recentMatches: "WWWLLWW", stats: { wins: 185, losses: 132, winStreak: 7, kills: 312, teamChampion: 1, mcSatChampion: 0 } },
  { rank: 7, name: "Blom", points: 201, recentMatches: "WLLLWWW", stats: { wins: 178, losses: 129, winStreak: 6, kills: 298, teamChampion: 1, mcSatChampion: 0 } },
  { rank: 8, name: "Blazo", points: 190, recentMatches: "WWLWWLL", stats: { wins: 167, losses: 121, winStreak: 5, kills: 281, teamChampion: 1, mcSatChampion: 0 } },
  { rank: 9, name: "spectro", points: 186, recentMatches: "WLWWWLL", stats: { wins: 162, losses: 118, winStreak: 5, kills: 274, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 10, name: "Doni", points: 177, recentMatches: "LWWWWLW", stats: { wins: 155, losses: 112, winStreak: 4, kills: 261, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 11, name: "Reterno", points: 171, recentMatches: "LWWWLLW", stats: { wins: 148, losses: 109, winStreak: 4, kills: 248, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 12, name: "kelk", points: 164, recentMatches: "WLWLWLW", stats: { wins: 141, losses: 105, winStreak: 4, kills: 235, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 13, name: "Me", points: 152, recentMatches: "WWLLWLW", stats: { wins: 132, losses: 98, winStreak: 3, kills: 220, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 14, name: "yolo", points: 145, recentMatches: "LWWLWLW", stats: { wins: 125, losses: 91, winStreak: 3, kills: 208, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 15, name: "big A", points: 138, recentMatches: "LWLWWWL", stats: { wins: 118, losses: 87, winStreak: 3, kills: 195, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 16, name: "Unded", points: 131, recentMatches: "LLWWWLW", stats: { wins: 112, losses: 83, winStreak: 2, kills: 185, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 17, name: "Unio", points: 127, recentMatches: "WWLLWLW", stats: { wins: 108, losses: 79, winStreak: 2, kills: 176, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 18, name: "Winder", points: 120, recentMatches: "LWLWWLL", stats: { wins: 102, losses: 75, winStreak: 2, kills: 167, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 19, name: "Vran", points: 116, recentMatches: "WLLWWLL", stats: { wins: 98, losses: 72, winStreak: 2, kills: 159, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 20, name: "Crysto", points: 112, recentMatches: "WLWLWLL", stats: { wins: 95, losses: 69, winStreak: 1, kills: 152, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 21, name: "Morpho", points: 106, recentMatches: "WLLWLWL", stats: { wins: 90, losses: 65, winStreak: 1, kills: 144, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 22, name: "Void", points: 96, recentMatches: "LWLLWWL", stats: { wins: 84, losses: 60, winStreak: 1, kills: 135, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 23, name: "Ravv", points: 88, recentMatches: "LLWWLLL", stats: { wins: 78, losses: 56, winStreak: 1, kills: 126, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 24, name: "Polo", points: 82, recentMatches: "WLLWLLL", stats: { wins: 72, losses: 52, winStreak: 1, kills: 118, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 25, name: "Retoro", points: 78, recentMatches: "LWLLLWL", stats: { wins: 68, losses: 49, winStreak: 1, kills: 110, teamChampion: 0, mcSatChampion: 0 } },
  { 
    rank: 26, 
    name: "Neo H", 
    points: 71, 
    recentMatches: "WLLWWLL",
    isRetired: true,
    peakPoints: 427,
    stats: {
      wins: 245,
      losses: 189,
      winStreak: 12,
      kills: 434,
      teamChampion: 3,
      mcSatChampion: 0
    }
  },
  { rank: 27, name: "Raivo", points: 68, recentMatches: "WLLLWLL", stats: { wins: 89, losses: 123, winStreak: 4, kills: 212, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 28, name: "Tron T", points: 60, recentMatches: "LLWLLWL", stats: { wins: 78, losses: 112, winStreak: 3, kills: 190, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 29, name: "Inferno", points: 60, recentMatches: "LLLWLWL", stats: { wins: 76, losses: 109, winStreak: 3, kills: 185, teamChampion: 0, mcSatChampion: 0 } },
  { rank: 30, name: "Rutner", points: 67, recentMatches: "LLWLLWL", stats: { wins: 82, losses: 115, winStreak: 4, kills: 197, teamChampion: 0, mcSatChampion: 0 } },
  { 
    rank: 31, 
    name: "Jka", 
    points: 65, 
    recentMatches: "LLWLLWL",
    isRetired: true,
    peakPoints: 411,
    stats: {
      wins: 198,
      losses: 167,
      winStreak: 8,
      kills: 365,
      teamChampion: 2,
      mcSatChampion: 0
    }
  }
];