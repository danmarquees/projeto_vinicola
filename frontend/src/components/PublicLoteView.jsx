import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    // Tenta voltar para a aba anterior, se não puder, vai pra home / admin
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/admin");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-800 rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-rose-900 font-medium tracking-wide">
            Desrolhando detalhes do vinho...
          </p>
        </div>
      </div>
    );
  }

  if (error || !lote) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcfb] px-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rose-800 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Ops! Vinho não encontrado.</h2>
        <p className="text-stone-500 mb-8 max-w-md">{error || "Não conseguimos localizar as informações deste lote específico."}</p>
        <button 
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition shadow-md font-medium"
        >
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  return <ClientView lote={lote} onClose={handleClose} />;
};

export default PublicLoteView;
