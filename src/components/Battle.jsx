import React from "react";
import PokemonStatus from "./PokemonStatus";
import AttackOptions from "./AttackOptions";

// Main Battle component for the Pokemon battle
const Battle = ({
  playerPokemon,
  opponentPokemon,
  isPlayerTurn,
  playerAttack,
}) => {
  return (
    <div className="battle">
      <div className="pokemon-status">
        {/* Player Status */}
        <PokemonStatus
          trainerSprite="player"
          trainerUrl="https://depictukinetic.carrd.co/assets/images/gallery03/5db9a82b.png?v=253bcc8c"
          pokemon={playerPokemon}
        />

        {/* Opponent Status */}
        <PokemonStatus
          trainerSprite="opponent"
          trainerUrl="https://pokemoncosmicquest.wordpress.com/wp-content/uploads/2023/02/galileo-final.png"
          pokemon={opponentPokemon}
        />
      </div>

      {/* Render Attack Options if it's the player's turn and both Pokemon are still in battle */}
      {isPlayerTurn &&
      playerPokemon?.currentHp > 0 &&
      opponentPokemon?.currentHp > 0 ? (
        <AttackOptions
          playerPokemon={playerPokemon}
          playerAttack={playerAttack}
          isPlayerTurn={isPlayerTurn}
          opponentPokemonHp={opponentPokemon.currentHp}
        />
      ) : (
        <AttackOptions
          playerPokemon={playerPokemon}
          playerAttack={playerAttack}
          isPlayerTurn={isPlayerTurn}
          opponentPokemonHp={opponentPokemon.currentHp}
        />
      )}
    </div>
  );
};

export default Battle;
