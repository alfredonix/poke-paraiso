import '../styles/PokemonCard.css';

function PokemonCard({ pokemon, isFavorite, isBlocked, onToggleFavorite, onToggleBlock }) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };

  const handleBlockClick = (e) => {
    e.stopPropagation();
    onToggleBlock(pokemon.id);
  };

  return (
    <div className={`pokemon-card ${isBlocked ? 'blocked' : ''}`}>
      {isBlocked && <div className="blocked-overlay">BLOQUEADO</div>}
      
      <div className="pokemon-image-container">
        <img 
          src={pokemon.image || 'https://via.placeholder.com/200'} 
          alt={pokemon.name}
          className="pokemon-image"
        />
      </div>
      
      <div className="pokemon-info">
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <p className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</p>
        
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
        
        <div className="pokemon-stats">
          <span className="stat">Height: {pokemon.height / 10}m</span>
          <span className="stat">Weight: {pokemon.weight / 10}kg</span>
        </div>
      </div>
      
      <div className="pokemon-actions">
        <button
          className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          ★
        </button>
        <button
          className={`action-btn block-btn ${isBlocked ? 'active' : ''}`}
          onClick={handleBlockClick}
          title={isBlocked ? 'Desbloquear' : 'Bloquear'}
        >
          🚫
        </button>
      </div>
    </div>
  );
}

export default PokemonCard;
