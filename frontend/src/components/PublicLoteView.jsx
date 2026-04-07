import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wine, AlertCircle } from "lucide-react";
import ClientView from "./ClientView";

const PublicLoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lote, setLote] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLote = async () => {
      try {
        const response = await fetch(`/api/lotes/${id}/`);
        if (!response.ok) throw new Error("Lote não encontrado ou indisponível.");
        const data = await response.json();
        setLote(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLote();
  }, [id]);

  const handleClose = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/admin");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center glass p-10 rounded-3xl border border-white/10"
        >
          <div className="p-4 rounded-full bg-[#4A0E0E]/20 mb-6">
            <Wine className="w-10 h-10 text-[#D4AF37] animate-pulse" />
          </div>
          <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em] font-sans">
            Preparando Degustação...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !lote) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-950/30 flex items-center justify-center mb-6 border border-red-900/50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-serif font-black text-white mb-3 tracking-wide">
            Garrafa Indisponível
          </h2>
          <p className="text-stone-400 mb-8 font-light text-sm leading-relaxed">
            {error || "Não conseguimos localizar as informações deste lote específico em nossa adega."}
          </p>
          
          <button 
            onClick={() => navigate("/")}
            className="w-full py-4 bg-[#4A0E0E] text-[#F7E7CE] rounded-xl tracking-widest uppercase text-[10px] font-bold hover:bg-[#6B1A1A] transition shadow-xl"
          >
            Retornar à Origem
          </button>
        </motion.div>
      </div>
    );
  }

  return <ClientView lote={lote} onClose={handleClose} />;
};

export default PublicLoteView;
