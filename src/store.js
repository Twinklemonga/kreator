import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

// ---------- Real auth (Supabase): accounts live in the cloud ----------
// One account works on every device. Email + password and Google sign-in.

let activeUser = null
export function setActiveUser(u) { activeUser = u }
export function currentUser() { return activeUser }

function shapeUser(u) {
  if (!u) return null
  const name =
    u.user_metadata?.name ||
    u.user_metadata?.full_name ||
    (u.email ? u.email.split('@')[0] : 'Creator')
  return { id: u.id, name, email: u.email }
}

function friendlyError(msg = '') {
  if (msg.includes('Invalid login credentials')) return 'Wrong email or password. Try again.'
  if (msg.includes('User already registered')) return 'This email already has an account. Log in instead.'
  if (msg.includes('Password should be')) return 'Password needs at least 6 characters.'
  if (msg.includes('Unable to validate email')) return "That email address doesn't look right."
  if (msg.includes('Email rate limit')) return 'Too many attempts. Wait a minute and try again.'
  return msg
}

const NOT_SETUP = 'Login is not connected yet. Add the Supabase keys to .env / Vercel and redeploy.'

// Read the saved session once when the app opens (keeps you logged in).
export async function getInitialUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return shapeUser(data?.session?.user)
}

// Fires on log in, log out, and when Google sign-in returns to the app.
export function onUserChange(cb) {
  if (!supabase) return () => {}
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(shapeUser(session?.user))
  })
  return () => subscription.unsubscribe()
}

export async function signUp(name, email, password) {
  if (!supabase) return { error: NOT_SETUP }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name || 'Creator' } },
  })
  if (error) return { error: friendlyError(error.message) }
  if (!data.session) {
    // Supabase "Confirm email" is ON: no session until the email link is clicked.
    return { info: 'Account created! Open the confirmation email, click the link, then log in.' }
  }
  return { user: shapeUser(data.user) }
}

export async function logIn(email, password) {
  if (!supabase) return { error: NOT_SETUP }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: friendlyError(error.message) }
  return { user: shapeUser(data.user) }
}

export async function googleSignIn() {
  if (!supabase) return { error: NOT_SETUP }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) return { error: friendlyError(error.message) }
  return {} // browser is now redirecting to Google
}

export async function logOut() {
  if (supabase) await supabase.auth.signOut()
}

// ---------- Per-user data storage (still in the browser, keyed by account) ----------
export function useStore(key, initial) {
  const u = currentUser()
  const full = u ? `kr_${u.email}_${key}` : `kr_guest_${key}`
  const [v, setV] = useState(() => {
    try { return JSON.parse(localStorage.getItem(full)) ?? initial } catch { return initial }
  })
  useEffect(() => { localStorage.setItem(full, JSON.stringify(v)) }, [full, v])
  return [v, setV]
}

// ---------- Demo seed data so charts and boards look alive on day 1 ----------
export function seedDemoData(email) {
  const p = `kr_${email}_`
  if (localStorage.getItem(p + 'deals')) return
  const m = new Date().getMonth()
  const monthKey = (back) => {
    const d = new Date(); d.setMonth(m - back)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  const deals = [
    { id: 1, brand: 'Dot & Key', amount: 12000, stage: 'Paid', month: monthKey(4), platform: 'Instagram' },
    { id: 2, brand: 'Mamaearth', amount: 8500, stage: 'Paid', month: monthKey(3), platform: 'Instagram' },
    { id: 3, brand: 'boAt', amount: 15000, stage: 'Paid', month: monthKey(2), platform: 'YouTube' },
    { id: 4, brand: 'The Souled Store', amount: 6000, stage: 'Paid', month: monthKey(1), platform: 'Instagram' },
    { id: 5, brand: 'Plum', amount: 9000, stage: 'Paid', month: monthKey(0), platform: 'Instagram' },
    { id: 6, brand: 'Zouk', amount: 11000, stage: 'Delivered', month: monthKey(0), platform: 'Instagram' },
    { id: 7, brand: 'Kapiva', amount: 7500, stage: 'Confirmed', month: monthKey(0), platform: 'Reels' },
    { id: 8, brand: 'Nykaa', amount: 14000, stage: 'Negotiating', month: monthKey(0), platform: 'Instagram' },
    { id: 9, brand: 'Campus Shoes', amount: 5000, stage: 'Pitched', month: monthKey(0), platform: 'Reels' },
  ]
  localStorage.setItem(p + 'deals', JSON.stringify(deals))
  const today = new Date()
  const iso = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10) }
  const posts = [
    { id: 1, title: 'GRWM reel for Plum', date: iso(1), platform: 'Instagram', type: 'Reel' },
    { id: 2, title: 'Unboxing: Zouk bag', date: iso(3), platform: 'Instagram', type: 'Story' },
    { id: 3, title: 'Kapiva morning routine', date: iso(5), platform: 'Reels', type: 'Reel' },
    { id: 4, title: 'Monthly favourites vlog', date: iso(8), platform: 'YouTube', type: 'Video' },
  ]
  localStorage.setItem(p + 'posts', JSON.stringify(posts))
}

export const STAGES = ['Pitched', 'Negotiating', 'Confirmed', 'Delivered', 'Paid']
export const STAGE_COLORS = {
  Pitched: '#38bdf8', Negotiating: '#fbbf24', Confirmed: '#a78bfa',
  Delivered: '#fb7185', Paid: '#34d399',
}
export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')
