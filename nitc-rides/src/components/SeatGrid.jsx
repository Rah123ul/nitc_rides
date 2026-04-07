export default function SeatGrid({ vehicle, filled, showYou }) {
  const total = vehicle === "minivan" ? 8 : 4;
  return (
    <div className="seat-icons">
      {Array.from({ length: total }, (_, i) => {
        const isYou = showYou && i === filled;
        const taken = i < filled;
        return (
          <div key={i} className={`si ${isYou ? "si-you" : taken ? "si-taken" : "si-free"}`}>
            {isYou ? "🧑" : taken ? "👤" : ""}
          </div>
        );
      })}
    </div>
  );
}
