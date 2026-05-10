import React, { useState } from 'react'

const LiveStream = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { user: 'Roseta', text: 'Só quem viveu isso vai saber como é sentir essa energia 🔥🔥🔥', color: '#FF6B6B' },
    { user: 'Verdinho420', text: 'pog champ ❤️❤️❤️', color: '#51CF66' },
    { user: 'Azulado', text: 'aaaaaaaaaaaaaaaaaaa', color: '#339AF0' },
    { user: 'Laranjinha', text: 'VO CHORA 😂😂😂😂', color: '#FF922B' },
    { user: 'Big_RED', text: 'Mds n acredito 🤯🤯🤯', color: '#FF6B6B' },
  ])

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages([...messages, { user: 'Você', text: message, color: '#FFD700' }])
    setMessage('')
  }

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

      <div className="flex gap-4 p-6">

        {/* Coluna esquerda - Player + Atalhos */}
        <div className="flex flex-col gap-4 w-1/3">
          
          {/* Player */}
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="w-full h-48 bg-[#2A2A2A] rounded-lg flex flex-col items-center justify-center text-[#A0A0A0] mb-4">
              <span className="text-4xl mb-2">📷</span>
              <span className="text-sm">There is no connected camera.</span>
            </div>
            <div className="flex items-center gap-3 text-[#A0A0A0]">
              <button>▶</button>
              <button>⏭</button>
              <div className="flex-1 h-1 bg-[#2A2A2A] rounded-full" />
              <button>🔊</button>
              <button>⛶</button>
            </div>
          </div>

          {/* Atalhos rápidos */}
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <h3 className="font-bold mb-3">Atalhos rápidos</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '✏️', label: 'Editar' },
                { icon: '❤️', label: 'Favoritar' },
                { icon: '⭐', label: 'Destacar' },
                { icon: '😎', label: 'Mood' },
                { icon: '⏱️', label: 'Timer' },
                { icon: '➕', label: 'Adicionar' },
              ].map((item, i) => (
                <button
                  key={i}
                  className="bg-[#2A2A1A] border border-[#FFD700] text-[#FFD700] py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#FFD700] hover:text-black transition-all"
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Botão iniciar live */}
          <button className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-full text-lg hover:opacity-90 transition-all">
            ▶ Iniciar live
          </button>
        </div>

        {/* Coluna central - Chat */}
        <div className="flex flex-col w-1/3 bg-[#1A1A1A] rounded-xl p-4">
          <h3 className="font-bold text-center mb-4 border-b border-[#2A2A2A] pb-2">Chat</h3>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 max-h-96">
            {messages.map((msg, i) => (
              <div key={i} className="text-sm">
                <span style={{ color: msg.color }} className="font-bold">{msg.user}: </span>
                <span className="text-[#E0E0E0]">{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-[#2A2A2A] pt-3">
            <span className="text-[#FFD700] font-bold">#</span>
            <input
              type="text"
              placeholder="Envie uma mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#A0A0A0]"
            />
            <span className="text-[#A0A0A0]">300</span>
            <button
              onClick={sendMessage}
              className="bg-[#FFD700] text-black font-bold px-4 py-1 rounded-full text-sm"
            >
              Chat
            </button>
          </div>
        </div>

        {/* Coluna direita - Donates + Activities */}
        <div className="flex flex-col gap-4 w-1/3">
          
          {/* Donates */}
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Donates</h3>
              <button className="text-[#A0A0A0]">⚙️</button>
            </div>
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A2A] text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#FFD700]">💰</span>
                  <div>
                    <p className="font-bold">R$10,00</p>
                    <p className="text-[#A0A0A0] text-xs">joso_design</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs border border-[#A0A0A0] px-2 py-0.5 rounded text-[#A0A0A0]">see donate</button>
                  <span className="text-[#A0A0A0] text-xs">47 min atrás</span>
                </div>
              </div>
            ))}
          </div>

          {/* Activities feed */}
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Activities feed</h3>
              <button className="text-[#A0A0A0]">⚙️</button>
            </div>
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-[#2A2A2A] text-sm">
                <span className="text-[#FFD700]">⭐</span>
                <div>
                  <span className="font-bold">joso_design </span>
                  <span className="text-[#A0A0A0]">se tornou inscrito no canal!</span>
                </div>
                <span className="text-[#A0A0A0] text-xs ml-auto">47 min atrás</span>
              </div>
            ))}
          </div>

          {/* Ad Management */}
          <div className="bg-[#1A1A1A] rounded-xl p-4 flex justify-between items-center">
            <div className="flex justify-between items-center w-full mb-0">
              <h3 className="font-bold">Ad Management</h3>
              <button className="text-[#A0A0A0]">⚙️</button>
            </div>
            <button className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-full text-sm whitespace-nowrap ml-4">
              Run Ad (0:30)
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LiveStream