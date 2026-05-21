import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ArtistProfile from './pages/ArtistProfile'
import LiveStream from './pages/LiveStream'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import WatchLive from './pages/WatchLive'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={<ArtistProfile />} />
        <Route path="/live" element={<LiveStream />} />
        <Route path="/watch/:streamId" element={<WatchLive />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
