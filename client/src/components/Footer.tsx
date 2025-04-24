import { FaCrown, FaDiscord, FaTwitch, FaTwitter, FaGamepad, FaGlobe, FaCode, FaInfoCircle } from "react-icons/fa";
import { ShimmerButton } from "@/lib/backgroundEffects";

export default function Footer() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <footer className="relative mt-16">
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-purple-600/20 blur-md"></div>
      
      <div className="bg-gray-900/80 backdrop-blur-md pt-8 pb-6">
        <div className="container mx-auto px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-700 to-indigo-900 shadow-lg shadow-purple-900/20 mr-3 border border-purple-600/30">
                  <FaCrown className="text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 inline-block text-transparent bg-clip-text">
                    Astrz Combat
                  </h3>
                  <p className="text-gray-400 text-sm">Elite Player Rankings</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                The ultimate platform for tracking competitive rankings, player performance metrics, and combat statistics in the Astrz universe.
              </p>
              
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-all transform hover:scale-110">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-all transform hover:scale-110">
                  <FaDiscord className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-all transform hover:scale-110">
                  <FaTwitch className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-medium border-b border-gray-800 pb-2 mb-3">Combat Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <FaGamepad className="text-purple-500" />
                    <span>Combat Tournaments</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <FaGlobe className="text-indigo-500" />
                    <span>Official Astrz Website</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <FaCode className="text-purple-500" />
                    <span>Developer Resources</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <FaInfoCircle className="text-indigo-500" />
                    <span>Ranking System Info</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-medium border-b border-gray-800 pb-2 mb-3">Player Stats</h4>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400 text-sm">Total Players</span>
                  <span className="text-purple-400 font-medium">31</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400 text-sm">Active Legends</span>
                  <span className="text-indigo-400 font-medium">29</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400 text-sm">Hall of Fame</span>
                  <span className="text-gray-300 font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Last Update</span>
                  <span className="text-green-400 font-medium">{formattedDate}</span>
                </div>
              </div>
              
              <ShimmerButton className="w-full justify-center mt-3">
                <span className="text-sm">Access Admin Panel</span>
              </ShimmerButton>
            </div>
          </div>
          
          {/* Footer bottom */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Astrz Combat Rankings. All rights reserved.</p>
            <div className="flex gap-4 mt-3 md:mt-0">
              <a href="#" className="hover:text-purple-400 transition-colors text-xs">Terms</a>
              <a href="#" className="hover:text-purple-400 transition-colors text-xs">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition-colors text-xs">Contact</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900 opacity-50"></div>
    </footer>
  );
}
