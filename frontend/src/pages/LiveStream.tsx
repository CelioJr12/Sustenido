import React, { useState, useEffect, useRef } from 'react'
import { getMessages, sendMessage, getDonations } from '../services/api'
import { supabase } from '../services/supabase'

const STREAM_ID = '00000000-0000-0000-0000-000000000001'

const LiveStream = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false)
  const [liveTitle, setLiveTitle] = useState('')
  const [liveDescription, setLiveDescription] = useState('')
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const colors = ['#FF6B6B', '#51CF66', '#339AF0', '#FF922B', '#FFD700', '#CC5DE8']
  const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUser(user)
    }
    fetchUser()
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
    if (!message.trim() || !currentUser) return
    await sendMessage(STREAM_ID, currentUser.id, message)
    setMessage('')
    fetchMessages()
  }

  const handleStartLiveConfirm = async () => {
    setIsLiveModalOpen(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraOn(true)
    } catch (err) {
      console.error("Erro ao acessar a câmera: ", err)
      alert("Não foi possível acessar a câmera e o microfone.")
    }
  }

  const handleEndLive = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`min-h-screen bg-[#0D0D0D] text-white ${isFullscreen ? 'h-screen overflow-hidden' : ''}`}>
      {/* Header (oculto em tela cheia) */}
      {!isFullscreen && (
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
      )}

      {/* Container Principal */}
      <div className={isFullscreen ? "flex h-screen w-full" : "flex gap-6 p-6 max-w-[1600px] mx-auto"}>
        
        {/* Coluna Esquerda: Câmera + Controles */}
        <div className={isFullscreen ? "flex-1 relative bg-black flex flex-col" : "flex flex-col gap-4 w-[65%]"}>
          
          {/* Container do Vídeo */}
          <div className={isFullscreen 
            ? "flex-1 relative flex items-center justify-center bg-black overflow-hidden" 
            : "w-full aspect-video bg-[#2A2A2A] rounded-xl flex flex-col items-center justify-center text-[#A0A0A0] relative overflow-hidden shadow-lg"
          }>
            <div className="flex flex-col items-center justify-center h-full w-full" style={{ display: isCameraOn ? 'none' : 'flex' }}>
              <span className="text-5xl mb-4">📷</span>
              <span className="text-sm">There is no connected camera.</span>
            </div>
            
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
              style={{ display: isCameraOn ? 'block' : 'none' }} 
            />

            {/* Botão de sair da tela cheia flutuante */}
            {isFullscreen && (
              <button 
                onClick={handleToggleFullscreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 px-4 rounded-full transition-all font-bold text-sm z-10"
              >
                ✕ Sair da Tela Cheia
              </button>
            )}
          </div>

          {/* Barra de Controles (Abaixo do Vídeo) */}
          {!isFullscreen && (
            <div className="flex items-center gap-4 text-[#A0A0A0] px-2 py-1">
              <button className="hover:text-white transition-colors">▶</button>
              <button className="hover:text-white transition-colors">⏭</button>
              <div className="flex-1 h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#FFD700]"></div>
              </div>
              <button className="hover:text-white transition-colors">🔊</button>
              <button onClick={handleToggleFullscreen} className="hover:text-[#FFD700] transition-colors text-xl" title="Tela Cheia">⛶</button>
            </div>
          )}

          {/* Grid Inferior: Botão Iniciar Live/Encerrar + Atalhos + Outros Painéis */}
          {!isFullscreen && (
            <div className="flex flex-col gap-4 mt-2">
              {!isCameraOn ? (
                <button 
                  onClick={() => setIsLiveModalOpen(true)}
                  className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-xl text-xl hover:bg-[#E6C200] transition-all shadow-md"
                >
                  ▶ Iniciar live
                </button>
              ) : (
                <button 
                  onClick={handleEndLive}
                  className="w-full bg-[#FF4444] text-white font-bold py-4 rounded-xl text-xl hover:bg-[#CC0000] transition-all shadow-md"
                >
                  ⏹ Encerrar live
                </button>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Esquerda: Atalhos e Ads */}
                <div className="flex flex-col gap-4">
                  <div className="bg-[#1A1A1A] rounded-xl p-5 border border-[#2A2A2A]">
                    <h3 className="font-bold mb-4 text-lg">Atalhos rápidos</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['✏️', '❤️', '⭐', '😎', '⏱️', '➕'].map((icon, i) => (
                        <button key={i} className="bg-[#2A2A2A] border border-[#3A3A3A] hover:border-[#FFD700] text-xl py-3 rounded-lg flex items-center justify-center hover:bg-[#FFD700]/10 transition-all">
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-xl p-5 flex justify-between items-center border border-[#2A2A2A]">
                    <h3 className="font-bold text-lg">Ad Management</h3>
                    <button className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-full text-sm hover:opacity-90">
                      Run Ad (0:30)
                    </button>
                  </div>
                </div>

                {/* Direita: Donates e Feed */}
                <div className="flex flex-col gap-4">
                  <div className="bg-[#1A1A1A] rounded-xl p-5 border border-[#2A2A2A] flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Donates</h3>
                      <button className="text-[#A0A0A0] hover:text-white">⚙️</button>
                    </div>
                    <div className="overflow-y-auto flex-1 max-h-32 pr-2">
                      {donations.length === 0 ? (
                        <p className="text-[#A0A0A0] text-sm italic">Nenhum donate ainda.</p>
                      ) : (
                        donations.map((don, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A2A] text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-[#FFD700] text-lg">💰</span>
                              <div>
                                <p className="font-bold text-[#FFD700]">R${don.amount}</p>
                                <p className="text-[#A0A0A0] text-xs">{don.users?.name || 'Anônimo'}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-xl p-5 border border-[#2A2A2A]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Activities feed</h3>
                      <button className="text-[#A0A0A0] hover:text-white">⚙️</button>
                    </div>
                    <p className="text-[#A0A0A0] text-sm italic">Nenhuma atividade recente.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Chat */}
        <div className={isFullscreen ? "w-[350px] bg-[#1A1A1A] flex flex-col border-l border-[#2A2A2A]" : "flex flex-col w-[35%] bg-[#1A1A1A] rounded-xl p-5 border border-[#2A2A2A]"}>
          <div className={isFullscreen ? "p-4 border-b border-[#2A2A2A] flex justify-between items-center" : "mb-4 border-b border-[#2A2A2A] pb-3"}>
            <h3 className="font-bold text-lg flex-1 text-center">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-2">
            {messages.length === 0 ? (
              <p className="text-[#A0A0A0] text-sm text-center my-auto">Nenhuma mensagem ainda. Seja o primeiro!</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="text-sm bg-[#2A2A2A]/40 p-2.5 rounded-lg break-words">
                  <span style={{ color: getColor(msg.users?.name || 'user') }} className="font-bold">
                    {msg.users?.name || 'Usuário'}:{' '}
                  </span>
                  <span className="text-[#E0E0E0]">{msg.content}</span>
                </div>
              ))
            )}
          </div>

          <div className={isFullscreen ? "p-4 bg-[#2A2A2A]" : "pt-3 border-t border-[#2A2A2A]"}>
            <div className="flex items-center gap-2 bg-[#2A2A2A] p-1.5 rounded-xl border border-[#3A3A3A] focus-within:border-[#FFD700] transition-colors">
              <input
                type="text"
                placeholder="Envie uma mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#A0A0A0] px-2"
              />
              <button 
                onClick={handleSend} 
                disabled={!message.trim()}
                className="bg-[#FFD700] text-black font-bold px-4 py-1.5 rounded-lg hover:bg-[#E6C200] transition-colors disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Iniciar Live */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] p-6 rounded-xl w-96 border border-[#2A2A2A]">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Criar Nova Live</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Título da Live</label>
              <input
                type="text"
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                placeholder="Ex: Tarde de música ao vivo"
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg outline-none border border-transparent focus:border-[#FFD700]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Descrição (opcional)</label>
              <textarea
                value={liveDescription}
                onChange={(e) => setLiveDescription(e.target.value)}
                placeholder="Conte um pouco sobre o que vai rolar..."
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg outline-none border border-transparent focus:border-[#FFD700] h-24 resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsLiveModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-transparent text-[#A0A0A0] hover:text-white transition-all font-bold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleStartLiveConfirm}
                disabled={!liveTitle.trim()}
                className="px-4 py-2 rounded-lg bg-[#FFD700] text-black hover:opacity-90 transition-all font-bold disabled:opacity-50"
              >
                Começar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveStream