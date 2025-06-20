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
      className={`w-full h-screen gradient-bg-home flex items-center justify-center relative page-transition ${
        isTransitioning ? "zoom-transition" : ""
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
      aria-label="Homepage"
    >
      <ParticleBackground type="home" particleCount={40} />
      
      <button
        onClick={handleShowMessage}
        className={`button-elegant text-white font-cormorant text-2xl md:text-3xl px-10 py-5 rounded-full 
                   transition-all duration-1500 ease-out hover:scale-105 active:scale-95 animate-slow-pulse
                   focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 tracking-wide relative z-10 drop-shadow-lg ${
                     showButton
                       ? "opacity-100 translate-y-0 scale-100"
                       : "opacity-0 translate-y-12 scale-90"
                   }`}
        disabled={!showButton || isTransitioning}
        aria-label="Show the special message"
      >
        {isTransitioning ? "Loading..." : "Show Message"}
      </button>
    </div>
  );
}
