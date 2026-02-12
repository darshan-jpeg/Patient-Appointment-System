import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import patientsRouter from './routes/patients.js'
import doctorsRouter from './routes/doctors.js'
import appointmentsRouter from './routes/appointments.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err))

app.use('/api/patients', patientsRouter)
app.use('/api/doctors', doctorsRouter)
app.use('/api/appointments', appointmentsRouter)

app.get('/', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
