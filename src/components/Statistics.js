import React, { useState } from 'react';

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  const processFile = (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const lines = content.split('\n');
        const numbers = new Map();

        // Inicializa o mapa com todos os números possíveis
        for (let i = 1; i <= 60; i++) {
          numbers.set(i, 0);
        }

        // Processa cada linha do arquivo
        lines.forEach(line => {
          const matches = line.match(/\d+/g);
          if (matches) {
            matches.forEach(num => {
              const number = parseInt(num);
              if (number >= 1 && number <= 60) {
                numbers.set(number, numbers.get(number) + 1);
              }
            });
          }
        });

        // Converte o Map para array e ordena
        const sortedNumbers = Array.from(numbers.entries()).sort((a, b) => b[1] - a[1]);

        // Pega os 6 mais e menos sorteados
        const mostDrawn = sortedNumbers.slice(0, 6);
        const leastDrawn = sortedNumbers.slice(-6).reverse();

        setStatistics({
          mostDrawn,
          leastDrawn,
          totalGames: lines.length
        });
      } catch (error) {
        alert('Erro ao processar o arquivo. Certifique-se que o formato está correto.');
        console.error('Error processing file:', error);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      alert('Erro ao ler o arquivo.');
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/plain') {
        alert('Por favor, envie um arquivo de texto (.txt)');
        return;
      }
      processFile(file);
    }
  };

  return (
    <div className="statistics-container">
      <div className="upload-section">
        <h2>Análise de Resultados Anteriores</h2>
        <div className="file-upload">
          <label htmlFor="file-input" className="file-upload-label">
            Escolher Arquivo .txt
            <input
              id="file-input"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="file-input"
            />
          </label>
          <p className="file-format-info">
            Formato: Um jogo por linha, números separados por espaço ou vírgula
          </p>
        </div>
      </div>

      {loading && (
        <div className="loading">
          Processando arquivo...
        </div>
      )}

      {statistics && !loading && (
        <div className="statistics-results">
          <div className="total-games">
            Total de Jogos Analisados: {statistics.totalGames}
          </div>
          
          <div className="statistics-grid">
            <div className="stat-column">
              <h3>Números Mais Sorteados</h3>
              <div className="number-stats">
                {statistics.mostDrawn.map(([number, count]) => (
                  <div key={number} className="stat-item">
                    <span className="number-ball">{number}</span>
                    <span className="number-count">{count}x</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-column">
              <h3>Números Menos Sorteados</h3>
              <div className="number-stats">
                {statistics.leastDrawn.map(([number, count]) => (
                  <div key={number} className="stat-item">
                    <span className="number-ball">{number}</span>
                    <span className="number-count">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
