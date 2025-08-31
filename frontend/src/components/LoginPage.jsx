import React, { useState } from "react";

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

const WineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-white mb-6"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M5.5 4a1.5 1.5 0 013 0v1.258A6.002 6.002 0 0110 5a6 6 0 011.5 9.742V16.5a1.5 1.5 0 01-3 0v-1.758A6.002 6.002 0 0110 15a6 6 0 01-1.5-9.742V4zM10 7a4 4 0 100 8 4 4 0 000-8z" />
    <path d="M2 10.5a1.5 1.5 0 013 0v2.5a1.5 1.5 0 01-3 0v-2.5zM15 10.5a1.5 1.5 0 013 0v2.5a1.5 1.5 0 01-3 0v-2.5z" />
  </svg>
);

const LoginPage = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-700">
          <div className="text-center">
            <div className="flex justify-center">
              <WineIcon />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wider">
              RASTREABILIDADE
            </h1>
            <p className="text-gray-400">Acesso ao Painel da Vinícola</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuário (vinicola)"
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha (django)"
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center font-bold text-white bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-transform transform hover:scale-105 disabled:bg-purple-800 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
