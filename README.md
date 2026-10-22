# Kreator 💜 — creator CRM

Kreator replaces the social media manager for nano and micro creators (10k–100k followers) in India.
Brand deals, rate calculator, content calendar, earnings graphs, pitch templates and invoices — ₹60/month.

**Live:** https://www.thekreator.in

## What's inside (V4)
- **Real login with Supabase**: email + password accounts and "Continue with Google" — one account works on every device
- Instagram-themed UI: IG gradients, story-ring avatar, gradient-bordered glass cards, hand-rolled SVG charts (no chart library)
- Overview dashboard with earnings graph, pipeline donut and upcoming posts
- Brand deals kanban (Pitched → Negotiating → Confirmed → Delivered → Paid)
- Rate card calculator + copy-paste pitch line
- Content calendar with month view
- Earnings page (monthly bars, trend area, platform split, pending payments)
- AI pitch studio (Vercel serverless function + Gemini; offline template fallback without a key) plus 6 ready pitch templates auto-filled from your rate card
- Invoice generator with GST toggle and print-to-PDF

## Run it
```bash
npm install
npm run dev
```
Open http://localhost:5173

Login needs two Supabase values: copy `.env.example` to `.env` and paste your
Project URL + anon key from Supabase (Project Settings > API). The same two
names go in Vercel > Settings > Environment Variables for the live site.

## Deploy
Push to GitHub — Vercel redeploys automatically.

## Notes
- Auth is handled by Supabase Auth (email/password + Google OAuth). The anon key is safe to expose to browsers by design; real protection comes from Supabase's server-side policies.
- App data (deals, posts, rates) is still stored per account in the browser's localStorage; cloud data sync is a later stage.
- The AI pitch studio calls /api/generate-pitch (Vercel serverless). Locally `npm run dev` serves only the frontend, so the offline writer answers there; on Vercel set GEMINI_API_KEY for live AI. The key is read server-side only.
- Set `VITE_RAZORPAY_LINK` in Vercel env vars to light up the Subscribe button. Razorpay subscriptions are the next stage.
