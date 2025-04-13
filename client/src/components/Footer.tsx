import { FaCrown, FaDiscord, FaTwitch, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 border-t border-purple-900/30 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FaCrown className="text-yellow-400 mr-2" />
            <div>
              <p className="text-white text-sm">
                <span className="text-purple-400 font-medium">Astrz Combat</span> Official Rankings
              </p>
              <p className="text-gray-400 text-xs mt-1">
                © {new Date().getFullYear()} Last updated: April 13, 2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-purple-400 hover:text-white transition-colors">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-purple-400 hover:text-white transition-colors">
              <FaDiscord className="w-5 h-5" />
            </a>
            <a href="#" className="text-purple-400 hover:text-white transition-colors">
              <FaTwitch className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
