import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function JobsFeed() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/jobs");

      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (jobId) => {
    try {
      setProcessingId(jobId);

      await api.patch(`/jobs/${jobId}/accept`);

      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      alert("Accept failed");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (jobId) => {
    try {
      setProcessingId(jobId);

      await api.patch(`/jobs/${jobId}/reject`);

      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      alert("Reject failed");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.skillRequired.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="feed-root">
      {/* 🔥 STICKY HEADER */}

      <div className="top-bar">
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="refresh-btn" onClick={fetchJobs}>
          ↻
        </button>
      </div>

      {/* 🔥 CONTENT AREA */}

      <div className="feed-content">
        {loading ? (
          <div className="state-card">Loading jobs...</div>
        ) : error ? (
          <div className="state-card">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="state-card">No jobs found</div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3 className="title">{job.title}</h3>

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

              <p>
                <b>Status:</b> {job.status}
              </p>

              <div className="actions">
                <button
                  className="job-btn accept-btn"
                  disabled={processingId === job._id}
                  onClick={() => handleAccept(job._id)}
                >
                  {processingId === job._id ? "Accepting..." : "Accept"}
                </button>

                <button
                  className="job-btn reject-btn"
                  disabled={processingId === job._id}
                  onClick={() => handleReject(job._id)}
                >
                  {processingId === job._id ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`

        .feed-root {
          height: 100vh;
          background: #f0fdf4;
          display: flex;
          flex-direction: column;
        }

        /* 🔥 STICKY HEADER */

        .top-bar {
          position: sticky;
          top: 0;
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          background: #f0fdf4;
          border-bottom: 1px solid rgba(16, 185, 129, 0.15);
          z-index: 10;
        }

        .top-bar input {
          flex: 1;
          height: 44px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.15);
          background: white;
          font-size: 15px;
          outline: none;
        }

        .refresh-btn {
          width: 44px;
          border-radius: 12px;
          border: none;
          background: #10b981;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }

        /* 🔥 SCROLLABLE CONTENT */

        .feed-content {
          flex: 1;
          overflow-y: auto;
          padding: 12px 16px;
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
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 14px;
          padding: 18px;
          background: white;
          text-align: center;
          color: #047857;
        }

        .title {
          color: #047857;
        }

        .desc {
          color: #475569;
          margin: 6px 0;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .job-btn {
          flex: 1;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: #e5e7eb;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .job-btn:hover {
          color: white;
        }

        .accept-btn:hover {
          background: #10b981;
        }

        .reject-btn:hover {
          background: #ef4444;
        }

        .job-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

      `}</style>
    </div>
  );
}
