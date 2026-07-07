const POKE_API_BASE = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 150) => {
  try {
    const response = await fetch(`${POKE_API_BASE}/pokemon?limit=${limit}&offset=0`);
    const data = await response.json();
    
    // Obtener detalles de cada Pokémon en paralelo
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        return {
          id: detailData.id,
          name: detailData.name,
          image: detailData.sprites.other['official-artwork'].front_default || 
                 detailData.sprites.front_default,
          types: detailData.types.map(t => t.type.name),
          height: detailData.height,
          weight: detailData.weight,
        };
      })
    );
    
    return pokemonDetails;
  } catch (error) {
    console.error('Error fetching pokemon list:', error);
    return [];
  }
};

export const fetchPokemonDetails = async (name) => {
  try {
    const response = await fetch(`${POKE_API_BASE}/pokemon/${name.toLowerCase()}`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default ||
             data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map(a => a.ability.name),
      stats: data.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
      }))
    };
  } catch (error) {
    console.error('Error fetching pokemon details:', error);
    return null;
  }
};
