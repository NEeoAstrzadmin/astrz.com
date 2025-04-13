import { useState } from "react";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Header({ searchTerm, setSearchTerm }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-surface border-b border-gray-800">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">
              Astrz Combat <span className="font-mono">Tier List</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Showcasing the top players based on combat points</p>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden rounded-md p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
          <div className="relative max-w-xs md:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search player..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-white text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
