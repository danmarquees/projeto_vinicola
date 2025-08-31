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
          className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
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
    nome_vinho: "",
    tipo_uva: "",
    data_safra: "",
    data_envase: "",
    descricao: "",
    notas_degustacao: "",
  });
  const [isQrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const openAddForm = () => {
    setEditingLote(null);
    setFormData({
      nome_vinho: "",
      tipo_uva: "",
      data_safra: "",
      data_envase: "",
      descricao: "",
      notas_degustacao: "",
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
      data_safra: formatDate(lote.data_safra),
      data_envase: formatDate(lote.data_envase),
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
      onAddLote({
        ...formData,
        codigo_lote: `LOTE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      });
    }
    closeForm();
  };

  const handleGenerateQrCode = (lote) => {
    const url = `${window.location.origin}/vinho/${lote.id}`;
    setQrCodeUrl(url);
    setQrModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {isQrModalOpen && (
        <QRCodeModal url={qrCodeUrl} onClose={() => setQrModalOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-col hidden sm:flex">
        <div className="h-20 flex items-center justify-center bg-gray-900">
          <h1 className="text-2xl font-bold tracking-wider">ADEGA</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </a>
          <button
            onClick={openAddForm}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <AddIcon />
            <span>Adicionar Lote</span>
          </button>
        </nav>
        <div className="px-4 py-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <LogoutIcon />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Lotes de Vinho
          </h2>
          <button
            onClick={openAddForm}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition transform hover:scale-105"
          >
            <AddIcon />
            <span>Novo Lote</span>
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
          <div className="text-center py-10">
            <p className="text-gray-500">Carregando lotes...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Vinho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Lote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Safra
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lotes.map((lote) => (
                  <tr key={lote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lote.nome_vinho}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {lote.codigo_lote}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {new Date(lote.data_safra).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                      <button
                        onClick={() => openEditForm(lote)}
                        className="text-blue-600 hover:text-blue-900 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteLote(lote.id)}
                        className="text-red-600 hover:text-red-900 transition"
                      >
                        Excluir
                      </button>
                      <button
                        onClick={() => handleGenerateQrCode(lote)}
                        className="text-purple-600 hover:text-purple-900 transition"
                      >
                        QR
                      </button>
                      <button
                        onClick={() => onViewLote(lote)}
                        className="text-indigo-600 hover:text-indigo-900 transition"
                      >
                        Ver
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl transform transition-all m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingLote ? "Editar Lote" : "Adicionar Novo Lote"}
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="nome_vinho"
                  value={formData.nome_vinho}
                  onChange={handleFormChange}
                  placeholder="Nome do Vinho"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  name="tipo_uva"
                  value={formData.tipo_uva}
                  onChange={handleFormChange}
                  placeholder="Tipo de Uva"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <div>
                  <label className="text-sm text-gray-500">Data da Safra</label>
                  <input
                    name="data_safra"
                    value={formData.data_safra}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Data de Envase
                  </label>
                  <input
                    name="data_envase"
                    value={formData.data_envase}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleFormChange}
                  placeholder="Descrição do Processo"
                  className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                ></textarea>
                <textarea
                  name="notas_degustacao"
                  value={formData.notas_degustacao}
                  onChange={handleFormChange}
                  placeholder="Notas de Degustação"
                  className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                ></textarea>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Salvar
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
