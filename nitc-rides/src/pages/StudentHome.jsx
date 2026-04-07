import { useState } from "react";
import { LOCATIONS, getBaseFare, calcFare, fmt } from "../constants";

export default function StudentHome({ liveCount, autoCount, miniCount, onFind }) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [picker, setPicker] = useState(null); // "from" | "to" | null

  const swap = () => { const t = from; setFrom(to); setTo(t); };
  const pick = (loc) => { picker === "from" ? setFrom(loc) : setTo(loc); setPicker(null); };
  const baseFare = from && to ? getBaseFare(from.id, to.id) : null;

  return (
    <div>
      <div className="hero">
        <div className="hero-lbl">NIT Calicut · Campus Rides</div>
        <div className="hero-title">Where do you<br/>want to go?</div>
        <div className="hero-sub">Share rides · split fares · save money</div>
      </div>

      <div className="stat-chips">
        <div className="stat-chip"><div className="sc-dot" style={{ background: "var(--green)" }} />{liveCount} live</div>
        <div className="stat-chip"><div className="sc-dot" style={{ background: "var(--orange)" }} />{autoCount} autos</div>
        <div className="stat-chip"><div className="sc-dot" style={{ background: "var(--blue)" }} />{miniCount} minivans</div>
      </div>

      <div className="route-wrap" style={{ marginTop: 14 }}>
        <div className="route-card-ui">
          <div className="route-row" onClick={() => setPicker("from")}>
            <div className="r-icon ri-from">🟠</div>
            <div>
              <div className="r-lbl">From</div>
              <div className={`r-val ${!from ? "ph" : ""}`}>{from ? from.label : "Select pickup location"}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)", marginLeft: 66 }} />
            <div className="swap-center" style={{ margin: "0 14px" }}>
              <button className="swap-inner" onClick={swap}>⇅</button>
            </div>
          </div>
          <div className="route-row" onClick={() => setPicker("to")}>
            <div className="r-icon ri-to">🟢</div>
            <div>
              <div className="r-lbl">To</div>
              <div className={`r-val ${!to ? "ph" : ""}`}>{to ? to.label : "Select drop location"}</div>
            </div>
          </div>
        </div>

        {baseFare && (
          <div className="route-fare-preview">
            <div>
              <div className="rfp-label">Solo Fare</div>
              <div className="rfp-note">{from.short} → {to.short}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="rfp-fare">{fmt(baseFare)}</div>
              <div className="rfp-note">Share to save up to {fmt(baseFare - calcFare("auto", baseFare, 4).perPerson)}+</div>
            </div>
          </div>
        )}
      </div>

      <button className="find-btn" disabled={!from || !to} onClick={() => onFind(from, to)}>
        Find Available Rides →
      </button>

      <div className="sec-block" style={{ paddingBottom: 100 }}>
        <div className="sec-title">Popular Routes</div>
        <div className="pop-chips">
          {[["LH → ChE", "lh", "chem"], ["MBH → Arch", "mbh", "arch"], ["AH → MBA", "ah", "mba"], ["MBA → LH", "mba", "lh"]].map(([l, f, t]) => (
            <div className="pop-chip" key={l} onClick={() => {
              setFrom(LOCATIONS.find(x => x.id === f));
              setTo(LOCATIONS.find(x => x.id === t));
            }}>{l}</div>
          ))}
        </div>
      </div>

      {picker && (
        <div className="overlay" onClick={() => setPicker(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">Choose {picker === "from" ? "Pickup" : "Drop"}</div>
            {LOCATIONS.filter(l => picker === "from" ? l.id !== to?.id : l.id !== from?.id).map(loc => (
              <div className="loc-item" key={loc.id} onClick={() => pick(loc)}>
                <div className="loc-em">{loc.icon}</div>
                <div><div className="loc-name">{loc.label}</div><div className="loc-code">{loc.short}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
