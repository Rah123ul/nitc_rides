import { useState } from "react";
import { apiFetch } from "../api";

export default function DriverAuth({ onBack, onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", phone: "", license: "", vehicle: "Auto Rickshaw", pass: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.phone || !form.pass) { setErr("Please enter phone number and password."); return; }
    if (tab === "register" && (!form.name || !form.license)) { setErr("Please fill all required fields."); return; }
    setErr(""); setLoading(true);
    try {
      const endpoint = tab === "login" ? "/auth/login/driver" : "/auth/register/driver";
      const payload = tab === "login"
        ? { phone_number: form.phone, password: form.pass }
        : { name: form.name, phone_number: form.phone, vehicle_type: form.vehicle, license_number: form.license, password: form.pass };

      const data = await apiFetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
      const user = {
        ...data.driver,
        role: "driver",
        name: data.driver.name,
        vehicle: data.driver.vehicle_type?.toLowerCase().includes("minivan") ? "minivan" : "auto",
      };
      localStorage.setItem("nitcrides_token", data.token);
      localStorage.setItem("nitcrides_user", JSON.stringify(user));
      onLogin(user);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-hero">
        <div className="auth-icon">🛺</div>
        <div className="auth-title">Driver Portal</div>
        <div className="auth-sub">Register your vehicle and earn on campus</div>
      </div>
      <div className="auth-tabs">
        <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); }}>Login</button>
        <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr(""); }}>Register</button>
      </div>
      <div className="auth-form">
        {err && <div className="err-msg">{err}</div>}
        {tab === "register" && (
          <>
            <div className="f-group">
              <label className="f-label">Full Name *</label>
              <input className="f-input" placeholder="e.g. Rajan Kumar" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Vehicle *</label>
                <select className="f-input" value={form.vehicle} onChange={e => set("vehicle", e.target.value)}>
                  <option value="Auto Rickshaw">Auto Rickshaw</option>
                  <option value="Magic Minivan">Magic Minivan</option>
                </select>
              </div>
              <div className="f-group">
                <label className="f-label">License No. *</label>
                <input className="f-input" placeholder="KL11A1234" value={form.license} onChange={e => set("license", e.target.value)} />
              </div>
            </div>
          </>
        )}
        <div className="f-group">
          <label className="f-label">Phone Number *</label>
          <input className="f-input" type="tel" placeholder="9876543210" value={form.phone} onChange={e => set("phone", e.target.value)} />
        </div>
        <div className="f-group">
          <label className="f-label">Password *</label>
          <input className="f-input" type="password" placeholder="Enter password" value={form.pass} onChange={e => set("pass", e.target.value)} />
        </div>
        <button className="auth-btn" onClick={submit} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "Login to Driver Account" : "Register My Vehicle"}
        </button>
      </div>
    </div>
  );
}
