import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Fade in home content after 1 second
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    // Show button after 3 seconds
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleShowMessage = () => {
    setIsTransitioning(true);
    // Start zoom transition then navigate after animation begins
    setTimeout(() => {
      setLocation("/message");
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && showButton) {
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
    >
      <div 
        className={`text-center transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="font-cormorant text-white text-5xl md:text-7xl lg:text-8xl font-light mb-8 tracking-wide italic text-float">
          Something Special
        </h1>
        <p className="text-white text-xl md:text-2xl opacity-80 mb-16 font-light font-crimson tracking-wide animate-fade-in-up" style={{animationDelay: '0.5s', animationFillMode: 'both'}}>
          A heartfelt message awaits...
        </p>
        
        <button 
          onClick={handleShowMessage}
          className={`button-elegant text-white font-cormorant text-2xl md:text-3xl px-10 py-5 rounded-full 
                     transition-all duration-1000 ease-out hover:scale-105 active:scale-95 animate-slow-pulse
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 tracking-wide ${
                       showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                     }`}
          disabled={!showButton || isTransitioning}
          aria-label="Show the special message"
        >
          Show Message
        </button>
      </div>
    </div>
  );
}
