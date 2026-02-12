import mongoose from 'mongoose'

const DoctorSchema = new mongoose.Schema({
  doctorId: { type: String, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date },
  specialization: { type: String },
  department: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  email: { type: String },
  phone: { type: String }
}, { timestamps: true, collection: 'doctors' })

DoctorSchema.pre('save', function(next) {
  if (!this.doctorId) {
    const rnd = Math.floor(Math.random() * 900 + 100)
    this.doctorId = `D${Date.now().toString().slice(-8)}${rnd}`
  }
  next()
})

export default mongoose.model('Doctor', DoctorSchema)
