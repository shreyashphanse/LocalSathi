import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ClientNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  if (!user || user.role !== "client") return null;

  const allowedRoutes = ["/home", "/myposted", "/postjob", "/clientprofile"];

  if (!allowedRoutes.includes(location.pathname)) return null;

  return (
    <div className="nav-root">
      <div className="nav-card">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/myposted")}>Posted</button>
        <button onClick={() => navigate("/postjob")}>＋</button>
        <button onClick={() => navigate("/clientprofile")}>Profile</button>
      </div>

      <style jsx>{`
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
          display: flex;
          gap: 6px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.15);
          flex-wrap: nowrap;
          max-width: 95%;
        }

        button {
          height: 36px;
          padding: 0 12px;
          border-radius: 12px;
          border: none;
          background: #ecfdf5;
          color: #065f46;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
        }

        button:hover {
          background: #10b981;
          color: white;
        }
      `}</style>
    </div>
  );
}
