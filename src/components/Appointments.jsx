import React, { useState, useEffect } from 'react'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments'
import { getPatients } from '../api/patients'
import { getDoctors } from '../api/doctors'
import './pass.css'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ patientId: '', doctorId: '', datetime: '', notes: '' })
  const [patientInput, setPatientInput] = useState('')
  const [doctorInput, setDoctorInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ patientId: '', doctorId: '', datetime: '', notes: '' })
  const [editPatientInput, setEditPatientInput] = useState('')
  const [editDoctorInput, setEditDoctorInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  async function fetchAll() {
    setLoading(true)
    try {
      const [ps, ds, ap] = await Promise.all([getPatients(), getDoctors(), getAppointments()])
      setPatients(ps)
      setDoctors(ds)
      setAppointments(ap)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  function parseSelectionValue(val) {
    if (!val) return ''
    const parts = val.split('||')
    if (parts.length === 2) return parts[0]
    return ''
  }

  function idFromLabel(label, list) {
    const found = list.find(item => {
      const nameOnly = `${item.firstName || ''} ${item.lastName || ''}`.trim()
      const withId = `${item.patientId || item.doctorId ? (item.patientId || item.doctorId) + ' — ' : ''}${nameOnly}`.trim()
      return label.toLowerCase() === nameOnly.toLowerCase() || label.toLowerCase() === withId.toLowerCase()
    })
    return found ? found.id : ''
  }

  async function handleSchedule(e) {
    e.preventDefault()
    setFormError('')
  let pid = form.patientId
    let did = form.doctorId
    if (!pid && patientInput) pid = parseSelectionValue(patientInput) || idFromLabel(patientInput, patients)
    if (!did && doctorInput) did = parseSelectionValue(doctorInput) || idFromLabel(doctorInput, doctors)

    if (!pid) return setFormError('Please select a valid patient from the list.')
    if (!did) return setFormError('Please select a valid doctor from the list.')
    if (!form.datetime) return setFormError('Please choose date and time for the appointment.')
    const selected = new Date(form.datetime)
    const now = new Date()
    if (selected < now) return setFormError('Cannot schedule an appointment in the past.')

    try {
      const a = await createAppointment({ patientId: pid, doctorId: did, datetime: form.datetime, notes: form.notes })
      setAppointments(s => [a, ...s])
      setForm({ patientId: '', doctorId: '', datetime: '', notes: '' })
      setPatientInput('')
      setDoctorInput('')
    } catch (err) { console.error(err); setFormError('Failed to schedule appointment') }
  }

  function startEdit(a) {
    setEditingId(a.id)
    setEditForm({ patientId: a.patientId, doctorId: a.doctorId, datetime: a.datetime ? new Date(a.datetime).toISOString().slice(0,16) : '', notes: a.notes || '' })
    const p = patients.find(x => x.id === a.patientId)
    const d = doctors.find(x => x.id === a.doctorId)
    setEditPatientInput(p ? `${p.id}||${p.patientId} — ${p.firstName} ${p.lastName}` : '')
    setEditDoctorInput(d ? `${d.id}||${d.doctorId} — ${d.firstName} ${d.lastName}` : '')
  }

  async function submitEdit(e) {
    e.preventDefault()
    setFormError('')
    let pid = editForm.patientId
    let did = editForm.doctorId
    if (!pid && editPatientInput) pid = parseSelectionValue(editPatientInput) || idFromLabel(editPatientInput, patients)
    if (!did && editDoctorInput) did = parseSelectionValue(editDoctorInput) || idFromLabel(editDoctorInput, doctors)

    if (!pid) return setFormError('Please select a valid patient for the appointment.')
    if (!did) return setFormError('Please select a valid doctor for the appointment.')
    if (!editForm.datetime) return setFormError('Please choose date and time.')

    try {
      const updated = await updateAppointment(editingId, { patientId: pid, doctorId: did, datetime: editForm.datetime, notes: editForm.notes })
      setAppointments(s => s.map(x => x.id === updated.id ? updated : x))
      setEditingId(null)
      setEditPatientInput('')
      setEditDoctorInput('')
    } catch (err) { console.error(err); setFormError('Failed to update appointment') }
  }

  async function cancelAppointment(id) {
    if (!confirm('Cancel this appointment?')) return
    try {
      await deleteAppointment(id)
      setAppointments(s => s.filter(x => x.id !== id))
    } catch (err) { console.error(err) }
  }

  function labelForPatient(id) { const p = patients.find(x => x.id === id); return p ? `${p.firstName} ${p.lastName}` : 'Unknown' }
  function labelForDoctor(id) { const d = doctors.find(x => x.id === id); return d ? `${d.firstName} ${d.lastName}` : 'Unknown' }

  return (
    <div>
      <form className="form-inline" onSubmit={handleSchedule}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input list="patients-list" placeholder="Search or choose patient" value={patientInput} onChange={e => { setPatientInput(e.target.value); setForm({ ...form, patientId: '' }) }} />
          <datalist id="patients-list">
            {patients.map(p => {
              const display = `${p.patientId} — ${p.firstName} ${p.lastName}`
              return <option key={p.id} value={`${p.id}||${display}`} />
            })}
          </datalist>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input list="doctors-list" placeholder="Search or choose doctor" value={doctorInput} onChange={e => { setDoctorInput(e.target.value); setForm({ ...form, doctorId: '' }) }} />
          <datalist id="doctors-list">
            {doctors.map(d => {
              const display = `${d.doctorId} — ${d.firstName} ${d.lastName} (${d.specialization || d.department || '—'})`
              return <option key={d.id} value={`${d.id}||${display}`} />
            })}
          </datalist>
        </div>

        <input type="datetime-local" value={form.datetime} onChange={e => setForm({...form, datetime: e.target.value})} />
        <input placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        <button className="btn primary">Schedule</button>
      </form>

      {formError && <div className="empty" style={{ color: 'crimson', marginTop: 8 }}>{formError}</div>}

      <div className="list" style={{ marginTop: 16 }}>
        {loading && <div className="empty">Loading...</div>}
        {!loading && appointments.length === 0 && <div className="empty">No appointments</div>}
        {appointments.map(a => (
          <div key={a.id} className="card">
            {editingId === a.id ? (
              <form className="form-inline" onSubmit={submitEdit} style={{ width: '100%' }}>
                <input list="patients-list-edit" placeholder="Patient" value={editPatientInput} onChange={e => { setEditPatientInput(e.target.value); setEditForm({ ...editForm, patientId: '' }) }} />
                <datalist id="patients-list-edit">
                  {patients.map(p => {
                    const display = `${p.firstName} ${p.lastName}`
                    return <option key={p.id} value={`${p.id}||${display}`} />
                  })}
                </datalist>

                <input list="doctors-list-edit" placeholder="Doctor" value={editDoctorInput} onChange={e => { setEditDoctorInput(e.target.value); setEditForm({ ...editForm, doctorId: '' }) }} />
                <datalist id="doctors-list-edit">
                  {doctors.map(d => {
                    const display = `${d.firstName} ${d.lastName}`
                    return <option key={d.id} value={`${d.id}||${display}`} />
                  })}
                </datalist>

                <input type="datetime-local" value={editForm.datetime} onChange={e => setEditForm({...editForm, datetime: e.target.value})} />
                <input placeholder="Notes" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} />
                <div className="actions">
                  <button className="btn">Save</button>
                  <button type="button" className="btn ghost" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <div className="muted">{labelForPatient(a.patientId)} — {labelForDoctor(a.doctorId)}</div>
                  <div className="small">{a.datetime ? new Date(a.datetime).toLocaleString() : ''}</div>
                  {a.notes && <div className="small muted">{a.notes}</div>}
                </div>
                <div className="actions">
                  <button className="btn" onClick={() => startEdit(a)}>Update</button>
                  <button className="btn danger" onClick={() => cancelAppointment(a.id)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
