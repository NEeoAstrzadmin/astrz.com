import Header from "@/components/Header";
import TierList from "@/components/TierList";
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
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Game description */}
        <section className="mb-8">
          <div className="bg-surface rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-3">About Astrz Combat</h2>
            <p className="text-gray-300">
              This tier list represents the top players in Astrz Combat based on their performance points. 
              Players are categorized into rank groups according to their combat prowess and achievements in the game.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="px-3 py-1 bg-[#FF6B6B] bg-opacity-20 text-[#FF6B6B] rounded-full text-sm font-medium">S Tier: 880+ points</div>
              <div className="px-3 py-1 bg-[#FFD166] bg-opacity-20 text-[#FFD166] rounded-full text-sm font-medium">A Tier: 820-879 points</div>
              <div className="px-3 py-1 bg-[#06D6A0] bg-opacity-20 text-[#06D6A0] rounded-full text-sm font-medium">B Tier: 770-819 points</div>
              <div className="px-3 py-1 bg-[#118AB2] bg-opacity-20 text-[#118AB2] rounded-full text-sm font-medium">C Tier: 700-769 points</div>
              <div className="px-3 py-1 bg-[#7678ED] bg-opacity-20 text-[#7678ED] rounded-full text-sm font-medium">D Tier: Below 700 points</div>
            </div>
          </div>
        </section>

        <TierList players={filteredPlayers} />
      </main>
      
      <Footer />
    </div>
  );
}
