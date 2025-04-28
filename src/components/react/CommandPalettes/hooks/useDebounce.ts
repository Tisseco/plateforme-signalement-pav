import { useState, useEffect } from 'react';

/**
 * Custom hook pour debouncer une valeur
 * @param value La valeur à debouncer
 * @param delay Le délai en millisecondes (par défaut: 500ms)
 * @returns La valeur debouncée
 */
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Mettre en place un timer qui mettra à jour la valeur debouncée après le délai spécifié
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    // Annuler le timer si la valeur change (ce qui déclencherait un nouvel effet)
    // Cela permet d'éviter que la valeur debouncée soit mise à jour si la valeur change dans le délai
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
