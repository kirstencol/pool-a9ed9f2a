
import { useState, useRef, useEffect, useCallback } from 'react';

interface UseLoadingStateOptions {
  minimumLoadingTime?: number;
  safetyTimeoutDuration?: number;
}

export function useLoadingState({
  minimumLoadingTime = 800,
  safetyTimeoutDuration = 3000
}: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const loadStartTime = useRef(Date.now());
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all timers on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
      }
    };
  }, []);

  // Function to start loading state
  const startLoading = useCallback(() => {
    // Clear any existing timers
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
    }

    // Reset loading state
    loadStartTime.current = Date.now();
    setIsLoading(true);
    
    // Set up safety timeout
    safetyTimerRef.current = setTimeout(() => {
      console.log("Safety timeout reached, forcing load completion");
      setIsLoading(false);
      safetyTimerRef.current = null;
    }, safetyTimeoutDuration);
  }, [safetyTimeoutDuration]);

  // Function to finish loading with minimum duration enforcement
  const finishLoading = useCallback(() => {
    if (!isLoading) return; // Don't do anything if we're already done loading
    
    const elapsedTime = Date.now() - loadStartTime.current;
    
    if (elapsedTime < minimumLoadingTime) {
      // If we haven't shown the loading screen for at least the minimum time,
      // wait until we have before hiding it
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      loadingTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        loadingTimerRef.current = null;
        
        // Clear safety timer since we're done loading
        if (safetyTimerRef.current) {
          clearTimeout(safetyTimerRef.current);
          safetyTimerRef.current = null;
        }
      }, minimumLoadingTime - elapsedTime);
    } else {
      setIsLoading(false);
      
      // Clear safety timer since we're done loading
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
    }
  }, [isLoading, minimumLoadingTime]);

  return {
    isLoading,
    startLoading,
    finishLoading
  };
}
