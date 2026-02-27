import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const statsRes = await api.get("/jobs/dashboard/client");
      const jobsRes = await api.get("/jobs/my-posted");

      setStats(statsRes.data);

      // ✅ FILTER ONLY OPEN JOBS 🔥
      const openJobs = jobsRes.data
        .filter((job) => job.status === "open")
        .slice(0, 3);

      setJobs(openJobs);
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

        <button onClick={fetchData}>🔄 Refresh</button>

        {/* ✅ OPEN JOBS ONLY */}

        {jobs.length === 0 ? (
          <div className="empty-card">
            <button onClick={() => navigate("/postjob")}>Post New Job</button>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
            </div>
          ))
        )}
      </div>

      <style>{`
  .dash-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5F3FF;
    padding: 16px;
  }

  .dash-card {
    width: 100%;
    max-width: 520px;
    background: #FFFFFF;
    border-radius: 18px;
    padding: 22px;
    border: 1px solid rgba(76, 29, 149, 0.15);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  h2 {
    margin: 0 0 16px;
    color: #1E1B4B;
    text-align: center;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat-box {
    background: rgba(76, 29, 149, 0.06);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-box span {
    font-size: 13px;
    color: rgba(30, 27, 75, 0.6);
  }

  .stat-box b {
    font-size: 20px;
    color: #4C1D95;
  }

  .job-card {
    background: rgba(76, 29, 149, 0.06);
    border-radius: 14px;
    padding: 12px;
    margin-top: 10px;
  }

  .empty-card {
    margin-top: 14px;
    background: rgba(76, 29, 149, 0.06);
    padding: 14px;
    border-radius: 14px;
    text-align: center;
    color: rgba(30, 27, 75, 0.6);
  }

  button {
    width: 100%;
    height: 44px;
    border-radius: 12px;
    border: none;
    background: #4C1D95;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: #06B6D4;
  }

  .state {
    padding: 40px;
    text-align: center;
    color: rgba(30, 27, 75, 0.6);
  }
`}</style>
    </div>
  );
}
