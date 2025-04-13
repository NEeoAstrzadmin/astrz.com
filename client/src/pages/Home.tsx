import Header from "@/components/Header";
import Leaderboard from "@/components/TierList"; // We're keeping the file name but changing the component
import Footer from "@/components/Footer";
import { useState } from "react";
import { players } from "@/data/players";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

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
            <h2 className="text-xl font-bold mb-3 text-purple-300">Monthly Competitive Combat Rankings</h2>
            <p className="text-gray-300">
              This leaderboard showcases the top 30 players in the monthly combat tournament based on their performance points.
              Players are ranked according to their skill level, with the top performers receiving special recognition.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="px-3 py-1 bg-yellow-500 bg-opacity-10 text-yellow-500 rounded-full text-sm font-medium border border-yellow-500/20">
                Top 3 Players - Crown Recognition
              </div>
              <div className="px-3 py-1 bg-purple-500 bg-opacity-10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20">
                Top 10 Players - Elite Status
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
