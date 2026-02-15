import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function MyCompletedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/jobs/my-completed");

      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load completed jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.skillRequired} ${job.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) return <div className="state">Loading jobs...</div>;

  if (error) return <div className="state">{error}</div>;

  return (
    <div className="feed-root">
      {/* ✅ TOP BAR */}
      <div className="top-bar">
        <input
          placeholder="Search completed jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="refresh-btn" onClick={fetchJobs}>
          🔄
        </button>
      </div>

      {/* ✅ EMPTY STATE */}
      {filteredJobs.length === 0 ? (
        <div className="job-card empty">No completed jobs</div>
      ) : (
        filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="status completed">Completed</span>
            </div>

            <p className="desc">{job.description}</p>

            <div className="meta">
              <div>
                <b>Skill:</b> {job.skillRequired}
              </div>
              <div>
                <b>Stations:</b> {job.stationRange.from} → {job.stationRange.to}
              </div>
              <div>
                <b>Budget:</b> ₹{job.budget}
              </div>
            </div>

            {/* ✅ ACTIONS 🔥 */}
            <div className="actions">
              <button onClick={() => navigate(`/ratings/${job._id}`)}>
                Rate
              </button>
            </div>
          </div>
        ))
      )}

      <style jsx>{`
        .feed-root {
          min-height: 100vh;
          padding: 16px;
          max-width: 900px;
          margin: auto;
        }

        .top-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .top-bar input {
          flex: 1;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0 16px;
          outline: none;
          font-size: 14px;
        }

        .refresh-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: #10b981;
          color: white;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .refresh-btn:hover {
          background: #059669;
        }

        .job-card {
          background: white;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h3 {
          margin: 0;
          color: #065f46;
        }

        .status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .completed {
          background: #ecfdf5;
          color: #047857;
        }

        .desc {
          margin: 8px 0;
          color: #374151;
        }

        .meta {
          font-size: 14px;
          color: #4b5563;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* ✅ ACTIONS */

        .actions {
          margin-top: 12px;
          display: flex;
        }

        .actions button {
          width: 100%;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: #e5e7eb;
          cursor: pointer;
          font-weight: 600;
        }

        .actions button:hover {
          background: #10b981;
          color: white;
        }

        .empty {
          text-align: center;
          color: #6b7280;
          font-weight: 600;
        }

        .state {
          padding: 40px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
