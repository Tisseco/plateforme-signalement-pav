import { useCallback, useRef } from 'react';

/**
 * Custom hook pour debouncer une fonction
 * @param fn La fonction à debouncer
 * @param delay Le délai en millisecondes (par défaut: 500ms)
 * @returns La fonction debouncée
 */
function useDebouncedFunction<T extends (...args: any[]) => any>(
  fn: T,
  delay?: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Annule le timeout quand le composant est démonté
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Crée une version debouncée de la fonction
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      cleanup();
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay || 500);
    },
    [fn, delay]
  );

  return debouncedFn;
}

export default useDebouncedFunction;
