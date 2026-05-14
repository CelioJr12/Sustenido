import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { getArtistProfile, getArtistStreams, subscribeToArtist, checkSubscription } from '../services/api'

const ArtistProfile = () => {
  const [artist, setArtist] = useState<any>(null)
  const [streams, setStreams] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Início')
  const navigate = useNavigate()

  const ARTIST_ID = '00000000-0000-0000-0000-000000000003'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      navigate('/')
      return
    }

    setCurrentUser(user)

    const profileData = await getArtistProfile(ARTIST_ID)
    setArtist(profileData)

    const streamsData = await getArtistStreams(ARTIST_ID)
    if (Array.isArray(streamsData)) setStreams(streamsData)

    const { subscribed: isSub } = await checkSubscription(ARTIST_ID, user.id)
    setSubscribed(isSub)

    setLoading(false)
  }

  const handleSubscribe = async () => {
    if (!currentUser) return
    const { subscribed: isSub } = await subscribeToArtist(ARTIST_ID, currentUser.id)
    setSubscribed(isSub)
    setArtist((prev: any) => ({
      ...prev,
      followers_count: isSub ? prev.followers_count + 1 : prev.followers_count - 1
    }))
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

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <h1 className="text-[#FFD700] font-bold text-2xl"># SUSTENIDO</h1>
        <input
          type="text"
          placeholder="Buscar"
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full w-64 outline-none"
        />
        <div className="flex items-center gap-3">
          <button className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-full">
            Obter pontos de fã
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full hover:bg-red-500 transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="px-8 py-6">

        {/* Info do artista */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-[#2A2A2A] border-4 border-red-500 flex items-center justify-center text-4xl font-bold">
              {artist?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            {streams.some((s: any) => s.is_live) && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                Ao vivo
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{artist?.name || 'Artista'}</h2>
              {artist?.is_verified && <span className="text-[#FFD700]">✔</span>}
            </div>
            <p className="text-[#A0A0A0]">{formatFollowers(artist?.followers_count)} seguidores</p>
            {artist?.bio && <p className="text-[#A0A0A0] text-sm mt-1">{artist.bio}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubscribe}
              className={`font-bold px-6 py-2 rounded-full transition-all ${
                subscribed
                  ? 'bg-[#2A2A2A] text-white border border-[#FFD700]'
                  : 'bg-[#FFD700] text-black'
              }`}
            >
              {subscribed ? 'Inscrito ✓' : 'Inscrever-se'}
            </button>
            <button
              onClick={() => navigate('/live')}
              className="border border-red-500 text-red-500 px-6 py-2 rounded-full flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all"
            >
              ♥ Quero ser Fã
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-8 border-b border-[#2A2A2A] mb-6">
          {['Início', 'Vídeos', 'Sobre', 'Discografia'].map((aba) => (
            <button
              key={aba}
              onClick={() => setActiveTab(aba)}
              className={`pb-2 transition-all border-b-2 ${
                activeTab === aba
                  ? 'text-white border-[#FFD700]'
                  : 'text-[#A0A0A0] border-transparent hover:text-white'
              }`}
            >
              {aba}
            </button>
          ))}
        </div>

        {/* Conteúdo da aba */}
        {activeTab === 'Início' && (
          <>
            {/* Live ativa */}
            {streams.filter((s: any) => s.is_live).map((stream: any) => (
              <div key={stream.id} className="mb-8">
                <h3 className="text-lg font-bold mb-4">Ao vivo</h3>
                <div
                  onClick={() => navigate('/live')}
                  className="flex gap-4 items-center bg-[#1A1A1A] p-4 rounded-xl w-fit cursor-pointer hover:bg-[#2A2A2A] transition-all"
                >
                  <div className="w-48 h-32 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-[#A0A0A0]">
                    🎵 Ao Vivo
                  </div>
                  <div>
                    <p className="font-bold text-lg">{stream.title}</p>
                    <p className="text-[#A0A0A0]">{stream.viewers_count?.toLocaleString()} assistindo</p>
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                      LIVE
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Transmissões anteriores */}
            <div>
              <h3 className="text-lg font-bold mb-4">Transmissões anteriores</h3>
              {streams.filter((s: any) => !s.is_live).length === 0 ? (
                <p className="text-[#A0A0A0]">Nenhuma transmissão anterior.</p>
              ) : (
                <div className="flex gap-4 flex-wrap">
                  {streams.filter((s: any) => !s.is_live).map((stream: any) => (
                    <div
                      key={stream.id}
                      onClick={() => navigate('/live')}
                      className="w-48 h-32 bg-[#2A2A2A] rounded-lg relative flex items-end p-2 cursor-pointer hover:bg-[#3A3A3A] transition-all"
                    >
                      <div className="text-white text-xs">
                        <p className="font-bold truncate">{stream.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'Sobre' && (
          <div className="bg-[#1A1A1A] p-6 rounded-xl max-w-lg">
            <h3 className="font-bold text-lg mb-3">Sobre o artista</h3>
            <p className="text-[#A0A0A0]">{artist?.bio || 'Nenhuma biografia cadastrada.'}</p>
            <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
              <p className="text-sm text-[#A0A0A0]">
                Membro desde {new Date(artist?.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Vídeos' && (
          <p className="text-[#A0A0A0]">Nenhum vídeo publicado ainda.</p>
        )}

        {activeTab === 'Discografia' && (
          <p className="text-[#A0A0A0]">Nenhuma música publicada ainda.</p>
        )}

      </div>
    </div>
  )
}

export default ArtistProfile