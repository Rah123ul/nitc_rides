export default function LandingPage({ onRole }) {
  return (
    <div className="landing">
      <div className="l-logo">NITC<span>Rides</span></div>
      <div className="l-tag">Smart campus mobility for<br/>NIT Calicut students &amp; drivers</div>
      <div className="l-q">Who are you?</div>
      <div className="role-cards">
        <div className="role-card" onClick={() => onRole("student")}>
          <div className="rc-icon rci-s">🎓</div>
          <div className="rc-text">
            <div className="rt">I'm a Student</div>
            <div className="rs">Book &amp; share rides on campus</div>
          </div>
          <div className="rc-arr">›</div>
        </div>
        <div className="role-card" onClick={() => onRole("driver")}>
          <div className="rc-icon rci-d">🛺</div>
          <div className="rc-text">
            <div className="rt">I'm a Driver</div>
            <div className="rs">Manage your vehicle &amp; earn</div>
          </div>
          <div className="rc-arr">›</div>
        </div>
      </div>
      <div className="l-foot">NIT Calicut · Campus Ride Sharing<br/>Built for students, by a student</div>
    </div>
  );
}
