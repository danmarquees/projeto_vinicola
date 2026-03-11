import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

const LoginPage = lazy(() => import("./components/LoginPage"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const PublicLoteView = lazy(() => import("./components/PublicLoteView"));

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

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("vinicola_token");
    return token ? { Authorization: `Token ${token}` } : {};
  };

  useEffect(() => {
    const token = localStorage.getItem("vinicola_token");
    if (token) {
      setIsAuthenticated(true);
      fetchLotes();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchLotes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/lotes/");
      if (!response.ok) throw new Error("Falha ao buscar os lotes.");
      const data = await response.json();
      setLotes(data);
    } catch (err) {
      setError("Não foi possível carregar os lotes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error("Credenciais inválidas!");

      const data = await response.json();
      localStorage.setItem("vinicola_token", data.token);
      setIsAuthenticated(true);
      fetchLotes();
      navigate("/admin");
    } catch (err) {
      alert(err.message || "Erro no login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vinicola_token");
    setIsAuthenticated(false);
    setLotes([]);
    navigate("/");
  };

  const handleAddLote = async (newLote) => {
    try {
      const response = await fetch("/api/lotes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...newLote,
          quantidade_produzida_inicial: 100,
          quantidade_em_estoque: 100
        })
      });
      if (!response.ok) throw new Error("Falha ao adicionar lote");
      const createdLote = await response.json();
      setLotes([createdLote, ...lotes]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateLote = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/lotes/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...updatedData,
          quantidade_produzida_inicial: 100,
          quantidade_em_estoque: 100
        })
      });
      if (!response.ok) throw new Error("Falha ao atualizar lote");
      const savedLote = await response.json();
      setLotes(lotes.map(l => (l.id === id ? savedLote : l)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLote = async (id) => {
    if (!window.confirm("Certeza que deseja excluir este lote?")) return;
    try {
      const response = await fetch(`/api/lotes/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Falha ao excluir lote");
      setLotes(lotes.filter(l => l.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Protected Route Wrapper
  const RequireAuth = ({ children }) => {
    if (isLoading) return null; // Or a spinner
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcfb]">
        <Spinner />
        <p className="text-xl text-rose-900 font-medium tracking-wide mt-4">Carregando...</p>
      </div>
    }>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <LoginPage onLogin={handleLogin} isLoading={isLoading} />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            <RequireAuth>
              <AdminPanel
                lotes={lotes}
                onAddLote={handleAddLote}
                onUpdateLote={handleUpdateLote}
                onDeleteLote={handleDeleteLote}
                onLogout={handleLogout}
                isLoading={isLoading}
                error={error}
              />
            </RequireAuth>
          } 
        />
        <Route path="/vinho/:id" element={<PublicLoteView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
