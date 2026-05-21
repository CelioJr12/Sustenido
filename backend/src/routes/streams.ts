import { Router, Request, Response } from 'express'
import { supabase } from '../supabase'

const router = Router()

// Buscar lives ativas (deve vir antes de /:streamId para não conflitar)
router.get('/active', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('streams')
    .select('*, users(name)')
    .eq('is_live', true)
    .order('created_at', { ascending: false })

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Iniciar uma live
router.post('/start', async (req: Request, res: Response) => {
  const { artist_id, title, description } = req.body

  // Encerra qualquer live ativa deste artista antes de criar uma nova
  await supabase
    .from('streams')
    .update({ is_live: false })
    .eq('artist_id', artist_id)
    .eq('is_live', true)

  const { data, error } = await supabase
    .from('streams')
    .insert({ artist_id, title, description, is_live: true })
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Buscar dados de uma stream específica
router.get('/:streamId', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { data, error } = await supabase
    .from('streams')
    .select('*, users(name)')
    .eq('id', streamId)
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Encerrar uma live
router.post('/:streamId/end', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { data, error } = await supabase
    .from('streams')
    .update({ is_live: false })
    .eq('id', streamId)
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Buscar mensagens do chat
router.get('/:streamId/messages', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { data, error } = await supabase
    .from('stream_messages')
    .select('*, users(name)')
    .eq('stream_id', streamId)
    .order('created_at', { ascending: true })

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Enviar mensagem no chat
router.post('/:streamId/messages', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { user_id, content } = req.body
  const { data, error } = await supabase
    .from('stream_messages')
    .insert({ stream_id: streamId, user_id, content })
    .select()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Buscar donates
router.get('/:streamId/donations', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { data, error } = await supabase
    .from('donations')
    .select('*, users(name)')
    .eq('stream_id', streamId)
    .order('created_at', { ascending: false })

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

// Fazer donate
router.post('/:streamId/donations', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { from_user_id, amount } = req.body
  const { data, error } = await supabase
    .from('donations')
    .insert({ stream_id: streamId, from_user_id, amount })
    .select()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json(data)
})

export default router