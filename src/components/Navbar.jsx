import "./Navbar.css";

const navItems = [
  { id: "dashboard",  label: "Dashboard",   icon: "⊞" },
  { id: "register",   label: "Register",    icon: "✚" },
  { id: "checkin",    label: "Check In",    icon: "↓" },
  { id: "checkout",   label: "Check Out",   icon: "↑" },
  { id: "log",        label: "Visitor Log", icon: "☰" },
  { id: "analytics",  label: "Analytics",   icon: "◉" },
];

const roleColor = { Admin: "#6366f1", Security: "#10b981", Receptionist: "#f59e0b" };

export default function Navbar({ page, setPage, user, onLogout, navOpen }) {
  return (
    <nav className={`navbar ${navOpen ? "open" : ""}`}>
      <div className="navbar-brand">
        <div className="brand-icon">▦</div>
        <div className="brand-text">
          <span className="brand-title">VisitorIQ</span>
          <span className="brand-sub">QR Management System</span>
        </div>
      </div>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.id}>
            <button className={`nav-btn ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="navbar-footer">
        <div className="navbar-time">
          <div className="org-name">Udit India Pvt. Ltd.</div>
          <div className="current-date">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
        </div>
        {user && (
          <div className="user-section">
            <div className="user-avatar" style={{ background: roleColor[user.role] || "#6366f1" }}>{user.name[0]}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role" style={{ color: roleColor[user.role] || "#6366f1" }}>{user.role}</div>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Logout">⏻</button>
          </div>
        )}
      </div>
    </nav>
  );
}