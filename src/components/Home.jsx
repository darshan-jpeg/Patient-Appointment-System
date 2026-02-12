import React, { useState } from 'react'
import './Home.css'
import Patients from './Patients'
import Doctors from './Doctors'
import Appointments from './Appointments'

export default function Home({ onBack }) {
  const [tab, setTab] = useState('patients')

  return (
    <div className="home-root">
      <header className="app-header">
        <div className="brand">PAS</div>
        <nav className="nav">
          <button className={tab === 'patients' ? 'active' : ''} onClick={() => setTab('patients')}>Patients</button>
          <button className={tab === 'doctors' ? 'active' : ''} onClick={() => setTab('doctors')}>Doctors</button>
          <button className={tab === 'appointments' ? 'active' : ''} onClick={() => setTab('appointments')}>Appointments</button>
        </nav>
        <div className="header-actions">
          <button className="btn ghost" onClick={onBack}>Back</button>
        </div>
      </header>

      <main className="container">
        {tab === 'patients' && (
          <section className="section-card">
            <Patients />
          </section>
        )}

        {tab === 'doctors' && (
          <section className="section-card">
            <Doctors />
          </section>
        )}

        {tab === 'appointments' && (
          <section className="section-card">
            <Appointments />
          </section>
        )}
      </main>
    </div>
  )
}
