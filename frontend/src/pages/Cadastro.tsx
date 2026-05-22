import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const Cadastro = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isArtist, setIsArtist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCadastro = async () => {
    if (!name || !email || !password) {
      setError('Preencha todos os campos!')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, is_artist: isArtist }
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('Este e-mail já está cadastrado!')
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        name,
        email,
        is_artist: isArtist
      })
    }

    setLoading(false)
    alert('Conta criada com sucesso! Faça o login para continuar.')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="bg-[#1A1A1A] p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-[#FFD700] font-bold text-3xl text-center mb-2"># SUSTENIDO</h1>
        <p className="text-[#A0A0A0] text-center text-sm mb-8">Crie sua conta e comece agora</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsArtist(false)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              !isArtist ? 'bg-[#FFD700] text-black' : 'bg-[#2A2A2A] text-[#A0A0A0]'
            }`}
          >
            🎧 Ouvinte
          </button>
          <button
            onClick={() => setIsArtist(true)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              isArtist ? 'bg-[#FFD700] text-black' : 'bg-[#2A2A2A] text-[#A0A0A0]'
            }`}
          >
            🎤 Artista
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-white text-sm mb-1 block">Nome</label>
            <input
              type="text"
              placeholder="Seu nome artístico ou completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg outline-none placeholder-[#A0A0A0]"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-1 block">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg outline-none placeholder-[#A0A0A0]"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-1 block">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg outline-none placeholder-[#A0A0A0]"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleCadastro}
            disabled={loading}
            className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg hover:opacity-90 transition-all mt-2 disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="text-[#A0A0A0] text-center text-sm">
            Já tem conta?{' '}
            <span
              onClick={() => navigate('/')}
              className="text-[#FFD700] cursor-pointer hover:underline"
            >
              Entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
