import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function MyPostedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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

  const handleCancel = async (jobId) => {
    try {
      setActionLoading(jobId);

      await api.patch(`/jobs/${jobId}/cancel`, {
        reason: "Cancelled by client",
      });

      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Cancellation failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ RAISE DISPUTE

  const handleDispute = async (jobId) => {
    try {
      const reason = prompt("Enter dispute reason:");

      if (!reason || reason.length < 10) {
        alert("Reason must be at least 10 characters");
        return;
      }

      setActionLoading(jobId);

      await api.post("/disputes", {
        jobId,
        text: reason,
      });

      alert("Dispute raised");

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Dispute failed");
    } finally {
      setActionLoading(null);
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
      <div className="top-bar">
        <input
          placeholder="Search my jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="refresh-btn" onClick={fetchJobs}>
          🔄
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="job-card empty">No jobs found</div>
      ) : (
        filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className={`status ${job.status}`}>{job.status}</span>
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
              {job.paymentDeadline && job.paymentStatus === "pending" && (
                <div>
                  <b>Payment Deadline:</b>{" "}
                  {new Date(job.paymentDeadline).toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* ✅ OPEN JOB → ONLY CANCEL */}
            {job.status === "open" && (
              <div className="actions">
                <button
                  onClick={() => handleCancel(job._id)}
                  disabled={actionLoading === job._id}
                >
                  {actionLoading === job._id ? "Processing..." : "Cancel"}
                </button>
              </div>
            )}

            {/* ✅ ASSIGNED JOB → CANCEL + DISPUTE */}
            {job.status === "assigned" && (
              <div className="actions dual">
                <button
                  onClick={() => handleCancel(job._id)}
                  disabled={actionLoading === job._id}
                >
                  Cancel
                </button>

                <button
                  className="dispute"
                  onClick={() => handleDispute(job._id)}
                  disabled={actionLoading === job._id}
                >
                  Dispute
                </button>
              </div>
            )}

            {/* ✅ COMPLETED JOB → MAKE PAYMENT */}
            {job.status === "completed" && job.paymentStatus === "pending" && (
              <div className="actions">
                <button
                  className="payment"
                  onClick={() => navigate(`/payment/${job.paymentId}`)}
                >
                  Make Payment
                </button>
              </div>
            )}
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

        .actions {
          margin-top: 12px;
        }

        .dual {
          display: flex;
          gap: 10px;
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
          background: #ef4444;
          color: white;
        }

        .dispute:hover {
          background: #f59e0b;
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
