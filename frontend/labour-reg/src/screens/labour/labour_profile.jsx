import React, { useEffect, useState, useRef } from "react";
import FormCard from "../../components/FormCard";
import DefaultProfile from "../../assets/default_profile.png";
import { t } from "../../utils/i18n";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const COMMON_SKILLS = [
  "Plumbing",
  "Electrician",
  "Carpenter",
  "Painter",
  "Cleaning",
  "AC Repair",
  "Welder",
  "Mechanic",
  "Driver",
  "Helper",
];

const STATIONS = ["Vasai", "Nalasopara", "Virar"];

const styles = `
:root {
  --emerald-50: #f0fbf4;
  --emerald-100: #e6f6ea;
  --emerald-200: #c8eed0;
  --emerald-300: #9fe2a8;
  --emerald-500: #2f855a;
  --emerald-600: #276749;
  --emerald-700: #22543d;
  --text: #0f172a;
}

/* PAGE */

.profile-root {
  padding: 28px;
  background: var(--emerald-50);
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
  color: var(--text);
}

.sub {
  margin-top: 6px;
  color: #5b6b59;
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
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn.edit {
  background: linear-gradient(180deg, var(--emerald-300), var(--emerald-500));
  color: white;
}

.btn.cancel {
  background: transparent;
  border: 1px solid rgba(47, 133, 90, 0.2);
  color: var(--emerald-700);
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
  border: 2px solid var(--emerald-500);
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
  color: var(--emerald-700);
}

.meta-text {
  font-size: 13px;
  color: #4b5f4e;
}

.rating {
  margin-top: 6px;
  font-size: 14px;
  color: var(--emerald-600);
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
  color: #3f5a48;
}

.input {
  height: 44px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(47, 133, 90, 0.12);
  background: white;
  font-size: 14px;
  outline: none;
}

.input.locked {
  background: #f7f9f6;
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
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  border: 1px solid rgba(47, 133, 90, 0.12);
}

/* SKILLS */

.skills-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(47, 133, 90, 0.12);
  background: white;
  min-height: 44px;
  align-items: center;
}

.skill-tag {
  background: var(--emerald-500);
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
}

.skills-dropdown {
  border-radius: 10px;
  border: 1px solid rgba(47, 133, 90, 0.12);
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
  background: var(--emerald-50);
}

/* LOGOUT */

.logout-btn {
  margin-top: 6px;
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.logout-btn:hover {
  background: #dc2626;
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

export default function LabourProfileTop({ lang }) {
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

    if (!fullName.trim()) missingFields.push("Full Name");
    if (!address.trim()) missingFields.push("Address");
    if (!gender) missingFields.push("Gender");
    if (!dob) missingFields.push("DOB");
    if (!stationFrom) missingFields.push("Station From");
    if (!stationTo) missingFields.push("Station To");
    if (!skills.length) missingFields.push("Skills");

    if (missingFields.length) {
      return alert(`Missing fields:\n${missingFields.join("\n")}`);
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

      setEditing(false);
      alert("Profile Updated");
    } catch (err) {
      console.error(err);
      alert("Update failed");
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
            className="btn edit"
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
            {editing ? "Save" : "Edit"}
          </button>

          {editing && (
            <button className="btn cancel" onClick={handleCancel}>
              Cancel
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
              <div className="meta-text">Status: {verificationStatus}</div>
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
              <span className="label-text">Full Name</span>
              <input
                value={fullName}
                readOnly={!editing}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
              />
            </label>

            <label className="field">
              <span className="label-text">Address</span>
              <input
                value={address}
                readOnly={!editing}
                onChange={(e) => setAddress(e.target.value)}
                className="input"
              />
            </label>

            <div className="row">
              <label className="field">
                <span className="label-text">DOB</span>
                <input
                  type="date"
                  value={dob}
                  readOnly={!editing}
                  onChange={(e) => setDob(e.target.value)}
                  className="input"
                />
              </label>

              <label className="field">
                <span className="label-text">Gender</span>
                <select
                  value={gender}
                  disabled={!editing}
                  onChange={(e) => setGender(e.target.value)}
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>

            <div className="age-box">
              Age: <strong>{calculateAge(dob)}</strong>
            </div>

            <div className="row">
              <label className="field">
                <span className="label-text">Station From</span>
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
                <span className="label-text">Station To</span>
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
              <span className="label-text">Skills</span>

              <div className="skills-box">
                {skills.map((skill) => (
                  <div key={skill} className="skill-tag">
                    {skill}
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
                    placeholder="Search skills..."
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
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </label>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </FormCard>
    </div>
  );
}
