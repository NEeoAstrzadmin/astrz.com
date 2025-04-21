import Header from "@/components/Header";
import Leaderboard from "@/components/TierList"; // We're keeping the file name but changing the component
import Footer from "@/components/Footer";
import { useState } from "react";
import { usePlayers } from "@/contexts/PlayerContext";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { players } = usePlayers();

  const filteredPlayers = searchTerm 
    ? players.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : players;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-sans antialiased">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Game description */}
        <section className="mb-8">
          <div className="bg-gray-900/60 rounded-lg p-6 border border-purple-900/40 shadow-lg">
            <h2 className="text-xl font-bold mb-3 text-purple-300">Astrz Rankings System</h2>
            <div className="space-y-6 text-gray-300">
              <div className="bg-gray-800/30 p-5 rounded-md border-l-4 border-purple-600">
                <h3 className="text-lg font-medium text-white flex items-center mb-2">
                  <span className="text-yellow-400 mr-2">🏆</span> The Astrz Rankings System – A Legacy of Combat
                </h3>
                <p className="mb-3">
                  Launched on January 1st, 2021, the Astrz Rankings System has served as the definitive measure of skill and dominance within the Astrz universe. Designed around intense ranked duels, this system assigns combat points to players based on their performance, drawing inspiration from traditional MC-style tiers—but with a unique twist.
                </p>
                <p className="mb-3">
                  Rather than separating players into multiple divisions, Astrz uses a unified point-based system paired with combat rank titles, rewarding consistency, precision, and competitive excellence.
                </p>
                <p className="text-sm text-purple-300">
                  Further details and ranking insights are available in our <a href="#" className="underline hover:text-white">Discord community</a>.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-5 rounded-md border-l-4 border-yellow-500">
                <h3 className="text-lg font-medium text-white flex items-center mb-2">
                  <span className="text-yellow-400 mr-2">👑</span> A New Era Begins: Wido Claims the Crown
                </h3>
                <p className="mb-3">
                  Since the inception of the leaderboard, the Astrz competitive scene has been defined by two legendary names: Sycthy and Neo H. For nearly five years, they held an iron grip on the #1 spot, fending off every challenger and cementing their legacy as titans of the game.
                </p>
                <p>
                  But in a historic shift, Wido has broken the streak. After a relentless rise through the ranks, Wido now stands as the third player ever to hold the coveted #1 position, marking a new chapter in Astrz history.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="px-3 py-1 bg-[#FF6B6B] bg-opacity-10 text-[#FF6B6B] rounded-full text-sm font-medium border border-[#FF6B6B]/20 hover:scale-105 transition-transform">
                Astrz Prime (250+ pts)
              </div>
              <div className="px-3 py-1 bg-[#4D96FF] bg-opacity-10 text-[#4D96FF] rounded-full text-sm font-medium border border-[#4D96FF]/20 hover:scale-105 transition-transform">
                Astrz Vanguard (180+ pts)
              </div>
              <div className="px-3 py-1 bg-[#9FE6A0] bg-opacity-10 text-[#9FE6A0] rounded-full text-sm font-medium border border-[#9FE6A0]/20 hover:scale-105 transition-transform">
                Astrz Challenger (100+ pts)
              </div>
              <div className="px-3 py-1 bg-[#FFBD35] bg-opacity-10 text-[#FFBD35] rounded-full text-sm font-medium border border-[#FFBD35]/20 hover:scale-105 transition-transform">
                Astrz Edge (below 100 pts)
              </div>
              <div className="px-3 py-1 bg-blue-500 bg-opacity-10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 hover:scale-105 transition-transform animate-pulse">
                Click on player names to see recent duel history
              </div>
            </div>
          </div>
        </section>

        <Leaderboard players={filteredPlayers} />
      </main>
      
      <Footer />
    </div>
  );
}
