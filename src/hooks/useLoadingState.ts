
import { useState, useRef, useEffect } from 'react';

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

  // Setup safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      console.log("Safety timeout reached, forcing load completion");
      setIsLoading(false);
    }, safetyTimeoutDuration);
    
    return () => {
      clearTimeout(safetyTimer);
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [safetyTimeoutDuration]);

  // Function to finish loading with minimum duration enforcement
  const finishLoading = () => {
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
      }, minimumLoadingTime - elapsedTime);
    } else {
      setIsLoading(false);
    }
  };

  // Function to reset loading state
  const startLoading = () => {
    loadStartTime.current = Date.now();
    setIsLoading(true);
  };

  return {
    isLoading,
    startLoading,
    finishLoading
  };
}
