import { useEffect, useState } from 'react'

// ---------- Demo auth (accounts live in this browser only) ----------
// Real cloud accounts + sync arrive with the payments stage.
export function getUsers() {
  try { return JSON.parse(localStorage.getItem('kr_users')) || {} } catch { return {} }
}
function saveUsers(u) { localStorage.setItem('kr_users', JSON.stringify(u)) }

export function currentUser() {
  try { return JSON.parse(localStorage.getItem('kr_session')) } catch { return null }
}

export function signUp(name, email, password) {
  const users = getUsers()
  if (users[email]) return { error: 'This email already has an account. Log in instead.' }
  users[email] = { name, email, password }
  saveUsers(users)
  localStorage.setItem('kr_session', JSON.stringify(users[email]))
  seedDemoData(email)
  return { user: users[email] }
}

export function logIn(email, password) {
  const u = getUsers()[email]
  if (!u) return { error: 'No account with this email. Sign up first.' }
  if (u.password !== password) return { error: 'Wrong password. Try again.' }
  localStorage.setItem('kr_session', JSON.stringify(u))
  return { user: u }
}

export function googleSignIn() {
  const email = 'demo.creator@gmail.com'
  const users = getUsers()
  if (!users[email]) {
    users[email] = { name: 'Demo Creator', email, google: true }
    saveUsers(users)
    seedDemoData(email)
  }
  localStorage.setItem('kr_session', JSON.stringify(users[email]))
  return { user: users[email] }
}

export function logOut() { localStorage.removeItem('kr_session') }

// ---------- Per-user data storage ----------
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
function seedDemoData(email) {
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
