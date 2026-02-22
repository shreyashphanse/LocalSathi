import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function MyCompletedJobs() {
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

      const { data } = await api.get("/jobs/my-completed");

      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load completed jobs");
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentId) => {
    try {
      setActionLoading(paymentId);

      await api.patch(`/payments/${paymentId}/confirm`);

      alert("Payment verified");

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Confirmation failed");
    } finally {
      setActionLoading(null);
    }
  };

  const disputePayment = async (paymentId) => {
    try {
      const reason = prompt("Enter dispute reason:");

      if (!reason || reason.length < 10) {
        alert("Reason must be at least 10 characters");
        return;
      }

      setActionLoading(paymentId);

      await api.patch(`/payments/${paymentId}/dispute`, { reason });

      alert("Payment disputed");

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
              <button
                className="rate-btn"
                onClick={() => navigate(`/ratings/${job._id}`)}
              >
                Rate
              </button>
            </div>

            {/* ✅ PAYMENT CONFIRMATION */}
            {job.paymentStatus === "pending_confirmation" && (
              <div className="actions dual">
                <button
                  className="confirm-btn"
                  onClick={() => confirmPayment(job.paymentId)}
                  disabled={actionLoading === job.paymentId}
                >
                  {actionLoading === job.paymentId
                    ? "Processing..."
                    : "Confirm Payment"}
                </button>

                <button
                  className="dispute-btn"
                  onClick={() => disputePayment(job.paymentId)}
                  disabled={actionLoading === job.paymentId}
                >
                  Raise Dispute
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <style>{`
        .feed-root {
          min-height: 100vh;
          padding: 16px;
          max-width: 900px;
          margin: auto;
          background: #fff7ed; /* ✅ Labour Background */
        }

        /* ✅ TOP BAR */

        .top-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .top-bar input {
          flex: 1;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(154, 52, 18, 0.25);
          padding: 0 16px;
          outline: none;
          font-size: 14px;
          color: #7c2d12;
        }

        .top-bar input:focus {
          border-color: #9a3412;
        }

        /* ✅ REFRESH BUTTON */

        .refresh-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: #9a3412;
          color: white;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
          transition: 0.2s;
        }

        .refresh-btn:hover {
          background: #7c2d12;
        }

        /* ✅ JOB CARD */

        .job-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid rgba(154, 52, 18, 0.15);
          box-shadow: 0 4px 12px rgba(154, 52, 18, 0.05);
        }

        /* ✅ HEADER */

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h3 {
          margin: 0;
          color: #7c2d12;
        }

        /* ✅ STATUS */

        .status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .completed {
          background: #cfecca;
          color: #137706;
        }

        /* ✅ DESCRIPTION */

        .desc {
          margin: 8px 0;
          color: #444;
        }

        /* ✅ META */

        .meta {
          font-size: 14px;
          color: #444;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* ✅ ACTIONS */

        .actions {
          margin-top: 12px;
          display: flex;
        }

        .dual {
          gap: 10px;
        }

        /* ✅ BASE BUTTON */

        .actions button {
          width: 100%;
          height: 40px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        /* ✅ RATE BUTTON */

        .rate-btn {
          background: #9a3412;
          color: white;
        }

        .rate-btn:hover {
          background: #7c2d12;
        }

        /* ✅ CONFIRM BUTTON */

        .confirm-btn {
          background: #15803d;
          color: white;
        }

        .confirm-btn:hover {
          background: #166534;
        }

        /* ✅ DISPUTE BUTTON */

        .dispute-btn {
          background: #d97706;
          color: white;
        }

        .dispute-btn:hover {
          background: #b45309;
        }

        /* ✅ EMPTY / STATE */

        .empty {
          text-align: center;
          color: rgba(124, 45, 18, 0.6);
          font-weight: 600;
        }

        .state {
          padding: 40px;
          text-align: center;
          color: rgba(124, 45, 18, 0.7);
        }

        /* ✅ MOBILE */

        @media (max-width: 768px) {
          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
