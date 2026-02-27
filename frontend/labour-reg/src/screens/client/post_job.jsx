import { useState } from "react";
import api from "../../utils/api";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../utils/i18n";

const COMMON_SKILLS = [
  "plumbing",
  "electrician",
  "carpenter",
  "painter",
  "cleaning",
  "acRepair",
  "welder",
  "mechanic",
  "driver",
  "helper",
];

const STATIONS = ["Vasai", "Nalasopara", "Virar"];

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillRequired: "",
    from: "",
    to: "",
    budget: "",
  });
  const { lang } = useLanguage();
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ FILTERED SKILLS */
  const filteredSkills = COMMON_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(skillInput.toLowerCase()),
  );

  const selectSkill = (skill) => {
    setForm({ ...form, skillRequired: skill });
    setSkillInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, skillRequired, from, to, budget } = form;

    if (!title.trim()) return alert(t(lang, "titleRequired"));

    if (!description.trim()) return alert(t(lang, "descriptionRequired"));

    if (!skillRequired) return alert(t(lang, "skillRequired"));

    if (!from) return alert(t(lang, "fromStationRequired"));

    if (!to) return alert(t(lang, "toStationRequired"));

    if (!budget) return alert(t(lang, "budgetRequired"));

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

      alert(t(lang, "jobPostedSuccess"));

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
      alert(t(lang, "jobCreationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-root">
      <form className="post-card" onSubmit={handleSubmit}>
        <h2>{t(lang, "postJob")}</h2>
        <input
          placeholder={t(lang, "jobTitle")}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder={t(lang, "jobDescription")}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* ✅ SKILL SELECTOR 🔥 */}

        <div className="field">
          <input
            placeholder={t(lang, "searchSkill")}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />

          {skillInput && (
            <div className="skills-dropdown">
              {filteredSkills.map((skill) => (
                <div
                  key={skill}
                  onClick={() => selectSkill(skill)}
                  className="dropdown-item"
                >
                  {t(lang, skill)}
                </div>
              ))}
            </div>
          )}

          {form.skillRequired && (
            <div className="selected-skill">
              {t(lang, "selected")} <b>{t(lang, form.skillRequired)}</b>
            </div>
          )}
        </div>

        {/* ✅ STATION DROPDOWN 🔥 */}

        <div className="stations">
          <select
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
          >
            <option value="">{t(lang, "fromStation")}</option>
            {STATIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          >
            <option value="">{t(lang, "toStation")}</option>{" "}
            {STATIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          placeholder={t(lang, "budget")}
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <button disabled={loading}>
          {loading ? t(lang, "posting") : t(lang, "postJob")}{" "}
        </button>
      </form>

      <style>{`
        .post-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f3ff;
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
          border: 1px solid rgba(76, 29, 149, 0.15);
          position: relative;
        }

        h2 {
          margin: 0 0 8px;
          color: #1e1b4b;
        }

        input,
        textarea,
        select {
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(76, 29, 149, 0.15);
          padding: 0 12px;
          outline: none;
          font-size: 14px;
          color: #1e1b4b;
          background: white;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #0e7490;
          box-shadow: 0 0 0 2px rgba(14, 116, 144, 0.15);
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
          background: #3b0f7a;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        button:hover {
          background: #0e7490;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ✅ SKILL DROPDOWN */

        .field {
          position: relative;
        }

        .skills-dropdown {
          position: absolute;
          width: 100%;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(76, 29, 149, 0.15);
          margin-top: 4px;
          max-height: 160px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        }

        .dropdown-item {
          padding: 10px 12px;
          cursor: pointer;
          font-size: 14px;
          color: #1e1b4b;
        }

        .dropdown-item:hover {
          background: rgba(76, 29, 149, 0.06);
        }

        .selected-skill {
          font-size: 13px;
          color: #3b0f7a;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
}
