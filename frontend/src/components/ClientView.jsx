import React, { useEffect } from "react";

const ClientView = ({ lote, onClose }) => {
  // Efeito para registrar leituras passivas do QR Code (Analytics)
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

  // Adiciona uma verificação para garantir que 'lote' não é nulo antes de renderizar
  if (!lote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-xl text-rose-900 font-medium tracking-wide">
          Desrolhando detalhes do vinho...
        </p>
      </div>
    );
  }

  // Lógica Dinâmica de Cores (Tinto vs Branco)
  const isWhiteWine = lote.variedade_uva &&
    (lote.variedade_uva.toLowerCase().includes('chardonnay') ||
      lote.variedade_uva.toLowerCase().includes('sauvignon') ||
      lote.variedade_uva.toLowerCase().includes('branco'));

  const themeTheme = {
    bgApp: isWhiteWine ? 'bg-[#fcfbf7]' : 'bg-[#fdfcfb]',
    selection: isWhiteWine ? 'selection:bg-amber-200 selection:text-amber-950' : 'selection:bg-rose-200 selection:text-rose-950',
    badgeWrapper: isWhiteWine ? 'border-amber-300/30 bg-amber-900/40' : 'border-amber-200/30 bg-rose-950/40',
    badgeText: isWhiteWine ? 'text-amber-100' : 'text-amber-100',
    backBtn: isWhiteWine ? 'bg-amber-950/30 hover:bg-amber-900/60 border-amber-200/20' : 'bg-rose-950/30 hover:bg-rose-900/60 border-amber-100/20',
    sectionTitle: isWhiteWine ? 'text-amber-950 border-amber-900/10' : 'text-rose-950 border-rose-900/10',
    cardHover: isWhiteWine ? 'hover:bg-amber-50/50 hover:border-amber-200' : 'hover:bg-rose-50/50 hover:border-rose-100',
    cardLabel: isWhiteWine ? 'text-amber-800/80 group-hover:text-amber-900' : 'text-rose-800/80 group-hover:text-rose-900',
    bgGradient: isWhiteWine ? 'from-amber-50/50 to-stone-50/80 border-amber-100/50' : 'from-rose-50/50 to-stone-50/80 border-rose-100/50',
    quoteColor: isWhiteWine ? 'text-amber-300' : 'text-rose-200',
    watermark: isWhiteWine ? 'text-amber-900' : 'text-rose-900',
    iconColor: isWhiteWine ? 'text-amber-800' : 'text-rose-800',
  };

  return (
    <div className={`min-h-screen ${themeTheme.bgApp} font-sans text-stone-800 ${themeTheme.selection}`}>
      <header
        className="relative h-[60vh] min-h-[400px] bg-cover bg-center bg-fixed shadow-inner"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2000')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end text-center pb-20 px-4">
          <div className="max-w-3xl translate-y-8 animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl text-amber-50 font-black tracking-tight drop-shadow-2xl mb-4"
              style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
            >
              {lote.nome_lote}
            </h1>
            <div className="inline-flex items-center px-5 py-2 rounded-full border border-amber-200/30 bg-rose-950/40 backdrop-blur-md shadow-xl">
              <span className={`text-sm tracking-widest ${themeTheme.badgeText} font-medium uppercase font-sans`}>Lote: <span className="text-white ml-1">{String(lote.id).split('-')[0]}</span></span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-stone-100 ${themeTheme.backBtn} backdrop-blur-md rounded-full px-5 py-2.5 transition-all duration-300 border shadow-lg text-sm font-medium tracking-wide group`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Voltar à Adega
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 -mt-12 relative z-10 pb-20">
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(159,18,57,0.15)] p-8 md:p-14 space-y-16 border border-stone-100 relative overflow-hidden">
          {/* Subtle watermark or texture */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <svg className={`w-64 h-64 ${themeTheme.watermark}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5h4v1h-4zm0-3h4v1h-4zm0-3h4v1h-4z" />
            </svg>
          </div>

          <section className="animate-in slide-in-from-bottom-5 fade-in duration-700 delay-100 fill-mode-both relative z-10">
            <h2
              className={`text-4xl ${themeTheme.sectionTitle} border-b pb-4 mb-8 text-center`}
              style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
            >
              A Origem
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className={`p-5 rounded-2xl bg-stone-50/80 ${themeTheme.cardHover} transition-colors border border-stone-100 group`}>
                <strong className={`block ${themeTheme.cardLabel} text-xs font-bold uppercase tracking-widest mb-2 transition-colors`}>Cepa</strong>
                <span className="text-stone-900 font-medium text-lg lg:text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>{lote.variedade_uva}</span>
              </div>
              <div className={`p-5 rounded-2xl bg-stone-50/80 ${themeTheme.cardHover} transition-colors border border-stone-100 group`}>
                <strong className={`block ${themeTheme.cardLabel} text-xs font-bold uppercase tracking-widest mb-2 transition-colors`}>Safra</strong>
                <span className="text-stone-900 font-medium text-lg lg:text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>{lote.data_colheita ? new Date(lote.data_colheita).getFullYear() : 'N/A'}</span>
              </div>
              <div className={`p-5 rounded-2xl bg-stone-50/80 ${themeTheme.cardHover} transition-colors border border-stone-100 group`}>
                <strong className={`block ${themeTheme.cardLabel} text-xs font-bold uppercase tracking-widest mb-2 transition-colors`}>Envase</strong>
                <span className="text-stone-900 font-medium text-lg lg:text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>{lote.data_engarrafamento ? new Date(lote.data_engarrafamento).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className={`p-5 rounded-2xl bg-stone-50/80 ${themeTheme.cardHover} transition-colors border border-stone-100 group`}>
                <strong className={`block ${themeTheme.cardLabel} text-xs font-bold uppercase tracking-widest mb-2 transition-colors`}>Terroir</strong>
                <span className="text-stone-900 font-medium text-lg lg:text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>Vale Selecionado</span>
              </div>
            </div>
          </section>

          <section className="animate-in slide-in-from-bottom-5 fade-in duration-700 delay-150 fill-mode-both relative z-10 mt-12 mb-8 border-y border-stone-100 py-10">
            <h3 className={`text-3xl ${isWhiteWine ? 'text-amber-950' : 'text-rose-950'} mb-10 text-center`} style={{ fontFamily: '"Playfair Display", serif' }}>Jornada de Envelhecimento</h3>
            <div className="flex items-center justify-center max-w-lg mx-auto px-4">
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full ${isWhiteWine ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-rose-50 text-rose-800 border-rose-100'} flex items-center justify-center shadow-sm border`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                </div>
                <span className="text-xs font-bold mt-4 text-stone-700 uppercase tracking-widest">Colheita</span>
                <span className="text-sm text-stone-500 mt-1 font-serif italic">{lote.data_colheita ? new Date(lote.data_colheita).toLocaleDateString() : 'N/A'}</span>
              </div>

              <div className="flex-1 h-px relative mx-4">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-200 via-stone-300 to-amber-200"></div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 shadow-sm border border-amber-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                </div>
                <span className="text-xs font-bold mt-4 text-stone-700 uppercase tracking-widest">Envase</span>
                <span className="text-sm text-stone-500 mt-1 font-serif italic">{lote.data_engarrafamento ? new Date(lote.data_engarrafamento).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </section>

          <section className="animate-in slide-in-from-bottom-5 fade-in duration-700 delay-200 fill-mode-both max-w-2xl mx-auto text-center relative z-10">
            <svg className={`w-10 h-10 mx-auto ${themeTheme.iconColor} opacity-60 mb-6 drop-shadow-sm`} fill="currentColor" viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
            <h2
              className={`text-3xl ${isWhiteWine ? 'text-amber-950' : 'text-rose-950'} pb-4 mb-2`}
              style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
            >
              Processo de Criação
            </h2>
            <p className="text-lg leading-relaxed text-stone-600 italic font-serif">"{lote.informacoes_adicionais}"</p>
          </section>

          <section className="animate-in slide-in-from-bottom-5 fade-in duration-700 delay-250 fill-mode-both grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-4">
            <div className="bg-stone-50/50 border border-stone-100 p-8 rounded-3xl shadow-sm text-center transform transition-transform hover:-translate-y-1">
              <div className={`${themeTheme.iconColor} mb-4 flex justify-center`}><svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              <h4 className="font-bold text-stone-800 uppercase tracking-widest text-xs mb-3">Temperatura</h4>
              <p className="text-stone-600 text-sm font-medium">{lote.temperatura_servico_recomendada || "Consultar sommelier"}</p>
            </div>
            <div className="bg-stone-50/50 border border-stone-100 p-8 rounded-3xl shadow-sm text-center transform transition-transform hover:-translate-y-1">
              <div className={`${themeTheme.iconColor} mb-4 flex justify-center`}><svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <h4 className="font-bold text-stone-800 uppercase tracking-widest text-xs mb-3">Guarda</h4>
              <p className="text-stone-600 text-sm font-medium">{lote.dicas_armazenamento || "Pronto para consumo"}</p>
            </div>
            <div className="bg-stone-50/50 border border-stone-100 p-8 rounded-3xl shadow-sm text-center transform transition-transform hover:-translate-y-1">
              <div className={`${themeTheme.iconColor} mb-4 flex justify-center`}><svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg></div>
              <h4 className="font-bold text-stone-800 uppercase tracking-widest text-xs mb-3">Harmonização</h4>
              <p className="text-stone-600 text-sm font-medium">{lote.sugestoes_harmonizacao || "Carnes e massas ricas"}</p>
            </div>
          </section>

          <section className={`animate-in slide-in-from-bottom-5 fade-in duration-700 delay-300 fill-mode-both bg-gradient-to-br ${themeTheme.bgGradient} rounded-3xl p-8 md:p-12 border relative z-10 shadow-inner`}>
            <h2
              className={`text-3xl ${isWhiteWine ? 'text-amber-950' : 'text-rose-950'} mb-8 text-center`}
              style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
            >
              Notas de Degustação
            </h2>
            <div className="flex gap-4 items-start max-w-2xl mx-auto">
              <span className={`text-6xl ${themeTheme.quoteColor} font-serif leading-none mt-2`}>"</span>
              <p className="text-lg leading-relaxed text-stone-700 pt-3">{lote.notas_degustacao}</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="text-center py-12 text-stone-400 bg-white border-t border-stone-200 mt-20">
        <div className="w-12 h-px bg-rose-200 mx-auto mb-6"></div>
        <p className="text-sm tracking-widest uppercase font-semibold text-rose-900/60">Aprecie com moderação</p>
        <p className="font-bold mt-2 text-stone-800" style={{ fontFamily: '"Playfair Display", serif' }}>&copy; 2026 ADEGA PREMIUM</p>
      </footer>
    </div>
  );
};

export default ClientView;
