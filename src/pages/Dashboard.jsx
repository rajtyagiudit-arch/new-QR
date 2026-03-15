import { useVisitors } from "../context/VisitorContext";
import StatusBadge from "../components/StatusBadge";
import "./Dashboard.css";

export default function Dashboard({ setPage }) {
  const { visitors } = useVisitors();
  const today = new Date().toISOString().split("T")[0];
  const todayVisitors = visitors.filter((v) => v.date === today);
  const checkedIn = visitors.filter((v) => v.status === "checked-in");
  const checkedOut = todayVisitors.filter((v) => v.status === "checked-out");
  const preRegistered = visitors.filter((v) => v.status === "pre-registered");

  const stats = [
    { label: "Total Visitors Today", value: todayVisitors.length, icon: "👥", color: "#6366f1", bg: "#eef2ff" },
    { label: "Currently Inside",     value: checkedIn.length,     icon: "🟢", color: "#10b981", bg: "#d1fae5" },
    { label: "Checked Out",          value: checkedOut.length,    icon: "✅", color: "#3b82f6", bg: "#dbeafe" },
    { label: "Pre-Registered",       value: preRegistered.length, icon: "📋", color: "#f59e0b", bg: "#fef3c7" },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Welcome back — here's today's visitor overview</p>
        </div>
        <button className="btn-primary" onClick={() => setPage("register")}>+ Register Visitor</button>
      </div>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label} style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-row">
          {[
            { label: "Register New Visitor", page: "register", icon: "✚", desc: "Pre-register & generate QR" },
            { label: "Visitor Check-In",     page: "checkin",  icon: "↓", desc: "Scan QR or enter ID" },
            { label: "Visitor Check-Out",    page: "checkout", icon: "↑", desc: "Mark exit time" },
            { label: "View Full Log",        page: "log",      icon: "☰", desc: "Complete visitor records" },
          ].map((a) => (
            <button key={a.page} className="action-card" onClick={() => setPage(a.page)}>
              <div className="action-icon">{a.icon}</div>
              <div className="action-label">{a.label}</div>
              <div className="action-desc">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Visitors</h2>
          <button className="btn-link" onClick={() => setPage("log")}>View All →</button>
        </div>
        <div className="table-wrapper">
          <table className="visitor-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Purpose</th><th>Host</th><th>Check In</th><th>Status</th></tr>
            </thead>
            <tbody>
              {visitors.slice(0, 5).map((v) => (
                <tr key={v.id}>
                  <td><code>{v.id}</code></td>
                  <td><div className="visitor-name">{v.name}</div><div className="visitor-phone">{v.phone}</div></td>
                  <td>{v.purpose}</td>
                  <td><div>{v.hostName}</div><div className="visitor-phone">{v.hostDept}</div></td>
                  <td>{v.checkInTime ? new Date(v.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td><StatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}