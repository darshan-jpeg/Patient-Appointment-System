import express from 'express'
import Appointment from '../models/Appointment.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { search, from, to } = req.query
  let items = await Appointment.find({}).sort({ datetime: -1 }).populate('patientId').populate('doctorId')

    
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(a => {
        const p = a.patientId || {}
        const d = a.doctorId || {}
        const pName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase()
        const dName = `${d.firstName || ''} ${d.lastName || ''}`.toLowerCase()
        const pBiz = (p.patientId || '').toString().toLowerCase()
        const dBiz = (d.doctorId || '').toString().toLowerCase()
        return pName.includes(q) || dName.includes(q) || pBiz.includes(q) || dBiz.includes(q)
      })
    }

    
    if (from) {
      const fromDt = new Date(from)
      if (!isNaN(fromDt.getTime())) items = items.filter(a => new Date(a.datetime) >= fromDt)
    }
    if (to) {
      const toDt = new Date(to)
      if (!isNaN(toDt.getTime())) items = items.filter(a => new Date(a.datetime) <= toDt)
    }

    
    const out = items.map(a => {
      const ap = a.toObject ? a.toObject() : a
      ap.patientId = ap.patientId && ap.patientId._id ? ap.patientId._id : ap.patientId
      ap.doctorId = ap.doctorId && ap.doctorId._id ? ap.doctorId._id : ap.doctorId
      return ap
    })
    res.json(out)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
  if (!req.body.datetime) return res.status(400).json({ error: 'datetime is required' })
    const dt = new Date(req.body.datetime)
    if (isNaN(dt.getTime())) return res.status(400).json({ error: 'Invalid datetime' })
    const now = new Date()
    if (dt < now) return res.status(400).json({ error: 'Appointment datetime cannot be in the past' })

    const a = await Appointment.create(req.body)
    res.status(201).json(a)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
  if (req.body.datetime) {
      const dt = new Date(req.body.datetime)
      if (isNaN(dt.getTime())) return res.status(400).json({ error: 'Invalid datetime' })
      const now = new Date()
      if (dt < now) return res.status(400).json({ error: 'Appointment datetime cannot be in the past' })
    }

    const a = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(a)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
