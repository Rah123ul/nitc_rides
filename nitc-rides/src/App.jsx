import { useState, useEffect, useCallback } from "react";
import CSS from "./styles";
import { apiFetch } from "./api";

// Pages
import LandingPage  from "./pages/LandingPage";
import StudentAuth  from "./pages/StudentAuth";
import DriverAuth   from "./pages/DriverAuth";
import StudentHome  from "./pages/StudentHome";
import ListingsPage from "./pages/ListingsPage";
import ConfirmPage  from "./pages/ConfirmPage";
import DriverHome   from "./pages/DriverHome";
import FareTablePage from "./pages/FareTablePage";
import ProfilePage  from "./pages/ProfilePage";

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | student-auth | driver-auth | app
  const [user,   setUser]   = useState(null);
  const [page,   setPage]   = useState("home");

  // Student ride selection
  const [from,   setFrom]   = useState(null);
  const [to,     setTo]     = useState(null);

  // Booking confirmation state
  const [bookedRide,    setBookedRide]    = useState(null);
  const [bookType,      setBookType]      = useState("shared");
  const [bookBaseFare,  setBookBaseFare]  = useState(50);
  const [confirmedFare, setConfirmedFare] = useState(null);

  // Toast notification
  const [toast, setToast] = useState({ msg: "", show: false });

  // Live drivers count (fetched for student header pill)
  const [liveRides, setLiveRides] = useState([]);

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2600);
  }, []);

  // Restore session on mount
  useEffect(() => {
    try {
      const s = localStorage.getItem("nitcrides_user");
      if (s) { setUser(JSON.parse(s)); setScreen("app"); }
    } catch { /* ignore */ }
  }, []);

  // Poll active rides for the live count pill (student only)
  useEffect(() => {
    if (!user || user.role !== "student") return;
    const fetch = async () => {
      try {
        const data = await apiFetch("/rides/active");
        setLiveRides(data.rides || []);
      } catch { /* ignore */ }
    };
    fetch();
    const id = setInterval(fetch, 8000);
    return () => clearInterval(id);
  }, [user]);

  const handleLogin  = (u) => { setUser(u); setScreen("app"); setPage("home"); };
  const handleLogout = () => {
    localStorage.removeItem("nitcrides_token");
    localStorage.removeItem("nitcrides_user");
    setUser(null); setScreen("landing"); setPage("home");
    setFrom(null); setTo(null); setBookedRide(null);
  };

  const handleFind = (f, t) => {
    setFrom(f); setTo(t); setPage("listings");
    showToast(`${f.short} → ${t.short}`);
  };

  const handleBook = (ride, type, baseFare, apiConfirmedFare) => {
    setBookedRide(ride);
    setBookType(type);
    setBookBaseFare(baseFare || 50);
    setConfirmedFare(apiConfirmedFare || null);
    setPage("confirm");
    showToast(`Booked! 🎉`);
  };

  const isStudent = user?.role === "student";

  // Live counts for header
  const liveCount = liveRides.length;
  const autoCount = liveRides.filter(r => r.vehicle_type?.toLowerCase().includes("auto")).length;
  const miniCount = liveRides.filter(r => r.vehicle_type?.toLowerCase().includes("minivan")).length;

  const wrap = (children) => (
    <><style>{CSS}</style><div className="app">{children}</div></>
  );

  // ── Pre-auth screens ──────────────────────────────────────────
  if (screen === "landing")      return wrap(<LandingPage onRole={r => setScreen(r === "student" ? "student-auth" : "driver-auth")} />);
  if (screen === "student-auth") return wrap(<StudentAuth onBack={() => setScreen("landing")} onLogin={handleLogin} />);
  if (screen === "driver-auth")  return wrap(<DriverAuth  onBack={() => setScreen("landing")} onLogin={handleLogin} />);

  // ── Main app ──────────────────────────────────────────────────
  const STUDENT_NAV = [
    { id: "home",     icon: "🏠", label: "Home" },
    { id: "listings", icon: "🚗", label: "Rides" },
    { id: "fares",    icon: "💰", label: "Fares" },
    { id: "profile",  icon: "👤", label: "Profile" },
  ];
  const DRIVER_NAV = [
    { id: "home",    icon: "🏠", label: "Home" },
    { id: "fares",   icon: "💰", label: "Fares" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  const NAV = isStudent ? STUDENT_NAV : DRIVER_NAV;

  return (
    <><style>{CSS}</style>
    <div className="app">
      {/* ── Top bar ── */}
      <div className="topbar">
        <div className="logo">NITC<span>Rides</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isStudent && <div className="live-pill">{liveCount} live</div>}
          <div
            className={`user-ava ${isStudent ? "ua-s" : "ua-d"}`}
            onClick={() => setPage("profile")}
          >
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ paddingBottom: 72 }}>
        {isStudent && page === "home" && (
          <StudentHome
            liveCount={liveCount}
            autoCount={autoCount}
            miniCount={miniCount}
            onFind={handleFind}
          />
        )}
        {isStudent && page === "listings" && from && to && (
          <ListingsPage
            from={from}
            to={to}
            onBook={handleBook}
            onChangeRoute={() => setPage("home")}
            showToast={showToast}
          />
        )}
        {isStudent && page === "confirm" && bookedRide && (
          <ConfirmPage
            ride={bookedRide}
            type={bookType}
            from={from}
            to={to}
            baseFare={bookBaseFare}
            confirmedFare={confirmedFare}
            onBack={() => setPage("home")}
          />
        )}
        {!isStudent && page === "home" && (
          <DriverHome user={user} showToast={showToast} />
        )}
        {page === "fares"   && <FareTablePage />}
        {page === "profile" && <ProfilePage user={user} onLogout={handleLogout} />}
      </div>

      {/* ── Bottom nav ── */}
      <nav className="bottom-nav">
        {NAV.map(n => (
          <div
            key={n.id}
            className={`nav-item ${page === n.id || (page === "confirm" && n.id === "listings") ? "active" : ""}`}
            onClick={() => {
              if (n.id === "listings" && !from) { setPage("home"); return; }
              setPage(n.id);
            }}
          >
            <div className="nav-icon">{n.icon}</div>
            <div className="nav-label">{n.label}</div>
          </div>
        ))}
      </nav>

      {/* ── Toast ── */}
      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>
    </div></>
  );
}