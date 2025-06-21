import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAudio } from "@/hooks/useAudio";
import ParticleBackground from "@/components/ParticleBackground";

export default function HomePage({ musicEnabled }: { musicEnabled: boolean }) {
  const [, setLocation] = useLocation();
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Show button after 3 seconds
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => {
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleShowMessage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLocation("/message");
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && showButton) {
      e.preventDefault();
      handleShowMessage();
    }
  };

  return (
    <div
      className={`fixed inset-0 w-screen h-screen w-full min-h-screen max-h-screen min-w-full max-w-full gradient-bg-home flex items-center justify-center overflow-hidden page-transition ${
        isTransitioning ? "zoom-transition" : ""
      }`}
      style={{position: 'fixed', inset: '0', height: '100vh', width: '100vw', overflow: 'hidden'}}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
      aria-label="Homepage"
    >
      <ParticleBackground type="home" particleCount={40} intensity="medium" />
      
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className={`show-button-container bg-black bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-1500 ease-out shadow-2xl ${
          showButton
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-12 scale-90"
        }`}>
          <button
            onClick={handleShowMessage}
            className={`button-elegant text-white font-sf-pro font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl px-8 sm:px-10 md:px-12 lg:px-14 py-4 sm:py-5 md:py-6 lg:py-7 rounded-full 
                       transition-all duration-1500 ease-out hover:scale-105 active:scale-95 animate-slow-pulse
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 tracking-wide relative z-10 drop-shadow-lg
                       min-w-[200px] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[320px] shadow-2xl`}
            disabled={!showButton || isTransitioning}
            aria-label="Show the special message"
          >
            {isTransitioning ? "Loading..." : "Show Message"}
          </button>
        </div>
      </div>
    </div>
  );
}
