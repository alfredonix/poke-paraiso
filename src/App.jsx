import "./App.css";
import PokemonList from "./components/PokemonList";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎀 Poke Paraiso 🎀</h1>
        <p className="app-subtitle">Gestor de Pokémon - Busca, Favoritos y Bloqueos</p>
      </header>
      <main className="app-main">
        <PokemonList />
      </main>
    </div>
  );
}

export default App;