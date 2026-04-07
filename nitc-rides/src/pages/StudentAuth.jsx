import { useState } from "react";
import { apiFetch } from "../api";

export default function StudentAuth({ onBack, onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", phone: "", pass: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.phone || !form.pass) { setErr("Please fill all required fields."); return; }
    if (tab === "register" && !form.name) { setErr("Please enter your name."); return; }
    setErr(""); setLoading(true);
    try {
      const endpoint = tab === "login" ? "/auth/login/student" : "/auth/register/student";
      const payload = tab === "login"
        ? { phone_number: form.phone, password: form.pass }
        : { name: form.name, phone_number: form.phone, password: form.pass };

      const data = await apiFetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
      const user = { ...data.user, role: "student", name: data.user.name };
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
        <div className="auth-icon">🎓</div>
        <div className="auth-title">Student Portal</div>
        <div className="auth-sub">Book and share rides across NITC campus</div>
      </div>
      <div className="auth-tabs">
        <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); }}>Login</button>
        <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr(""); }}>Register</button>
      </div>
      <div className="auth-form">
        {err && <div className="err-msg">{err}</div>}
        {tab === "register" && (
          <div className="f-group">
            <label className="f-label">Full Name *</label>
            <input className="f-input" placeholder="e.g. Rahul Singh" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
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
          {loading ? "Please wait…" : tab === "login" ? "Login to My Account" : "Create Account"}
        </button>
      </div>
    </div>
  );
}
