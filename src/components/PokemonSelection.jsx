import React from "react";

// Component for Pokemon selection screen
const PokemonSelection = ({ pokemonData, choosePokemon }) => {
  return (
    <div className="pokemon-selection">
      <h2>Welcome Player! Choose your Pokemon</h2>

      {/* Check if pokemonData exists and has content */}
      {pokemonData && pokemonData.length && (
        <div className="pokemon-list">
          {pokemonData.map((pokemon) => (
            <button
              key={pokemon.name}
              type="button"
              className="nes-btn"
              onClick={() => choosePokemon(pokemon)}
            >
              {pokemon.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonSelection;
