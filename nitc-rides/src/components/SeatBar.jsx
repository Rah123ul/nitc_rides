export default function SeatBar({ vehicle, filled, showYou }) {
  const total = vehicle === "minivan" ? 8 : 4;
  const pct = Math.round(((showYou ? filled + 1 : filled) / total) * 100);
  return (
    <div className="seat-bar">
      <div
        className={`seat-fill ${vehicle === "minivan" ? "sf-minivan" : "sf-auto"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
