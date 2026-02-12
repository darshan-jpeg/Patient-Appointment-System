# Patient Appointment System (PAS)

Simple Express + MongoDB backend for clinicDB (patients, doctors, appointments). The server serves a static frontend from ../dist and exposes REST endpoints under `/api/*`.

**Hosted on Render:** https://patient-appointment-system-y3oo.onrender.com/
**Database hosted on:** MongoDB Atlas

## Prerequisites

* Node.js (16+ recommended)
* npm
* A MongoDB Atlas connection URI (database: `clinicDB`)

## Quick setup (local)

1. Open server folder
   eg below –

   ```bash
   cd "/Users/darsanp/Patient Appointment System/PAS/server"
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Environment variables

   * Create a `.env` in `PAS/server`.

     ```
     MONGO_URI="mongodb+srv://<username>:<password>@myprojects.vy0auv5.mongodb.net/clinicDB?retryWrites=true&w=majority"
     PORT=4000
     ```

4. Run in development

   ```bash
   npm run dev
   ```

5. Start (production)

   ```bash
   npm start
   ```
