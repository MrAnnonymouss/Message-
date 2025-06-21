import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useAudio } from "@/hooks/useAudio";
import { messageText } from "@/data/message";
import ParticleBackground from "@/components/ParticleBackground";

export default function MessagePage() {
  const [, setLocation] = useLocation();
  const [showReturnButton, setShowReturnButton] = useState(false);
  const [typingIntensity, setTypingIntensity] = useState<'normal' | 'fast'>('normal');
  const [showPurpleGradient, setShowPurpleGradient] = useState(false);
  const { displayText, isComplete } = useTypingAnimation(messageText, 80); // 80ms per character for faster reveal
  const { fadeOut, stop } = useAudio("/attached_assets/Song1_1750453164009.mp3");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isComplete) {
      // Show return button after typing is complete
      const timer = setTimeout(() => {
        setShowReturnButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // Dynamic typing intensity based on progress
  useEffect(() => {
    const progress = displayText.length / messageText.length;
    if (progress > 0.7) {
      setTypingIntensity('fast');
    } else {
      setTypingIntensity('normal');
    }
  }, [displayText.length, messageText.length]);

  // Show purple gradient after 30 seconds
  useEffect(() => {
    const purpleTimer = setTimeout(() => {
      setShowPurpleGradient(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(purpleTimer);
  }, []);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [displayText]);



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
        !isComplete ? (typingIntensity === 'fast' ? "typing-fast" : "typing") : ""
      } ${showPurpleGradient ? "purple-transition" : ""}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
      aria-label="Message page"
    >
      <ParticleBackground type="message" particleCount={60} intensity="high" />
      
      <div className="w-full max-w-5xl relative z-10 flex flex-col max-h-[80vh]">
        <div className={`message-container ${!isComplete ? 'typing-active' : 'typing-complete'}`}>
          <div className="message-scroll-area" ref={scrollAreaRef}>
            <div className="message-text-clean font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-relaxed tracking-wide text-center">
              {displayText.split('\n').map((line, index) => (
                <p key={index} className="mb-6 md:mb-8">
                  {line}
                </p>
              ))}
            </div>
            {!isComplete && (
              <span className="typing-cursor-clean text-center block text-3xl md:text-4xl lg:text-5xl" aria-hidden="true">
                |
              </span>
            )}
          </div>
        </div>
      </div>
      
      {showReturnButton && (
        <button
          onClick={handleReturn}
          className="mt-8 md:mt-12 lg:mt-16 premium-button text-white font-bold text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 rounded-full hover:scale-105 transition-all duration-300 relative z-10"
          aria-label="Return to homepage"
        >
          Return to Home
        </button>
      )}
    </div>
  );
}
