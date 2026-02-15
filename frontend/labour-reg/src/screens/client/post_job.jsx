import { useState } from "react";
import api from "../../utils/api";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillRequired: "",
    from: "",
    to: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/jobs/create", {
        ...form,
        budget: Number(form.budget),
      });

      alert("Job posted successfully");

      setForm({
        title: "",
        description: "",
        skillRequired: "",
        from: "",
        to: "",
        budget: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-root">
      <form className="post-card" onSubmit={handleSubmit}>
        <h2>Post a Job</h2>

        <input
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Skill Required"
          value={form.skillRequired}
          onChange={(e) => setForm({ ...form, skillRequired: e.target.value })}
        />

        <div className="row">
          <input
            placeholder="From Station"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
          />

          <input
            placeholder="To Station"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
        </div>

        <input
          placeholder="Budget"
          type="number"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <button disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>

      <style>{`

        .post-root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f0fdf4;
          padding: 20px;
        }

        .post-card {
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(16, 185, 129, 0.15);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        input, textarea {
          height: 44px;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        textarea {
          height: 80px;
        }

        .row {
          display: flex;
          gap: 8px;
        }

        button {
          height: 44px;
          border: none;
          border-radius: 10px;
          background: #10b981;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
        }

      `}</style>
    </div>
  );
}
