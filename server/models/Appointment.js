import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  datetime: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true, collection: 'appointments' })

export default mongoose.model('Appointment', AppointmentSchema)
