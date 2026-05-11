import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    console.log('Login:', email, password)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="bg-[#1A1A1A] p-8 rounded-2xl w-full max-w-md">

        {/* Logo */}
        <h1 className="text-[#FFD700] font-bold text-3xl text-center mb-2"># SUSTENIDO</h1>
        <p className="text-[#A0A0A0] text-center text-sm mb-8">Plataforma de streaming para cantores iniciantes</p>

        {/* Formulário */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-white text-sm mb-1 block">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg outline-none placeholder-[#A0A0A0] focus:border border-[#FFD700]"
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

          <button
            onClick={handleLogin}
            className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg hover:opacity-90 transition-all mt-2"
          >
            Entrar
          </button>

          <p className="text-[#A0A0A0] text-center text-sm">
            Não tem conta?{' '}
            <span
              onClick={() => navigate('/cadastro')}
              className="text-[#FFD700] cursor-pointer hover:underline"
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login