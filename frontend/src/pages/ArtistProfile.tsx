import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { getArtistProfile, getActiveStreams } from '../services/api'
import { mockLiveStreams } from '../mocks/live'

const ArtistProfile = () => {
  const [artist, setArtist] = useState<any>(null)
  const [activeStreams, setActiveStreams] = useState<any[]>([])
  const [currentUserName, setCurrentUserName] = useState('')
  const [isArtist, setIsArtist] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('perfil-streams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streams' }, fetchActiveStreams)
      .subscribe()

    const interval = setInterval(fetchActiveStreams, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const fetchActiveStreams = async () => {
    try {
      const data = await getActiveStreams()
      setActiveStreams(Array.isArray(data) && data.length > 0 ? data : mockLiveStreams)
    } catch {
      setActiveStreams(mockLiveStreams)
    }
  }

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate('/')
      return
    }

    const artistFlag = !!user.user_metadata?.is_artist
    setIsArtist(artistFlag)

    const { data: userData } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()
    const displayName = userData?.name || user.user_metadata?.name || 'Artista'
    setCurrentUserName(displayName)

    if (artistFlag) {
      try {
        const profileData = await getArtistProfile(user.id)
        setArtist(profileData?.error ? { name: displayName, followers_count: 0 } : profileData)
      } catch {
        setArtist({ name: displayName, followers_count: 0 })
      }
    }

      await fetchActiveStreams()
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const formatFollowers = (count: number) => {
    if (!count) return '0'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)} mi`
    if (count >= 1000) return `${(count / 1000).toFixed(1)} mil`
    return count.toString()
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

        {isArtist && artist && (
          <div className="flex items-center gap-6 mb-8 bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A]">
            <div className="w-20 h-20 rounded-full bg-[#2A2A2A] border-4 border-red-500 flex items-center justify-center text-3xl font-bold shrink-0">
              {artist?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{artist?.name || 'Artista'}</h2>
              <p className="text-[#A0A0A0] text-sm">{formatFollowers(artist?.followers_count)} seguidores</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#2A2A2A] text-white font-bold px-5 py-3 rounded-full hover:bg-[#3A3A3A] transition-all"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/live')}
              className="bg-[#FFD700] text-black font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all"
            >
              🎙 Ir para sua live
            </button>
          </div>
        )}

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
                  {stream.viewers_count && (
                    <p className="text-[#FFD700] text-xs mt-2">{stream.viewers_count} assistindo agora</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default ArtistProfile
