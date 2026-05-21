const API_URL = 'http://localhost:3000'

// ── Lives ───────────────────────────────────
export const getActiveStreams = async () => {
  const response = await fetch(`${API_URL}/streams/active`)
  return response.json()
}

export const getStream = async (streamId: string) => {
  const response = await fetch(`${API_URL}/streams/${streamId}`)
  return response.json()
}

export const startLive = async (artist_id: string, title: string, description: string) => {
  const response = await fetch(`${API_URL}/streams/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artist_id, title, description })
  })
  return response.json()
}

export const endLive = async (streamId: string) => {
  const response = await fetch(`${API_URL}/streams/${streamId}/end`, {
    method: 'POST'
  })
  return response.json()
}

// ── Mensagens ──────────────────────────────
export const getMessages = async (streamId: string) => {
  const response = await fetch(`${API_URL}/streams/${streamId}/messages`)
  return response.json()
}

export const sendMessage = async (streamId: string, user_id: string, content: string) => {
  const response = await fetch(`${API_URL}/streams/${streamId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, content })
  })
  return response.json()
}

export const getDonations = async (streamId: string) => {
  const response = await fetch(`${API_URL}/streams/${streamId}/donations`)
  return response.json()
}

// ── Perfil ──────────────────────────────────
export const getArtistProfile = async (userId: string) => {
  const response = await fetch(`${API_URL}/users/${userId}`)
  return response.json()
}

export const getArtistStreams = async (userId: string) => {
  const response = await fetch(`${API_URL}/users/${userId}/streams`)
  return response.json()
}

export const subscribeToArtist = async (userId: string, follower_id: string) => {
  const response = await fetch(`${API_URL}/users/${userId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ follower_id })
  })
  return response.json()
}

export const checkSubscription = async (userId: string, followerId: string) => {
  const response = await fetch(`${API_URL}/users/${userId}/subscribed/${followerId}`)
  return response.json()
}