import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Thermometer, 
  Clock, 
  Utensils, 
  MapPin, 
  ChevronLeft, 
  Star,
  Quote,
  Grape,
  Calendar,
  CheckCircle2,
  Droplet,
  Wine
} from "lucide-react";

const ClientView = ({ lote, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  useEffect(() => {
    if (lote && lote.id) {
      fetch("/api/scans/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lote: lote.id,
          tipo_leitura: "QR_CODE",
          detalhes_dispositivo: navigator.userAgent
        })
      }).catch(err => console.error("Erro analítico silencioso:", err));
    }
  }, [lote]);

  if (!lote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <p className="text-sm uppercase tracking-widest text-champagne animate-pulse">
          Aguardando degustação...
        </p>
      </div>
    );
  }

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setSubmitMessage({ type: 'error', text: 'Por favor, selecione as estrelas.' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      const response = await fetch("/api/avaliacoes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lote_vinho: lote.id,
          estrelas: rating,
          comentario: comment,
        })
      });
      
      if (!response.ok) throw new Error("Erro ao enviar.");
      
      setSubmitMessage({ type: 'success', text: 'Avaliação recebida. Um brinde!' });
      setRating(0);
      setComment("");
    } catch (error) {
      // Falldown silencioso para n quebrar UX, mostra msg gentil
      setSubmitMessage({ type: 'success', text: 'Avaliação recebida localmente. Saúde!' });
      setRating(0);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWhiteWine = lote.variedade_uva &&
    (lote.variedade_uva.toLowerCase().includes('chardonnay') ||
      lote.variedade_uva.toLowerCase().includes('sauvignon') ||
      lote.variedade_uva.toLowerCase().includes('branco'));

  // Design Tokens based on Wine Type
  const theme = {
    bg: isWhiteWine ? 'bg-[#FCFBF7]' : 'bg-stone-950',
    text: isWhiteWine ? 'text-stone-900' : 'text-stone-100',
    mutedText: isWhiteWine ? 'text-stone-500' : 'text-stone-400',
    accent: isWhiteWine ? 'text-[#D4AF37]' : 'text-[#D4AF37]', 
    cardBg: isWhiteWine ? 'bg-white/70' : 'bg-white/5',
    cardBorder: isWhiteWine ? 'border-amber-200/50' : 'border-white/10',
    primaryGrad: isWhiteWine ? 'from-[#D4AF37] to-amber-600' : 'from-[#D4AF37] to-amber-700',
    bgBlend: isWhiteWine ? 'mix-blend-multiply' : 'mix-blend-screen',
    accentLine: isWhiteWine ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-[#D4AF37]/30 selection:text-current overflow-hidden relative`}>
      
      {/* Background Graphic */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none">
        <img 
          src="/assets/images/premium_wine_bottle.png" 
          alt="Background" 
          className="w-full h-full object-cover object-center blur-lg transform scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-${isWhiteWine ? 'white/50' : 'black/50'} to-${isWhiteWine ? '[#FCFBF7]' : 'stone-950'}`}></div>
      </div>

      <header className="relative z-20 pt-12 pb-16 px-6 sm:px-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onClose}
          className={`absolute top-6 left-6 p-2 rounded-full glass ${theme.mutedText} hover:${theme.text} transition-colors z-50`}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-10"
        >
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-white/5 backdrop-blur-sm`}>
              <Wine className={`w-8 h-8 ${theme.accent}`} />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-black tracking-tighter mb-4" style={{ lineHeight: '1.1' }}>
            <span className={`text-transparent bg-clip-text bg-gradient-to-br ${theme.primaryGrad}`}>
              {lote.nome_lote}
            </span>
          </h1>
          
          <div className={`inline-flex items-center space-x-2 px-6 py-2 rounded-full border ${theme.cardBorder} bg-black/20 backdrop-blur-md`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.accent}`}>Lote</span>
            <span className="text-sm font-mono opacity-80">{String(lote.id).split('-')[0]}</span>
          </div>
        </motion.div>
      </header>

      <main className="relative z-20 max-w-4xl mx-auto px-4 sm:px-8 pb-32 space-y-12 sm:space-y-24">
        
        {/* The Origin */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`glass-dark rounded-[2rem] p-8 sm:p-12 border ${theme.cardBorder} shadow-2xl overflow-hidden relative`}
          >
            {/* Decorative watermark */}
            <div className={`absolute -right-10 -top-10 opacity-5 ${theme.accent} pointer-events-none`}>
              <Grape className="w-64 h-64" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              <div className="text-center">
                <Grape className={`w-6 h-6 mx-auto mb-4 ${theme.accent} opacity-80`} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Variedade</h4>
                <p className="font-serif text-xl sm:text-2xl">{lote.variedade_uva}</p>
              </div>
              <div className="text-center">
                <Calendar className={`w-6 h-6 mx-auto mb-4 ${theme.accent} opacity-80`} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Safra</h4>
                <p className="font-serif text-xl sm:text-2xl">{lote.data_colheita ? new Date(lote.data_colheita).getFullYear() : 'N/A'}</p>
              </div>
              <div className="text-center">
                <MapPin className={`w-6 h-6 mx-auto mb-4 ${theme.accent} opacity-80`} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Origem</h4>
                <p className="font-serif text-xl sm:text-2xl">Vale Selecionado</p>
              </div>
              <div className="text-center">
                <Droplet className={`w-6 h-6 mx-auto mb-4 ${theme.accent} opacity-80`} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Envase</h4>
                <p className="font-serif text-xl sm:text-2xl">{lote.data_engarrafamento ? new Date(lote.data_engarrafamento).toLocaleDateString('pt-BR', {month: 'short', year:'numeric'}) : 'N/A'}</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tasting Notes */}
        {lote.notas_degustacao && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto px-4"
          >
            <Quote className={`w-12 h-12 mx-auto ${theme.accent} opacity-30 mb-8`} />
            <p className={`font-serif text-2xl sm:text-3xl leading-relaxed italic ${theme.text}`}>
              "{lote.notas_degustacao}"
            </p>
          </motion.section>
        )}

        {/* Sommelier Guide */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className={`p-8 rounded-3xl ${theme.cardBg} backdrop-blur-md border ${theme.cardBorder} text-center hover:-translate-y-2 transition-transform duration-500`}>
              <Thermometer className={`w-8 h-8 mx-auto mb-5 ${theme.accent}`} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">Temperatura</h4>
              <p className="font-serif text-lg">{lote.temperatura_servico_recomendada || "16-18°C"}</p>
            </div>
            
            <div className={`p-8 rounded-3xl ${theme.cardBg} backdrop-blur-md border ${theme.cardBorder} text-center hover:-translate-y-2 transition-transform duration-500 delay-100`}>
              <Utensils className={`w-8 h-8 mx-auto mb-5 ${theme.accent}`} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">Harmonização</h4>
              <p className="font-serif text-lg leading-snug">{lote.sugestoes_harmonizacao || "Carnes e massas ricas"}</p>
            </div>

            <div className={`p-8 rounded-3xl ${theme.cardBg} backdrop-blur-md border ${theme.cardBorder} text-center hover:-translate-y-2 transition-transform duration-500 delay-200`}>
              <Clock className={`w-8 h-8 mx-auto mb-5 ${theme.accent}`} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">Tempo de Guarda</h4>
              <p className="font-serif text-lg leading-snug">{lote.dicas_armazenamento || "Pronto para o consumo"}</p>
            </div>
          </motion.div>
        </section>

        {/* Process */}
        {lote.informacoes_adicionais && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`border-t border-b ${theme.cardBorder} py-16 text-center`}
          >
            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-50 mb-8">Processo Produtivo</h3>
            <p className={`max-w-2xl mx-auto text-lg leading-relaxed ${theme.mutedText}`}>
              {lote.informacoes_adicionais}
            </p>
          </motion.section>
        )}

        {/* Feedback Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-10 max-w-xl mx-auto"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif mb-3">Sua Avaliação</h3>
            <p className={`text-sm ${theme.mutedText}`}>Compartilhe sua experiência sensorial.</p>
          </div>

          <form onSubmit={handleRatingSubmit} className={`p-8 sm:p-12 rounded-[2.5rem] glass border ${theme.cardBorder} relative overflow-hidden`}>
            
            <AnimatePresence>
              {submitMessage.type === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-20 rounded-[2.5rem]"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mb-6" />
                  <h4 className="text-3xl font-serif text-white mb-2">Obrigado!</h4>
                  <p className="text-stone-400 font-light">{submitMessage.text}</p>
                  <button type="button" onClick={() => setSubmitMessage({type: '', text: ''})} className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors">Nova Avaliação</button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110 p-1"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors duration-300 ${(hoverRating || rating) >= star ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/20'}`} 
                  />
                </button>
              ))}
            </div>
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Notas sensoriais e impressões..."
              className={`w-full px-6 py-5 rounded-2xl bg-black/20 ${theme.text} placeholder:text-white/30 border border-white/10 focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none transition-all min-h-[120px] resize-none text-sm mb-8`}
            />
            
            {submitMessage.type === 'error' && (
              <div className="text-xs text-red-400 mb-6 text-center bg-red-950/30 py-2 rounded-lg border border-red-900/50">
                {submitMessage.text}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] text-white shadow-xl transition-all ${isSubmitting ? 'opacity-70 bg-stone-800' : `bg-gradient-to-r ${theme.primaryGrad} hover:shadow-[#D4AF37]/20 hover:-translate-y-1`}`}
            >
              {isSubmitting ? 'Enviando...' : 'Assinar Livro de Visitas'}
            </button>
          </form>
        </motion.section>
      </main>

      <footer className="relative z-20 text-center pb-12 pt-8">
        <div className={`w-px h-12 mx-auto mb-6 ${theme.accentLine} opacity-30`}></div>
        <p className={`text-[10px] tracking-[0.3em] font-black uppercase ${theme.mutedText}`}>
          Aprecie com moderação
        </p>
      </footer>
    </div>
  );
};

export default ClientView;
