import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import RegisterVisitor from "./pages/RegisterVisitor";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import VisitorLog from "./pages/VisitorLog";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { VisitorProvider } from "./context/VisitorContext";
import { ToastProvider } from "./components/Toast";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  const navigate = (p) => { setPage(p); setNavOpen(false); };

  if (!user) {
    return (
      <ToastProvider>
        <Login onLogin={setUser} />
      </ToastProvider>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <Dashboard setPage={navigate} />;
      case "register":   return <RegisterVisitor setPage={navigate} />;
      case "checkin":    return <CheckIn setPage={navigate} />;
      case "checkout":   return <CheckOut setPage={navigate} />;
      case "log":        return <VisitorLog setPage={navigate} />;
      case "analytics":  return <Analytics />;
      default:           return <Dashboard setPage={navigate} />;
    }
  };

  return (
    <ToastProvider>
      <VisitorProvider>
        <div className="mobile-header">
          <button className="hamburger" onClick={() => setNavOpen(true)}>☰</button>
          <span className="mobile-brand">VisitorIQ</span>
        </div>
        <div className={`nav-overlay ${navOpen ? "open" : ""}`} onClick={() => setNavOpen(false)} />
        <div className="app">
          <Navbar page={page} setPage={navigate} user={user} onLogout={() => setUser(null)} navOpen={navOpen} />
          <main className="main-content">
            {renderPage()}
          </main>
        </div>
      </VisitorProvider>
    </ToastProvider>
  );
}