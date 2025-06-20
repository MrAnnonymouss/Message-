import { useRef, useCallback } from "react";

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      
      // Add error handling
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio loading error:", e);
      });
      
      audioRef.current.addEventListener('loadstart', () => {
        console.log("Audio loading started for:", src);
      });
      
      audioRef.current.addEventListener('canplay', () => {
        console.log("Audio ready to play:", src);
      });
    }
    return audioRef.current;
  }, [src]);

  // Play with fade-in effect
  const playWithFadeIn = useCallback(async () => {
    const audio = initAudio();
    
    try {
      audio.volume = 0;
      await audio.play();
      
      // Fade in over 2 seconds
      const fadeDuration = 2000;
      const fadeSteps = 20;
      const stepDuration = fadeDuration / fadeSteps;
      const volumeStep = 0.7 / fadeSteps; // Final volume 0.7
      
      let currentStep = 0;
      
      return new Promise<void>((resolve) => {
        fadeIntervalRef.current = setInterval(() => {
          if (currentStep < fadeSteps) {
            audio.volume = Math.min(currentStep * volumeStep, 0.7);
            currentStep++;
          } else {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            }
            resolve();
          }
        }, stepDuration);
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
      throw error;
    }
  }, [initAudio]);

  // Fade out audio
  const fadeOut = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const fadeDuration = 1000; // 1 second
    const fadeSteps = 10;
    const stepDuration = fadeDuration / fadeSteps;
    const currentVolume = audio.volume;
    const volumeStep = currentVolume / fadeSteps;
    
    let currentStep = 0;
    
    return new Promise<void>((resolve) => {
      fadeIntervalRef.current = setInterval(() => {
        if (currentStep < fadeSteps && audio) {
          audio.volume = Math.max(currentVolume - (currentStep * volumeStep), 0);
          currentStep++;
        } else {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          if (audio) {
            audio.pause();
          }
          resolve();
        }
      }, stepDuration);
    });
  }, []);

  // Stop audio completely
  const stop = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
    }
  }, []);

  return {
    playWithFadeIn,
    fadeOut,
    stop
  };
}
