import mongoose from 'mongoose'

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  email: { type: String },
  phone: { type: String }
}, { timestamps: true, collection: 'patients' })

PatientSchema.pre('save', function(next) {
  if (!this.patientId) {
    const rnd = Math.floor(Math.random() * 900 + 100)
    this.patientId = `P${Date.now().toString().slice(-8)}${rnd}`
  }
  next()
})

export default mongoose.model('Patient', PatientSchema)
