import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function MyAcceptedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [disputeText, setDisputeText] = useState({});
  const [evidenceFile, setEvidenceFile] = useState({});

  const updateDisputeText = (jobId, value) => {
    setDisputeText((prev) => ({ ...prev, [jobId]: value }));
  };

  const updateEvidenceFile = (jobId, file) => {
    setEvidenceFile((prev) => ({ ...prev, [jobId]: file }));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/jobs/my-accepted");

      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load accepted jobs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ COMPLETE JOB

  const handleComplete = async (jobId) => {
    try {
      setActionLoading(jobId);

      await api.patch(`/jobs/${jobId}/complete`);

      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Completion failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ CANCEL JOB

  const handleCancel = async (jobId) => {
    try {
      setActionLoading(jobId);

      await api.patch(`/jobs/${jobId}/cancel`, {
        reason: "Cancelled by labour",
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
      const reason = disputeText[jobId];

      if (!reason || reason.length < 10) {
        alert("Reason too short");
        return;
      }

      setActionLoading(jobId);

      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("text", reason);

      if (evidenceFile[jobId]) {
        formData.append("evidence", evidenceFile[jobId]);
      }

      await api.post("/disputes", formData);

      alert("Dispute raised");

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Dispute failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ FILTER LOGIC 🔥

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.skillRequired} ${job.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // ---------------- STATES ----------------

  if (loading) return <div className="state">Loading jobs...</div>;

  if (error) return <div className="state">{error}</div>;

  // ---------------- UI ----------------

  return (
    <div className="feed-root">
      {/* ✅ TOP BAR 🔥 */}
      <div className="top-bar">
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="refresh-btn" onClick={fetchJobs}>
          🔄
        </button>
      </div>

      {/* ✅ EMPTY STATE CARD 🔥 */}
      {filteredJobs.length === 0 ? (
        <div className="job-card empty">No jobs found</div>
      ) : (
        filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="status">{job.status}</span>
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

            <textarea
              placeholder="Enter dispute reason..."
              value={disputeText[job._id] || ""}
              onChange={(e) => updateDisputeText(job._id, e.target.value)}
              className="dispute-input"
            />

            <input
              type="file"
              onChange={(e) => updateEvidenceFile(job._id, e.target.files[0])}
            />

            <div className="actions">
              <button
                className="complete"
                onClick={() => handleComplete(job._id)}
                disabled={actionLoading === job._id}
              >
                {actionLoading === job._id ? "Processing..." : "Complete"}
              </button>

              <button
                className="cancel"
                onClick={() => handleCancel(job._id)}
                disabled={actionLoading === job._id}
              >
                Cancel
              </button>

              {(job.status === "assigned" || job.status === "completed") && (
                <button
                  className="dispute"
                  onClick={() => handleDispute(job._id)}
                  disabled={actionLoading === job._id}
                >
                  Dispute
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <style>{`

.feed-root {
  min-height: 100vh;
  padding: 16px;
  max-width: 900px;
  margin: auto;
  background: #FFF7ED;   /* ✅ Labour Background */
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
  color: #7C2D12;
}

.top-bar input:focus {
  border-color: #9A3412;
}

/* ✅ REFRESH BUTTON */

.refresh-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: #9A3412;   /* ✅ Primary */
  color: white;
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
  transition: 0.2s;
}

.refresh-btn:hover {
  background: #7C2D12;
}

/* ✅ JOB CARD */

.job-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid rgba(154, 52, 18, 0.15);
  box-shadow: 0 4px 12px rgba(154, 52, 18, 0.05);
}

.empty {
  text-align: center;
  color: rgba(124, 45, 18, 0.6);
  font-weight: 600;
}

/* ✅ HEADER */

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
  color: #7C2D12;
}

/* ✅ STATUS BADGE */

.status {
  background: #FFEDD5;
  color: #9A3412;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
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

/* ✅ DISPUTE TEXTAREA */

.dispute-input {
  width: 100%;
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid rgba(154, 52, 18, 0.15);
  padding: 10px;
  resize: none;
  font-size: 14px;
  outline: none;
}

.dispute-input:focus {
  border-color: #9A3412;
}

/* ✅ ACTIONS */

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
}

button {
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: #F3F4F6;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

/* ✅ PRIMARY ACTION */

.complete:hover {
  background: #2d960d;
  color: white;
}

/* ✅ CANCEL */

.cancel:hover {
  background: #DC2626;
  color: white;
}

/* ✅ DISPUTE */

.dispute:hover {
  background: #D97706;
  color: white;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ✅ STATE */

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
