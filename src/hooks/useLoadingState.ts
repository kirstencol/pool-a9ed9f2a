
import { useState, useRef, useEffect, useCallback } from 'react';

interface UseLoadingStateOptions {
  minimumLoadingTime?: number;
  safetyTimeoutDuration?: number;
}

export function useLoadingState({
  minimumLoadingTime = 500,
  safetyTimeoutDuration = 3000
}: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const loadStartTime = useRef(Date.now());
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasFinishedRef = useRef(false);
  
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

  // Safety timeout on mount
  useEffect(() => {
    safetyTimerRef.current = setTimeout(() => {
      if (isLoading) {
        console.log("Safety timeout reached, forcing load completion");
        setIsLoading(false);
        hasFinishedRef.current = true;
        safetyTimerRef.current = null;
      }
    }, safetyTimeoutDuration);
    
    return () => {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
      }
    };
  }, [safetyTimeoutDuration, isLoading]);

  // Function to start loading state
  const startLoading = useCallback(() => {
    // If already loading and not finished, don't restart
    if (isLoading && !hasFinishedRef.current) return;
    
    // Reset state
    hasFinishedRef.current = false;
    
    // Clear existing timers
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    // Reset loading state
    loadStartTime.current = Date.now();
    setIsLoading(true);
    
    // Set safety timeout
    safetyTimerRef.current = setTimeout(() => {
      console.log("Safety timeout reached, forcing load completion");
      setIsLoading(false);
      hasFinishedRef.current = true;
      safetyTimerRef.current = null;
    }, safetyTimeoutDuration);
  }, [isLoading, safetyTimeoutDuration]);

  // Function to finish loading with minimum duration
  const finishLoading = useCallback(() => {
    if (!isLoading || hasFinishedRef.current) return;
    
    const elapsedTime = Date.now() - loadStartTime.current;
    
    if (elapsedTime < minimumLoadingTime) {
      // Wait until minimum time before hiding
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      loadingTimerRef.current = setTimeout(() => {
        hasFinishedRef.current = true;
        setIsLoading(false);
        loadingTimerRef.current = null;
        
        // Clear safety timer
        if (safetyTimerRef.current) {
          clearTimeout(safetyTimerRef.current);
          safetyTimerRef.current = null;
        }
      }, minimumLoadingTime - elapsedTime);
    } else {
      // Finish immediately if minimum time passed
      hasFinishedRef.current = true;
      setIsLoading(false);
      
      // Clear safety timer
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
