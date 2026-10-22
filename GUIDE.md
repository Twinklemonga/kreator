# Kreator V4 — real login setup guide (Supabase)

You do NOT need to understand the code. Follow the stages one by one.
V4 replaces the demo login with real accounts: email + password, and "Continue with Google".
One account will work on every device.

## Stage 1 — put the new code into your project (same as last time)

1. Download `kreator-v4.zip` from the Drive link, double-click to unzip. You get a folder called `kreator`.
2. Open Finder → go to your OLD kreator folder (the one connected to GitHub).
3. Click inside it, press Cmd + A, then Cmd + Delete. Empty trash. (Hidden files like `.git` stay safe — that keeps the GitHub connection.)
4. Open the NEW unzipped `kreator` folder, Cmd + A, Cmd + C.
5. Back in the OLD folder, Cmd + V.
6. Open VS Code → File → Open Folder → the old kreator folder.
7. VS Code top menu → Terminal → New Terminal. Paste, Enter:

```
npm install
```

(This adds the Supabase library. Wait for "added N packages".)

## Stage 2 — create the Supabase project (skip ahead if already done)

1. Go to https://supabase.com → Sign in (use your GitHub or Google account) → New project.
2. Name: `kreator`. Database password: click Generate, then COPY it into Notes somewhere safe (you won't need it today).
3. Region: Mumbai (or Singapore). Create project. Wait ~2 minutes while it spins up.

## Stage 3 — copy your two keys into a local .env file

1. In Supabase: left sidebar bottom → gear icon (Project Settings) → **API**.
2. You need exactly two values from this page:
   - **Project URL** (looks like https://abcdefgh.supabase.co)
   - the **anon** / **public** key (long text starting with `eyJ...`)
   ⚠️ Use ONLY the "anon public" key. NEVER copy the "service_role" key anywhere.
3. In VS Code: in the file list, find `.env.example`. Right-click it → Copy, then right-click in the file list → Paste. Rename the copy to `.env` (dot at the start, no extension).
4. Open your new `.env` and replace the two placeholder lines with your real values, like:

```
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...(your long key)
```

5. Save (Cmd + S). This file stays on your laptop only — `.gitignore` already blocks it from GitHub.

## Stage 4 — test login on your laptop

1. In the VS Code terminal, paste:

```
npm run dev
```

2. Open http://localhost:5173 → Sign up with your real email + a password (6+ characters).
3. You should land in the dashboard. Log out, log back in — it remembers you.
4. If you see "Account created! Open the confirmation email…" instead of the dashboard: Supabase is asking you to confirm your email. Either click the link in the email, or turn the check off: Supabase → Authentication → Sign In / Up → Email → toggle **Confirm email** OFF → Save. (Off is easier for class demos.)

## Stage 5 — tell Supabase your real website addresses

1. Supabase → **Authentication** → **URL Configuration**.
2. Site URL: set to `https://www.thekreator.in` → Save.
3. Redirect URLs → Add URL, one at a time (all four):

```
http://localhost:5173/**
https://www.thekreator.in/**
https://thekreator.in/**
https://kreator-gray.vercel.app/**
```

4. Save.

## Stage 6 — add the same two keys to Vercel

1. https://vercel.com → your kreator project → **Settings** → **Environment Variables**.
2. Add `VITE_SUPABASE_URL` = your Project URL (tick Production, Preview, Development) → Save.
3. Add `VITE_SUPABASE_ANON_KEY` = your anon public key (same three ticks) → Save.

## Stage 7 — publish

1. VS Code → Source Control icon (left bar).
2. Message: `V4: real login with Supabase (email + Google)`
3. Commit → Sync Changes.
4. Wait 1-2 minutes, open www.thekreator.in, hard refresh (Cmd + Shift + R).
5. Sign up on the live site, log out, log in. ✅ Email login done.

## Stage 8 — turn on real "Continue with Google"

Part A — Google Cloud:
1. Go to https://console.cloud.google.com (sign in with your Gmail).
2. Top-left project dropdown → New Project → name `kreator` → Create.
3. Left menu → APIs & Services → **OAuth consent screen** → External → Create.
4. App name: `Kreator`. User support email: your email. Scroll down → Developer contact: your email → Save and Continue (skip Scopes, skip Test users) → Back to Dashboard.
5. Click **Publish app** → Confirm. (So anyone can sign in, not just test users.)

Part B — connect it to Supabase:
1. In Supabase → Authentication → Sign In / Up → **Google** → toggle ON.
2. It shows a **Callback URL** like `https://abcdefgh.supabase.co/auth/v1/callback` — copy it.
3. Back in Google Cloud → APIs & Services → **Credentials** → Create Credentials → **OAuth client ID**.
4. Application type: **Web application**. Name: `Kreator`.
5. Authorized redirect URIs → Add URI → paste the Supabase callback URL → Create.
6. Copy the **Client ID** and **Client Secret** it shows.
7. Paste both into the Supabase Google provider box → Save.

Part C — test:
1. Open www.thekreator.in → Continue with Google → pick your Google account → you should land in the dashboard. 🎉

## If something breaks
- Send Instinct a screenshot of the exact screen/error.
- "Login is not connected yet" message on the site = env vars missing (Stage 3 or 6).
- Google button spins forever = redirect URLs missing (Stage 5) or Google OAuth not saved (Stage 8B).
