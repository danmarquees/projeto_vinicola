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
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gray-950 font-sans"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-rose-950/40 via-gray-950 to-black z-0"></div>
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-900/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-0 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-8 border border-white/5 relative overflow-hidden">
          {/* Subtle shine effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

          <div className="text-center relative z-20">
            <div className="flex justify-center mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <WineIcon className="h-16 w-16 text-rose-200 mb-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-amber-100 tracking-tight pt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
              RASTREABILIDADE
            </h1>
            <p className="text-amber-200/50 mt-2 font-light text-sm tracking-widest uppercase">Adega Premium</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-200/50 uppercase tracking-widest pl-1">ID do Mestre</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: vinicola"
                required
                className="w-full px-5 py-3.5 bg-black/50 text-rose-50 placeholder-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/50 border border-white/5 transition-all duration-300 shadow-inner"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-200/50 uppercase tracking-widest pl-1">Chave de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex: django"
                required
                className="w-full px-5 py-3.5 bg-black/50 text-rose-50 placeholder-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/50 border border-white/5 transition-all duration-300 shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 flex justify-center items-center font-bold text-rose-50 bg-gradient-to-r from-rose-900 to-red-950 hover:from-rose-800 hover:to-red-900 py-3.5 rounded-xl border border-rose-800/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(225,29,72,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? <Spinner /> : <span className="tracking-widest uppercase text-sm">Desrolhar Acesso</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
