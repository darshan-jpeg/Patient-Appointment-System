import React, { useState } from 'react'
import Landing from './components/Landing'
import Home from './components/Home'

function App() {
  const [view, setView] = useState('landing')

  return (
    <>
      {view === 'landing' ? (
        <Landing onGetStarted={() => setView('home')} />
      ) : (
        <Home onBack={() => setView('landing')} />
      )}
    </>
  )
}

export default App
