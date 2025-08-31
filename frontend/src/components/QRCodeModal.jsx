import React, { useEffect } from "react";

const QRCodeModal = ({ url, onClose }) => {
  // Efeito para fechar com a tecla 'Escape'
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // A URL da API para gerar o QR Code, removendo a dependência da biblioteca 'qrcode'
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

export default QRCodeModal;
