import { useVisitors } from "../context/VisitorContext";
import "./Analytics.css";

export default function Analytics() {
  const { visitors } = useVisitors();
  const purposeCount = visitors.reduce((acc, v) => { acc[v.purpose] = (acc[v.purpose] || 0) + 1; return acc; }, {});
  const deptCount = visitors.reduce((acc, v) => { acc[v.hostDept] = (acc[v.hostDept] || 0) + 1; return acc; }, {});
  const statusCount = { "Pre-Registered": visitors.filter(v => v.status === "pre-registered").length, "Checked In": visitors.filter(v => v.status === "checked-in").length, "Checked Out": visitors.filter(v => v.status === "checked-out").length };
  const maxP = Math.max(...Object.values(purposeCount));
  const maxD = Math.max(...Object.values(deptCount));
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

  return (
    <div className="analytics-page">
      <div className="page-header"><div><h1 className="page-title">Analytics & Reports</h1><p className="page-sub">Visitor statistics and insights</p></div></div>
      <div className="analytics-summary">
        {Object.entries(statusCount).map(([label, count], i) => (
          <div className="analytics-card" key={label}>
            <div className="ac-value">{count}</div><div className="ac-label">{label}</div>
            <div className="ac-bar" style={{ width: `${visitors.length ? (count / visitors.length) * 100 : 0}%`, background: ["#f59e0b", "#10b981", "#6b7280"][i] }} />
          </div>
        ))}
        <div className="analytics-card"><div className="ac-value">{visitors.length}</div><div className="ac-label">Total All Time</div><div className="ac-bar" style={{ width: "100%", background: "#6366f1" }} /></div>
      </div>
      <div className="charts-grid">
        <div className="chart-box">
          <h3 className="chart-title">Visits by Purpose</h3>
          <div className="bar-chart">
            {Object.entries(purposeCount).map(([purpose, count], i) => (
              <div className="bar-row" key={purpose}>
                <div className="bar-label">{purpose}</div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(count / maxP) * 100}%`, background: colors[i % colors.length] }} /></div>
                <div className="bar-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-box">
          <h3 className="chart-title">Visits by Department</h3>
          <div className="bar-chart">
            {Object.entries(deptCount).map(([dept, count], i) => (
              <div className="bar-row" key={dept}>
                <div className="bar-label">{dept}</div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(count / maxD) * 100}%`, background: colors[(i + 3) % colors.length] }} /></div>
                <div className="bar-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-box">
          <h3 className="chart-title">Status Breakdown</h3>
          <div className="donut-legend">
            {[{ label: "Pre-Registered", color: "#f59e0b", count: statusCount["Pre-Registered"] }, { label: "Checked In", color: "#10b981", count: statusCount["Checked In"] }, { label: "Checked Out", color: "#6b7280", count: statusCount["Checked Out"] }].map(item => (
              <div className="legend-item" key={item.label}>
                <div className="legend-dot" style={{ background: item.color }} />
                <div className="legend-text"><div className="legend-label">{item.label}</div><div className="legend-count">{item.count} visitors</div></div>
                <div className="legend-pct">{visitors.length ? Math.round((item.count / visitors.length) * 100) : 0}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-box">
          <h3 className="chart-title">Recent Activity</h3>
          <div className="activity-feed">
            {visitors.slice(0, 6).map(v => (
              <div className="activity-item" key={v.id}>
                <div className="activity-dot" style={{ background: v.status === "checked-in" ? "#10b981" : v.status === "checked-out" ? "#6b7280" : "#f59e0b" }} />
                <div className="activity-info"><div className="activity-name">{v.name}</div><div className="activity-meta">{v.purpose} · {v.hostDept}</div></div>
                <div className="activity-status">{v.status === "checked-in" ? "Inside" : v.status === "checked-out" ? "Exited" : "Pending"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}