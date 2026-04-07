import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Wine, 
  Edit, 
  Trash2, 
  QrCode, 
  Eye, 
  X,
  Plus,
  AlertTriangle,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  History
} from "lucide-react";

const QRCodeModal = ({ url, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass rounded-3xl shadow-2xl p-10 text-center max-w-sm w-full mx-4 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold text-stone-900">
            Ficha Digital
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-inner mb-6 flex justify-center">
          <img
            src={qrApiUrl}
            alt="QR Code do Lote"
            className="rounded-lg h-48 w-48"
          />
        </div>
        
        <p className="text-stone-500 mb-8 text-sm leading-relaxed">
          Este código direciona o cliente para a experiência sensorial completa do vinho.
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-4 bg-[#4A0E0E] text-[#F7E7CE] rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#6B1A1A] transition-all shadow-lg"
        >
          Concluído
        </button>
      </motion.div>
    </motion.div>
  );
};

const AdminPanel = ({
  lotes,
  onAddLote,
  onUpdateLote,
  onDeleteLote,
  onLogout,
  isLoading,
  error,
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLote, setEditingLote] = useState(null);
  const [formData, setFormData] = useState({
    nome_lote: "",
    variedade_uva: "",
    data_colheita: "",
    data_engarrafamento: "",
    informacoes_adicionais: "",
    notas_degustacao: "",
    quantidade_produzida_inicial: "",
    quantidade_em_estoque: "",
    nivel_alerta_estoque: "10",
    sugestoes_harmonizacao: "",
    temperatura_servico_recomendada: "",
    dicas_armazenamento: "",
  });
  const [isQrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const openAddForm = () => {
    setEditingLote(null);
    setFormData({
      nome_lote: "",
      variedade_uva: "",
      data_colheita: "",
      data_engarrafamento: "",
      informacoes_adicionais: "",
      notas_degustacao: "",
      quantidade_produzida_inicial: "",
      quantidade_em_estoque: "",
      nivel_alerta_estoque: "10",
      sugestoes_harmonizacao: "",
      temperatura_servico_recomendada: "",
      dicas_armazenamento: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (lote) => {
    setEditingLote(lote);
    const formatDate = (dateString) =>
      dateString ? new Date(dateString).toISOString().split("T")[0] : "";
    setFormData({
      ...lote,
      data_colheita: formatDate(lote.data_colheita),
      data_engarrafamento: formatDate(lote.data_engarrafamento),
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingLote(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingLote) {
      onUpdateLote(editingLote.id, formData);
    } else {
      onAddLote(formData);
    }
    closeForm();
  };

  const handleGenerateQrCode = (lote) => {
    const url = `${window.location.origin}/vinho/${lote.id}`;
    setQrCodeUrl(url);
    setQrModalOpen(true);
  };

  const [movData, setMovData] = useState({ tipo: 'ENTRADA', quantidade: '', motivo: '' });

  const handleStockAction = async () => {
    if (!editingLote || !movData.quantidade) return;
    const qtdNum = parseInt(movData.quantidade);
    const newQtd = movData.tipo === 'ENTRADA' ? 
      editingLote.quantidade_em_estoque + qtdNum : 
      Math.max(0, editingLote.quantidade_em_estoque - qtdNum);
    
    const token = localStorage.getItem("vinicola_token");
    const headers = { "Content-Type": "application/json", ...(token ? {Authorization: `Token ${token}`} : {}) };

    try {
      await fetch("/api/movimentacoes/", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          lote_vinho: editingLote.id, 
          tipo: movData.tipo, 
          quantidade: qtdNum, 
          motivo: movData.motivo 
        })
      });

      onUpdateLote(editingLote.id, { ...editingLote, quantidade_em_estoque: newQtd });
      
      const newMov = { 
        id: Math.random().toString(), 
        tipo: movData.tipo, 
        quantidade: qtdNum, 
        motivo: movData.motivo, 
        data_movimentacao: new Date().toISOString() 
      };

      setEditingLote(prev => ({ 
        ...prev, 
        quantidade_em_estoque: newQtd,
        movimentacoes: [newMov, ...(prev.movimentacoes || [])]
      }));
      setFormData(prev => ({ ...prev, quantidade_em_estoque: newQtd }));
      setMovData({ tipo: 'ENTRADA', quantidade: '', motivo: '' });
    } catch (err) {
      alert("Falha ao registrar movimentação.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Check if lotes is available, otherwise default to empty array
  const safeLotes = Array.isArray(lotes) ? lotes : [];

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans text-stone-900 overflow-hidden">
      <AnimatePresence>
        {isQrModalOpen && (
          <QRCodeModal url={qrCodeUrl} onClose={() => setQrModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[60] sm:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-[70] transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0 sm:flex w-72 bg-[#1A1A1A] text-stone-300 flex-col transition-transform duration-500 ease-in-out shadow-2xl`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A0E0E]/40 to-stone-950/90 pointer-events-none"></div>
        
        <div className="h-24 flex items-center px-8 border-b border-white/5 relative z-10">
          <div className="p-2 bg-[#4A0E0E]/50 rounded-lg mr-3 border border-white/10">
            <Wine className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h1 className="text-xl font-serif font-black tracking-widest text-white">ADEGA</h1>
        </div>

        <nav className="flex-1 px-4 py-10 space-y-2 relative z-10">
          <motion.button
            whileHover={{ x: 5 }}
            className="w-full flex items-center space-x-3 px-6 py-4 rounded-xl bg-white/5 text-[#F7E7CE] font-medium border border-white/5 shadow-inner"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </motion.button>
          
          <motion.button
            whileHover={{ x: 5 }}
            onClick={openAddForm}
            className="w-full flex items-center space-x-3 px-6 py-4 rounded-xl text-stone-400 hover:text-white transition-colors group"
          >
            <PlusCircle className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span>Novo Lote</span>
          </motion.button>
        </nav>

        <div className="p-6 relative z-10 border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-[#4A0E0E]/20 text-[#E9D5DA] hover:bg-[#4A0E0E]/40 transition-all border border-[#4A0E0E]/30"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">Sair</span>
          </motion.button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto w-full relative pt-16 sm:pt-0">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-[#E9D5DA]/30 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto p-6 sm:p-10 lg:p-12 relative z-10">
          <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="sm:hidden p-3 text-stone-600 bg-white rounded-xl shadow-sm border border-stone-200"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </button>
                <h2 className="text-4xl font-serif font-black text-stone-900 tracking-tight">
                  Lotes de Produção
                </h2>
              </div>
              <p className="text-stone-500 mt-3 font-light text-lg">Monitoramento e rastreabilidade em tempo real.</p>
            </div>

            <motion.button
              whileHover={{ y: -2, shadow: "0 10px 25px -5px rgba(74, 14, 14, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddForm}
              className="flex items-center justify-center space-x-3 bg-[#4A0E0E] text-[#F7E7CE] px-8 py-4 rounded-2xl shadow-xl transition-all border border-[#6B1A1A] font-bold tracking-widest uppercase text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Gerar Novo Lote</span>
            </motion.button>
          </header>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-sm"
              >
                <div className="w-16 h-16 border-4 border-[#E9D5DA] border-t-[#4A0E0E] rounded-full animate-spin mb-6"></div>
                <p className="text-stone-500 font-medium tracking-widest uppercase text-xs">Sincronizando Adega...</p>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden relative"
              >
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100">
                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Vinho / Lote</th>
                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] hidden md:table-cell">Safra</th>
                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Disponibilidade</th>
                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {safeLotes.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-10 text-stone-500 italic">
                            Nenhum lote registrado. Clique em "Gerar Novo Lote" para começar.
                          </td>
                        </tr>
                      ) : safeLotes.map((lote) => (
                        <motion.tr 
                          key={lote.id} 
                          variants={itemVariants}
                          className="hover:bg-[#E9D5DA]/10 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mr-4 group-hover:bg-white transition-colors border border-stone-200">
                                <Wine className="w-5 h-5 text-[#6B1A1A]" />
                              </div>
                              <div>
                                <div className="font-serif font-black text-stone-900 text-lg leading-tight uppercase tracking-tight">{lote.nome_lote}</div>
                                <div className="text-[10px] font-mono text-stone-400 mt-1">REF: {String(lote.id).split('-')[0]}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 hidden md:table-cell">
                            <div className="text-sm font-medium text-stone-600">
                              {lote.data_colheita ? new Date(lote.data_colheita).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' }) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {lote.quantidade_em_estoque <= (lote.nivel_alerta_estoque || 0) ? (
                              <div className="flex items-center space-x-2 text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm font-black uppercase tracking-widest">{lote.quantidade_em_estoque} UN.</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                                {lote.quantidade_em_estoque} em estoque
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end space-x-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => navigate(`/vinho/${lote.id}`)}
                                title="Visualizar como cliente"
                                className="p-2.5 text-stone-400 hover:text-[#4A0E0E] hover:bg-[#E9D5DA]/30 rounded-xl transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleGenerateQrCode(lote)}
                                title="QR Code"
                                className="p-2.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditForm(lote)}
                                title="Editar"
                                className="p-2.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteLote(lote.id)}
                                title="Excluir"
                                className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" 
              onClick={closeForm}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[2rem] shadow-2xl p-8 sm:p-12 w-full max-w-3xl relative z-10 border border-white overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-4xl font-serif font-black text-stone-900 tracking-tight">
                    {editingLote ? "Refinar Lote" : "Criar Lote"}
                  </h3>
                  <p className="text-stone-500 mt-3 font-light text-lg">
                    Preencha os detalhes técnicos para a ficha de rastreabilidade.
                  </p>
                </div>
                <button
                  onClick={closeForm}
                  className="p-3 text-stone-400 hover:text-[#4A0E0E] bg-stone-50 hover:bg-stone-100 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nome do Vinho</label>
                    <input
                      name="nome_lote"
                      value={formData.nome_lote}
                      onChange={handleFormChange}
                      placeholder="Ex: Reserva Cabernet"
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4A0E0E]/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Variedade da Uva</label>
                    <input
                      name="variedade_uva"
                      value={formData.variedade_uva}
                      onChange={handleFormChange}
                      placeholder="Ex: 100% Merlot"
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4A0E0E]/20 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Safra / Colheita</label>
                    <input
                      name="data_colheita"
                      value={formData.data_colheita}
                      onChange={handleFormChange}
                      type="date"
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4A0E0E]/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Engarrafamento</label>
                    <input
                      name="data_engarrafamento"
                      value={formData.data_engarrafamento}
                      onChange={handleFormChange}
                      type="date"
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#4A0E0E]/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Qtd Inicial</label>
                      <input name="quantidade_produzida_inicial" type="number" value={formData.quantidade_produzida_inicial} onChange={handleFormChange} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Qtd em Estoque</label>
                      <input name="quantidade_em_estoque" type="number" value={formData.quantidade_em_estoque} onChange={handleFormChange} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nível Alerta</label>
                      <input name="nivel_alerta_estoque" type="number" value={formData.nivel_alerta_estoque} onChange={handleFormChange} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-6 border-t border-stone-100">
                    <h4 className="text-[10px] font-black text-[#4A0E0E] uppercase tracking-[0.3em] mb-6">Guia do Sommelier</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input name="temperatura_servico_recomendada" value={formData.temperatura_servico_recomendada} onChange={handleFormChange} placeholder="Temp. Ideal (Ex: 16-18°C)" className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" />
                      <input name="sugestoes_harmonizacao" value={formData.sugestoes_harmonizacao} onChange={handleFormChange} placeholder="Harmonização (Ex: Carnes)" className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none" />
                    </div>
                  </div>

                  {editingLote && (
                    <div className="md:col-span-2 pt-6 border-t border-stone-100 bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-stone-600 uppercase tracking-[0.3em] mb-6">
                        <History className="w-4 h-4" /> Gestão de Estoque Rápida
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <select 
                          value={movData.tipo} 
                          onChange={(e) => setMovData({...movData, tipo: e.target.value})}
                          className="px-5 py-4 bg-white border border-stone-200 rounded-2xl outline-none font-bold text-xs"
                        >
                          <option value="ENTRADA">Entrada</option>
                          <option value="SAIDA">Saída</option>
                        </select>
                        <input 
                          type="number" 
                          placeholder="Qtd" 
                          value={movData.quantidade} 
                          onChange={(e) => setMovData({...movData, quantidade: e.target.value})}
                          className="w-24 px-5 py-4 bg-white border border-stone-200 rounded-2xl outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Motivo (Opcional)" 
                          value={movData.motivo} 
                          onChange={(e) => setMovData({...movData, motivo: e.target.value})}
                          className="flex-1 px-5 py-4 bg-white border border-stone-200 rounded-2xl outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={handleStockAction}
                          className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-2 text-white shadow-md transition-colors text-xs tracking-wider ${movData.tipo === 'ENTRADA' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {movData.tipo === 'ENTRADA' ? <ArrowUpCircle className="w-4 h-4"/> : <ArrowDownCircle className="w-4 h-4"/>}
                          Lançar
                        </button>
                      </div>

                      {editingLote.movimentacoes && editingLote.movimentacoes.length > 0 && (
                        <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                          {editingLote.movimentacoes.map(mov => (
                            <div key={mov.id} className="flex justify-between items-center text-sm p-3 bg-white border border-stone-200 rounded-xl">
                              <div className="flex items-center gap-3">
                                {mov.tipo === 'ENTRADA' ? <ArrowUpCircle className="w-4 h-4 text-emerald-500" /> : <ArrowDownCircle className="w-4 h-4 text-red-500" />}
                                <div>
                                  <span className="font-bold">{mov.quantidade} garrafas</span>
                                  <span className="text-stone-500 ml-2">{mov.motivo}</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Notas de Degustação</label>
                    <textarea
                      name="notas_degustacao"
                      value={formData.notas_degustacao}
                      onChange={handleFormChange}
                      placeholder="Descreva o aroma, corpo e final..."
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none min-h-[120px]"
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-8 py-4 font-bold text-stone-500 hover:text-stone-800 transition-colors order-2 sm:order-1"
                  >
                    Descartar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-10 py-4 font-bold text-[#F7E7CE] bg-[#4A0E0E] rounded-2xl shadow-xl hover:shadow-2xl transition-all order-1 sm:order-2 tracking-widest uppercase text-xs"
                  >
                    {editingLote ? "Salvar Alterações" : "Gerar Lote de Vinho"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
