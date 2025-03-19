
import { useState, useRef, useEffect, useCallback } from 'react';
import { isDemoId } from '@/context/meeting/storage/demoData';

interface UseLoadingStateOptions {
  minimumLoadingTime?: number;
  safetyTimeoutDuration?: number;
}

export function useLoadingState({
  minimumLoadingTime = 300,
  safetyTimeoutDuration = 2000
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

  // Set a safety timeout on mount - but don't reset loading state immediately for demo IDs
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
    // If already loading and not finished, don't restart the loading process
    if (isLoading && !hasFinishedRef.current) return;
    
    // Reset finished state
    hasFinishedRef.current = false;
    
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
      hasFinishedRef.current = true;
      safetyTimerRef.current = null;
    }, safetyTimeoutDuration);
  }, [isLoading, safetyTimeoutDuration]);

  // Function to finish loading with minimum duration enforcement
  const finishLoading = useCallback(() => {
    if (!isLoading || hasFinishedRef.current) return; // Don't do anything if we're already done loading
    
    const elapsedTime = Date.now() - loadStartTime.current;
    
    if (elapsedTime < minimumLoadingTime) {
      // If we haven't shown the loading screen for at least the minimum time,
      // wait until we have before hiding it
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      loadingTimerRef.current = setTimeout(() => {
        console.log("Minimum loading time met, finishing loading");
        hasFinishedRef.current = true;
        setIsLoading(false);
        loadingTimerRef.current = null;
        
        // Clear safety timer since we're done loading
        if (safetyTimerRef.current) {
          clearTimeout(safetyTimerRef.current);
          safetyTimerRef.current = null;
        }
      }, minimumLoadingTime - elapsedTime);
    } else {
      console.log("Elapsed time exceeds minimum, finishing loading immediately");
      hasFinishedRef.current = true;
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
