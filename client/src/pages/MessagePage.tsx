import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { messageText } from "@/data/message";

export default function MessagePage() {
  const [, setLocation] = useLocation();
  const [showReturnButton, setShowReturnButton] = useState(false);
  const { displayText, isComplete } = useTypingAnimation(messageText, 120); // 120ms per character for elegant slow reveal

  useEffect(() => {
    if (isComplete) {
      // Show return button after typing is complete
      const timer = setTimeout(() => {
        setShowReturnButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const handleReturn = () => {
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
      className="w-full h-screen gradient-bg flex items-center justify-center p-6 page-transition"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
      aria-label="Message page"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 md:p-12 lg:p-16 border border-white border-opacity-10">
          <div 
            className="font-crimson text-white text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-wide message-scroll max-h-[60vh] overflow-y-auto font-normal"
            aria-live="polite"
            aria-label="Message content"
          >
            {formatText(displayText)}
            {!isComplete && <span className="typing-cursor" aria-hidden="true"></span>}
          </div>
        </div>
        
        {/* Return button */}
        <div className="text-center mt-8">
          <button 
            onClick={handleReturn}
            className={`button-glow text-white font-inter text-sm md:text-base px-6 py-3 rounded-full 
                       transition-all duration-500 ease-out hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 ${
                         showReturnButton ? 'opacity-100' : 'opacity-0'
                       }`}
            disabled={!showReturnButton}
            aria-label="Return to homepage"
          >
            ← Return
          </button>
        </div>
      </div>
    </div>
  );
}
