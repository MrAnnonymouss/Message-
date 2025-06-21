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
    <div className="fixed inset-0 w-screen h-screen w-full min-h-screen max-h-screen min-w-full max-w-full gradient-bg-home flex items-center justify-center overflow-hidden" style={{position: 'fixed', inset: '0', height: '100vh', width: '100vw', overflow: 'hidden'}}>
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className={`music-permission-container bg-black bg-opacity-90 backdrop-blur-xl border border-white border-opacity-30 rounded-[2rem] p-6 sm:p-8 md:p-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center transition-all duration-2000 transform hover:scale-105 shadow-2xl ${isClosing ? 'fade-out-slow' : 'animate-fade-in-up'}`}>
          <h2 className="font-cormorant text-white text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 tracking-wide">Welcome Aarohi :)</h2>
          <p className="text-white text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 font-crimson leading-relaxed px-2">
            Would you like to enable background music for this experience?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button
              onClick={() => onPermission(true)}
              className="button-elegant text-white font-cormorant text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[140px] shadow-lg"
            >
              Yes, Enable Music
            </button>
            <button
              onClick={() => onPermission(false)}
              className="bg-transparent border-2 border-white border-opacity-40 text-white font-cormorant text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:border-opacity-70 hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[140px] shadow-lg"
            >
              Continue Silently
            </button>
          </div>
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
