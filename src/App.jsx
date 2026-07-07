import { useState, useEffect } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import SidebarFavorites from "./components/SidebarFavorites";

function App() {
  const [favoritesPokemon, setFavoritesPokemon] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const saved = localStorage.getItem('pokemonFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [blockedIds, setBlockedIds] = useState(() => {
    const saved = localStorage.getItem('pokemonBlocked');
    return saved ? JSON.parse(saved) : [];
  });

  
  useEffect(() => {
    const savedFavoritesData = localStorage.getItem('pokemonFavoritesData');
    if (savedFavoritesData) {
      try {
        setFavoritesPokemon(JSON.parse(savedFavoritesData));
      } catch (error) {
        console.error('Error loading favorites data:', error);
      }
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('pokemonFavoritesData', JSON.stringify(favoritesPokemon));
  }, [favoritesPokemon]);

  
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  
  useEffect(() => {
    localStorage.setItem('pokemonBlocked', JSON.stringify(blockedIds));
  }, [blockedIds]);

  
  const handleUpdateFavorites = (favoritePokemonList, ids) => {
    setFavoritesPokemon(favoritePokemonList);
    setFavoriteIds(ids);
  };

  
  const handleRemoveFavorite = (pokemonId) => {
    setFavoritesPokemon(prev => prev.filter(p => p.id !== pokemonId));
    setFavoriteIds(prev => prev.filter(id => id !== pokemonId));
  };

  
  const handleToggleBlock = (pokemonId) => {
    setBlockedIds(prev =>
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    );
  };

  
  const handleUpdateBlocked = (newBlockedIds) => {
    setBlockedIds(newBlockedIds);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1> PokeParaiso </h1>
        <p className="app-subtitle">Gestor de Pokémon - Busca a tus pokemones favoritos</p>
      </header>

      <div className="app-layout">
        <main className="app-main">
          <PokemonList 
            onUpdateFavorites={handleUpdateFavorites}
            onUpdateBlocked={handleUpdateBlocked}
            blockedIds={blockedIds}
            favoriteIds={favoriteIds}
          />
        </main>

        <aside className="app-sidebar">
          <SidebarFavorites
            favoritesPokemon={favoritesPokemon}
            onRemoveFavorite={handleRemoveFavorite}
            onToggleBlock={handleToggleBlock}
            blockedIds={blockedIds}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
