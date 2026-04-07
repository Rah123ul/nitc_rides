import { calcFare, fmt } from "../constants";

export default function PriceBanner({ vehicle, baseFare }) {
  const maxCols = 4;
  return (
    <div className="price-banner">
      <div className="pb-title">💡 How Sharing Saves You Money</div>
      <div className="pb-cols">
        {Array.from({ length: maxCols }, (_, i) => {
          const n = i + 1;
          const { perPerson, driverTotal, saving } = calcFare(vehicle, baseFare, n);
          return (
            <div className="pb-col" key={n}>
              <div className="pb-passengers">{n === 1 ? "Solo" : `${n} people`}</div>
              <div className="pb-per">{fmt(perPerson)}</div>
              {saving > 0 ? (
                <div className="pb-save">Save {fmt(saving)}</div>
              ) : (
                <div style={{ height: 16 }} />
              )}
              <div className="pb-driver">Driver: {fmt(driverTotal)}</div>
            </div>
          );
        })}
      </div>
      <div className="pb-note">Driver earns more as more people share — everyone benefits 🎉</div>
    </div>
  );
}
