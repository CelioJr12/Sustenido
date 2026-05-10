import React from 'react'

const ArtistProfile = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <h1 className="text-[#FFD700] font-bold text-2xl"># SUSTENIDO</h1>
        <input
          type="text"
          placeholder="Buscar"
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full w-64 outline-none"
        />
        <button className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-full">
          Obter pontos de fã
        </button>
      </header>

      {/* Perfil do Artista */}
      <div className="px-8 py-6">
        
        {/* Info do artista */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-[#2A2A2A] border-4 border-red-500 flex items-center justify-center text-2xl font-bold">
              V
            </div>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              Ao vivo
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Vorax</h2>
              <span className="text-[#FFD700]">✔</span>
            </div>
            <p className="text-[#A0A0A0]">28,2 mi de seguidores</p>
          </div>

          <div className="flex gap-3">
            <button className="bg-[#FFD700] text-black font-bold px-6 py-2 rounded-full">
              Inscrever-se
            </button>
            <button className="border border-red-500 text-red-500 px-6 py-2 rounded-full flex items-center gap-2">
              ♥ Quero ser Fã
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-8 border-b border-[#2A2A2A] mb-6">
          {['Início', 'Vídeos', 'Sobre', 'Discografia'].map((aba) => (
            <button
              key={aba}
              className="pb-2 text-[#A0A0A0] hover:text-white border-b-2 border-transparent hover:border-[#FFD700] transition-all"
            >
              {aba}
            </button>
          ))}
        </div>

        {/* Ao vivo */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Ao vivo</h3>
          <div className="flex gap-4 items-center bg-[#1A1A1A] p-4 rounded-xl w-fit">
            <div className="w-48 h-32 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-[#A0A0A0]">
              🎵 Rock In Rio
            </div>
            <div>
              <p className="font-bold text-lg">Primeira vez no Rock In Rio 2025</p>
              <p className="text-[#A0A0A0]">88 mil assistindo</p>
            </div>
          </div>
        </div>

        {/* Transmissões mais famosas */}
        <div>
          <h3 className="text-lg font-bold mb-4">Transmissões mais famosas</h3>
          <div className="flex gap-4">
            {['1:45:59', '2:11:02', '1:23:57', '2:47:35'].map((duracao, i) => (
              <div key={i} className="w-48 h-32 bg-[#2A2A2A] rounded-lg relative flex items-end p-2">
                <span className="bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {duracao}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ArtistProfile