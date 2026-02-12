import express from 'express'
import Patient from '../models/Patient.js'

const router = express.Router()

const isValidEmail = (e) => typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)

// GET /api/patients?search=
router.get('/', async (req, res) => {
  try {
    const q = req.query.search ? { $or: [ { firstName: { $regex: req.query.search, $options: 'i' } }, { lastName: { $regex: req.query.search, $options: 'i' } }, { patientId: { $regex: req.query.search, $options: 'i' } } ] } : {}
    const items = await Patient.find(q).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    if (req.body.email && !isValidEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
    const p = await Patient.create(req.body)
    res.status(201).json(p)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    if (req.body.email && !isValidEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
    const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(p)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
