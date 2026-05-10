import React, { useState, useEffect } from 'react'
import { getMessages, sendMessage, getDonations } from '../services/api'

const STREAM_ID = '00000000-0000-0000-0000-000000000001'
const USER_ID = '00000000-0000-0000-0000-000000000002'

const LiveStream = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])

  const colors = ['#FF6B6B', '#51CF66', '#339AF0', '#FF922B', '#FFD700', '#CC5DE8']
  const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

  useEffect(() => {
    fetchMessages()
    fetchDonations()
  }, [])

  const fetchMessages = async () => {
    const data = await getMessages(STREAM_ID)
    if (Array.isArray(data)) setMessages(data)
  }

  const fetchDonations = async () => {
    const data = await getDonations(STREAM_ID)
    if (Array.isArray(data)) setDonations(data)
  }

  const handleSend = async () => {
    if (!message.trim()) return
    await sendMessage(STREAM_ID, USER_ID, message)
    setMessage('')
    fetchMessages()
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

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-4 w-1/3">
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

          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <h3 className="font-bold mb-3">Atalhos rápidos</h3>
            <div className="grid grid-cols-2 gap-2">
              {['✏️', '❤️', '⭐', '😎', '⏱️', '➕'].map((icon, i) => (
                <button key={i} className="bg-[#2A2A1A] border border-[#FFD700] text-[#FFD700] py-3 rounded-lg flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-full text-lg hover:opacity-90 transition-all">
            ▶ Iniciar live
          </button>
        </div>

        {/* Chat */}
        <div className="flex flex-col w-1/3 bg-[#1A1A1A] rounded-xl p-4">
          <h3 className="font-bold text-center mb-4 border-b border-[#2A2A2A] pb-2">Chat</h3>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 max-h-96">
            {messages.length === 0 ? (
              <p className="text-[#A0A0A0] text-sm text-center">Nenhuma mensagem ainda. Seja o primeiro!</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="text-sm">
                  <span style={{ color: getColor(msg.users?.name || 'user') }} className="font-bold">
                    {msg.users?.name || 'Usuário'}:{' '}
                  </span>
                  <span className="text-[#E0E0E0]">{msg.content}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-[#2A2A2A] pt-3">
            <span className="text-[#FFD700] font-bold">#</span>
            <input
              type="text"
              placeholder="Envie uma mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#A0A0A0]"
            />
            <button onClick={handleSend} className="bg-[#FFD700] text-black font-bold px-4 py-1 rounded-full text-sm">
              Chat
            </button>
          </div>
        </div>

        {/* Donates + Activities */}
        <div className="flex flex-col gap-4 w-1/3">
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Donates</h3>
              <button className="text-[#A0A0A0]">⚙️</button>
            </div>
            {donations.length === 0 ? (
              <p className="text-[#A0A0A0] text-sm">Nenhum donate ainda.</p>
            ) : (
              donations.map((don, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A2A] text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFD700]">💰</span>
                    <div>
                      <p className="font-bold">R${don.amount}</p>
                      <p className="text-[#A0A0A0] text-xs">{don.users?.name || 'Anônimo'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Activities feed</h3>
              <button className="text-[#A0A0A0]">⚙️</button>
            </div>
            <p className="text-[#A0A0A0] text-sm">Nenhuma atividade recente.</p>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-4 flex justify-between items-center">
            <h3 className="font-bold">Ad Management</h3>
            <button className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-full text-sm">
              Run Ad (0:30)
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LiveStream