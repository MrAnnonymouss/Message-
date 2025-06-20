import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAudio } from "@/hooks/useAudio";
import HomePage from "@/pages/HomePage";
import MessagePage from "@/pages/MessagePage";
import NotFound from "@/pages/not-found";

function MusicPermissionScreen({ onPermission, isClosing }: { onPermission: (allow: boolean) => void, isClosing: boolean }) {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className={`bg-black bg-opacity-80 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-8 max-w-md mx-4 text-center transition-all duration-2000 ${isClosing ? 'fade-out-slow' : ''}`}>
        <h2 className="font-cormorant text-white text-3xl mb-6">Welcome</h2>
        <p className="text-white text-lg opacity-80 mb-8 font-crimson">
          Would you like to enable background music for this experience?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onPermission(true)}
            className="button-elegant text-white font-cormorant text-lg px-6 py-3 rounded-full hover:scale-105 transition-all duration-300"
          >
            Yes, Enable Music
          </button>
          <button
            onClick={() => onPermission(false)}
            className="bg-transparent border-2 border-white border-opacity-30 text-white font-cormorant text-lg px-6 py-3 rounded-full hover:border-opacity-60 hover:scale-105 transition-all duration-300"
          >
            Continue Silently
          </button>
        </div>
      </div>
    </div>
  );
}

function Router({ musicEnabled }: { musicEnabled: boolean }) {
  return (
    <Switch>
      <Route path="/" component={() => <HomePage musicEnabled={musicEnabled} />} />
      <Route path="/message" component={MessagePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showMusicPermission, setShowMusicPermission] = useState(true);
  const [isClosingPermission, setIsClosingPermission] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const { playWithFadeIn } = useAudio("/attached_assets/Song1_1750453164009.mp3");

  const handleMusicPermission = async (allow: boolean) => {
    setMusicEnabled(allow);
    setIsClosingPermission(true);
    
    if (allow) {
      try {
        await playWithFadeIn();
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    }
    
    // Wait for fade out animation before hiding
    setTimeout(() => {
      setShowMusicPermission(false);
    }, 2000);
  };

  if (showMusicPermission) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MusicPermissionScreen onPermission={handleMusicPermission} isClosing={isClosingPermission} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router musicEnabled={musicEnabled} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
