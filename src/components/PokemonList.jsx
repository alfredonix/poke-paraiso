import { useState, useEffect } from 'react';
import { fetchPokemonList } from '../services/pokemonService';
import PokemonCard from './PokemonCard';
import '../styles/PokemonList.css';

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokemonFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [blocked, setBlocked] = useState(() => {
    const saved = localStorage.getItem('pokemonBlocked');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Cargar lista de Pokémon al montar
  useEffect(() => {
    loadPokemon();
  }, []);

  // Guardar favoritos en localStorage
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Guardar bloqueados en localStorage
  useEffect(() => {
    localStorage.setItem('pokemonBlocked', JSON.stringify(blocked));
  }, [blocked]);

  // Filtrar basado en búsqueda y favoritos
  useEffect(() => {
    let filtered = pokemon;

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
      );
    }

    // Filtrar solo favoritos si está activado
    if (showOnlyFavorites) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    setFilteredPokemon(filtered);
  }, [pokemon, searchTerm, favorites, showOnlyFavorites]);

  const loadPokemon = async () => {
    setLoading(true);
    const data = await fetchPokemonList(150);
    setPokemon(data);
    setLoading(false);
  };

  const toggleFavorite = (pokemonId) => {
    setFavorites(prev =>
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    );
  };

  const toggleBlock = (pokemonId) => {
    setBlocked(prev =>
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setShowOnlyFavorites(false);
  };

  if (loading) {
    return <div className="loading">Cargando Pokémon...</div>;
  }

  return (
    <div className="pokemon-list-container">
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
            ★ Favoritos ({favorites.length})
          </button>
          <button
            className="filter-btn"
            onClick={clearFilters}
            disabled={!searchTerm && !showOnlyFavorites}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="stats">
          <span>Total: {filteredPokemon.length}</span>
          <span>Favoritos: {favorites.length}</span>
          <span>Bloqueados: {blocked.length}</span>
        </div>
      </div>

      {filteredPokemon.length === 0 ? (
        <div className="no-results">
          No se encontraron Pokémon
        </div>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemon.map(p => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              isFavorite={favorites.includes(p.id)}
              isBlocked={blocked.includes(p.id)}
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
