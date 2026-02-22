import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function LabourDashboard() {
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

      const statsRes = await api.get("/jobs/dashboard/labour");
      const jobsRes = await api.get("/jobs/my-accepted");

      setStats(statsRes.data);
      setJobs(jobsRes.data.slice(0, 3)); // ✅ Latest 3
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

        {/* ✅ STATS */}
        <div className="stats-grid">
          <div className="stat-box">
            <span>Accepted Jobs</span>
            <b>{stats.acceptedJobs}</b>
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

          <div className="stat-box earnings">
            <span>Total Earnings</span>
            <b>₹{stats.totalEarnings}</b>
          </div>
        </div>

        {/* ✅ REFRESH */}
        <button onClick={fetchData}>🔄 Refresh</button>

        {/* ✅ ACTIVE JOBS PREVIEW */}
        <div className="jobs-section">
          <h3>Latest Active Jobs</h3>

          {jobs.length === 0 ? (
            <div className="empty-card">
              <button onClick={() => navigate("/jobs")}>Find Jobs</button>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h4>{job.title}</h4>
                <p>{job.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`

.dash-root {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #FFF7ED;   /* ✅ Labour Background */
  padding: 16px;
}

.dash-card {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(154, 52, 18, 0.15);
  box-shadow: 0 8px 20px rgba(154, 52, 18, 0.08);
}

/* ✅ HEADINGS */

h2 {
  margin: 0 0 16px;
  color: #7C2D12;   /* ✅ Text Dark */
  text-align: center;
}

h3 {
  margin: 18px 0 10px;
  color: #7C2D12;
  font-size: 16px;
}

/* ✅ STATS GRID */

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-box {
  background: #FFEDD5;  /* ✅ Soft orange tint */
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid rgba(154, 52, 18, 0.12);
}

.stat-box span {
  font-size: 13px;
  color: rgba(124, 45, 18, 0.7);
}

.stat-box b {
  font-size: 20px;
  color: #9A3412;   /* ✅ Primary */
}

/* ✅ EARNINGS HIGHLIGHT */

.earnings {
  grid-column: span 2;
  background: #9A3412;   /* ✅ Primary */
}

.earnings span,
.earnings b {
  color: white;
}

/* ✅ BUTTON */

button {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: #9A3412;   /* ✅ Primary */
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #7C2D12;
}

/* ✅ JOB PREVIEW */

.jobs-section {
  margin-top: 10px;
}

.job-card {
  background: #FFF;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid rgba(154, 52, 18, 0.12);
  box-shadow: 0 4px 10px rgba(154, 52, 18, 0.05);
}

.job-card h4 {
  margin: 0;
  color: #7C2D12;
  font-size: 15px;
}

.job-card p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #444;
}

/* ✅ EMPTY CARD */

.empty-card {
  background: #FFF;
  padding: 16px;
  border-radius: 14px;
  text-align: center;
  border: 1px solid rgba(154, 52, 18, 0.12);
}

/* ✅ LOADING / ERROR */

.state {
  padding: 40px;
  text-align: center;
  color: #7C2D12;
}

`}</style>
    </div>
  );
}
