import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Estado para armazenar os lotes de vinho
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os dados da API quando o componente for montado
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        // A chamada agora é para /api/lotes/, que será encaminhada pelo proxy do Vite
        const response = await fetch("/api/lotes/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLotes(data);
      } catch (error) {
        setError(error);
        console.error("Erro ao buscar lotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLotes();
  }, []); // O array vazio garante que este efeito rode apenas uma vez após a montagem inicial

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Rastreabilidade de Vinhos</h1>
      </header>
      <main>
        <h2>Lotes de Vinho</h2>
        {loading && <p>Carregando lotes...</p>}
        {error && <p>Erro ao carregar dados: {error.message}</p>}
        {!loading && !error && lotes.length === 0 && (
          <p>Nenhum lote encontrado.</p>
        )}
        {!loading && !error && lotes.length > 0 && (
          <ul>
            {lotes.map((lote) => (
              <li key={lote.id}>
                <strong>ID:</strong> {lote.id},<strong>Nome:</strong>{" "}
                {lote.nome_vinho},<strong>Safra:</strong> {lote.safra},
                <strong>Volume:</strong> {lote.volume_litros}L
                {/* Adicione outros campos conforme sua API */}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
