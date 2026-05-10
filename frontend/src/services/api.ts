const API_URL = 'http://localhost:3000'

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