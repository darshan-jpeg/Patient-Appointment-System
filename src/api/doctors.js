import { API_BASE } from './index'

export async function getDoctors(search = '') {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await fetch(`${API_BASE}/doctors${q}`)
  const items = await res.json()
  return items.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
}

export async function createDoctor(payload) {
  const res = await fetch(`${API_BASE}/doctors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const data = await res.json()
  return { id: data._id, ...data }
}

export async function updateDoctor(id, payload) {
  const res = await fetch(`${API_BASE}/doctors/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const data = await res.json()
  return { id: data._id, ...data }
}

export async function deleteDoctor(id) {
  await fetch(`${API_BASE}/doctors/${id}`, { method: 'DELETE' })
}
