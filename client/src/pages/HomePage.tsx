import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAudio } from "@/hooks/useAudio";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const { playWithFadeIn } = useAudio("/attached_assets/Song1_1750453164009.mp3");

  useEffect(() => {
    // Fade in home content after 2 seconds (slower)
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    // Show button after 5 seconds (slower)
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 5000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleShowMessage = () => {
    // Show music permission dialog first
    setShowMusicDialog(true);
  };

  const handleMusicPermission = async (allowMusic: boolean) => {
    setShowMusicDialog(false);
    setIsTransitioning(true);
    
    if (allowMusic) {
      // Start playing music with fade-in
      try {
        await playWithFadeIn();
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    }
    
    // Slower transition - wait longer before navigating
    setTimeout(() => {
      setLocation("/message");
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && showButton && !showMusicDialog) {
      e.preventDefault();
      handleShowMessage();
    }
  };

  return (
    <div 
      className={`w-full h-screen bg-black flex items-center justify-center relative page-transition ${
        isTransitioning ? 'zoom-transition' : ''
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
      aria-label="Homepage"
      style={{ backgroundColor: '#000000' }}
    >
      <div 
        className={`text-center transition-all duration-2000 ease-out ${
          showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
      >
        <h1 className="font-cormorant text-white text-5xl md:text-7xl lg:text-8xl font-light mb-8 tracking-wide italic text-float">
          Something Special
        </h1>
        <p className="text-white text-xl md:text-2xl opacity-80 mb-16 font-light font-crimson tracking-wide slow-fade-in" style={{animationDelay: '1s', animationFillMode: 'both', opacity: showContent ? 1 : 0}}>
          A heartfelt message awaits...
        </p>
        
        <button 
          onClick={handleShowMessage}
          className={`button-elegant text-white font-cormorant text-2xl md:text-3xl px-10 py-5 rounded-full 
                     transition-all duration-1500 ease-out hover:scale-105 active:scale-95 animate-slow-pulse
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 tracking-wide ${
                       showButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'
                     }`}
          disabled={!showButton || isTransitioning}
          aria-label="Show the special message"
        >
          {isTransitioning ? 'Loading...' : 'Show Message'}
        </button>
      </div>

      {/* Music Permission Dialog */}
      {showMusicDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-black bg-opacity-80 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-8 max-w-md mx-4 text-center">
            <h3 className="font-cormorant text-white text-2xl mb-4">Background Music</h3>
            <p className="text-white text-lg opacity-80 mb-6 font-crimson">
              Would you like to play background music while reading the message?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleMusicPermission(true)}
                className="button-elegant text-white font-cormorant text-lg px-6 py-3 rounded-full hover:scale-105 transition-all duration-300"
              >
                Yes, Play Music
              </button>
              <button
                onClick={() => handleMusicPermission(false)}
                className="bg-transparent border-2 border-white border-opacity-30 text-white font-cormorant text-lg px-6 py-3 rounded-full hover:border-opacity-60 hover:scale-105 transition-all duration-300"
              >
                No, Silent Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
