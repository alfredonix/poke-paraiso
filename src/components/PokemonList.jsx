import { useState, useEffect } from 'react';
import { fetchPokemonList, checkApiHealth } from '../services/pokemonService';
import PokemonCard from './PokemonCard';
import Notification from './Notification';
import '../styles/PokemonList.css';

function PokemonList({ onUpdateFavorites, onUpdateBlocked, blockedIds = [], favoriteIds = [] }) {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => {
    const saved = localStorage.getItem('pokemonSearchTerm');
    return saved ? saved : '';
  });
  const [localFavoriteIds, setLocalFavoriteIds] = useState(favoriteIds);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [apiHealth, setApiHealth] = useState(null);

  // Sincronizar favoriteIds prop con estado local
  useEffect(() => {
    setLocalFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  // Cargar lista de Pokémon al montar
  useEffect(() => {
    loadPokemon();
    checkHealth();
  }, []);

  // Guardar término de búsqueda en localStorage
  useEffect(() => {
    localStorage.setItem('pokemonSearchTerm', searchTerm);
  }, [searchTerm]);

  // Guardar favoritos IDs en localStorage y actualizar App con datos completos
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(localFavoriteIds));
    
    // Obtener datos completos de favoritos
    const favoritePokemonData = pokemon.filter(p => localFavoriteIds.includes(p.id));
    onUpdateFavorites(favoritePokemonData, localFavoriteIds);
  }, [localFavoriteIds, pokemon, onUpdateFavorites]);

  // Filtrar basado en búsqueda, bloqueados y favoritos
  useEffect(() => {
    let filtered = pokemon;

    // Si hay búsqueda: mostrar TODOS los Pokémon (incluyendo bloqueados) que coincidan
    // Si NO hay búsqueda: excluir bloqueados por defecto
    if (searchTerm.trim() === '') {
      filtered = filtered.filter(p => !blockedIds.includes(p.id));
    } else {
      // Con búsqueda activa, mostrar todos pero filtrar por coincidencia
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
      );
    }

    // Filtrar solo favoritos si está activado
    if (showOnlyFavorites) {
      filtered = filtered.filter(p => localFavoriteIds.includes(p.id));
    }

    setFilteredPokemon(filtered);
  }, [pokemon, searchTerm, localFavoriteIds, showOnlyFavorites, blockedIds]);

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Math.random();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const checkHealth = async () => {
    const health = await checkApiHealth();
    setApiHealth(health);
    
    if (!health.isHealthy) {
      addNotification(
        'API de Pokémon no disponible. Usando datos en caché.',
        'warning',
        5000
      );
    }
  };

  const loadPokemon = async () => {
    setLoading(true);
    try {
      const data = await fetchPokemonList(150);
      if (data.length === 0) {
        addNotification('No se pudieron cargar los Pokémon', 'error', 5000);
      } else {
        addNotification(`Se cargaron ${data.length} Pokémon correctamente`, 'success', 2000);
      }
      setPokemon(data);
    } catch (error) {
      addNotification('Error al cargar los Pokémon', 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (pokemonId) => {
    setLocalFavoriteIds(prev =>
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    );
  };

  const toggleBlock = (pokemonId) => {
    const newBlockedIds = blockedIds.includes(pokemonId)
      ? blockedIds.filter(id => id !== pokemonId)
      : [...blockedIds, pokemonId];
    
    onUpdateBlocked(newBlockedIds);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setShowOnlyFavorites(false);
  };

  if (loading) {
    return (
      <div className="pokemon-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Conectando con Pokémon API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-list-container">
      {/* Notificaciones */}
      {notifications.length > 0 && (
        <div className="notification-container">
          {notifications.map(notif => (
            <Notification
              key={notif.id}
              message={notif.message}
              type={notif.type}
              duration={notif.duration}
              onClose={() => removeNotification(notif.id)}
            />
          ))}
        </div>
      )}

      {/* Estado de la API */}
      {apiHealth && !apiHealth.isHealthy && (
        <div className="api-status api-status-warning">
          <span className="status-icon">⚠️</span>
          <span className="status-text">API fuera de servicio. Mostrando datos en caché.</span>
          <button
            className="status-retry"
            onClick={() => {
              checkHealth();
              loadPokemon();
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre o ID (#)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${showOnlyFavorites ? 'active' : ''}`}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            ★ Favoritos ({localFavoriteIds.length})
          </button>
          <button
            className="filter-btn"
            onClick={clearFilters}
            disabled={!searchTerm && !showOnlyFavorites}
          >
            Limpiar filtros
          </button>
          <button
            className="filter-btn"
            onClick={() => {
              loadPokemon();
              checkHealth();
            }}
            title="Recargar datos"
          >
            🔄 Recargar
          </button>
        </div>

        <div className="stats">
          <span>Total: {filteredPokemon.length}</span>
          <span>Favoritos: {localFavoriteIds.length}</span>
          <span>Bloqueados: {blockedIds.length}</span>
        </div>
      </div>

      {filteredPokemon.length === 0 ? (
        <div className="no-results">
          {pokemon.length === 0 ? 'No hay Pokémon disponibles' : 'No se encontraron Pokémon'}
        </div>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemon.map(p => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              isFavorite={localFavoriteIds.includes(p.id)}
              isBlocked={blockedIds.includes(p.id)}
              onToggleFavorite={toggleFavorite}
              onToggleBlock={toggleBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PokemonList;
