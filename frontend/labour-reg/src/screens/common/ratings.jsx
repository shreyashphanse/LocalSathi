import { useState } from "react";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Ratings() {
  const params = useParams();
  const jobId = params.id;
  const navigate = useNavigate();

  console.log("JOB ID:", jobId); // ✅ DEBUG (KEEP for now)

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    if (!jobId) {
      alert("Invalid Job");
      return;
    }

    if (!rating) {
      alert("Select rating");
      return;
    }

    try {
      await api.patch(`/jobs/${jobId}/rate`, {
        rating,
        comment: review,
      });

      alert("Rating submitted");
      navigate("/mycompleted");
    } catch (err) {
      console.error(err);

      const message = err.response?.data?.message;

      if (message === "Already rated this job") {
        alert("You have already rated this job");
        navigate("/mycompleted");
        return;
      }

      alert(message || "Rating failed");
    }
  };

  return (
    <div className="ratings-root">
      <div className="ratings-card">
        <h2>Rate Experience</h2>

        {/* ⭐ STARS */}
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (hover || rating) ? "active" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* 📝 REVIEW */}
        <textarea
          placeholder="Write optional review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button onClick={handleSubmit}>Submit Rating</button>
      </div>

      <style>{`
        .ratings-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff7ed; /* ✅ Labour Background */
          padding: 20px;
        }

        .ratings-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(154, 52, 18, 0.08);
          border: 1px solid rgba(154, 52, 18, 0.15);
        }

        h2 {
          margin: 0 0 18px;
          color: #7c2d12; /* ✅ Text Dark */
          text-align: center;
        }

        /* ⭐ STARS */

        .stars {
          display: flex;
          justify-content: center;
          gap: 12px;
          font-size: 30px;
          margin-bottom: 18px;
        }

        .star {
          cursor: pointer;
          color: #e5e7eb;
          transition: 0.2s;
        }

        .star.active {
          color: #d97706; /* ✅ Mustard Accent */
          transform: scale(1.18);
        }

        /* 📝 REVIEW */

        textarea {
          width: 100%;
          height: 90px;
          border-radius: 14px;
          border: 1px solid rgba(154, 52, 18, 0.15);
          padding: 12px;
          resize: none;
          outline: none;
          margin-bottom: 16px;
          font-size: 14px;
          color: #7c2d12;
          transition: 0.2s;
        }

        textarea:focus {
          border-color: #9a3412;
          box-shadow: 0 0 0 2px rgba(154, 52, 18, 0.08);
        }

        /* ✅ BUTTON */

        button {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: none;
          background: #9a3412; /* ✅ Primary */
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        button:hover {
          background: #7c2d12;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
