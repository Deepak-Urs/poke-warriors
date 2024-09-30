import React from "react";

// Button component to reset the game
const ResetButton = ({ resetGame }) => {
  return (
    <button className="nes-btn is-error" onClick={resetGame}>
      New Game
    </button>
  );
};

export default ResetButton;
