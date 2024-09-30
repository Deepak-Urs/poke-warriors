import React from "react";

// Component to display Pokemon's status (HP, name, type, image)
const PokemonStatus = ({ trainerSprite, pokemon }) => {
  // Function to render the life bar based on current and max HP
  const renderLifeBar = (currentHp, maxHp) => {
    const widthPercentage = (currentHp / maxHp) * 100;
    return (
      <div className="life-bar-container">
        <div
          className="life-bar"
          style={{ width: `${widthPercentage}%`, color: "orange" }}
        ></div>
      </div>
    );
  };

  return (
    <div>
      <h1>{trainerSprite === "player" ? "Player" : "Opponent"}</h1>

      {/* Show Pokemon info if it's alive, otherwise show fainted message */}
      {pokemon?.currentHp ? (
        <>
          <div className="pokemon-info">
            <div className="pokemon-name">
              <h3>{pokemon?.name}</h3>
              <span style={{ fontSize: 10 }}>Type: {pokemon.type}</span>
            </div>
            <img
              width={250}
              height={200}
              src={pokemon?.image}
              className={pokemon?.isAttacking ? "attacking" : ""}
            />
          </div>

          {/* Render Pokemon's life bar */}
          {renderLifeBar(pokemon?.currentHp, pokemon?.maxHp)}
          <p>HP: {pokemon?.currentHp}</p>
        </>
      ) : (
        <h1 style={{ color: "red" }}>Pokemon fainted</h1>
      )}
    </div>
  );
};

export default PokemonStatus;
