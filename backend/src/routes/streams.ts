import { Router, Request, Response } from 'express'
import { supabase } from '../supabase'

const router = Router()

// Buscar mensagens do chat
router.get('/:streamId/messages', async (req: Request, res: Response) => {
  const { streamId } = req.params

  const { data, error } = await supabase
    .from('stream_messages')
    .select('*, users(name)')
    .eq('stream_id', streamId)
    .order('created_at', { ascending: true })

  if (error) return res.status(400).json({ error: error.message })
  return res.json(data)
})

// Enviar mensagem no chat
router.post('/:streamId/messages', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { user_id, content } = req.body

  const { data, error } = await supabase
    .from('stream_messages')
    .insert({ stream_id: streamId, user_id, content })
    .select()

  if (error) return res.status(400).json({ error: error.message })
  return res.json(data)
})

// Buscar donates da live
router.get('/:streamId/donations', async (req: Request, res: Response) => {
  const { streamId } = req.params

  const { data, error } = await supabase
    .from('donations')
    .select('*, users(name)')
    .eq('stream_id', streamId)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  return res.json(data)
})

// Fazer donate
router.post('/:streamId/donations', async (req: Request, res: Response) => {
  const { streamId } = req.params
  const { from_user_id, amount } = req.body

  const { data, error } = await supabase
    .from('donations')
    .insert({ stream_id: streamId, from_user_id, amount })
    .select()

  if (error) return res.status(400).json({ error: error.message })
  return res.json(data)
})

export default router