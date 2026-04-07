import { calcFare, fmt, vehicleKey } from "../constants";
import SeatGrid from "../components/SeatGrid";
import SeatBar from "../components/SeatBar";

export default function ConfirmPage({ ride, type, from, to, baseFare, confirmedFare, onBack }) {
  const vKey = vehicleKey(ride?.vehicle_type);
  const maxSeats = ride?.max_seats || (vKey === "minivan" ? 8 : 4);
  const filled = maxSeats - (ride?.seats_left || 0);
  const n = type === "shared" ? filled : 1;
  const { perPerson, driverTotal } = calcFare(vKey, baseFare, n);
  const actualFare = confirmedFare || perPerson;
  const soloFare = calcFare(vKey, baseFare, 1).perPerson;
  const saved = soloFare - actualFare;
  const driverBonus = driverTotal - soloFare;

  return (
    <div className="confirm-wrap">
      <div className="confirm-top">
        <div className="confirm-emoji">🎉</div>
        <div className="confirm-title">Ride Booked!</div>
        <div className="confirm-sub">
          {type === "shared"
            ? `You're sharing with ${filled - 1} other passenger${filled - 1 !== 1 ? "s" : ""}`
            : "Solo ride confirmed"}
        </div>
      </div>

      {saved > 0 && (
        <div className="save-banner">
          <div className="save-amount">{fmt(saved)} saved!</div>
          <div className="save-label">Your saving by sharing 🌱</div>
        </div>
      )}

      {driverBonus > 0 && type === "shared" && (
        <div className="driver-earn-banner">
          <div className="deb-title">Driver earns extra too 🎯</div>
          <div className="deb-amount">{fmt(driverBonus)} bonus from your share</div>
        </div>
      )}

      <div className="info-card">
        <div className="info-row"><span className="ir-lbl">Driver</span><span className="ir-val">{ride?.driver_name}</span></div>
        <div className="info-row"><span className="ir-lbl">Vehicle</span><span className="ir-val">{vKey === "minivan" ? "🚐 Minivan" : "🛺 Auto"}</span></div>
        <div className="info-row"><span className="ir-lbl">Route</span><span className="ir-val">{from?.short} → {to?.short}</span></div>
        <div className="info-row"><span className="ir-lbl">Ride Type</span><span className="ir-val">{type === "shared" ? "Shared" : "Solo"}</span></div>
        <div className="info-row"><span className="ir-lbl">Base Route Fare</span><span className="ir-val">{fmt(baseFare)}</span></div>
        <div className="info-row"><span className="ir-lbl">You Pay</span><span className="ir-val big">{fmt(actualFare)}</span></div>
        {saved > 0 && <div className="info-row"><span className="ir-lbl">You Saved</span><span className="ir-val green">{fmt(saved)}</span></div>}
        <div className="info-row"><span className="ir-lbl">Driver Earns</span><span className="ir-val orange">{fmt(driverTotal)}</span></div>
      </div>

      <div className="info-card" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Your Seat</div>
        <SeatGrid vehicle={vKey} filled={filled} showYou={type === "shared"} />
        <SeatBar vehicle={vKey} filled={filled} showYou={type === "shared"} />
      </div>

      <button className="btn-primary" onClick={onBack}>Find Another Ride</button>
      <button className="btn-ghost" onClick={onBack}>← Back to Home</button>
    </div>
  );
}
