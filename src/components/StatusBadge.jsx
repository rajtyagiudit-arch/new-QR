export default function StatusBadge({ status }) {
  const config = {
    "pre-registered": { label: "Pre-Registered", color: "#f59e0b", bg: "#fef3c7" },
    "checked-in":     { label: "Checked In",      color: "#10b981", bg: "#d1fae5" },
    "checked-out":    { label: "Checked Out",      color: "#6b7280", bg: "#f3f4f6" },
  };
  const c = config[status] || config["pre-registered"];
  return (
    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: c.color, background: c.bg, border: `1px solid ${c.color}40` }}>
      {c.label}
    </span>
  );
}