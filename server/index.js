import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

// Prefer explicit server env vars; fall back to Vite vars for convenience
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

app.use(cors())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// GET /events -> all events
app.get('/events', async (_req, res) => {
  const { data, error } = await supabase.from('events').select('*')
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.json(data ?? [])
})

// GET /events/:category -> events filtered by category
app.get('/events/:category', async (req, res) => {
  const category = req.params.category
  const { data, error } = await supabase.from('events').select('*').eq('category', category)
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.json(data ?? [])
})

app.listen(PORT, () => {
  console.log(`API server listening on http://0.0.0.0:${PORT}`)
})
