import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import AdminPanel from "./components/AdminPanel";
import ClientView from "./components/ClientView";

// Componente para ícone de carregamento (Spinner)
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

function App() {
  // Estado para controlar a autenticação e a visão atual
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("login"); // 'login', 'admin', 'client'
  const [selectedLote, setSelectedLote] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Efeito para buscar os lotes da API quando o componente for montado
  useEffect(() => {
    // A verificação de autenticação aconteceria aqui.
    // Por enquanto, vamos assumir que não está autenticado e parar o carregamento.
    setIsLoading(false);
    // fetchLotes(); // Descomente quando a API estiver pronta
  }, []);

  const fetchLotes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/lotes/");
      if (!response.ok) {
        throw new Error("Falha ao buscar os dados.");
      }
      const data = await response.json();
      setLotes(data);
    } catch (err) {
      setError(
        "Não foi possível carregar os lotes. Tente novamente mais tarde.",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de login (simulada)
  const handleLogin = (username, password) => {
    setIsLoading(true);
    // Simula uma chamada de API
    setTimeout(() => {
      if (username === "vinicola" && password === "django") {
        setIsAuthenticated(true);
        setCurrentView("admin");
        fetchLotes(); // Busca os lotes após o login
      } else {
        alert("Credenciais inválidas!");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("login");
    setLotes([]);
  };

  // Função para lidar com a adição de um novo lote
  const handleAddLote = async (newLote) => {
    // Lógica para enviar o novo lote para a API
    const id = lotes.length > 0 ? Math.max(...lotes.map((l) => l.id)) + 1 : 1;
    setLotes([...lotes, { ...newLote, id }]);
  };

  // Função para visualizar os detalhes de um lote (visão do cliente)
  const handleViewLote = (lote) => {
    setSelectedLote(lote);
    setCurrentView("client");
  };

  // Função para fechar a visão do cliente e voltar para o painel admin
  const handleCloseClientView = () => {
    setCurrentView("admin");
    setSelectedLote(null);
  };

  // Renderização condicional baseada no estado
  if (currentView === "login") {
    return <LoginPage onLogin={handleLogin} isLoading={isLoading} />;
  }

  if (currentView === "client" && selectedLote) {
    return <ClientView lote={selectedLote} onClose={handleCloseClientView} />;
  }

  return (
    <AdminPanel
      lotes={lotes}
      onAddLote={handleAddLote}
      onViewLote={handleViewLote}
      onLogout={handleLogout}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default App;
