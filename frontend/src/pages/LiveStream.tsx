import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendMessage, startLive, endLive } from '../services/api'
import { supabase } from '../services/supabase'
import { mockLiveActivities, mockLiveDonations, mockLiveMessages } from '../mocks/live'

const LiveStream = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentUserName, setCurrentUserName] = useState('')

  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false)
  const [liveTitle, setLiveTitle] = useState('')
  const [liveDescription, setLiveDescription] = useState('')
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null)
  const [streamTitle, setStreamTitle] = useState('')
  const [activities, setActivities] = useState<string[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const channelRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const colors = ['#FF6B6B', '#51CF66', '#339AF0', '#FF922B', '#FFD700', '#CC5DE8']
  const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/'); return }
      if (!user.user_metadata?.is_artist) { navigate('/perfil'); return }

      setCurrentUser(user)

      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single()
      setCurrentUserName(userData?.name || user.user_metadata?.name || 'Artista')
    }
    init()
  }, [])

  // Inscreve no canal de chat quando a live começa
  useEffect(() => {
    if (!currentStreamId) return

    const channel = supabase.channel(`live-${currentStreamId}`, {
      config: { broadcast: { self: false } }
    })

    channel
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload])
      })
      .on('broadcast', { event: 'live-ended' }, () => {
        // Nada para o artista fazer aqui
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentStreamId])

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !currentStreamId) return

    const msg = {
      user_id: currentUser.id,
      user_name: currentUserName,
      content: message,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, msg])
    setMessage('')

    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: msg
    })

    await sendMessage(currentStreamId, currentUser.id, message)
  }

  const handleStartLiveConfirm = async () => {
    if (!liveTitle.trim() || !currentUser) return
    setIsLiveModalOpen(false)

    try {
      const stream = await startLive(currentUser.id, liveTitle, liveDescription)
      if (stream.error) {
        alert('Erro ao iniciar live: ' + stream.error)
        return
      }

      setCurrentStreamId(stream.id)
      setStreamTitle(liveTitle)
      setMessages(mockLiveMessages)
      setDonations(mockLiveDonations)
      setActivities(mockLiveActivities)

      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCameraOn(true)
    } catch (err) {
      console.error('Erro ao iniciar live:', err)
      alert('Não foi possível acessar a câmera e o microfone.')
    }
  }

  const handleEndLive = async () => {
    if (videoRef.current?.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream
      mediaStream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    if (currentStreamId) {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'live-ended',
        payload: {}
      })
      await endLive(currentStreamId)
      setCurrentStreamId(null)
      setStreamTitle('')
    }

    setIsCameraOn(false)
    setMessages([])
    setDonations([])
    setActivities([])
  }

  const handleToggleFullscreen = () => setIsFullscreen(!isFullscreen)

  const handleLogout = async () => {
    if (currentStreamId) await handleEndLive()
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="h-screen bg-[#0D0D0D] text-white flex flex-col overflow-hidden">
      {!isFullscreen && (
        <header className="flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-[#2A2A2A]">
          <h1 className="text-[#FFD700] font-bold text-2xl"># SUSTENIDO</h1>
          <div className="flex items-center gap-3">
            {streamTitle && (
              <span className="text-sm text-[#A0A0A0]">
                Transmitindo: <span className="text-white font-bold">{streamTitle}</span>
              </span>
            )}
            <span className="text-sm text-[#A0A0A0]">{currentUserName}</span>
            <button
              onClick={handleLogout}
              className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full hover:bg-red-500 transition-all text-sm"
            >
              Sair
            </button>
          </div>
        </header>
      )}

      <div className={isFullscreen ? "flex-1 flex w-full min-h-0" : "flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-6 max-w-[1600px] w-full mx-auto min-h-0"}>

        <div className={isFullscreen ? "flex-1 relative bg-black flex flex-col min-w-0" : "flex flex-col gap-4 w-full lg:w-[70%] min-w-0"}>

          <div className={isFullscreen
            ? "flex-1 relative flex items-center justify-center bg-black overflow-hidden"
            : "w-full flex-1 min-h-0 bg-[#2A2A2A] rounded-xl flex flex-col items-center justify-center text-[#A0A0A0] relative overflow-hidden shadow-lg"
          }>
            <div className="flex flex-col items-center justify-center h-full w-full" style={{ display: isCameraOn ? 'none' : 'flex' }}>
              <span className="text-5xl mb-4">📷</span>
              <span className="text-sm">Nenhuma câmera conectada.</span>
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: isCameraOn ? 'block' : 'none' }}
            />

            {isCameraOn && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-white text-xs font-bold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                AO VIVO
              </div>
            )}

            {isFullscreen && (
              <button
                onClick={handleToggleFullscreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 px-4 rounded-full transition-all font-bold text-sm z-10"
              >
                ✕ Sair da Tela Cheia
              </button>
            )}
          </div>

          {!isFullscreen && (
            <div className="flex items-center gap-4 text-[#A0A0A0] px-2 py-1">
              <div className="flex-1 h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                {isCameraOn && <div className="w-full h-full bg-red-500 animate-pulse"></div>}
              </div>
              <button onClick={handleToggleFullscreen} className="hover:text-[#FFD700] transition-colors text-xl" title="Tela Cheia">⛶</button>
            </div>
          )}

          {!isFullscreen && (
            <div className="flex flex-col gap-4 mt-2 overflow-y-auto pr-2 pb-2">
              {!isCameraOn ? (
                <button
                  onClick={() => setIsLiveModalOpen(true)}
                  className="w-full shrink-0 bg-[#FFD700] text-black font-bold py-3 rounded-xl text-lg hover:bg-[#E6C200] transition-all shadow-md"
                >
                  ▶ Iniciar live
                </button>
              ) : (
                <button
                  onClick={handleEndLive}
                  className="w-full shrink-0 bg-[#FF4444] text-white font-bold py-3 rounded-xl text-lg hover:bg-[#CC0000] transition-all shadow-md"
                >
                  ⏹ Encerrar live
                </button>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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

                <div className="flex flex-col gap-4">
                  <div className="bg-[#1A1A1A] rounded-xl p-5 border border-[#2A2A2A] flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Donates</h3>
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
                    </div>
                    {activities.length === 0 ? (
                      <p className="text-[#A0A0A0] text-sm italic">Nenhuma atividade recente.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {activities.map((activity) => (
                          <p key={activity} className="text-[#A0A0A0] text-sm border-b border-[#2A2A2A] pb-2 last:border-b-0 last:pb-0">
                            {activity}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat */}
        <div className={isFullscreen ? "w-[350px] bg-[#1A1A1A] flex flex-col border-l border-[#2A2A2A] shrink-0" : "flex flex-col w-full lg:w-[30%] bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A2A] shrink-0 min-h-[300px]"}>
          <div className={isFullscreen ? "p-4 border-b border-[#2A2A2A] flex justify-between items-center shrink-0" : "mb-4 border-b border-[#2A2A2A] pb-3 shrink-0"}>
            <h3 className="font-bold text-lg flex-1 text-center">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-2">
            {!currentStreamId ? (
              <p className="text-[#A0A0A0] text-sm text-center my-auto">Inicie sua live para ativar o chat.</p>
            ) : messages.length === 0 ? (
              <p className="text-[#A0A0A0] text-sm text-center my-auto">Nenhuma mensagem ainda. Seja o primeiro!</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="text-sm bg-[#2A2A2A]/40 p-2.5 rounded-lg break-words">
                  <span style={{ color: getColor(msg.user_name || msg.users?.name || 'user') }} className="font-bold">
                    {msg.user_name || msg.users?.name || 'Usuário'}:{' '}
                  </span>
                  <span className="text-[#E0E0E0]">{msg.content}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={isFullscreen ? "p-4 bg-[#2A2A2A] shrink-0" : "pt-3 border-t border-[#2A2A2A] shrink-0"}>
            <div className="flex items-center gap-2 bg-[#2A2A2A] p-1.5 rounded-xl border border-[#3A3A3A] focus-within:border-[#FFD700] transition-colors">
              <input
                type="text"
                placeholder={currentStreamId ? "Envie uma mensagem..." : "Inicie a live primeiro"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={!currentStreamId}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#A0A0A0] px-2 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || !currentStreamId}
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
