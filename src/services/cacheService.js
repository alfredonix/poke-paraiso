/**
 * Servicio de caché en memoria y localStorage
 * Ayuda a reducir llamadas a la API y mejorar el rendimiento
 */

const CACHE_PREFIX = 'poke_cache_';
const MEMORY_CACHE = new Map();

const getCacheDuration = () => {
  return parseInt(import.meta.env.VITE_CACHE_DURATION || '3600000');
};

export const getCachedData = (key) => {
  // Primero revisar caché en memoria
  const memoryEntry = MEMORY_CACHE.get(key);
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    return memoryEntry.data;
  }

  // Luego revisar localStorage
  try {
    const storedData = localStorage.getItem(CACHE_PREFIX + key);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.expiresAt > Date.now()) {
        // Restaurar en caché de memoria
        MEMORY_CACHE.set(key, parsedData);
        return parsedData.data;
      } else {
        localStorage.removeItem(CACHE_PREFIX + key);
      }
    }
  } catch (error) {
    console.warn('Error reading from localStorage:', error);
  }

  return null;
};

export const setCachedData = (key, data) => {
  const expiresAt = Date.now() + getCacheDuration();
  const cacheEntry = { data, expiresAt };

  // Guardar en caché de memoria
  MEMORY_CACHE.set(key, cacheEntry);

  // Guardar en localStorage
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Error writing to localStorage:', error);
  }
};

export const clearCache = () => {
  MEMORY_CACHE.clear();
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing localStorage cache:', error);
  }
};

export const clearCacheEntry = (key) => {
  MEMORY_CACHE.delete(key);
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.warn('Error clearing cache entry:', error);
  }
};
