import React from "react";

const ClientView = ({ lote, onClose }) => {
  // Adiciona uma verificação para garantir que 'lote' não é nulo antes de renderizar
  if (!lote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-xl text-stone-500">
          Carregando detalhes do vinho...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-serif text-stone-800">
      <header
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552089123-2d26226fc2b7?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
          <h1
            className="text-5xl md:text-7xl text-white font-extrabold tracking-tight"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {lote.nome_vinho}
          </h1>
          <p className="text-xl text-stone-200 mt-2">
            Lote: {lote.codigo_lote}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition"
        >
          &larr; Voltar ao Painel
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-8 md:p-12 -mt-20">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 space-y-10">
          <section>
            <h2
              className="text-3xl font-bold text-stone-900 border-b-2 border-amber-800 pb-2 mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              A Origem
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <strong className="block text-amber-900">Uva</strong>
                <span>{lote.tipo_uva}</span>
              </div>
              <div>
                <strong className="block text-amber-900">Safra</strong>
                <span>{new Date(lote.data_safra).getFullYear()}</span>
              </div>
              <div>
                <strong className="block text-amber-900">Envase</strong>
                <span>{new Date(lote.data_envase).toLocaleDateString()}</span>
              </div>
              <div>
                <strong className="block text-amber-900">Região</strong>
                <span>Vale dos Vinhedos</span>
              </div>
            </div>
          </section>
          <section>
            <h2
              className="text-3xl font-bold text-stone-900 border-b-2 border-amber-800 pb-2 mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Processo de Criação
            </h2>
            <p className="text-lg leading-relaxed">{lote.descricao}</p>
          </section>
          <section>
            <h2
              className="text-3xl font-bold text-stone-900 border-b-2 border-amber-800 pb-2 mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Notas de Degustação
            </h2>
            <p className="text-lg leading-relaxed">{lote.notas_degustacao}</p>
          </section>
        </div>
      </main>
      <footer className="text-center py-8 text-stone-500">
        <p>Aprecie com moderação.</p>
        <p className="font-bold mt-1">Sua Vinícola &copy; 2025</p>
      </footer>
    </div>
  );
};

export default ClientView;
