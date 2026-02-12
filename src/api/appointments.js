import { API_BASE } from './index'

export async function getAppointments() {
  const res = await fetch(`${API_BASE}/appointments`)
  const items = await res.json()
  return items.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
}

export async function createAppointment(payload) {
  const res = await fetch(`${API_BASE}/appointments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const data = await res.json()
  return { id: data._id, ...data }
}

export async function updateAppointment(id, payload) {
  const res = await fetch(`${API_BASE}/appointments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const data = await res.json()
  return { id: data._id, ...data }
}

export async function deleteAppointment(id) {
  await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' })
}
