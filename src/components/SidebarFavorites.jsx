import { useState } from 'react';
import '../styles/SidebarFavorites.css';

function SidebarFavorites({ favoritesPokemon = [], onRemoveFavorite, onToggleBlock, blockedIds = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRemove = (pokemonId) => {
    onRemoveFavorite(pokemonId);
  };

  const handleBlock = (pokemonId) => {
    onToggleBlock(pokemonId);
  };

  const blockedFavorites = favoritesPokemon.filter(p => blockedIds.includes(p.id)).length;

  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  return (
    <>
      {/* Botón flotante para móviles */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Abrir favoritos"
      >
        ★
      </button>

      {/* Overlay para cerrar sidebar en móviles */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-favorites ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>★ Mis Favoritos</h2>
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-stats">
          <div className="stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{favoritesPokemon.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Bloqueados:</span>
            <span className="stat-value">{blockedFavorites}</span>
          </div>
        </div>

        {favoritesPokemon.length === 0 ? (
          <div className="empty-favorites">
            <p>No tienes Pokémon favoritos</p>
            <p className="empty-hint">¡Agrega favoritos desde la lista!</p>
          </div>
        ) : (
          <div className="favorites-list">
            {favoritesPokemon.map(pokemon => (
              <div
                key={pokemon.id}
                className={`favorite-item ${blockedIds.includes(pokemon.id) ? 'blocked' : ''}`}
              >
                <div className="favorite-image">
                  <img
                    src={pokemon.image || 'https://via.placeholder.com/60'}
                    alt={pokemon.name}
                  />
                </div>

                <div className="favorite-info">
                  <div className="favorite-name">
                    {pokemon.name}
                    <span className="favorite-id">#{String(pokemon.id).padStart(3, '0')}</span>
                  </div>
                  
                  <div className="favorite-types">
                    {pokemon.types.map(type => (
                      <span
                        key={type}
                        className="type-badge"
                        style={{ backgroundColor: typeColors[type] || '#999' }}
                        title={type}
                      >
                        {type.charAt(0).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="favorite-actions">
                  <button
                    className={`action-icon block-icon ${blockedIds.includes(pokemon.id) ? 'blocked' : ''}`}
                    onClick={() => handleBlock(pokemon.id)}
                    title={blockedIds.includes(pokemon.id) ? 'Desbloquear' : 'Bloquear'}
                  >
                    🚫
                  </button>
                  <button
                    className="action-icon remove-icon"
                    onClick={() => handleRemove(pokemon.id)}
                    title="Quitar de favoritos"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SidebarFavorites;
