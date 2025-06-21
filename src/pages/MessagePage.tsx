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
      className={`fixed inset-0 w-screen h-screen w-full min-h-screen max-h-screen min-w-full max-w-full gradient-bg-message flex items-center justify-center overflow-hidden page-transition zoom-in-transition ${
        !isComplete ? (typingIntensity === 'fast' ? "typing-fast" : "typing") : ""
      } ${showPurpleGradient ? "purple-transition" : ""}`}
      style={{position: 'fixed', inset: '0', height: '100vh', width: '100vw', overflow: 'hidden'}}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
      aria-label="Message page"
    >
      <ParticleBackground type="message" particleCount={60} intensity="high" />
      
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="message-page-container bg-black bg-opacity-30 backdrop-blur-xl border border-white border-opacity-25 rounded-[2.5rem] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl h-[80vh] sm:h-[85vh] flex flex-col shadow-2xl relative z-10">
          <div className={`message-container flex-1 ${!isComplete ? 'typing-active' : 'typing-complete'}`}>
            <div className="message-scroll-area h-full overflow-y-auto overflow-x-hidden" ref={scrollAreaRef}>
              <div className="message-text-clean font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-relaxed tracking-wide text-center px-2 sm:px-4 md:px-6">
                {displayText.split('\n').map((line, index) => (
                  <p key={index} className="mb-4 sm:mb-6 md:mb-8">
                    {line}
                  </p>
                ))}
              </div>
              {!isComplete && (
                <span className="typing-cursor-clean text-center block text-2xl sm:text-3xl md:text-4xl lg:text-5xl" aria-hidden="true">
                  |
                </span>
              )}
            </div>
          </div>
          
          {showReturnButton && (
            <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 border-t border-white border-opacity-20">
              <button
                onClick={handleReturn}
                className="premium-button text-white font-bold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-2xl min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
                aria-label="Return to homepage"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
