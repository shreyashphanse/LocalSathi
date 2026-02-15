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

    const { title, description, skillRequired, from, to, budget } = form;

    if (!title.trim()) return alert("Title required");
    if (!description.trim()) return alert("Description required");
    if (!skillRequired.trim()) return alert("Skill required");
    if (!from.trim()) return alert("From station required");
    if (!to.trim()) return alert("To station required");
    if (!budget) return alert("Budget required");

    try {
      setLoading(true);

      await api.post("/jobs/create", {
        title,
        description,
        skillRequired,
        from,
        to,
        budget: Number(budget),
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
      alert("Job creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-root">
      <form className="post-card" onSubmit={handleSubmit}>
        <h2>Post Job</h2>

        <input
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Job Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Skill Required"
          value={form.skillRequired}
          onChange={(e) => setForm({ ...form, skillRequired: e.target.value })}
        />

        <div className="stations">
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
          type="number"
          placeholder="Budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <button disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>

      <style jsx>{`
        .post-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf4;
          padding: 16px;
        }

        .post-card {
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        h2 {
          margin: 0 0 8px;
          color: #065f46;
        }

        input,
        textarea {
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0 12px;
          outline: none;
        }

        textarea {
          height: 80px;
          padding-top: 10px;
          resize: none;
        }

        .stations {
          display: flex;
          gap: 10px;
        }

        button {
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

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
