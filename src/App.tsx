import './App.css';
import Game from './Game';

function App() {
  return (
    <div className="app">
      <h1>two|rds</h1>
      <Game guessLimit={6} wordLength={5} />
    </div>
  );
}

export default App;
