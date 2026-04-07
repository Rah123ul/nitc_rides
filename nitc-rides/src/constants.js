// ─────────────────────────────────────────────────────────────────
// CAMPUS LOCATIONS
// ─────────────────────────────────────────────────────────────────
export const LOCATIONS = [
  { id: "lh",   label: "Ladies Hostel",       short: "LH",   icon: "🏠", full: "Ladies Hostel" },
  { id: "ah",   label: "Ambience Hostel",      short: "AH",   icon: "🏘", full: "Ambience Hostel" },
  { id: "mbh",  label: "Mega Boys Hostel",     short: "MBH",  icon: "🏗", full: "Mega Boys Hostel" },
  { id: "mba",  label: "MBA Hostel",           short: "MBA",  icon: "🎓", full: "MBA Hostel" },
  { id: "chem", label: "Chemical Engg Block",  short: "ChE",  icon: "⚗️", full: "Chemical Engg Block" },
  { id: "arch", label: "Architecture Block",   short: "Arch", icon: "📐", full: "Architecture Block" },
];

// ─────────────────────────────────────────────────────────────────
// BASE FARE TABLE  (bi-directional — same price both ways)
// Key format: "fromId-toId" (always alphabetically sorted)
// ─────────────────────────────────────────────────────────────────
export const ROUTE_FARES = {
  "ah-lh":    40,
  "ah-mbh":   35,
  "ah-mba":   30,
  "ah-chem":  50,
  "ah-arch":  55,
  "lh-mbh":   30,
  "lh-mba":   35,
  "lh-chem":  50,
  "lh-arch":  45,
  "mbh-mba":  25,
  "mbh-chem": 40,
  "mbh-arch": 45,
  "mba-chem": 35,
  "mba-arch": 40,
  "chem-arch":30,
};

export const routeKey = (a, b) => [a, b].sort().join("-");

export const getBaseFare = (fromId, toId) => {
  const key = routeKey(fromId, toId);
  return ROUTE_FARES[key] || 50;
};

// ─────────────────────────────────────────────────────────────────
// INCENTIVE PRICING MODEL
// Driver Total  = baseFare + (n-1) × incentivePerPerson
// Per Person    = Math.ceil(driverTotal / n)
// ─────────────────────────────────────────────────────────────────
export const INCENTIVE = { auto: 10, minivan: 12 };

export function calcFare(vehicle, baseFare, nPassengers) {
  const inc = INCENTIVE[vehicle] || 10;
  const total = baseFare + (nPassengers - 1) * inc;
  const perPerson = Math.ceil(total / nPassengers);
  return { perPerson, driverTotal: total, saving: baseFare - perPerson };
}

export const fmt = (n) => `₹${n}`;

// Map backend vehicle_type string → internal key used in calcFare
export const vehicleKey = (vehicleType) => {
  if (!vehicleType) return "auto";
  return vehicleType.toLowerCase().includes("minivan") ? "minivan" : "auto";
};
