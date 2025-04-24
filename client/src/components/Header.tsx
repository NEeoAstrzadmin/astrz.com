import { useState, useEffect } from "react";
import { FaCrown, FaUserCog, FaStar, FaChartLine, FaTrophy } from "react-icons/fa";
import { Link } from "wouter";
import { ShimmerButton } from "@/lib/backgroundEffects";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Header({ searchTerm, setSearchTerm }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`w-full backdrop-blur-md sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/90 shadow-lg shadow-purple-900/20' 
          : 'bg-gray-900/70'
      }`}
    >
      {/* Top highlight line */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
      
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center">
            <div className="relative">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-indigo-800 shadow-lg mr-3 border border-purple-600/20 group-hover:scale-110 transition-transform duration-300">
                <FaCrown className="text-yellow-300 text-xl group-hover:animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <div className="absolute w-full h-full rounded-full bg-purple-400 opacity-60 group-hover:animate-ping"></div>
                  <div className="absolute w-full h-full rounded-full bg-purple-500 opacity-80"></div>
                </div>
              </div>
              
              {/* Decorative stars */}
              <div className="absolute -top-1 -left-1 text-yellow-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <FaStar />
              </div>
              <div className="absolute -bottom-0.5 -right-1 text-yellow-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                <FaStar />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-400 inline-block text-transparent bg-clip-text group-hover:from-purple-200 group-hover:to-indigo-300 transition-colors">
                Astrz
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-purple-300 text-sm font-medium">Combat Rankings</p>
                <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                  <span className="inline-block w-1 h-1 rounded-full bg-purple-500"></span>
                  <span>Live Data</span>
                </div>
              </div>
            </div>
          </Link>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden rounded-md p-2 text-purple-400 hover:text-white focus:outline-none bg-gray-800/50 border border-gray-700/50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex mt-4 md:mt-0 flex-row items-center gap-3`}>
          {/* Navigation items */}
          <div className="hidden md:flex items-center gap-1 mr-3">
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors flex items-center rounded-lg hover:bg-gray-800/50">
              <FaTrophy className="mr-1.5 text-yellow-500" />
              <span>Rankings</span>
            </Link>
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors flex items-center rounded-lg hover:bg-gray-800/50">
              <FaChartLine className="mr-1.5 text-indigo-400" />
              <span>Stats</span>
            </Link>
          </div>
          
          {/* Search bar */}
          <div className="relative w-full max-w-xs md:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search player..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-gray-800/70 border border-purple-900/30 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-600 focus:outline-none text-white text-sm transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Admin link */}
          <ShimmerButton className="flex items-center gap-1.5 text-sm font-medium">
            <Link href="/admin" className="flex items-center text-purple-200 hover:text-white transition-colors">
              <FaUserCog className="mr-1" />
              <span>Admin</span>
            </Link>
          </ShimmerButton>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-4 py-2 space-y-1 bg-gray-900/90">
            <Link href="/" className="block px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors flex items-center rounded-lg hover:bg-gray-800/50">
              <FaTrophy className="mr-1.5 text-yellow-500" />
              <span>Rankings</span>
            </Link>
            <Link href="/" className="block px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors flex items-center rounded-lg hover:bg-gray-800/50">
              <FaChartLine className="mr-1.5 text-indigo-400" />
              <span>Stats</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
