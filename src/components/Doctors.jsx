import React, { useState, useEffect } from 'react'
import { getDoctors, createDoctor, deleteDoctor } from '../api/doctors'
import './pass.css'
import { emailRegex, isValidName, isValidDOB, isValidPhone } from '../utils/validation'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', specialization: '', department: '', gender: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  async function fetchList(q = '') {
    setLoading(true)
    try {
      const items = await getDoctors(q)
      setDoctors(items)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchList() }, [])
  useEffect(() => {
    const t = setTimeout(() => fetchList(search), 250)
    return () => clearTimeout(t)
  }, [search])

  async function addDoctor(e) {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.dob || !form.specialization.trim() || !form.department.trim() || !form.gender || !form.email.trim()) {
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
      const d = await createDoctor({ ...form })
      setDoctors(s => [d, ...s])
  setForm({ firstName: '', lastName: '', dob: '', specialization: '', department: '', gender: '', email: '', phone: '' })
    } catch (err) { console.error(err) }
  }

  async function removeDoctor(id) {
    if (!confirm('Remove this doctor? This will also remove related appointments.')) return
    try {
      await deleteDoctor(id)
      setDoctors(s => s.filter(x => x.id !== id))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="form-inline">
        <input placeholder="Search doctors" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

  <form className="form-inline" onSubmit={addDoctor} style={{ marginTop: 12 }}>
    <input placeholder="First name" value={form.firstName} onChange={e => { setForm({ ...form, firstName: e.target.value }); setFormError('') }} />
    <input placeholder="Last name" value={form.lastName} onChange={e => { setForm({ ...form, lastName: e.target.value }); setFormError('') }} />
    <input type="date" placeholder="DOB" value={form.dob} onChange={e => { setForm({ ...form, dob: e.target.value }); setFormError('') }} />
    <input placeholder="Specialization" value={form.specialization} onChange={e => { setForm({ ...form, specialization: e.target.value }); setFormError('') }} />
    <input placeholder="Department" value={form.department} onChange={e => { setForm({ ...form, department: e.target.value }); setFormError('') }} />
    <select value={form.gender} onChange={e => { setForm({ ...form, gender: e.target.value }); setFormError('') }}>
      <option value="">Gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
    <input placeholder="Email" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setFormError('') }} />
    <input placeholder="Phone (10 digits)" value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value }); setFormError('') }} />
    <button className="btn primary" disabled={!(form.firstName.trim() && form.lastName.trim() && form.dob && form.specialization.trim() && form.department.trim() && form.gender && form.email.trim() && form.phone.trim())}>Add Doctor</button>
  </form>
  {formError && <div className="empty" style={{ color: 'crimson', marginTop: 8 }}>{formError}</div>}

      <div className="list" style={{ marginTop: 16 }}>
        {loading && <div className="empty">Loading...</div>}
        {!loading && doctors.length === 0 && <div className="empty">No doctors found</div>}
        {doctors.map(d => (
          <div key={d.id} className="card">
            <div>
              <div className="muted">{d.doctorId} — {d.firstName} {d.lastName}</div>
              <div className="small">{d.specialization} • {d.department}</div>
              <div className="small muted">{d.gender || ''} {d.email ? `• ${d.email}` : ''} {d.phone ? `• ${d.phone}` : ''}</div>
            </div>
            <div className="actions">
              <button className="btn danger" onClick={() => removeDoctor(d.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
