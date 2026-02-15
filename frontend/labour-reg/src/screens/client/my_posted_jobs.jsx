import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function MyPostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/jobs/my-posted");

      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="state">Loading jobs...</div>;
  if (error) return <div className="state">{error}</div>;

  if (jobs.length === 0)
    return (
      <div className="root">
        <div className="job-card state-card">No jobs posted yet</div>
      </div>
    );

  return (
    <div className="root">
      <div className="top-bar">
        <h2>My Posted Jobs</h2>
        <button onClick={fetchJobs}>↻</button>
      </div>

      {jobs.map((job) => (
        <div key={job._id} className="job-card">
          <div className="header">
            <h3>{job.title}</h3>
            <span className={`status ${job.status}`}>{job.status}</span>
          </div>

          <p className="desc">{job.description}</p>

          <p>
            <b>Skill:</b> {job.skillRequired}
          </p>

          <p>
            <b>Stations:</b> {job.stationRange.from} → {job.stationRange.to}
          </p>

          <p>
            <b>Budget:</b> ₹{job.budget}
          </p>
        </div>
      ))}

      <style>{`

        .root {
          min-height: 100vh;
          background: #f0fdf4;
          padding: 16px;
          max-width: 600px;
          margin: auto;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .top-bar button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: #10b981;
          color: white;
          font-size: 18px;
          cursor: pointer;
        }

        .job-card {
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          background: white;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.05);
        }

        .state-card {
          text-align: center;
          color: #047857;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          background: #ecfdf5;
          color: #059669;
        }

        .desc {
          color: #475569;
          margin: 6px 0;
        }

        .state {
          padding: 40px;
          text-align: center;
          color: #047857;
        }

      `}</style>
    </div>
  );
}
