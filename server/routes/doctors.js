import express from 'express'
import Doctor from '../models/Doctor.js'
import Appointment from '../models/Appointment.js'

const router = express.Router()

const isValidEmail = (e) => typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)

router.get('/', async (req, res) => {
  try {
    const q = req.query.search ? { $or: [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { specialization: { $regex: req.query.search, $options: 'i' } },
      { department: { $regex: req.query.search, $options: 'i' } },
      { doctorId: { $regex: req.query.search, $options: 'i' } }
    ] } : {}
    const items = await Doctor.find(q).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    if (req.body.email && !isValidEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
    const d = await Doctor.create(req.body)
    res.status(201).json(d)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    if (req.body.email && !isValidEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
    const d = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(d)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id)
    // remove appointments for this doctor
    await Appointment.deleteMany({ doctorId: req.params.id })
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
