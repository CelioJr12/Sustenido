import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ArtistProfile from './pages/ArtistProfile'
import LiveStream from './pages/LiveStream'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArtistProfile />} />
        <Route path="/live" element={<LiveStream />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App