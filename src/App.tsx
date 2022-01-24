import React from 'react';
import Game from "./Game";
import validAnswers from "./validAnswers.json";

import './App.css';

const answer = validAnswers[Math.floor(Math.random() * validAnswers.length)];
const answer2 = validAnswers[Math.floor(Math.random() * validAnswers.length)];

function App() {
  return (
    <div className="App">
      <h1>two|rds</h1>
      <div className="Boards">
        <Game target={answer} guessLimit={6} />
        <Game target={answer2} guessLimit={6} />
      </div>
    </div>
  );
}

export default App;
