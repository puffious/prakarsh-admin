import { getSupabaseClient } from '../_supabaseClient.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { category } = req.query

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('events').select('*').eq('category', category)
    if (error) throw error
    return res.status(200).json(data ?? [])
  } catch (err) {
    console.error(`Error fetching events for category ${category}`, err)
    return res.status(500).json({ error: 'Internal Server Error', details: err.message })
  }
}
