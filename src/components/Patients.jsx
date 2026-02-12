import React, { useState, useEffect } from 'react'
import { getPatients, createPatient, updatePatient, deletePatient } from '../api/patients'
import './pass.css'
import { emailRegex, isValidName, isValidDOB, isValidPhone } from '../utils/validation'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', gender: '', email: '', phone: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', dob: '', gender: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [editFormError, setEditFormError] = useState('')

  async function fetchList(q = '') {
    setLoading(true)
    try {
      const items = await getPatients(q)
      setPatients(items)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])


  useEffect(() => {
    const t = setTimeout(() => fetchList(search), 250)
    return () => clearTimeout(t)
  }, [search])

  async function addPatient(e) {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.dob || !form.gender || !form.email.trim() || !form.phone.trim()) {
      setFormError('Enter all details to submit')
      return
    }
    if (!isValidName(form.firstName) || !isValidName(form.lastName)) {
      setFormError('First and last name must contain letters and not contain numbers')
      return
    }
    if (!emailRegex.test(form.email)) {
      setFormError('Invalid email')
      return
    }
    if (!isValidPhone(form.phone)) {
      setFormError('Phone must be 10 digits and contain numbers only')
      return
    }
    if (!isValidDOB(form.dob)) {
      setFormError('Date of birth cannot be in the future')
      return
    }
    try {
      const p = await createPatient({ ...form })
      setPatients((s) => [p, ...s])
    setForm({ firstName: '', lastName: '', dob: '', gender: '', email: '', phone: '' })
    } catch (err) { console.error(err) }
  }

  function startEdit(p) {
    setEditingId(p.id)
    setEditForm({ firstName: p.firstName || '', lastName: p.lastName || '', dob: p.dob ? new Date(p.dob).toISOString().slice(0,10) : '', gender: p.gender || '', email: p.email || '', phone: p.phone || '' })
  }

  async function submitEdit(e) {
    e.preventDefault()
    if (!editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.dob || !editForm.gender || !editForm.email.trim() || !editForm.phone.trim()) {
      setEditFormError('Enter all details to submit')
      return
    }
    if (!isValidName(editForm.firstName) || !isValidName(editForm.lastName)) {
      setEditFormError('First and last name must contain letters and not contain numbers')
      return
    }
    if (!emailRegex.test(editForm.email)) {
      setEditFormError('Invalid email')
      return
    }
    if (!isValidPhone(editForm.phone)) {
      setEditFormError('Phone must be 10 digits and contain numbers only')
      return
    }
    if (!isValidDOB(editForm.dob)) {
      setEditFormError('Date of birth cannot be in the future')
      return
    }
    try {
      const updated = await updatePatient(editingId, { ...editForm })
      setPatients((s) => s.map(x => x.id === updated.id ? updated : x))
      setEditingId(null)
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="form-inline">
        <input placeholder="Search patients" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <form className="form-inline" onSubmit={addPatient} style={{ marginTop: 12 }}>
        <input placeholder="First name" value={form.firstName} onChange={e => { setForm({ ...form, firstName: e.target.value }); setFormError('') }} />
        <input placeholder="Last name" value={form.lastName} onChange={e => { setForm({ ...form, lastName: e.target.value }); setFormError('') }} />
        <input type="date" placeholder="DOB" value={form.dob} onChange={e => { setForm({ ...form, dob: e.target.value }); setFormError('') }} />
        <select value={form.gender} onChange={e => { setForm({ ...form, gender: e.target.value }); setFormError('') }}>
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input placeholder="Email" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setFormError('') }} />
        <input placeholder="Phone (10 digits)" value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value }); setFormError('') }} />
        <button className="btn primary" disabled={!(form.firstName.trim() && form.lastName.trim() && form.dob && form.gender && form.email.trim())}>Add Patient</button>
      </form>
      {formError && <div className="empty" style={{ color: 'crimson', marginTop: 8 }}>{formError}</div>}

      <div className="list" style={{ marginTop: 16 }}>
        {loading && <div className="empty">Loading...</div>}
        {!loading && patients.length === 0 && <div className="empty">No patients found</div>}
        {patients.map(p => (
          <div key={p.id} className="card">
            {editingId === p.id ? (
              <form className="form-inline" onSubmit={submitEdit} style={{ width: '100%' }}>
                <input style={{ flex: 1 }} value={editForm.firstName} onChange={e => { setEditForm({ ...editForm, firstName: e.target.value }); setEditFormError('') }} />
                <input style={{ flex: 1 }} value={editForm.lastName} onChange={e => { setEditForm({ ...editForm, lastName: e.target.value }); setEditFormError('') }} />
                <input type="date" value={editForm.dob} onChange={e => { setEditForm({ ...editForm, dob: e.target.value }); setEditFormError('') }} />
                <select value={editForm.gender} onChange={e => { setEditForm({ ...editForm, gender: e.target.value }); setEditFormError('') }}>
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input style={{ flex: 1 }} value={editForm.email} onChange={e => { setEditForm({ ...editForm, email: e.target.value }); setEditFormError('') }} />
                <input style={{ flex: 1 }} placeholder="Phone (10 digits)" value={editForm.phone} onChange={e => { setEditForm({ ...editForm, phone: e.target.value }); setEditFormError('') }} />
                {editFormError && <div className="empty" style={{ color: 'crimson', marginTop: 8, width: '100%' }}>{editFormError}</div>}
                <div className="actions">
                  <button className="btn" disabled={!(editForm.firstName.trim() && editForm.lastName.trim() && editForm.dob && editForm.gender && editForm.email.trim())}>Save</button>
                  <button type="button" className="btn ghost" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <div className="muted">{p.patientId} — {p.firstName} {p.lastName}</div>
                  <div className="small">DOB: {p.dob ? new Date(p.dob).toLocaleDateString() : '—'}</div>
                  <div className="small muted">{p.gender || ''} {p.email ? `• ${p.email}` : ''} {p.phone ? `• ${p.phone}` : ''}</div>
                </div>
                <div className="actions">
                  <button className="btn" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn danger" onClick={async () => {
                    if (!confirm('Delete this patient?')) return
                    try {
                      await deletePatient(p.id)
                      setPatients(s => s.filter(x => x.id !== p.id))
                    } catch (err) { console.error(err) }
                  }}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
