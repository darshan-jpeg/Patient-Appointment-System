import './Landing.css';

function Landing({ onGetStarted }) {

return (

<div className="landing-container">
    <div>
    <h1 className="landing-title">Welcome to PAS</h1>
    <p className="landing-description">
      Your Personal Assistant System for managing tasks, schedules, and more.
    </p>
    <button className="landing-button" onClick={onGetStarted}>Get Started</button>
  </div>
</div>
    )
}

export default Landing;