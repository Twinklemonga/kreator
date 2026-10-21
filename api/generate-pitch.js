// Vercel serverless function: POST /api/generate-pitch
// Needs GEMINI_API_KEY set in Vercel > Settings > Environment Variables.
// Without a key it answers { fallback: true } and the app writes the pitch itself.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(200).json({ fallback: true })

  const { brand, product, deliverable, tone, notes, creator } = req.body || {}
  const prompt = `You are the manager of an Indian nano/micro social-media creator.
Write a short, natural ${tone || 'friendly'} brand-collaboration pitch (${deliverable || 'Instagram Reel'}).
Creator: ${creator?.name || 'the creator'}, niche: ${creator?.niche || 'lifestyle'}, followers: ${creator?.followers || 20000}, engagement: ${creator?.er || 4}%.
Brand: ${brand || 'the brand'}. Product/campaign: ${product || 'their products'}.
${notes ? 'Extra context from the creator: ' + notes : ''}
Rules: sound human and warm, not corporate. Max 90 words for DM style. End with one clear question. No hashtags. Output only the pitch text.`

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    )
    const j = await r.json()
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!text) return res.status(200).json({ fallback: true })
    return res.status(200).json({ text })
  } catch {
    return res.status(200).json({ fallback: true })
  }
}
