import React, { useEffect, useState, useRef } from "react";
import FormCard from "../../components/FormCard";
import DefaultProfile from "../../assets/default_profile.png";
import { t } from "../../utils/i18n";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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

const styles = `
:root {
  --primary: #9A3412;
  --secondary: #D97706;
  --bg: #FFF7ED;
  --card: #FFFFFF;
  --text-dark: #7C2D12;
  --border-soft: rgba(154, 52, 18, 0.15);
}

/* PAGE */

.profile-root {
  padding: 28px;
  background: var(--bg);
  min-height: 100vh;
}

/* HEADER */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.welcome {
  margin: 0;
  font-size: 20px;
  color: var(--text-dark);
}

.sub {
  margin-top: 6px;
  color: rgba(124, 45, 18, 0.6);
  font-size: 13px;
}

/* BUTTONS */

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.btn.edit {
  background: var(--primary);
  color: white;
}

.btn.edit:hover {
  background: var(--text-dark);
}

.btn.cancel {
  background: transparent;
  border: 1px solid;
  color: var(--text-dark);
}

.btn.cancel:hover {
  background: rgb(194, 13, 13);
  color: white;
}

.btn.save {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--text-dark);
}

.btn.save:hover {
  background: rgb(23, 173, 9);
  color: white;
}

/* CARD */

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* TOP SECTION */

.top-section {
  display: flex;
  gap: 18px;
  align-items: center;
}

.avatar-wrap {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  border: 2px solid var(--primary);
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identity-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.display-name {
  font-weight: 700;
  font-size: 18px;
  color: var(--text-dark);
}

.meta-text {
  font-size: 13px;
  color: rgba(124, 45, 18, 0.7);
}

.rating {
  margin-top: 6px;
  font-size: 14px;
  color: var(--primary);
}

/* INPUT SECTION */

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.label-text {
  font-size: 12px;
  color: rgba(124, 45, 18, 0.7);
}

.input {
  height: 44px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  background: white;
  font-size: 14px;
  outline: none;
  color: var(--text-dark);
}

.input:focus {
  border-color: var(--primary);
}

.input.locked {
  background: #f9fafb;
}

/* ROW */

.row {
  display: flex;
  gap: 12px;
}

.row .field {
  flex: 1;
}

/* AGE */

.age-box {
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  border: 1px solid var(--border-soft);
  color: var(--text-dark);
}

/* SKILLS */

.skills-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  background: white;
  min-height: 44px;
  align-items: center;
}

.skill-tag {
  background: var(--primary);
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

.skill-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  flex: 1;
  min-width: 120px;
  color: var(--text-dark);
}

.skills-dropdown {
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  margin-top: 6px;
  background: white;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(154, 52, 18, 0.08);
}

/* LOGOUT */

.logout-btn {
  margin-top: 6px;
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: var(--secondary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.logout-btn:hover {
  background: rgb(194, 13, 13);
}

@media (max-width: 768px) {
  .top-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .row {
    flex-direction: column;
  }
}
`;

export default function LabourProfileTop() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const fileInputRef = useRef(null);

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] =
    useState(DefaultProfile);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [stationFrom, setStationFrom] = useState("");
  const [stationTo, setStationTo] = useState("");

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [verificationStatus, setVerificationStatus] = useState("");
  const [reliabilityScore, setReliabilityScore] = useState(50);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await api.get("/users/profile");

    setFullName(data.name || "");
    setPhone(data.phone || "");
    setAddress(data.address || "");
    setGender(data.gender || "");
    setDob(data.dob ? data.dob.substring(0, 10) : "");

    setStationFrom(data.stationRange?.start || "");
    setStationTo(data.stationRange?.end || "");

    setSkills(data.skills || []);
    setVerificationStatus(data.verificationStatus || "unverified");
    setReliabilityScore(data.reliabilityScore || 50);

    if (data.profilePhoto) {
      setProfilePhotoPreview(`http://localhost:5000${data.profilePhoto}`);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "--";
    const birth = new Date(dob);
    return Math.floor((Date.now() - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const filteredSkills = COMMON_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(skillInput.toLowerCase()),
  );

  const addSkill = (skill) => {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    const missingFields = [];

    if (!fullName.trim()) missingFields.push(t(lang, "fullName"));
    if (!address.trim()) missingFields.push(t(lang, "address"));
    if (!gender) missingFields.push(t(lang, "gender"));
    if (!dob) missingFields.push(t(lang, "dob"));
    if (!stationFrom) missingFields.push(t(lang, "stationFrom"));
    if (!stationTo) missingFields.push(t(lang, "stationTo"));
    if (!skills.length) missingFields.push(t(lang, "skills"));

    if (missingFields.length) {
      alert(`${t(lang, "missingFields")}:\n${missingFields.join("\n")}`);
    }

    /* ✅ SAFE TO SAVE */

    try {
      const formData = new FormData();

      formData.append("name", fullName);
      formData.append("address", address);
      formData.append("gender", gender);
      formData.append("dob", dob);
      formData.append("stationFrom", stationFrom);
      formData.append("stationTo", stationTo);

      formData.append("skills", JSON.stringify(skills));

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      await api.patch("/users/profile", formData);

      await fetchProfile(); // 🔥 THIS FIXES EVERYTHING

      setEditing(false);
      alert(t(lang, "profileUpdated"));
    } catch (err) {
      console.error(err);
      alert(t(lang, "updateFailed"));
    }
  };

  const handleCancel = () => {
    if (!originalData) return;

    setFullName(originalData.fullName);
    setAddress(originalData.address);
    setGender(originalData.gender);
    setDob(originalData.dob);
    setStationFrom(originalData.stationFrom);
    setStationTo(originalData.stationTo);
    setSkills(originalData.skills);

    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const ratingStars = "⭐".repeat(Math.round(reliabilityScore / 20));

  return (
    <div className="profile-root">
      <style>{styles}</style>

      <div className="page-header">
        <div>
          <h2 className="welcome">{t(lang, "profile")}</h2>
          <div className="sub">{t(lang, "manageAccount")}</div>
        </div>

        <div className="actions">
          <button
            className={`btn ${editing ? "save" : "edit"}`}
            onClick={() => {
              if (editing) handleSave();
              else {
                setOriginalData({
                  fullName,
                  address,
                  gender,
                  dob,
                  stationFrom,
                  stationTo,
                  skills,
                });
                setEditing(true);
              }
            }}
          >
            {editing ? t(lang, "save") : t(lang, "edit")}
          </button>
          {editing && (
            <button className="btn cancel" onClick={handleCancel}>
              {t(lang, "cancel")}
            </button>
          )}
        </div>
      </div>

      <FormCard>
        <div className="profile-card">
          <div className="top-section">
            <div
              className="avatar-wrap"
              onClick={() => editing && fileInputRef.current.click()}
            >
              <img src={profilePhotoPreview} className="avatar" />
            </div>

            <div className="identity-block">
              <div className="display-name">{fullName}</div>
              <div className="meta-text">{phone}</div>
              <div className="meta-text">
                {" "}
                {t(lang, "status")}: {t(lang, verificationStatus)}
              </div>
              <div className="rating">
                {ratingStars} ({reliabilityScore})
              </div>
            </div>
          </div>

          <div className="input-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhotoFile(e.target.files[0])}
              style={{ display: "none" }}
            />

            <label className="field">
              <span className="label-text">{t(lang, "fullName")}</span>
              <input
                value={fullName}
                readOnly={!editing}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
              />
            </label>

            <label className="field">
              <span className="label-text">{t(lang, "primaryAddress")}</span>
              <input
                value={address}
                readOnly={!editing}
                onChange={(e) => setAddress(e.target.value)}
                className="input"
              />
            </label>

            <div className="row">
              <label className="field">
                <span className="label-text">{t(lang, "dob")}</span>
                <input
                  type="date"
                  value={dob}
                  readOnly={!editing}
                  onChange={(e) => setDob(e.target.value)}
                  className="input"
                />
              </label>

              <label className="field">
                <span className="label-text">{t(lang, "gender")}</span>
                <select
                  value={gender}
                  disabled={!editing}
                  onChange={(e) => setGender(e.target.value)}
                  className="input"
                >
                  <option value="">{t(lang, "select")}</option>
                  <option value="male">{t(lang, "male")}</option>
                  <option value="female">{t(lang, "female")}</option>
                </select>
              </label>
            </div>

            <div className="age-box">
              {t(lang, "age")}:<strong>{calculateAge(dob)}</strong>
            </div>

            <div className="row">
              <label className="field">
                <span className="label-text">{t(lang, "fromStation")}</span>
                <select
                  value={stationFrom}
                  disabled={!editing}
                  onChange={(e) => setStationFrom(e.target.value)}
                  className="input"
                >
                  <option value="">Select</option>
                  {STATIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="label-text">{t(lang, "toStation")}</span>
                <select
                  value={stationTo}
                  disabled={!editing}
                  onChange={(e) => setStationTo(e.target.value)}
                  className="input"
                >
                  <option value="">Select</option>
                  {STATIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span className="label-text">{t(lang, "skills")}</span>

              <div className="skills-box">
                {skills.map((skill) => (
                  <div key={skill} className="skill-tag">
                    {t(lang, skill)}{" "}
                    {editing && (
                      <span onClick={() => removeSkill(skill)}>✕</span>
                    )}
                  </div>
                ))}

                {editing && (
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="skill-input"
                    placeholder={t(lang, "searchSkill")}
                  />
                )}
              </div>

              {editing && skillInput && (
                <div className="skills-dropdown">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="dropdown-item"
                    >
                      {t(lang, skill)}{" "}
                    </div>
                  ))}
                </div>
              )}
            </label>

            <button className="logout-btn" onClick={handleLogout}>
              {t(lang, "logout")}
            </button>
          </div>
        </div>
      </FormCard>
    </div>
  );
}
