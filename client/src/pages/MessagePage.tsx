import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useAudio } from "@/hooks/useAudio";
import { messageText } from "@/data/message";
import ParticleBackground from "@/components/ParticleBackground";

export default function MessagePage() {
  const [, setLocation] = useLocation();
  const [showReturnButton, setShowReturnButton] = useState(false);
  const { displayText, isComplete } = useTypingAnimation(messageText, 80); // 80ms per character for faster reveal
  const { fadeOut, stop } = useAudio("/attached_assets/Song1_1750453164009.mp3");

  useEffect(() => {
    if (isComplete) {
      // Show return button after typing is complete
      const timer = setTimeout(() => {
        setShowReturnButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const handleReturn = async () => {
    // Fade out music
    try {
      await fadeOut();
    } catch (error) {
      console.log("Audio fade out failed:", error);
    }
    
    // Stop audio completely
    stop();
    
    // Navigate back to homepage
    setLocation("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || (e.key === 'Enter' && showReturnButton)) {
      e.preventDefault();
      handleReturn();
    }
  };

  // Format text with line breaks
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div 
      className={`w-full min-h-screen gradient-bg-message flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 page-transition zoom-in-transition ${
        !isComplete ? "typing" : ""
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
      aria-label="Message page"
    >
      <ParticleBackground type="message" particleCount={60} />
      
      <div className="w-full max-w-6xl text-white text-xl md:text-2xl lg:text-3xl leading-relaxed font-crimson tracking-wide relative z-10">
        {displayText.split('\n').map((line, index) => (
          <p key={index} className="mb-6 text-center drop-shadow-lg">
            {line}
          </p>
        ))}
        {!isComplete && <span className="typing-cursor text-center block" aria-hidden="true">|</span>}
      </div>
      
      {showReturnButton && (
        <button
          onClick={handleReturn}
          className="mt-16 button-elegant text-white font-cormorant text-xl px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 relative z-10 drop-shadow-lg"
          aria-label="Return to homepage"
        >
          Return to Home
        </button>
      )}
    </div>
  );
}
