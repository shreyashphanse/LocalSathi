import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../utils/i18n";

export default function JobsFeed() {
  const { lang } = useLanguage();
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
      setError(t(lang, "jobsLoadFailed"));
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
      alert(t(lang, "acceptFailed"));
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
      alert(t(lang, "rejectFailed"));
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
          placeholder={t(lang, "searchJobs")}
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
          <div className="state-card">{t(lang, "loadingJobs")}</div>
        ) : error ? (
          <div className="state-card">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="state-card">{t(lang, "noJobsFound")}</div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3 className="title">{job.title}</h3>

              <p className="desc">{job.description}</p>

              <p>
                <b>{t(lang, "skill")}:</b>
                {job.skillRequired}
              </p>

              <p>
                <b>{t(lang, "stations")}:</b>
                {job.stationRange.from} → {job.stationRange.to}
              </p>

              <p>
                <b>{t(lang, "stations")}:</b> ₹{job.budget}
              </p>

              <p>
                <b>{t(lang, "budget")}:</b> {t(lang, job.status)}
              </p>

              <div className="actions">
                <button
                  className="job-btn accept-btn"
                  disabled={processingId === job._id}
                  onClick={() => handleAccept(job._id)}
                >
                  {processingId === job._id
                    ? t(lang, "accepting")
                    : t(lang, "accept")}{" "}
                </button>

                <button
                  className="job-btn reject-btn"
                  disabled={processingId === job._id}
                  onClick={() => handleReject(job._id)}
                >
                  {processingId === job._id
                    ? t(lang, "rejecting")
                    : t(lang, "reject")}{" "}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`

.feed-root {
  height: 100vh;
  background: #FFF7ED;   /* ✅ Background */
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
  background: #FFF7ED;   /* ✅ Match background */
  border-bottom: 1px solid rgba(154, 52, 18, 0.15); /* Primary tint */
  z-index: 10;
}

.top-bar input {
  flex: 1;
  height: 44px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(154, 52, 18, 0.2);  /* ✅ Primary tint */
  background: white;
  font-size: 15px;
  outline: none;
  color: #7C2D12;   /* ✅ Text Dark */
}

.top-bar input::placeholder {
  color: rgba(124, 45, 18, 0.5);
}

.refresh-btn {
  width: 44px;
  border-radius: 12px;
  border: none;
  background: #9A3412;   /* ✅ Primary */
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: 0.2s;
}

.refresh-btn:hover {
  background: #7C2D12;
}

/* 🔥 SCROLLABLE CONTENT */

.feed-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

/* 🔥 JOB CARD */

.job-card {
  border: 1px solid rgba(154, 52, 18, 0.15);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
  box-shadow: 0 4px 10px rgba(154, 52, 18, 0.08);
}

.state-card {
  border: 1px solid rgba(154, 52, 18, 0.15);
  border-radius: 14px;
  padding: 18px;
  background: white;
  text-align: center;
  color: #7C2D12;   /* ✅ Text Dark */
}

/* 🔥 TEXT */

.title {
  color: #7C2D12;   /* ✅ Text Dark */
}

.desc {
  color: #444;
  margin: 6px 0;
}

/* 🔥 ACTIONS */

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
  background: #FED7AA;  /* Soft orange tint */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #7C2D12;
}

/* ✅ ACCEPT BUTTON */

.accept-btn:hover {
  background: #109610;   /* Primary */
  color: white;
}

/* ✅ REJECT BUTTON */

.reject-btn:hover {
  background: #ff0101;   /* Secondary (Mustard) */
  color: white;
}

.job-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

`}</style>
    </div>
  );
}
