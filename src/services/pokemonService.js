import { getCachedData, setCachedData } from './cacheService';
import { executeWithRateLimit } from './rateLimiter';
import { ApiError, handleApiError, validateApiResponse } from './errorHandler';

const POKE_API_BASE = import.meta.env.VITE_POKE_API_BASE || 'https://pokeapi.co/api/v2';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
const MAX_RETRIES = parseInt(import.meta.env.VITE_MAX_RETRIES || '3');

/**
 * Realiza una solicitud fetch con timeout, reintentos y validación
 */
const secureFetch = async (url, options = {}, retryCount = 0) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    // Validar status HTTP
    if (!response.ok) {
      throw new ApiError(
        `HTTP Error: ${response.status}`,
        response.status,
        `URL: ${url}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Reintentar si falla por timeout o error de red
    if (retryCount < MAX_RETRIES && (
      error.name === 'AbortError' ||
      error instanceof TypeError
    )) {
      console.warn(`Reintentando solicitud (${retryCount + 1}/${MAX_RETRIES}): ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return secureFetch(url, options, retryCount + 1);
    }

    // Convertir a ApiError si es necesario
    if (!(error instanceof ApiError)) {
      throw new ApiError(
        error.message,
        error.name === 'AbortError' ? 0 : 500,
        url
      );
    }
    throw error;
  }
};

/**
 * Obtiene la lista de Pokémon con detalles
 */
export const fetchPokemonList = async (limit = 150) => {
  const cacheKey = `pokemon_list_${limit}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    // Obtener lista inicial
    const listData = await executeWithRateLimit(() =>
      secureFetch(`${POKE_API_BASE}/pokemon?limit=${limit}&offset=0`)
    );

    validateApiResponse(listData, ['results']);

    // Obtener detalles con rate limiting
    const pokemonDetails = await Promise.all(
      listData.results.map(pokemon =>
        executeWithRateLimit(async () => {
          try {
            const detailData = await secureFetch(pokemon.url);
            validateApiResponse(detailData, ['id', 'name', 'sprites', 'types']);

            return {
              id: detailData.id,
              name: detailData.name,
              image: detailData.sprites.other?.['official-artwork']?.front_default ||
                     detailData.sprites.front_default ||
                     'https://via.placeholder.com/200',
              types: (detailData.types || []).map(t => t.type.name),
              height: detailData.height || 0,
              weight: detailData.weight || 0,
            };
          } catch (error) {
            const { userMessage } = handleApiError(error, `fetchPokemonDetails: ${pokemon.name}`);
            console.error(userMessage);
            return null;
          }
        })
      )
    );

    // Filtrar nulos
    const validPokemon = pokemonDetails.filter(p => p !== null);
    
    // Cachear resultados
    setCachedData(cacheKey, validPokemon);
    
    return validPokemon;
  } catch (error) {
    const { userMessage } = handleApiError(error, 'fetchPokemonList');
    console.error(userMessage);
    return [];
  }
};

/**
 * Obtiene los detalles de un Pokémon específico
 */
export const fetchPokemonDetails = async (name) => {
  const cacheKey = `pokemon_detail_${name.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const data = await executeWithRateLimit(() =>
      secureFetch(`${POKE_API_BASE}/pokemon/${name.toLowerCase()}`)
    );

    validateApiResponse(data, ['id', 'name', 'sprites', 'types']);

    const details = {
      id: data.id,
      name: data.name,
      image: data.sprites.other?.['official-artwork']?.front_default ||
             data.sprites.front_default ||
             'https://via.placeholder.com/200',
      types: (data.types || []).map(t => t.type.name),
      height: data.height || 0,
      weight: data.weight || 0,
      abilities: (data.abilities || []).map(a => a.ability.name),
      stats: (data.stats || []).map(s => ({
        name: s.stat.name,
        value: s.base_stat
      }))
    };

    setCachedData(cacheKey, details);
    return details;
  } catch (error) {
    const { userMessage } = handleApiError(error, `fetchPokemonDetails: ${name}`);
    console.error(userMessage);
    return null;
  }
};

/**
 * Verifica la conectividad con la API
 */
export const checkApiHealth = async () => {
  try {
    const data = await secureFetch(`${POKE_API_BASE}/pokemon/1`, {}, 0);
    return { isHealthy: true, message: 'API is healthy' };
  } catch (error) {
    const { userMessage, errorInfo } = handleApiError(error, 'checkApiHealth');
    return { isHealthy: false, message: userMessage, details: errorInfo };
  }
};
