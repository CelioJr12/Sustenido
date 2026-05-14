import { Router, Request, Response } from 'express'
import { supabase } from '../supabase'

const router = Router()

// Buscar perfil do artista
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    res.status(404).json({ error: 'Usuário não encontrado' })
    return
  }
  res.json(data)
})

// Buscar transmissões do artista
router.get('/:userId/streams', async (req: Request, res: Response) => {
  const { userId } = req.params

  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .eq('artist_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Inscrever no canal do artista
router.post('/:userId/subscribe', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { follower_id } = req.body

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('follower_id', follower_id)
    .eq('artist_id', userId)
    .single()

  if (existing) {
    await supabase
      .from('subscriptions')
      .delete()
      .eq('follower_id', follower_id)
      .eq('artist_id', userId)

    await supabase.rpc('decrement_followers', { user_id: userId })

    res.json({ subscribed: false })
    return
  }

  await supabase
    .from('subscriptions')
    .insert({ follower_id, artist_id: userId })

  await supabase.rpc('increment_followers', { user_id: userId })

  res.json({ subscribed: true })
})

// Verificar se está inscrito
router.get('/:userId/subscribed/:followerId', async (req: Request, res: Response) => {
  const { userId, followerId } = req.params

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('follower_id', followerId)
    .eq('artist_id', userId)
    .single()

  res.json({ subscribed: !!data })
})

export default router