import express from 'express'
import Appointment from '../models/Appointment.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const items = await Appointment.find({}).sort({ datetime: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    // validate datetime
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
    // validate datetime if provided
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
