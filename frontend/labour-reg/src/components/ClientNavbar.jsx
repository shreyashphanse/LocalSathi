import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ClientNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!user || user.role !== "client") return null;

  const isActive = (path) => location.pathname === path;

  const allowedRoutes = ["/home", "/myposted", "/postjob", "/clientprofile"];

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
          className={isActive("/myposted") ? "active" : ""}
          onClick={() => navigate("/myposted")}
        >
          Posted
        </button>

        <button
          className={isActive("/postjob") ? "active" : ""}
          onClick={() => navigate("/postjob")}
        >
          +
        </button>

        <button
          className={isActive("/clientprofile") ? "active" : ""}
          onClick={() => navigate("/clientprofile")}
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
          background: rgba(76, 29, 149, 0.08);
          color: #3b0f7a;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .nav-card button:hover {
          background: #0e7490;
          color: white;
        }

        .nav-card button.active {
          background: #3b0f7a;
          color: white;
        }

        .nav-card button.active:hover {
          background: #0e7490;
        }
      `}</style>
    </div>
  );
}
