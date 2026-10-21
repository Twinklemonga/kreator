# Kreator 💜 — creator CRM

Kreator replaces the social media manager for nano and micro creators (10k–100k followers) in India.
Brand deals, rate calculator, content calendar, earnings graphs, pitch templates and invoices — ₹60/month.

**Live:** https://www.thekreator.in

## What's inside (V3)
- Instagram-themed UI: IG gradients, story-ring avatar, gradient-bordered glass cards, hand-rolled SVG charts (no chart library)
- Login / signup portal (demo auth stored in the browser) + Google-style demo sign-in
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

## Deploy
Push to GitHub — Vercel redeploys automatically.

## Notes
- Data (deals, posts, rates) is stored per account in the browser's localStorage.
- The AI pitch studio calls /api/generate-pitch (Vercel serverless). Locally `npm run dev` serves only the frontend, so the offline writer answers there; on Vercel set GEMINI_API_KEY for live AI. The key is read server-side only.
- Set `VITE_RAZORPAY_LINK` in Vercel env vars to light up the Subscribe button.
- Real cloud accounts + sync + Razorpay subscriptions are the next stage.
