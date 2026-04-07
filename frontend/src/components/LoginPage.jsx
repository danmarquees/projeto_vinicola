import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wine, Lock, User, Loader2 } from "lucide-react";

const LoginPage = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-stone-950">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: "url('/assets/images/vineyard_sunset.png')",
          filter: "brightness(0.4) saturate(1.2)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950/90"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 space-y-8 border border-white/10 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>

          <div className="text-center relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-bordeaux/40 rounded-full border border-gold/30 shadow-[0_0_20px_rgba(74,14,14,0.5)]">
                <Wine className="h-10 w-10 text-champagne" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-champagne via-gold to-white tracking-widest uppercase">
              Adega Virtual
            </h1>
            <p className="text-champagne/60 mt-3 font-light text-xs tracking-[0.3em] uppercase">Gestão de Rastreabilidade Premium</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-champagne/40 uppercase tracking-[0.2em] ml-1">Usuário de Acesso</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-champagne/30 group-focus-within:text-gold transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nome do usuário"
                  required
                  className="w-full pl-12 pr-5 py-4 bg-white/5 text-champagne placeholder-stone-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold/50 border border-white/5 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-champagne/40 uppercase tracking-[0.2em] ml-1">Senha de Segurança</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-champagne/30 group-focus-within:text-gold transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-5 py-4 bg-white/5 text-champagne placeholder-stone-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold/50 border border-white/5 transition-all duration-300"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 flex justify-center items-center font-bold text-bordeaux bg-gradient-to-r from-champagne to-gold hover:from-white hover:to-champagne py-4 rounded-xl shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="tracking-[0.2em] uppercase text-xs">Entrar na Vinícola</span>
              )}
            </motion.button>
          </form>

          <div className="text-center pt-4">
            <p className="text-champagne/20 text-[10px] uppercase tracking-widest italic">
              Reservado a enólogos autorizados
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative corners */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gold/20 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gold/20 pointer-events-none"></div>
    </div>
  );
};

export default LoginPage;
