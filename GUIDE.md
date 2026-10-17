# Kreator: 2-hour launch guide (VS Code)

Product: Kreator, a creator CRM that replaces the social media manager for nano/micro creators (10k-100k followers, India). Plan: Rs 60/month via Razorpay.
The starter project is already built and tested (it builds cleanly). You don't write code. You copy, push, deploy.

## DO THESE 3 NOW (10 min)
1. Unzip kreator-starter.zip. In VS Code: File > Open Folder > pick the "kreator" folder.
2. Create a GitHub account at github.com/signup (skip if you have one).
3. Open godaddy.com/en-in and search domains (list below). Don't pay yet.

## Timeline
| Time | Step |
|---|---|
| 0:00-0:10 | The 3 actions above |
| 0:10-0:30 | Push code to GitHub |
| 0:30-0:55 | Deploy on Vercel |
| 0:55-1:20 | Buy domain, connect to Vercel |
| 1:20-1:40 | Razorpay payment link, plug into app |
| 1:40-2:00 | Test, screenshots, submit repo link |
Do GitHub + Vercel first. If time runs out, you can still submit the repo + Vercel link.

## Step 1: GitHub (VS Code)
1. In VS Code, click the Source Control icon (left bar, branch symbol).
2. Click "Initialize Repository". Type a message like "Kreator first version" and click Commit (say Yes if it asks to stage all).
3. Click "Publish Branch". Sign in to GitHub when the browser opens. Choose "Publish to GitHub public repository", name it `kreator`.
4. Open github.com/YOUR-USERNAME/kreator. Your files should be there. This URL is the repo link you submit.
If Git is not installed: install from git-scm.com, restart VS Code.
Terminal alternative (Terminal > New Terminal): create an empty repo on github.com (New repository, no README), then run the 3 command blocks GitHub shows under "push an existing repository from the command line". Before that, run:
```
git init
git add .
git commit -m "Kreator first version"
```

## Step 2: Vercel
1. vercel.com/signup > Continue with GitHub.
2. Add New > Project > Import the `kreator` repo.
3. Framework Preset should show Vite. Leave settings. Click Deploy.
4. In about a minute you get a link like kreator-xyz.vercel.app. Open it and check it works.
Every future push to GitHub redeploys automatically.

## Step 3: Domain (GoDaddy)
Availability (public registry lookup, read-only, Oct 17):
- Taken: kreator.in, kreator.app, kreator.club, kreator.store, kreator.studio
- Looked free: kreatorhq.in, trykreator.in, mykreator.in, kreatorapp.in, kreatorcrm.in, getkreator.co.in, kreatorcrm.com
Confirm on GoDaddy before paying; it shows the live price. GoDaddy India advertises first-year domains from about Rs 96. .in prices vary, so check the first-year and renewal price at checkout. Skip add-ons.
Suggestion: kreatorhq.in.

Connect to Vercel:
1. Vercel > your project > Settings > Domains > Add > type your domain.
2. Vercel shows DNS records (usually an A record 76.76.21.21 for the root and a CNAME for www; use exactly what Vercel shows).
3. GoDaddy > My Products > your domain > DNS > add/edit those records. Delete any old "parked" A record for @.
4. Wait until Vercel shows "Valid Configuration" (5-30 min, sometimes longer). Submit the vercel.app link too in case DNS is slow.

## Step 4: Razorpay Rs 60/month
Fastest route (no backend):
1. razorpay.com > Sign up. Test Mode is fine for the assignment (Live needs KYC).
2. Dashboard > Payment Links (or Subscriptions > Plans, then Subscription Links) > Create. Amount Rs 60, monthly.
3. Copy the link.
4. Vercel > Project > Settings > Environment Variables > add VITE_RAZORPAY_LINK = your link > Save > Deployments > Redeploy.
The "Subscribe with Razorpay" button then opens it. Say honestly in the submission that payment uses a Razorpay link.

## MVP features in the app
1. Landing page with price (Rs 60/month) and Subscribe button
2. Brand deal pipeline (Pitched, Negotiating, Confirmed, Delivered, Paid) with earnings total
3. Pricing helper: quote range from followers, engagement, deliverable, plus a counter-offer script
4. Content calendar for planned posts
5. Message templates (brand pitch, rate negotiation, payment reminder, PR/gifting reply) with one-click copy
Data is saved in the browser (no login or database). Pitch it as "v1 is local-first; accounts and database come next."

## Roadmap (not built)
User accounts, payment webhooks, AI editing support, Instagram integration.

## Pitch lines
- Problem: creators under 100k can't afford a Rs 15-30k/month social media manager.
- Solution: Kreator does the manager's job: deals, pricing, planning, messages.
- Price: Rs 60/month.

## Optional local run
Install Node.js LTS from nodejs.org, then in the VS Code terminal: npm install, then npm run dev. Not needed to deploy.

## What was tested
npm install and npm run build succeeded. I did not click through the UI in a browser, and Razorpay, Vercel and GoDaddy need your accounts, so those steps are untested.
