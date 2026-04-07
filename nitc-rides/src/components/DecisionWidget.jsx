import { calcFare, fmt, vehicleKey } from "../constants";

export default function DecisionWidget({ rides, baseFare }) {
  if (!rides || rides.length === 0 || !baseFare) return null;

  const avail = rides.filter((r) => r.seats_left > 0);
  if (!avail.length) return null;

  const best = [...avail].sort((a, b) => (a.eta_min || 5) - (b.eta_min || 5))[0];
  const vKey = vehicleKey(best.vehicle_type);
  const filled = (best.max_seats || 4) - best.seats_left;
  const n = filled + 1;
  const { perPerson, saving } = calcFare(vKey, baseFare, n);
  const soloFare = calcFare(vKey, baseFare, 1).perPerson;
  const etaMin = best.eta_min || 3;
  const waitWin = etaMin <= 3 && saving >= 8;

  return (
    <div className="dec-card">
      <div className="dec-lbl">⚡ Best Option For You</div>
      <div className="dec-opts">
        <div className={`dec-opt ${waitWin ? "win" : ""}`}>
          {waitWin && <div className="win-tag">✓ RECOMMENDED</div>}
          <div className="dec-act">Wait {etaMin} min</div>
          <div className="dec-fare">{fmt(perPerson)}</div>
          {saving > 0 && <div className="dec-save">Save {fmt(saving)}</div>}
        </div>
        <div className={`dec-opt ${!waitWin ? "win" : ""}`}>
          {!waitWin && <div className="win-tag">✓ RECOMMENDED</div>}
          <div className="dec-act">Leave Now (Solo)</div>
          <div className="dec-fare">{fmt(soloFare)}</div>
          <div className="dec-note">No wait</div>
        </div>
      </div>
    </div>
  );
}
