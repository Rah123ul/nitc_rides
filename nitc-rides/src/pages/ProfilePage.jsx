export default function ProfilePage({ user, onLogout }) {
  const isS = user.role === "student";
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className={`profile-ava ${isS ? "pa-s" : "pa-d"}`}>
          {user.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.phone_number || user.phone}</div>
        <div className={`profile-role ${isS ? "pr-s" : "pr-d"}`}>{isS ? "🎓 Student" : "🛺 Driver"}</div>
      </div>
      <div className="info-card">
        {!isS && user.vehicle_type && (
          <div className="info-row">
            <span className="ir-lbl">Vehicle</span>
            <span className="ir-val">{user.vehicle_type}</span>
          </div>
        )}
        {!isS && user.license_number && (
          <div className="info-row">
            <span className="ir-lbl">License No.</span>
            <span className="ir-val">{user.license_number}</span>
          </div>
        )}
        <div className="info-row">
          <span className="ir-lbl">Phone</span>
          <span className="ir-val">{user.phone_number || user.phone || "—"}</span>
        </div>
        <div className="info-row">
          <span className="ir-lbl">Account type</span>
          <span className="ir-val">{isS ? "Student" : "Driver"}</span>
        </div>
      </div>
      <button className="logout-btn" onClick={onLogout}>Sign Out</button>
    </div>
  );
}
