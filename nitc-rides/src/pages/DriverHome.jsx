import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api";
import { calcFare, fmt, vehicleKey, INCENTIVE } from "../constants";
import SeatGrid from "../components/SeatGrid";
import SeatBar from "../components/SeatBar";

export default function DriverHome({ user, showToast }) {
  const [status, setStatus] = useState(user.status || "offline");   // "offline" | "active"
  const [activeRide, setActiveRide] = useState(null);               // current ride object
  const [routes, setRoutes] = useState([]);                          // all available routes
  const [stats, setStats] = useState({ trips_today: 0 });
  const [loading, setLoading] = useState(false);
  const [pendingBookings, setPendingBookings] = useState([]);

  const vKey = vehicleKey(user.vehicle_type || user.vehicle);
  const maxSeats = vKey === "minivan" ? 8 : 4;
  const filledSeats = activeRide ? activeRide.current_passengers : 0;
  const sampleBase = 50;
  const INCENTIVE_VAL = INCENTIVE[vKey] || 10;
  const estEarned = stats.trips_today * (sampleBase + INCENTIVE_VAL * 1.5) | 0;

  // Fetch available routes for dropdown
  const fetchRoutes = useCallback(async () => {
    try {
      const data = await apiFetch("/routes");
      setRoutes(data.routes || []);
      if ((data.routes || []).length > 0 && !selectedRouteId) {
        setSelectedRouteId(String(data.routes[0].id));
      }
    } catch { /* ignore */ }
  }, []);

  // Fetch driver stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await apiFetch("/rides/my-stats");
      setStats(data);
      if (data.active_ride) {
        setActiveRide(data.active_ride);
        setStatus("active");

        // Also fetch pending bookings
        try {
            const pendingData = await apiFetch("/bookings/driver/pending");
            setPendingBookings(pendingData.bookings || []);
        } catch {}
      } else {
        setActiveRide(null);
        if (status === "active") setStatus("offline");
        setPendingBookings([]);
      }
    } catch { /* ignore */ }
  }, [status]);

  const confirmBooking = async (id) => {
    try {
        const res = await apiFetch("/bookings/driver/confirm", {
            method: "POST",
            body: JSON.stringify({ booking_id: id })
        });
        showToast(res.message || "Booking confirmed");
        fetchStats();
    } catch (err) {
        showToast("❌ " + err.message);
    }
  };

  const rejectBooking = async (id) => {
    try {
        const res = await apiFetch("/bookings/driver/reject", {
            method: "POST",
            body: JSON.stringify({ booking_id: id })
        });
        showToast(res.message || "Booking rejected");
        fetchStats();
    } catch (err) {
        showToast("❌ " + err.message);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchStats();
    const id = setInterval(fetchStats, 6000);
    return () => clearInterval(id);
  }, [fetchRoutes, fetchStats]);

  const goOnline = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/rides/start", {
        method: "POST",
      });
      setActiveRide(data.ride);
      setStatus("active");
      showToast("✅ You're now online!");
    } catch (e) {
      showToast("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const goOffline = async () => {
    if (!activeRide) { setStatus("offline"); return; }
    setLoading(true);
    try {
      await apiFetch("/rides/complete", {
        method: "POST",
        body: JSON.stringify({ ride_id: activeRide.id }),
      });
      setActiveRide(null);
      setStatus("offline");
      showToast("Trip completed! You're now offline.");
      fetchStats();
    } catch (e) {
      showToast("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="drv-home">
      <div className="drv-hero">
        <div className="dh-welcome">Welcome back,</div>
        <div className="dh-name">{user.name} 👋</div>
        <div className="dh-vehicle">
          {vKey === "minivan" ? "🚐 Magic Minivan" : "🛺 Auto Rickshaw"}
          {user.license_number ? ` · ${user.license_number}` : ""}
        </div>
      </div>



      {/* Online/Offline toggle */}
      <div className="online-card">
        <div className="oc-head">
          <span className="oc-label">Your Availability</span>
          <span className={`status-pill ${status === "active" ? "sp-on" : "sp-off"}`}>
            {status === "active" ? "● Online" : "○ Offline"}
          </span>
        </div>
        {status === "active" && activeRide && (
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Current route: <strong style={{ color: "var(--text)" }}>
              {activeRide.start_location !== 'Any Location' ? `${activeRide.start_location} → ${activeRide.end_location}` : 'Ready for first request...'}
            </strong>
          </div>
        )}
        <div className="tog-row">
          <button
            className={`tog-btn ${status === "active" ? "tog-on" : ""}`}
            onClick={goOnline}
            disabled={loading || status === "active"}
          >
            ✓ Go Online
          </button>
          <button
            className={`tog-btn ${status === "offline" ? "tog-off" : ""}`}
            onClick={goOffline}
            disabled={loading || status === "offline"}
          >
            ✕ Go Offline
          </button>
        </div>
      </div>

      {/* Pending requests */}
      {status === "active" && pendingBookings.length > 0 && (
          <div className="seat-card">
              <div className="seat-card-lbl" style={{color: "var(--orange)", marginBottom: 12}}>Pending Requests ({pendingBookings.length})</div>
              {pendingBookings.map(b => (
                  <div key={b._id} style={{ padding: 12, background: "var(--card-bg-alt)", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 10 }}>
                      <div style={{fontWeight: 'bold'}}>{b.user_id?.name || "Student"}</div>
                      <div style={{fontSize: 13, color: "var(--muted)", margin: "4px 0"}}>
                          {b.pickup_location} → {b.dropoff_location}
                      </div>
                      <div style={{display: 'flex', gap: 10, marginTop: 10}}>
                          <button style={{flex: 1, padding: 8, background: "var(--green)", color: "white", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer"}} onClick={() => confirmBooking(b._id)}>✓ Accept</button>
                          <button style={{flex: 1, padding: 8, background: "transparent", color: "var(--red)", border: "1px solid var(--red)", borderRadius: 6, cursor: "pointer"}} onClick={() => rejectBooking(b._id)}>✕ Decline</button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Stats */}
      <div className="drv-stats">
        <div className="dstat">
          <div className="dstat-num" style={{ color: "var(--orange)" }}>{filledSeats}/{maxSeats}</div>
          <div className="dstat-label">Seats Filled</div>
        </div>
        <div className="dstat">
          <div className="dstat-num" style={{ color: "var(--green)" }}>{stats.trips_today}</div>
          <div className="dstat-label">Trips Today</div>
        </div>
        <div className="dstat">
          <div className="dstat-num" style={{ color: "var(--text)", fontSize: 18 }}>{fmt(estEarned)}</div>
          <div className="dstat-label">Est. Earned</div>
        </div>
        <div className="dstat">
          <div className="dstat-num" style={{ color: "#F5C518" }}>5.0⭐</div>
          <div className="dstat-label">Rating</div>
        </div>
      </div>

      {/* Seat status */}
      {status === "active" && (
        <div className="seat-card">
          <div className="seat-card-lbl">Current Seat Status</div>
          <SeatGrid vehicle={vKey} filled={filledSeats} />
          <SeatBar vehicle={vKey} filled={filledSeats} />
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            {maxSeats - filledSeats} seats available · {filledSeats} filled
          </div>
        </div>
      )}

      {/* Incentive table */}
      <div className="drv-incentive-card">
        <div className="dic-title">💰 Your Earning Per Ride (₹{sampleBase} base example)</div>
        {[1, 2, 3, 4].map(n => {
          const { driverTotal } = calcFare(vKey, sampleBase, n);
          return (
            <div className="dic-row" key={n}>
              <span className="dic-label">{n === 1 ? "Solo passenger" : `${n} passengers sharing`}</span>
              <span className="dic-earn">{fmt(driverTotal)} {n > 1 ? `(+${fmt(driverTotal - sampleBase)} extra)` : ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
