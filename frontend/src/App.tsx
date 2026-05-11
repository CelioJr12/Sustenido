import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ArtistProfile from './pages/ArtistProfile'
import LiveStream from './pages/LiveStream'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={<ArtistProfile />} />
        <Route path="/live" element={<LiveStream />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App