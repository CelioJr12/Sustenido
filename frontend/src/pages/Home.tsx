import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { getActiveStreams } from '../services/api'

const Home = () => {
  const [activeStreams, setActiveStreams] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentUserName, setCurrentUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/'); return }
      if (user.user_metadata?.is_artist) { navigate('/live'); return }

      setCurrentUser(user)

      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single()
      setCurrentUserName(userData?.name || user.user_metadata?.name || 'Ouvinte')

      await fetchActiveStreams()
      setLoading(false)
    }
    init()
  }, [])

  // Atualiza a lista em tempo real via Supabase Realtime + polling de backup a cada 5s
  useEffect(() => {
    const channel = supabase
      .channel('home-streams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streams' }, async () => {
        await fetchActiveStreams()
      })
      .subscribe()

    const interval = setInterval(fetchActiveStreams, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const fetchActiveStreams = async () => {
    const data = await getActiveStreams()
    if (Array.isArray(data)) setActiveStreams(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <p className="text-[#FFD700] text-xl">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <h1 className="text-[#FFD700] font-bold text-2xl"># SUSTENIDO</h1>
        <input
          type="text"
          placeholder="Buscar"
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full w-64 outline-none"
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#A0A0A0]">{currentUserName}</span>
          <button
            onClick={handleLogout}
            className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full hover:bg-red-500 transition-all text-sm"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Lives ao vivo</h2>
          {activeStreams.length > 0 && (
            <span className="flex items-center gap-1.5 bg-red-600/20 border border-red-600 text-red-400 text-xs px-3 py-1 rounded-full font-bold">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              {activeStreams.length} ao vivo
            </span>
          )}
        </div>

        {activeStreams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#A0A0A0]">
            <span className="text-6xl mb-4">🎵</span>
            <p className="text-xl font-bold mb-2">Nenhuma live acontecendo agora</p>
            <p className="text-sm">Quando um artista iniciar uma live, ela aparecerá aqui automaticamente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeStreams.map((stream) => (
              <div
                key={stream.id}
                onClick={() => navigate(`/watch/${stream.id}`)}
                className="bg-[#1A1A1A] rounded-xl overflow-hidden cursor-pointer hover:bg-[#222222] hover:scale-[1.02] transition-all border border-[#2A2A2A] hover:border-[#FFD700]/40"
              >
                <div className="w-full h-40 bg-[#2A2A2A] flex items-center justify-center relative">
                  <span className="text-5xl">🎤</span>
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    AO VIVO
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm truncate">{stream.title}</p>
                  <p className="text-[#A0A0A0] text-xs mt-0.5">{stream.users?.name || 'Artista'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
