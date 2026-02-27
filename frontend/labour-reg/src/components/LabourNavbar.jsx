import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!user || user.role !== "labour") return null;
  const isActive = (path) => location.pathname === path;

  const allowedRoutes = [
    "/home",
    "/jobs",
    "/myaccepted",
    "/mycompleted",
    "/labourprofile",
  ];

  if (!allowedRoutes.includes(location.pathname)) return null;

  return (
    <div className="nav-root">
      <div className="nav-card">
        <button
          className={isActive("/home") ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        <button
          className={isActive("/jobs") ? "active" : ""}
          onClick={() => navigate("/jobs")}
        >
          Jobs
        </button>
        <button
          className={isActive("/myaccepted") ? "active" : ""}
          onClick={() => navigate("/myaccepted")}
        >
          Active
        </button>
        <button
          className={isActive("/mycompleted") ? "active" : ""}
          onClick={() => navigate("/mycompleted")}
        >
          Completed
        </button>
        <button
          className={isActive("/labourprofile") ? "active" : ""}
          onClick={() => navigate("/labourprofile")}
        >
          Profile
        </button>
      </div>

      <style>{`
        .nav-root {
          position: fixed;
          bottom: 12px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 999;
        }

        .nav-card {
          background: white;
          border-radius: 20px;
          padding: 8px;
          display: flex; /* ✅ THIS IS THE MISSING FIX */
          gap: 6px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(154, 52, 18, 0.15); /* optional theme alignment */
          flex-wrap: nowrap;
          max-width: 95%;
        }

        .nav-card button {
          height: 36px;
          padding: 0 12px;
          border-radius: 12px;
          border: none;
          background: #a07669;
          color: white;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .nav-card button:hover {
          background: #d97706;
          color: white;
        }

        .nav-card button.active {
          background: #aa320a;
          color: white;
        }

        .nav-card button.active:hover {
          background: #d97706;
        }
      `}</style>
    </div>
  );
}
