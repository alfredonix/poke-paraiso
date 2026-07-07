import "./App.css";
import PokemonList from "./components/PokemonList";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1> PokeParaiso </h1>
        <p className="app-subtitle">Gestor de Pokémon - Busca a tus pokemones favoritos</p>
      </header>
      <main className="app-main">
        <PokemonList />
      </main>
    </div>
  );
}

export default App;