import React from "react";

// Component for displaying player's attack options
const AttackOptions = ({
  playerPokemon,
  playerAttack,
  isPlayerTurn,
  opponentPokemonHp,
}) => {
  return (
    <div className="attack-options">
      <h2 style={{ color: "blue" }}>
        <u>Choose your attack!</u>
      </h2>

      {/* Map through player's available attacks */}
      {playerPokemon?.attacks.map((selectedAttack) => (
        <button
          key={selectedAttack?.name}
          className={
            "nes-btn " +
            (isPlayerTurn === false ||
            selectedAttack.uses <= 0 ||
            playerPokemon.currentHp <= 0 ||
            opponentPokemonHp <= 0
              ? "is-disabled"
              : "is-warning")
          }
          onClick={() => playerAttack(selectedAttack)}
          disabled={
            selectedAttack.uses <= 0 ||
            playerPokemon.currentHp <= 0 ||
            opponentPokemonHp <= 0
          }
        >
          {/* Display attack name, damage and uses left */}
          <p className="attack-options-data">
            {selectedAttack.name} ({selectedAttack.damage} dmg)
          </p>
          <span style={{ fontSize: 10 }}>
            Usage left: {selectedAttack.uses}
          </span>
        </button>
      ))}
    </div>
  );
};

export default AttackOptions;
