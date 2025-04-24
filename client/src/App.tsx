import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthPage from "@/pages/auth-page";
import { Starfield, BackgroundGradient } from "@/lib/backgroundEffects";
import { useEffect } from "react";

// Animation Style Component
const AnimationStyles = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes float {
        0% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-10px) translateX(5px); }
        50% { transform: translateY(0) translateX(10px); }
        75% { transform: translateY(10px) translateX(5px); }
        100% { transform: translateY(0) translateX(0); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .shimmer-effect {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.03) 25%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0.03) 75%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 2.5s infinite;
      }
      
      /* Subtle background pulse animation */
      @keyframes bgPulse {
        0% { opacity: 0.5; }
        50% { opacity: 0.7; }
        100% { opacity: 0.5; }
      }
      
      /* Glowing effect for borders */
      .border-glow {
        box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
        animation: borderPulse 4s infinite;
      }
      
      @keyframes borderPulse {
        0% { box-shadow: 0 0 5px rgba(124, 58, 237, 0.3); }
        50% { box-shadow: 0 0 15px rgba(124, 58, 237, 0.7); }
        100% { box-shadow: 0 0 5px rgba(124, 58, 237, 0.3); }
      }
      
      /* Smooth entry animations */
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-in-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* Cosmic background with subtle movement */
      .cosmic-bg {
        background-image: 
          radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(67, 56, 202, 0.15) 0%, transparent 50%);
        background-attachment: fixed;
        background-size: 200% 200%;
        animation: cosmic-shift 30s ease infinite;
      }
      
      @keyframes cosmic-shift {
        0% { background-position: 0% 0%; }
        50% { background-position: 100% 100%; }
        100% { background-position: 0% 0%; }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return null;
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <ProtectedRoute path="/admin" component={Admin} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlayerProvider>
          {/* Load animations */}
          <AnimationStyles />
          
          {/* Background effects */}
          <div className="fixed inset-0 z-[-10] bg-gray-950">
            <BackgroundGradient className="w-full h-full">
              <Starfield speed={0.03} density={150} opacity={0.6} />
            </BackgroundGradient>
          </div>
          
          {/* Main content */}
          <div className="min-h-screen cosmic-bg">
            <Router />
            <Toaster />
          </div>
        </PlayerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
