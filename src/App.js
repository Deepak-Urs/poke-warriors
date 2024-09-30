import { useState, useRef, useEffect } from "react";
import PokemonSelection from "./components/PokemonSelection";
import Battle from "./components/Battle";
import ResetButton from "./components/ResetBtn";

import "./App.css";

export default function App() {
  // State hooks for managing Pokemon data, battle state, and messages
  const [playerPokemonList, setPlayerPokemonList] = useState([]);
  const [opponentPokemonList, setOpponentPokemonList] = useState([]);
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [isShowBattleArea, setIsShowBattleArea] = useState(false);
  const [message, setMessage] = useState("");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const attackSound = useRef(null);
  const base_url = "https://pokeapi.co/api/v2";

  useEffect(() => {
    document.body.style.zoom = "90%";
    getPokemon(); // Fetch Pokemon data on app load
  }, []);

  const getPokemon = async () => {
    // fetch playerPokemon
    const res = await fetch(
      base_url +
        `/pokemon?offset=${
          Math.floor(Math.random() * (150 / 10 + 1)) * 10
        }&limit=10`
    );
    const data = await res.json();
    setPlayerPokemonList(data.results);
    let opponentPokemonSet = data.next;

    // fetch opponentPokemon
    const response = await fetch(opponentPokemonSet);
    const dataset = await response.json();
    setOpponentPokemonList(dataset.results);
  };

  const populatePokemon = async (pokemon, playerType) => {
    // Fetch selected Pokemon data and populate it
    let chosenPokemon = {};

    try {
      const response = await fetch(pokemon.url);
      let data = await response.json();

      // Set Pokemon details (name, image, type)
      chosenPokemon.name = pokemon.name;
      chosenPokemon.image =
        playerType === "player"
          ? data.sprites.back_default
          : data.sprites.front_default;
      chosenPokemon.sound = data.cries.latest;
      chosenPokemon.type = data.types[0].type.name;

      // getting the attacks
      let moves = data.moves;
      let attacksData = moves.slice(0, 4);

      // Add attack details
      let pokemonAttacks = [];
      for (let i = 0; i < attacksData.length; i++) {
        let pokeData = await fetch(attacksData[i]["move"]["url"]);
        let attackRes = await pokeData.json();

        pokemonAttacks.push({
          name: attackRes.name,
          // damage is calculated by a lot many factors in real world game,
          // for simplicity the usual high damage levels are rounded to 20% of original value, it is compatible to an intersting game
          damage: Math.round(attackRes.power / 10) || 0,

          // doing below calculation to reduce the number of uses to a practical game level to make it interesting
          uses: attackRes.pp % 10 < 5 ? 10 : attackRes.pp,
          accuracy: parseFloat((attackRes.accuracy / 100).toFixed(1)),
        });
      }

      chosenPokemon.attacks = pokemonAttacks;

      // Set Pokemon stats (HP)
      data.stats.map((stat) => {
        if (stat.stat.name === "hp") {
          chosenPokemon.maxHp = stat.base_stat;
          chosenPokemon.currentHp = stat.base_stat;
        }
      });
    } catch (error) {
      console.error(error);
    }
    return chosenPokemon;
  };

  const choosePokemon = async (pokemon) => {
    // get player's pokemon
    let playerPokemonData = await populatePokemon(pokemon, "player");
    setPlayerPokemon(playerPokemonData);

    //get opponent pokemon
    let randomOpponentPokemonData = await populatePokemon(
      opponentPokemonList[
        Math.floor(Math.random() * opponentPokemonList.length)
      ],
      "opponent"
    );
    setOpponentPokemon(randomOpponentPokemonData);

    // Set battle message and show battle area
    setMessage(
      `You chose ${pokemon.name}! Opponent sent out ${randomOpponentPokemonData.name}`
    );
    setIsPlayerTurn(true);
    setIsShowBattleArea(true);
  };

  const resetGame = () => {
    // Reload the page to reset the game
    window.location.reload();
  };

  const playerAttack = (selectedAttack) => {
    if (!playerPokemon || !opponentPokemon) {
      setMessage("Choose your Pokemon to start battle");
      return;
    }

    // check all attacks
    const availableAttacks = playerPokemon.attacks.filter(
      (attack) => attack.uses > 0
    );

    if (availableAttacks.length == 0) {
      const log = `${playerPokemon.name} has no attack left!`;
      setMessage(log);
      return;
    }

    // check current attack usage
    if (selectedAttack.uses <= 0) {
      setMessage(`No more uses left for ${selectedAttack.name}`);
      return;
    }

    // Custom check to see if attack missed
    if (Math.random() > selectedAttack.accuracy) {
      const log = `${playerPokemon.name} tried to use ${selectedAttack.name} but missed!`;

      setMessage(log);

      setTimeout(() => {
        setIsPlayerTurn(false);
        opponentAttack();
      }, 1000);

      return;
    }

    // play attack sound
    if (attackSound.current) {
      attackSound.current.play();
    }

    const playerDamage = selectedAttack.damage;
    const opponentHp =
      opponentPokemon.currentHp - playerDamage >= 0
        ? opponentPokemon.currentHp - playerDamage
        : 0;

    setOpponentPokemon({
      ...opponentPokemon,
      currentHp: opponentHp,
    });

    selectedAttack.uses -= 1;

    let commentary = "";

    if (playerDamage > 10) {
      commentary = "Effective!";
    }
    if (playerAttack?.name == "Confusion" && Math.random() < 0.5) {
      commentary += `The opponent ${opponentPokemon.name} is confused!`;
    }

    const log = `You used ${selectedAttack.name} for ${playerDamage} damage! ${commentary}`;
    setMessage(log);

    if (opponentHp <= 0) {
      setMessage(`You win! ${playerPokemon.name} wins!`);
      setTimeout(() => {
        let audio = new Audio(playerPokemon.sound);
        audio.play();
      }, 750);
      return;
    }

    setTimeout(() => {
      setIsPlayerTurn(false);
      opponentAttack(); // Trigger opponent's attack after a delay
    }, 1000);
  };

  const opponentAttack = () => {
    if (!playerPokemon || !opponentPokemon) {
      setMessage("Choose your Pokemon to start battle");
      return;
    }

    const availableAttacks = opponentPokemon.attacks.filter(
      (attack) => attack.uses > 0
    );

    if (availableAttacks.length == 0) {
      const log = `${opponentPokemon.name} has no attack left!`;
      setMessage(log);
      return;
    }

    const selectedAttack =
      availableAttacks[Math.floor(Math.random() * availableAttacks.length)];

    // check current attack
    if (selectedAttack.uses <= 0) {
      setMessage(`No more uses left for ${selectedAttack.name}`);
      return;
    }

    if (Math.random() > selectedAttack.accuracy) {
      const log = `${opponentPokemon.name} tried to use ${selectedAttack.name} but missed!`;

      setMessage(log);

      setTimeout(() => {
        setIsPlayerTurn(true);
        // opponentAttack()
      }, 1000);

      return;
    }

    // play general attack sound
    if (attackSound.current) {
      attackSound.current.play();
    }

    const opponentDamage = selectedAttack.damage;

    const playerHp =
      playerPokemon.currentHp - opponentDamage >= 0
        ? playerPokemon.currentHp - opponentDamage
        : 0;

    setPlayerPokemon({
      ...playerPokemon,
      currentHp: playerHp,
    });

    selectedAttack.uses -= 1;

    let commentary = "";

    if (opponentDamage > 10) {
      commentary = "Effective!";
    }
    if (selectedAttack?.name == "Confusion" && Math.random() < 0.5) {
      commentary += `Your ${playerPokemon.name} is confused!`;
    }

    const log = `Opponent's ${opponentPokemon.name} used ${selectedAttack.name} for ${opponentDamage} damage! ${commentary}`;
    setMessage((oldlog) => oldlog + "  < || >  " + log);

    if (playerHp <= 0) {
      setMessage(`You lose! ${opponentPokemon.name} wins!`);
      setTimeout(() => {
        let audio = new Audio(opponentPokemon.sound);
        audio.play();
      }, 750);
      return;
    }

    setTimeout(() => {
      setIsPlayerTurn(true);
    }, 1000);
  };

  return (
    <div className="app-wrapper">
      <div className="nes-container is-rounded is-dark App">
        {/* Header with icons and game title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="nes-ash"></i>
          <h1>Poke'Warriors</h1>
          <i className="nes-mario"></i>
        </div>

        <div className="message-bar">
          <h2>
            <i>{message}</i>
          </h2>
        </div>

        {/* Conditional rendering for Pokemon selection or battle area */}
        {!isShowBattleArea ? (
          <PokemonSelection
            pokemonData={playerPokemonList}
            choosePokemon={choosePokemon}
          />
        ) : (
          <div style={{ display: "flex" }}>
            {isShowBattleArea ? (
              <Battle
                playerPokemon={playerPokemon}
                opponentPokemon={opponentPokemon}
                isPlayerTurn={isPlayerTurn}
                playerAttack={playerAttack}
              />
            ) : (
              ""
            )}
          </div>
        )}
        {/* Display reset button if the battle area is active */}
        {isShowBattleArea ? <ResetButton resetGame={resetGame} /> : ""}

        {/* Audio element for attack sound */}
        <audio
          ref={attackSound}
          src="https://vgmtreasurechest.com/soundtracks/pokemon-sfx-gen-3-attack-moves-rse-fr-lg/izqqhmeayp/Tackle.mp3"
          preload="auto"
        />
      </div>
    </div>
  );
}
