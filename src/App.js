import React, { useState, useCallback, useMemo } from 'react';
import Statistics from './components/Statistics';
import './App.css';

const generateRandomNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 60) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

const NumberBall = React.memo(({ number }) => (
  <span className="number-ball">{number}</span>
));

const GameRow = React.memo(({ gameNumber, numbers }) => (
  <tr>
    <td>Jogo {gameNumber}</td>
    <td className="numbers-cell">
      {numbers.map((num) => (
        <NumberBall key={num} number={num} />
      ))}
    </td>
  </tr>
));

const App = () => {
  const [numGames, setNumGames] = useState(1);
  const [allGames, setAllGames] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGenerate = useCallback(() => {
    const newGames = Array.from({ length: numGames }, () => ({
      numbers: generateRandomNumbers(),
      id: Date.now() + Math.random()
    }));
    
    setAllGames(prevGames => [...newGames, ...prevGames]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, [numGames]);

  const handleCopy = useCallback(() => {
    const textToCopy = allGames
      .map((game, index) => `Jogo ${allGames.length - index}: ${game.numbers.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Números copiados para a área de transferência!');
    });
  }, [allGames]);

  const handleClear = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setAllGames([]);
    }
  }, []);

  const totalGamesGenerated = useMemo(() => allGames.length, [allGames]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gerador de Números da Mega-Sena</h1>
        <p className="subtitle">Gere seus números da sorte!</p>
      </header>

      <main className="main-content">
        <div className="control-panel">
          <div className="input-container">
            <div className="quantity-control">
              <button 
                className="quantity-button"
                onClick={() => setNumGames(prev => Math.max(1, prev - 1))}
                disabled={numGames <= 1}
              >
                -
              </button>
              <span className="quantity-display">
                {numGames} {numGames === 1 ? 'Jogo' : 'Jogos'}
              </span>
              <button 
                className="quantity-button"
                onClick={() => setNumGames(prev => Math.min(10, prev + 1))}
                disabled={numGames >= 10}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="button-group">
            <button className="primary-button" onClick={handleGenerate}>
              Gerar Números
            </button>
            {allGames.length > 0 && (
              <>
                <button onClick={handleCopy}>Copiar Jogos</button>
                <button className="clear-button" onClick={handleClear}>
                  Limpar Histórico
                </button>
              </>
            )}
          </div>
        </div>

        {showConfetti && <div className="confetti">🎉</div>}

        {allGames.length > 0 && (
          <div className="results">
            <div className="results-header">
              <h2>Histórico de Jogos</h2>
              <span className="total-games">Total: {totalGamesGenerated} jogo(s)</span>
            </div>
            
            <div className="table-container">
              <table className="games-table">
                <thead>
                  <tr>
                    <th>Jogo</th>
                    <th>Números</th>
                  </tr>
                </thead>
                <tbody>
                  {allGames.map((game, index) => (
                    <GameRow
                      key={game.id}
                      gameNumber={allGames.length - index}
                      numbers={game.numbers}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Statistics />
      </main>

      <footer className="app-footer">
        <p>Desenvolvido pelo <a href="https://github.com/thiagoamorimm" target="_blank" rel="noopener noreferrer">thiagoamorimm</a></p>
      </footer>
    </div>
  );
};

export default App;