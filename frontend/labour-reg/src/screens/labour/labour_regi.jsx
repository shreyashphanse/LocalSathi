import React, { useRef, useState } from "react";
import FormCard from "../../components/FormCard";
import { ensureMobileFocus } from "../../utils/mobileFocus";
import { useNavigate } from "react-router-dom";
import { t } from "../../utils/i18n";
import api from "../../utils/api";
import { useLanguage } from "../../hooks/useLanguage";

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

export default function LabourRegi() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    dob: "",
    stationFrom: "",
    stationTo: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredSkills = COMMON_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(skillInput.toLowerCase()),
  );

  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, password, dob, stationFrom, stationTo } = form;

    if (!phone.trim()) return alert(t(lang, "phoneRequired"));
    if (!dob) return alert(t(lang, "dobRequired"));

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (isNaN(age)) return alert(t(lang, "invalidDob"));
    if (age < 18) return alert(t(lang, "ageRestriction"));

    if (!name.trim()) return alert(t(lang, "nameRequired"));
    if (!password.trim()) return alert(t(lang, "passwordRequired"));

    if (!stationFrom || !stationTo)
      return alert(t(lang, "stationRangeRequired"));

    if (skills.length === 0) return alert(t(lang, "atLeastOneSkill"));

    try {
      setLoading(true);

      await api.post("/auth/register/labour", {
        name,
        phone,
        password,
        dob,
        stationFrom,
        stationTo,
        skills,
      });

      alert(t(lang, "registrationSuccess"));
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || t(lang, "registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root">
      <FormCard title={t(lang, "providerRegistration")}>
        <form ref={formRef} className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label-text">{t(lang, "name")}</span>
            <input
              type="text"
              placeholder={t(lang, "enterName")}
              onFocus={ensureMobileFocus}
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label className="field">
            <span className="label-text">{t(lang, "phone")}</span>
            <input
              type="tel"
              placeholder={t(lang, "enterPhone")}
              onFocus={ensureMobileFocus}
              required
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>

          {/* ✅ STATION RANGE 🔥 */}

          <div className="row">
            <label className="field">
              <span className="label-text">{t(lang, "fromStation")}</span>

              <select
                value={form.stationFrom}
                onChange={(e) =>
                  setForm({ ...form, stationFrom: e.target.value })
                }
                className="input"
              >
                <option value="">{t(lang, "select")}</option>
                {STATIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="label-text">{t(lang, "toStation")}</span>
              <select
                value={form.stationTo}
                onChange={(e) =>
                  setForm({ ...form, stationTo: e.target.value })
                }
                className="input"
              >
                <option value="">{t(lang, "select")}</option>
                {STATIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          {/* ✅ SKILL SELECTOR 🔥 */}

          <label className="field">
            <span className="label-text">{t(lang, "skills")}</span>
            <div className="skills-box">
              {skills.map((skill) => (
                <div key={skill} className="skill-tag">
                  {t(lang, skill)}
                  <span onClick={() => removeSkill(skill)}>✕</span>
                </div>
              ))}

              <input
                type="text"
                placeholder={t(lang, "searchSkill")}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="skill-input"
              />
            </div>

            {skillInput && (
              <div className="skills-dropdown">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="dropdown-item"
                  >
                    {t(lang, skill)}
                  </div>
                ))}
              </div>
            )}
          </label>

          <label className="field">
            <span className="label-text">{t(lang, "password")}</span>

            <input
              type="password"
              placeholder={t(lang, "enterPassword")}
              onFocus={ensureMobileFocus}
              required
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <label className="field">
            <span className="label-text">{t(lang, "dob")}</span>
            <input
              type="date"
              onFocus={ensureMobileFocus}
              required
              className="input"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </label>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? t(lang, "registering") : t(lang, "register")}
          </button>
        </form>

        <style>{`
        :root {
  --primary: #9A3412;
}
  /* PAGE */

.page-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #FFF7ED;   /* ✅ Labour Background */
}

/* FORM */

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.label-text {
  font-size: 13px;
  color: rgba(124, 45, 18, 0.65);
}

/* INPUT */

.input {
  height: 44px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(154, 52, 18, 0.15);
  background: white;
  font-size: 15px;
  outline: none;
  color: #7C2D12;
  transition: 0.2s;
}

.input:focus {
  border-color: #9A3412;
  box-shadow: 0 0 0 2px rgba(154, 52, 18, 0.08);
}

/* BUTTON */

.submit-btn {
  height: 46px;
  border-radius: 12px;
  border: none;
  background: #9A3412;   /* ✅ Primary */
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.submit-btn:hover {
  background: #7C2D12;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ROW */

.row {
  display: flex;
  gap: 10px;
}

/* SKILLS */

.skills-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(154, 52, 18, 0.15);
  background: white;
  min-height: 44px;
  align-items: center;
}

.skill-tag {
  background: #9A3412;   /* ✅ Primary */
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.skill-tag span {
  cursor: pointer;
}

/* SKILL INPUT */

.skill-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  flex: 1;
  color: #7C2D12;
}

/* DROPDOWN */

.skills-dropdown {
  border-radius: 12px;
  border: 1px solid rgba(154, 52, 18, 0.15);
  margin-top: 6px;
  background: white;
  overflow: hidden;
  box-shadow: 0 6px 14px rgba(0,0,0,0.05);
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #7C2D12;
}

.dropdown-item:hover {
  background: rgba(154, 52, 18, 0.06);
}

/* MOBILE */

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }
}

`}</style>
      </FormCard>
    </div>
  );
}
