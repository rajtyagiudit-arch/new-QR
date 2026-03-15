import { useState } from "react";
import "./Login.css";

const USERS = [
  { username: "admin",        password: "admin123",    role: "Admin",        name: "Super Admin" },
  { username: "security",     password: "security123", role: "Security",     name: "Security Guard" },
  { username: "receptionist", password: "recep123",    role: "Receptionist", name: "Front Desk" },
];

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    setTimeout(() => {
      const user = USERS.find((u) => u.username === form.username && u.password === form.password);
      if (user) { onLogin(user); } else { setError("Invalid username or password"); setLoading(false); }
    }, 900);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb orb1" /><div className="login-orb orb2" /><div className="login-orb orb3" />
      </div>
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">▦</div>
          <div className="login-logo-text">
            <span className="login-brand">VisitorIQ</span>
            <span className="login-tagline">QR Visitor Management</span>
          </div>
        </div>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-sub">Sign in to access the control panel</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label>Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter username" autoFocus />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" />
          </div>
          {error && <div className="login-error">⚠️ {error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In →"}
          </button>
        </form>
        <div className="login-demo">
          <p>Demo Accounts — click to fill:</p>
          <div className="demo-accounts">
            {USERS.map(u => (
              <div key={u.username} onClick={() => setForm({ username: u.username, password: u.password })}>
                <strong>{u.username}</strong> / {u.password} — {u.role}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}