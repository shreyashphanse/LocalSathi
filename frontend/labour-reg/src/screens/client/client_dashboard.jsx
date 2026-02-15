import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function ClientDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/jobs/dashboard/client");

      setStats(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="state">Loading dashboard...</div>;

  if (error) return <div className="state">{error}</div>;

  return (
    <div className="dash-root">
      <div className="dash-card">
        <h2>Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-box">
            <span>Total Jobs Posted</span>
            <b>{stats.totalJobs}</b>
          </div>

          <div className="stat-box">
            <span>Active Jobs</span>
            <b>{stats.activeJobs}</b>
          </div>

          <div className="stat-box">
            <span>Completed</span>
            <b>{stats.completedJobs}</b>
          </div>

          <div className="stat-box">
            <span>Cancelled</span>
            <b>{stats.cancelledJobs}</b>
          </div>
        </div>

        <button onClick={fetchStats}>🔄 Refresh</button>
      </div>

      <style jsx>{`
        .dash-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf4;
          padding: 16px;
        }

        .dash-card {
          width: 100%;
          max-width: 520px;
          background: white;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid rgba(16, 185, 129, 0.15);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        h2 {
          margin: 0 0 16px;
          color: #065f46;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-box {
          background: #ecfdf5;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-box span {
          font-size: 13px;
          color: #047857;
        }

        .stat-box b {
          font-size: 20px;
          color: #065f46;
        }

        button {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: #10b981;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        button:hover {
          background: #059669;
        }

        .state {
          padding: 40px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
