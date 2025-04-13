export interface Player {
  rank: number;
  name: string;
  points: number;
  recentMatches?: string; // Format: "WWLWWLW" for 7 recent matches
}

// Generate random match history for demonstration
const generateRandomMatches = () => {
  const results = ['W', 'L'];
  let matches = '';
  for (let i = 0; i < 7; i++) {
    matches += results[Math.floor(Math.random() * results.length)];
  }
  return matches;
};

// Add random match history to all players
export const players: Player[] = [
  { rank: 1, name: "Wido", points: 302, recentMatches: "WWWWLWW" },
  { rank: 2, name: "Ellies V", points: 272, recentMatches: "WWLWWLW" },
  { rank: 3, name: "Sycthy", points: 267, recentMatches: "WLWLWWW" },
  { rank: 4, name: "Rexo", points: 236, recentMatches: "WLWWWWL" },
  { rank: 5, name: "Evo", points: 212, recentMatches: "LWWWLWW" },
  { rank: 6, name: "Darky", points: 207, recentMatches: "WWWLLWW" },
  { rank: 7, name: "Blom", points: 201, recentMatches: "WLLLWWW" },
  { rank: 8, name: "Blazo", points: 190, recentMatches: "WWLWWLL" },
  { rank: 9, name: "spectro", points: 186, recentMatches: "WLWWWLL" },
  { rank: 10, name: "Doni", points: 177, recentMatches: "LWWWWLW" },
  { rank: 11, name: "Reterno", points: 171, recentMatches: "LWWWLLW" },
  { rank: 12, name: "kelk", points: 164, recentMatches: "WLWLWLW" },
  { rank: 13, name: "Me", points: 152, recentMatches: "WWLLWLW" },
  { rank: 14, name: "yolo", points: 145, recentMatches: "LWWLWLW" },
  { rank: 15, name: "big A", points: 138, recentMatches: "LWLWWWL" },
  { rank: 16, name: "Unded", points: 131, recentMatches: "LLWWWLW" },
  { rank: 17, name: "Unio", points: 127, recentMatches: "WWLLWLW" },
  { rank: 18, name: "Winder", points: 120, recentMatches: "LWLWWLL" },
  { rank: 19, name: "Vran", points: 116, recentMatches: "WLLWWLL" },
  { rank: 20, name: "Crysto", points: 112, recentMatches: "WLWLWLL" },
  { rank: 21, name: "Morpho", points: 106, recentMatches: "WLLWLWL" },
  { rank: 22, name: "Void", points: 96, recentMatches: "LWLLWWL" },
  { rank: 23, name: "Ravv", points: 88, recentMatches: "LLWWLLL" },
  { rank: 24, name: "Polo", points: 82, recentMatches: "WLLWLLL" },
  { rank: 25, name: "Retoro", points: 78, recentMatches: "LWLLLWL" },
  { rank: 26, name: "Neo H", points: 71, recentMatches: "WLLWWLL" },
  { rank: 27, name: "Raivo", points: 68, recentMatches: "WLLLWLL" },
  { rank: 28, name: "Tron T", points: 60, recentMatches: "LLWLLWL" },
  { rank: 29, name: "Inferno", points: 60, recentMatches: "LLLWLWL" },
  { rank: 30, name: "Rutner", points: 67, recentMatches: "LLWLLWL" }
];
