import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendMessage, getStream } from '../services/api'
import { supabase } from '../services/supabase'
import { getMockLiveStream, mockLiveMessages } from '../mocks/live'

const WatchLive = () => {
  const { streamId } = useParams<{ streamId: string }>()
  const [stream, setStream] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentUserName, setCurrentUserName] = useState('')
  const [liveEnded, setLiveEnded] = useState(false)
  const [loading, setLoading] = useState(true)

  const channelRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const colors = ['#FF6B6B', '#51CF66', '#339AF0', '#FF922B', '#FFD700', '#CC5DE8']
  const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

  useEffect(() => {
    const init = async () => {
      const isMockStream = streamId?.startsWith('mock-live')

      if (isMockStream) {
        setCurrentUser({ id: 'mock-viewer' })
        setCurrentUserName('Visitante demo')
        setStream(getMockLiveStream(streamId))
        setMessages(mockLiveMessages)
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) { navigate('/'); return }

      setCurrentUser(user || { id: 'mock-viewer' })

      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single()
        setCurrentUserName(userData?.name || user.user_metadata?.name || 'Ouvinte')
      } else {
        setCurrentUserName('Visitante demo')
      }

      if (!streamId) { navigate('/perfil'); return }

      const streamData = await getStream(streamId)
      if (streamData.error || !streamData.is_live) {
        navigate('/perfil')
        return
      }
      setStream(streamData)

      setLoading(false)
    }
    init()
  }, [streamId])

  // Canal de chat em tempo real
  useEffect(() => {
    if (!streamId || streamId.startsWith('mock-live')) return

    const channel = supabase.channel(`live-${streamId}`, {
      config: { broadcast: { self: false } }
    })

    channel
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload])
      })
      .on('broadcast', { event: 'live-ended' }, () => {
        setLiveEnded(true)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [streamId])

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !streamId) return
    const isMockStream = streamId.startsWith('mock-live')

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

    if (!isMockStream) {
      await sendMessage(streamId, currentUser.id, message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <p className="text-[#FFD700] text-xl">Entrando na live...</p>
      </div>
    )
  }

  if (liveEnded) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white gap-4">
        <span className="text-5xl">📺</span>
        <h2 className="text-2xl font-bold">A live encerrou</h2>
        <p className="text-[#A0A0A0]">{stream?.users?.name || 'O artista'} encerrou a transmissão.</p>
        <button
          onClick={() => navigate('/perfil')}
          className="bg-[#FFD700] text-black font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all mt-2"
        >
          Voltar para Home
        </button>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0D0D0D] text-white flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-[#2A2A2A] shrink-0">
        <h1 className="text-[#FFD700] font-bold text-2xl"># SUSTENIDO</h1>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-bold text-red-400">AO VIVO</span>
          <span className="text-[#A0A0A0] text-sm ml-2">{stream?.users?.name || 'Artista'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#A0A0A0]">{currentUserName}</span>
          <button
            onClick={() => navigate('/perfil')}
            className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full hover:bg-[#3A3A3A] transition-all text-sm"
          >
            ← Sair da live
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-6 max-w-[1600px] w-full mx-auto min-h-0">

        {/* Área de vídeo */}
        <div className="flex flex-col gap-4 w-full lg:w-[70%] min-w-0">
          <div className="w-full flex-1 min-h-0 bg-[#111111] rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-lg border border-[#2A2A2A]">
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <div
                className="w-24 h-24 rounded-full bg-[#2A2A2A] border-4 border-red-500 flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: stream?.users?.avatar_color || undefined }}
              >
                {stream?.users?.name?.charAt(0).toUpperCase() || '🎤'}
              </div>
              <div>
                <p className="text-white font-bold text-xl">{stream?.users?.name || 'Artista'}</p>
                <p className="text-[#A0A0A0] text-sm mt-1">{stream?.title}</p>
              </div>
              <div className="flex items-center gap-2 bg-red-600/20 border border-red-600 text-red-400 text-sm px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Transmissão ao vivo em andamento
              </div>
            </div>

            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              AO VIVO
            </div>
            {stream?.viewers_count && (
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-bold">
                {stream.viewers_count} assistindo
              </div>
            )}
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A2A]">
            <h2 className="font-bold text-lg">{stream?.title}</h2>
            {stream?.description && (
              <p className="text-[#A0A0A0] text-sm mt-1">{stream.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="text-[#A0A0A0]">por {stream?.users?.name || 'Artista'}</span>
              {stream?.category && <span className="text-[#FFD700]">#{stream.category}</span>}
              {stream?.peak_viewers && <span className="text-[#A0A0A0]">pico de {stream.peak_viewers}</span>}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-col w-full lg:w-[30%] bg-[#1A1A1A] rounded-xl p-4 border border-[#2A2A2A] shrink-0 min-h-[300px]">
          <div className="mb-4 border-b border-[#2A2A2A] pb-3 shrink-0">
            <h3 className="font-bold text-lg text-center">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-2">
            {messages.length === 0 ? (
              <p className="text-[#A0A0A0] text-sm text-center my-auto">Nenhuma mensagem ainda. Seja o primeiro!</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="text-sm bg-[#2A2A2A]/40 p-2.5 rounded-lg break-words">
                  <span style={{ color: getColor(msg.user_name || 'user') }} className="font-bold">
                    {msg.user_name || 'Usuário'}:{' '}
                  </span>
                  <span className="text-[#E0E0E0]">{msg.content}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="pt-3 border-t border-[#2A2A2A] shrink-0">
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
    </div>
  )
}

export default WatchLive
