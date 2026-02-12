import express from 'express'
import Patient from '../models/Patient.js'
import Appointment from '../models/Appointment.js'
import { isValidEmail, isValidName, isValidDOB, isValidPhone } from '../utils/validation.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const q = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { patientId: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {}
    const items = await Patient.find(q).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
  if (req.body.email && !isValidEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
  if (!isValidName(req.body.firstName) || !isValidName(req.body.lastName)) return res.status(400).json({ error: 'First and last name must contain letters and not contain numbers' })
  if (!isValidPhone(req.body.phone)) return res.status(400).json({ error: 'Phone must be 10 digits and contain numbers only' })
  if (!isValidDOB(req.body.dob)) return res.status(400).json({ error: 'Date of birth cannot be in the future' })
    const p = await Patient.create(req.body)
    res.status(201).json(p)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
  if (req.body.email && !isValidEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
  if (req.body.firstName && !isValidName(req.body.firstName)) return res.status(400).json({ error: 'Invalid first name' })
  if (req.body.lastName && !isValidName(req.body.lastName)) return res.status(400).json({ error: 'Invalid last name' })
  if (req.body.phone && !isValidPhone(req.body.phone)) return res.status(400).json({ error: 'Phone must be 10 digits and contain numbers only' })
  if (req.body.dob && !isValidDOB(req.body.dob)) return res.status(400).json({ error: 'Date of birth cannot be in the future' })
    const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(p)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id)
    await Appointment.deleteMany({ patientId: req.params.id })
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
