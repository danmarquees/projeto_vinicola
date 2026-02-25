import React, { useState, useEffect, useRef } from "react";

// O componente QRCodeModal foi modificado para usar uma API online, resolvendo o erro de dependência.
const QRCodeModal = ({ url, onClose }) => {
  // Efeito para fechar com a tecla 'Escape'
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // A URL da API para gerar o QR Code
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose} // Fecha ao clicar no fundo
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-8 text-center transform transition-all scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          QR Code do Lote
        </h3>
        <img
          src={qrApiUrl}
          alt="QR Code do Lote"
          width="256"
          height="256"
          className="rounded-lg mx-auto"
        />
        <p className="text-gray-500 mt-4 text-sm">
          Aponte a câmera para escanear.
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-rose-800 text-white rounded-lg hover:bg-rose-900 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

// Ícones SVG como componentes
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);
const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const WineIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M5.5 4a1.5 1.5 0 013 0v1.258A6.002 6.002 0 0110 5a6 6 0 011.5 9.742V16.5a1.5 1.5 0 01-3 0v-1.758A6.002 6.002 0 0110 15a6 6 0 01-1.5-9.742V4zM10 7a4 4 0 100 8 4 4 0 000-8z" />
    <path d="M2 10.5a1.5 1.5 0 013 0v2.5a1.5 1.5 0 01-3 0v-2.5zM15 10.5a1.5 1.5 0 013 0v2.5a1.5 1.5 0 01-3 0v-2.5z" />
  </svg>
);

const AdminPanel = ({
  lotes,
  onAddLote,
  onUpdateLote,
  onDeleteLote,
  onViewLote,
  onLogout,
  isLoading,
  error,
}) => {
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
    // Formata as datas para o formato YYYY-MM-DD que o input[type=date] espera
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

  return (
    <div className="min-h-screen flex bg-[#fbfaf9] font-sans text-stone-800 selection:bg-rose-200">
      {isQrModalOpen && (
        <QRCodeModal url={qrCodeUrl} onClose={() => setQrModalOpen(false)} />
      )}

      {/* Sidebar - Premium Dark Mode */}
      <aside className="w-72 bg-stone-950 text-stone-300 flex-col hidden sm:flex shadow-2xl z-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 to-black/80 pointer-events-none"></div>
        <div className="h-24 flex items-center justify-center bg-black/60 border-b border-rose-950/50 relative z-10">
          <WineIcon className="w-8 h-8 text-rose-500 mr-3" />
          <h1 className="text-2xl font-black tracking-widest text-white bg-clip-text bg-gradient-to-r from-amber-100 to-rose-200" style={{ fontFamily: '"Playfair Display", serif' }}>ADEGA</h1>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-3 relative z-10">
          <a
            href="#"
            className="flex items-center space-x-3 px-5 py-3.5 rounded-xl bg-rose-900/30 text-rose-200 font-medium shadow-sm border border-rose-800/30 transition-all duration-300"
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </a>
          <button
            onClick={openAddForm}
            className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl text-stone-400 hover:bg-white/5 hover:text-white transition-all duration-300 group"
          >
            <span className="group-hover:text-amber-500 transition-colors"><AddIcon /></span>
            <span>Adicionar Lote</span>
          </button>
        </nav>
        <div className="px-4 py-6 relative z-10 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-3 px-5 py-3 rounded-xl text-stone-400 hover:bg-rose-950/50 hover:text-rose-400 transition-all duration-300"
          >
            <LogoutIcon />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto w-full relative">
        {/* Subtle background graphic */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/40 rounded-full blur-[120px] pointer-events-none -mr-20 -mt-20"></div>

        <header className="flex justify-between items-end mb-10 relative z-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
              Lotes de Vinho
            </h2>
            <p className="text-stone-500 mt-2 font-light">Gerencie sua produção e rastreabilidade.</p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-900 to-red-950 text-amber-50 px-6 py-3 rounded-xl shadow-[0_8px_16px_rgba(159,18,57,0.25)] hover:shadow-[0_12px_24px_rgba(159,18,57,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 border border-rose-800/30"
          >
            <AddIcon />
            <span className="font-semibold tracking-wide">Novo Lote</span>
          </button>
        </header>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100 relative z-10">
            <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-800 rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 font-medium">Sincronizando lotes...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 overflow-hidden relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-100">
                  <th className="px-8 py-5 text-xs font-bold text-stone-500 uppercase tracking-widest">
                    Nome do Vinho
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-stone-500 uppercase tracking-widest hidden md:table-cell">
                    Lote ID
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-stone-500 uppercase tracking-widest hidden lg:table-cell">
                    Data da Safra
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-stone-500 uppercase tracking-widest">
                    Estoque
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-stone-500 uppercase tracking-widest text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {lotes.map((lote) => (
                  <tr key={lote.id} className="hover:bg-rose-50/30 transition-colors duration-200">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="font-bold text-stone-900 text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{lote.nome_lote}</div>
                      <div className="text-xs text-stone-500 md:hidden mt-1">{String(lote.id).split('-')[0]}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-stone-600 font-mono bg-stone-50/50 hidden md:table-cell">
                      {String(lote.id).split('-')[0]}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-stone-600 hidden lg:table-cell">
                      {new Date(lote.data_colheita).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {lote.quantidade_em_estoque <= lote.nivel_alerta_estoque ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                          Baixo: {lote.quantidade_em_estoque}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
                          {lote.quantidade_em_estoque} un.
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right space-x-3 text-sm">
                      <button
                        onClick={() => openEditForm(lote)}
                        className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium transition-colors"
                      >
                        <EditIcon /> Editar
                      </button>
                      <button
                        onClick={() => onDeleteLote(lote.id)}
                        className="inline-flex items-center text-red-700 hover:text-red-900 font-medium transition-colors"
                      >
                        <DeleteIcon /> Excluir
                      </button>
                      <button
                        onClick={() => handleGenerateQrCode(lote)}
                        className="text-stone-600 hover:text-stone-900 transition font-medium"
                      >
                        QR
                      </button>
                      <button
                        onClick={() => onViewLote(lote)}
                        className="text-rose-700 hover:text-rose-900 transition font-bold"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Formulário Modal para Adicionar/Editar Lote */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-2xl transform transition-all border border-stone-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {editingLote ? "Editar Detalhes do Lote" : "Registrar Novo Lote"}
                </h3>
                <p className="text-stone-500 mt-1 font-light">
                  {editingLote ? "Atualize as informações do lote selecionado." : "Preencha as informações para gerar a rastreabilidade num novo padrão."}
                </p>
              </div>
              <button
                onClick={closeForm}
                className="text-stone-400 hover:text-rose-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="nome_lote"
                  value={formData.nome_lote}
                  onChange={handleFormChange}
                  placeholder="Nome do Vinho"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 focus:border-rose-800 focus:outline-none transition-shadow"
                  required
                />
                <input
                  name="variedade_uva"
                  value={formData.variedade_uva}
                  onChange={handleFormChange}
                  placeholder="Tipo de Uva"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 focus:border-rose-800 focus:outline-none transition-shadow"
                  required
                />
                <div>
                  <label className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Data da Safra</label>
                  <input
                    name="data_colheita"
                    value={formData.data_colheita}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full px-4 py-3 mt-1 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 focus:border-rose-800 focus:outline-none transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                    Data de Envase
                  </label>
                  <input
                    name="data_engarrafamento"
                    value={formData.data_engarrafamento}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full px-4 py-3 mt-1 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 focus:border-rose-800 focus:outline-none transition-shadow"
                    required
                  />
                </div>

                {/* Novos Campos: Estoque */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Qtd Inicial</label>
                    <input name="quantidade_produzida_inicial" type="number" value={formData.quantidade_produzida_inicial} onChange={handleFormChange} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ex: 500" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Qtd Estoque</label>
                    <input name="quantidade_em_estoque" type="number" value={formData.quantidade_em_estoque} onChange={handleFormChange} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Atual" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Alerta Baixa</label>
                    <input name="nivel_alerta_estoque" type="number" value={formData.nivel_alerta_estoque} onChange={handleFormChange} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500/50 outline-none" placeholder="Ex: 10" />
                  </div>
                </div>

                {/* Novos Campos: Sommelier */}
                <div className="md:col-span-2 pt-4 border-t border-stone-100">
                  <h4 className="text-sm font-bold text-rose-900 uppercase tracking-widest mb-4">Guia do Sommelier</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="temperatura_servico_recomendada" value={formData.temperatura_servico_recomendada} onChange={handleFormChange} placeholder="Temperatura Ideal (Ex: 16-18°C)" className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 outline-none" />
                    <input name="sugestoes_harmonizacao" value={formData.sugestoes_harmonizacao} onChange={handleFormChange} placeholder="Harmonização (Ex: Carnes vermelhas, Queijos duros)" className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 outline-none" />
                    <input name="dicas_armazenamento" value={formData.dicas_armazenamento} onChange={handleFormChange} placeholder="Guarda (Ex: Ao abrigo da luz, deitado)" className="md:col-span-2 w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 outline-none" />
                  </div>
                </div>

                <textarea
                  name="informacoes_adicionais"
                  value={formData.informacoes_adicionais}
                  onChange={handleFormChange}
                  placeholder="Descrição do Processo"
                  className="md:col-span-2 w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 focus:border-rose-800 focus:outline-none transition-shadow"
                  rows="4"
                ></textarea>
                <textarea
                  name="notas_degustacao"
                  value={formData.notas_degustacao}
                  onChange={handleFormChange}
                  placeholder="Notas de Degustação"
                  className="md:col-span-2 w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-800/50 focus:border-rose-800 focus:outline-none transition-shadow"
                  rows="4"
                ></textarea>
              </div>
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2.5 font-semibold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 font-bold text-amber-50 bg-gradient-to-r from-rose-900 to-red-950 rounded-xl shadow-[0_4px_10px_rgba(159,18,57,0.3)] hover:shadow-[0_8px_15px_rgba(159,18,57,0.4)] transition-all"
                >
                  Salvar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
