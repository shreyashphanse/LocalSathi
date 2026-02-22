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

      <style jsx>{`
        .ratings-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf4;
          padding: 20px;
        }

        .ratings-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        h2 {
          margin: 0 0 16px;
          color: #065f46;
          text-align: center;
        }

        .stars {
          display: flex;
          justify-content: center;
          gap: 10px;
          font-size: 28px;
          margin-bottom: 16px;
        }

        .star {
          cursor: pointer;
          color: #d1d5db;
          transition: 0.2s;
        }

        .star.active {
          color: #10b981;
          transform: scale(1.15);
        }

        textarea {
          width: 100%;
          height: 90px;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 10px;
          resize: none;
          outline: none;
          margin-bottom: 14px;
        }

        button {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: #10b981;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        button:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
}
