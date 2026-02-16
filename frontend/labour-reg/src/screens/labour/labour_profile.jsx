import React, { useEffect, useRef, useState } from "react";
import FormCard from "../../components/FormCard";
import { t } from "../../utils/i18n";
import DefaultProfile from "../../assets/default_profile.png";
import { useAuth } from "../../hooks/useAuth"; // ✅ ADDED
import { useNavigate } from "react-router-dom";

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

  .profile-root {
    padding: 28px;
    background: var(--emerald-50);
    min-height: 100vh;
  }

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

  .profile-row {
    display: flex;
    gap: 20px;
  }

  .left {
    width: 34%;
    display: flex;
    gap: 14px;
    align-items: center;
  }

  .avatar-wrap {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    overflow: hidden;
    background: white;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    border: 2px solid var(--emerald-500);
  }

  .avatar-wrap.editable {
    cursor: pointer;
    outline: 2px dashed rgba(35, 190, 113, 0.1);
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .display-name {
    font-weight: 700;
    font-size: 18px;
    color: var(--emerald-700);
  }

  .email {
    margin-top: 6px;
    font-size: 13px;
    color: #4b5f4e;
  }

  .status-note {
    margin-top: 8px;
    font-size: 13px;
    color: var(--emerald-500);
    font-weight: 600;
  }

  .right {
    flex: 1;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 22px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
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
    background: var(--emerald-50);
    font-size: 14px;
    outline: none;
  }

  .input.locked {
    background: #f7f9f6;
  }

  .muted-note {
    font-size: 12px;
    color: #6b7280;
  }

  /* ✅ LOGOUT */

  .logout-wrap {
    margin-top: 26px;
  }

  .logout-btn {
    width: 100%;
    height: 46px;
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

  @media (max-width: 900px) {
    .profile-row {
      flex-direction: column;
    }

    .left {
      width: 100%;
    }

    .grid {
      grid-template-columns: 1fr;
    }
  }
`;

function relativeTimeFromISO(isoString) {
  if (!isoString) return "Unknown";
  const then = new Date(isoString).getTime();
  if (isNaN(then)) return "Unknown";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Active just now";
  if (mins < 60) return `Active ${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Active ${hours} hrs ago`;
  const days = Math.floor(hours / 24);
  return `Active ${days} days ago`;
}

export default function LabourProfileTop({ lang }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("John Doe");
  const [phone] = useState("+91-9876543210");
  const [email] = useState("johndoe@example.com");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("1995-06-15");

  const [verificationStatus] = useState("unverified");
  const [lastActive, setLastActive] = useState(() => new Date().toISOString());

  const fileInputRef = useRef(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] =
    useState(DefaultProfile);

  const computeAge = (dobString) => {
    if (!dobString) return null;
    const birth = new Date(dobString);
    if (isNaN(birth)) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const age = computeAge(dob);

  useEffect(() => {
    setLastActive(new Date().toISOString());
  }, []);

  useEffect(() => {
    if (!profilePhotoFile) return;
    const url = URL.createObjectURL(profilePhotoFile);
    setProfilePhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhotoFile]);

  const handleSave = () => {
    setEditing(false);
    setLastActive(new Date().toISOString());
    alert(t(lang, "profileSaved"));
  };

  const onSelectProfilePhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setProfilePhotoFile(f);
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // ✅ CRITICAL FIX
  };

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
            onClick={() => (editing ? handleSave() : setEditing(true))}
          >
            {editing ? t(lang, "save") : t(lang, "edit")}
          </button>
        </div>
      </div>

      <FormCard>
        <div className="profile-row">
          <div className="left">
            <div className="avatar-wrap">
              <img src={profilePhotoPreview} alt="avatar" className="avatar" />
            </div>

            <div>
              <div className="display-name">{fullName}</div>
              <div className="email">{email}</div>
              <div className="status-note">
                {t(lang, "status")}: {verificationStatus}
              </div>
            </div>
          </div>

          <div className="right">
            <div className="grid">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSelectProfilePhoto}
                style={{ display: "none" }}
              />

              <label className="field">
                <span className="label-text">{t(lang, "fullName")}</span>
                <input className="input" value={fullName} readOnly />
              </label>

              <label className="field">
                <span className="label-text">{t(lang, "phoneRegistered")}</span>
                <input className="input locked" value={phone} readOnly />
              </label>

              <label className="field">
                <span className="label-text">{t(lang, "gender")}</span>
                <input className="input" value={gender} readOnly />
              </label>

              <label className="field">
                <span className="label-text">{t(lang, "dob")}</span>
                <input className="input" value={dob} readOnly />
                <div className="muted-note">
                  {age !== null && `${t(lang, "age")}: ${age}`}
                </div>
              </label>

              <label className="field">
                <span className="label-text">{t(lang, "lastActive")}</span>
                <input
                  className="input"
                  value={relativeTimeFromISO(lastActive)}
                  readOnly
                />
              </label>
            </div>
          </div>
        </div>

        {/* ✅ LOGOUT BUTTON */}
        <div className="logout-wrap">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </FormCard>
    </div>
  );
}
