import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api";
import { getBaseFare, calcFare, fmt, vehicleKey, LOCATIONS } from "../constants";
import SeatGrid from "../components/SeatGrid";
import SeatBar from "../components/SeatBar";
import PriceBanner from "../components/PriceBanner";
import DecisionWidget from "../components/DecisionWidget";

export default function ListingsPage({ from, to, onBook, onChangeRoute, showToast }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [booking, setBooking] = useState(null); // ride_id being booked

  const baseFare = getBaseFare(from.id, to.id);

  const fetchRides = useCallback(async () => {
    try {
      const data = await apiFetch("/rides/active");
      setRides(data.rides || []);
    } catch {
      // silently fail on poll errors; show stale data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides();
    const id = setInterval(fetchRides, 5000);
    return () => clearInterval(id);
  }, [fetchRides]);

  // Filter by vehicle type
  const visible = rides.filter(r => {
    if (filter === "auto" && !r.vehicle_type?.toLowerCase().includes("auto")) return false;
    if (filter === "minivan" && !r.vehicle_type?.toLowerCase().includes("minivan")) return false;
    return true;
  });

  const autoCount = rides.filter(r => r.vehicle_type?.toLowerCase().includes("auto")).length;
  const miniCount = rides.filter(r => r.vehicle_type?.toLowerCase().includes("minivan")).length;

  const handleJoin = async (ride) => {
    if (booking) return;
    setBooking(ride.ride_id);
    try {
      const data = await apiFetch("/bookings/join", {
        method: "POST",
        body: JSON.stringify({
          ride_id: ride.ride_id,
          pickup_location: from.full,
          dropoff_location: to.full,
        }),
      });
      // Do not optimistically update seats anymore, wait for driver!
      onBook(ride, "shared", baseFare, null, data.booking_id);
    } catch (e) {
      showToast("❌ " + e.message);
    } finally {
      setBooking(null);
    }
  };

  const handleSolo = (ride) => {
    onBook(ride, "solo", baseFare, null);
  };

  return (
    <div>
      <div className="page-hd">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="route-badge">
            <span>{from?.short}</span>
            <span className="rb-arr">→</span>
            <span>{to?.short}</span>
            <span style={{ marginLeft: 8, background: "var(--yellowL)", color: "var(--text)", fontSize: 12, fontWeight: 800, padding: "2px 8px", borderRadius: 100 }}>
              {fmt(baseFare)} base
            </span>
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)", cursor: "pointer", fontWeight: 600 }} onClick={onChangeRoute}>← Change</span>
        </div>
        <div className="avail-row">
          <div className="avail-pill"><div className="ap-dot" style={{ background: "var(--orange)" }} />{autoCount} Auto{autoCount !== 1 ? "s" : ""}</div>
          <div className="avail-pill"><div className="ap-dot" style={{ background: "var(--green)" }} />{miniCount} Minivan{miniCount !== 1 ? "s" : ""}</div>
          <div className="avail-pill"><div className="ap-dot" style={{ background: "var(--yellow)" }} />{visible.length} Available</div>
        </div>
      </div>

      {visible.length > 0 && <PriceBanner vehicle={vehicleKey(visible[0]?.vehicle_type)} baseFare={baseFare} />}
      <DecisionWidget rides={rides} baseFare={baseFare} />

      <div className="filter-row">
        {[["all", "All"], ["auto", "Auto 🛺"], ["minivan", "Minivan 🚐"]].map(([v, l]) => (
          <div key={v} className={`f-chip ${filter === v ? "on" : ""}`} onClick={() => setFilter(v)}>{l}</div>
        ))}
      </div>

      <div className="rides-list">
        {loading && (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        )}
        {!loading && visible.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No rides available right now</div>
            <div className="empty-sub">Drivers go online when they're ready.<br />Check back in a minute!</div>
          </div>
        )}
        {visible.map((ride, i) => {
          const vKey = vehicleKey(ride.vehicle_type);
          const maxSeats = ride.max_seats || (vKey === "minivan" ? 8 : 4);
          const filled = maxSeats - ride.seats_left;
          const isFull = ride.seats_left <= 0;
          const nIfYouJoin = filled + 1;
          const { perPerson, driverTotal, saving } = calcFare(vKey, baseFare, nIfYouJoin);
          const soloFare = calcFare(vKey, baseFare, 1).perPerson;
          const initials = ride.driver_name?.slice(0, 2).toUpperCase() || "DR";

          return (
            <div className={`ride-card ${isFull ? "dimmed" : ""}`} key={ride.ride_id} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="rc-head">
                <div className={`drv-ava ${vKey === "minivan" ? "da-minivan" : "da-auto"}`}>{initials}</div>
                <div className="drv-info">
                  <div className="drv-name">{ride.driver_name}</div>
                  <div className="drv-sub">{vKey === "minivan" ? "🚐 Minivan" : "🛺 Auto"} · {filled}/{maxSeats} seats filled</div>
                  <div className="drv-stars">★★★★★ <span style={{ color: "var(--muted)" }}>5.0</span></div>
                </div>
                <div className="eta-box">
                  <div className="eta-num">{ride.eta_min || "~"}</div>
                  <div className="eta-unit">min away</div>
                  <div className="eta-live">Live</div>
                </div>
              </div>

              <div className="seat-sec">
                <div className="seat-top">
                  <span className="seat-lbl">Seats</span>
                  <span className="seat-cnt" style={{ color: isFull ? "var(--red)" : "var(--green)" }}>
                    {isFull ? "Full" : `${ride.seats_left} free`}
                  </span>
                </div>
                <SeatGrid vehicle={vKey} filled={filled} />
                <SeatBar vehicle={vKey} filled={filled} />
              </div>

              {!isFull && (
                <div className="rc-price">
                  <div className="price-row">
                    <div>
                      <div className="pr-per">{fmt(perPerson)}</div>
                      <div className="pr-tag">per person if you join ({nIfYouJoin} total)</div>
                    </div>
                    {saving > 0 && <div className="pr-save">Save {fmt(saving)} vs solo</div>}
                  </div>
                  <div className="pr-driver-earn">Driver earns {fmt(driverTotal)} total · +{fmt(driverTotal - soloFare)} bonus from sharing</div>
                </div>
              )}

              <div className="rc-foot">
                {isFull ? (
                  <div className="full-tag">Vehicle Full</div>
                ) : (
                  <>
                    <button
                      className="btn-join"
                      onClick={() => handleJoin(ride)}
                      disabled={booking === ride.ride_id}
                    >
                      {booking === ride.ride_id ? "Booking…" : `Join Ride · ${fmt(perPerson)}`}
                    </button>
                    <button className="btn-solo" onClick={() => handleSolo(ride)}>Solo {fmt(soloFare)}</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
