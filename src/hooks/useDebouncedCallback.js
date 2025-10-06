import { useEffect, useMemo, useRef } from "react";

/**
 * Creates a debounced version of a callback function that delays its execution
 * until a specified amount of time has passed without any new calls.
 *
 * @param {Function} callback The function to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {Function} The debounced callback function with a .cancel() method.
 */
export function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  // Update the callback reference whenever it changes, so we always have the latest one.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Use useMemo to create the debounced function.
  // This function will be stable across re-renders as long as `delay` doesn't change.
  const debouncedCallback = useMemo(() => {
    const debounced = (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };

    // Add a `cancel` method to the debounced function.
    // This allows us to cancel any pending execution.
    debounced.cancel = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    return debounced;
  }, [delay]);

  // Cleanup timeout on unmount to prevent memory leaks.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
