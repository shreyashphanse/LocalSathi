import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../utils/i18n";

export default function MyPostedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const { lang } = useLanguage();

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
      setError(t(lang, "jobsLoadFailed"));
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
      alert(t(lang, "cancellationFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ RAISE DISPUTE

  const handleDispute = async (jobId) => {
    try {
      const reason = prompt(t(lang, "enterDisputeReason"));

      if (!reason || reason.length < 10) {
        alert(t(lang, "disputeReasonLength"));
        return;
      }

      setActionLoading(jobId);

      await api.post("/disputes", {
        jobId,
        text: reason,
      });

      alert(t(lang, "disputeRaised"));
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || t(lang, "disputeFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.skillRequired} ${job.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) return <div className="state">{t(lang, "loadingJobs")}</div>;

  if (error) return <div className="state">{error}</div>;

  return (
    <div className="feed-root">
      <div className="top-bar">
        <input
          placeholder={t(lang, "searchMyJobs")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="refresh-btn" onClick={fetchJobs}>
          🔄
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="job-card empty">{t(lang, "noJobsFound")}</div>
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
                <b>{t(lang, "skill")}:</b> {job.skillRequired}
              </div>
              <div>
                <b>{t(lang, "stations")}:</b>
                {job.stationRange.from} → {job.stationRange.to}
              </div>
              <div>
                <b>{t(lang, "budget")}:</b>₹{job.budget}
              </div>
              {job.paymentDeadline && job.paymentStatus === "pending" && (
                <div>
                  <b>{t(lang, "paymentDeadline")}:</b>{" "}
                  {new Date(job.paymentDeadline).toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* ✅ OPEN JOB → ONLY CANCEL */}
            {job.status === "open" && (
              <div className="actions">
                <button
                  // className="cancel"
                  onClick={() => handleCancel(job._id)}
                  disabled={actionLoading === job._id}
                >
                  {actionLoading === job._id
                    ? t(lang, "processing")
                    : t(lang, "cancel")}{" "}
                </button>
              </div>
            )}

            {/* ✅ ASSIGNED JOB → CANCEL + DISPUTE */}
            {job.status === "assigned" && (
              <div className="actions dual">
                <button
                  className="cancel"
                  onClick={() => handleCancel(job._id)}
                  disabled={actionLoading === job._id}
                >
                  {t(lang, "cancel")}
                </button>

                <button
                  className="dispute"
                  onClick={() => handleDispute(job._id)}
                  disabled={actionLoading === job._id}
                >
                  {t(lang, "dispute")}
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
                  {t(lang, "makePayment")}
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
          background: #f5f3ff;
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
          border: 1px solid rgba(76, 29, 149, 0.15);
          padding: 0 16px;
          outline: none;
          background: white;
          color: #1e1b4b;
        }

        .top-bar input:focus {
          border-color: #0e7490;
          box-shadow: 0 0 0 2px rgba(14, 116, 144, 0.15);
        }

        /* ✅ REFRESH BUTTON */

        .refresh-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: #3b0f7a;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: 0.2s;
        }

        .refresh-btn:hover {
          background: #0e7490;
        }

        /* ✅ JOB CARD */

        .job-card {
          background: white;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid rgba(76, 29, 149, 0.15);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h3 {
          margin: 0;
          color: #1e1b4b;
        }

        /* ✅ STATUS BADGE */

        .status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(76, 29, 149, 0.08);
          color: #3b0f7a;
        }

        .desc {
          margin: 8px 0;
          color: rgba(30, 27, 75, 0.75);
        }

        .meta {
          font-size: 14px;
          color: rgba(30, 27, 75, 0.6);
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

        /* ✅ BUTTON SYSTEM */

        .actions button {
          width: 100%;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(77, 29, 149, 0.78);
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          color: #3b0f7a;
          transition: 0.2s;
        }

        /* Default Action Hover (Primary Feel) */

        .actions button:hover {
          background: #3b0f7a;
          color: white;
        }

        /* ✅ DELETE / CANCEL TYPE */

        .actions button.cancel:hover {
          background: #dc2626;
          border-color: #dc2626;
          color: white;
        }

        /* ✅ MAKE PAYMENT */

        .actions button.payment:hover {
          background: #059669;
          border-color: #059669;
          color: white;
        }

        /* ✅ DISPUTE BUTTON */

        .actions button.dispute:hover {
          background: #d97706;
          border-color: #d97706;
          color: white;
        }

        .empty {
          text-align: center;
          color: rgba(30, 27, 75, 0.6);
          font-weight: 600;
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
