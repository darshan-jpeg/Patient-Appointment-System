import { API_BASE } from './index'

export async function getPatients(search = '') {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await fetch(`${API_BASE}/patients${q}`)
  const items = await res.json()
  return items.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
}

export async function createPatient(payload) {
  const res = await fetch(`${API_BASE}/patients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const data = await res.json()
  return { id: data._id, ...data }
}

export async function updatePatient(id, payload) {
  const res = await fetch(`${API_BASE}/patients/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const data = await res.json()
  return { id: data._id, ...data }
}

export async function deletePatient(id) {
  await fetch(`${API_BASE}/patients/${id}`, { method: 'DELETE' })
}
