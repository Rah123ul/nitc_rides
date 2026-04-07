import { ROUTE_FARES, LOCATIONS, calcFare, fmt } from "../constants";

export default function FareTablePage() {
  const routes = Object.entries(ROUTE_FARES).map(([key, base]) => {
    const [a, b] = key.split("-");
    const locA = LOCATIONS.find(l => l.id === a);
    const locB = LOCATIONS.find(l => l.id === b);
    const share2 = calcFare("auto", base, 2).perPerson;
    const share3 = calcFare("auto", base, 3).perPerson;
    return { locA, locB, base, share2, share3 };
  }).filter(r => r.locA && r.locB);

  return (
    <div className="fare-table-page">
      <div className="ft-title">Fare Chart</div>
      <div className="ft-sub">All campus route fares · Auto pricing shown</div>

      <div className="incentive-explain">
        <div className="ie-title">💡 How Your Sharing Bonus Works</div>
        {[1, 2, 3, 4].map(n => {
          const ex = calcFare("auto", 50, n);
          return (
            <div className="ie-row" key={n}>
              <span className="ie-label">{n === 1 ? "1 person (solo)" : `${n} people sharing`}</span>
              <div style={{ textAlign: "right" }}>
                <div className="ie-per">{fmt(ex.perPerson)} per person</div>
                <div className="ie-driver">Driver earns {fmt(ex.driverTotal)}</div>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 8 }}>Example based on ₹50 base fare. Actual fare varies by route.</div>
      </div>

      <div className="ft-card">
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", background: "var(--bg)", fontWeight: 800, fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <span>Route</span>
          <div style={{ display: "flex", gap: 24 }}>
            <span>Solo</span><span style={{ color: "var(--green)" }}>2 share</span><span style={{ color: "var(--blue)" }}>3 share</span>
          </div>
        </div>
        {routes.map(({ locA, locB, base, share2, share3 }) => (
          <div className="ft-row" key={`${locA.id}-${locB.id}`}>
            <div className="ft-route">{locA.short} ↔ {locB.short}</div>
            <div className="ft-prices">
              <span className="ft-solo">{fmt(base)}</span>
              <span className="ft-share">{fmt(share2)}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--blue)" }}>{fmt(share3)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
