import React, { useEffect, useState, useRef } from "react";
import FormCard from "../../components/FormCard";
import { t } from "../../utils/i18n";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const styles = `
  :root {
    --bg-100: #0f1720;
    --panel: #1a1f24;
    --muted: #72797c;
    --accent: #696969;
    --accent-strong: #6e6e6e;
    --input-bg: #101418;
    --border: rgba(230, 230, 230, 0.06);
    --text: #5a5c5f;
  }

  .profile-root {
  padding: 28px;
  background: linear-gradient(180deg, #0b0d0f, #0f1316);
  min-height: 100vh;
  color: var(--text);

  width: 100%;
  max-width: 1400px;   /* 🔥 wider desktop */
  margin: 0 auto;
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
    color: var(--accent-strong);
  }

  .sub {
    margin-top: 6px;
    color: var(--muted);
    font-size: 13px;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .btn {
    background: linear-gradient(180deg, #32373b, #1f2427);
    color: var(--accent-strong);
    border: 1px solid rgba(255, 255, 255, 0.04);
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  .btn.cancel {
    background: transparent;
    color: var(--muted);
  }

  /* ✅ PROFILE CARD STRUCTURE */

  .profile-card {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

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
    background: radial-gradient(circle, #2b2f33, #111315);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.6);
    border: 2px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }

  .avatar-wrap.editable {
    cursor: pointer;
    outline: 2px dashed rgba(255, 255, 255, 0.12);
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
    color: var(--accent-strong);
  }

  .email {
    font-size: 13px;
    color: var(--muted);
  }

  .status-note {
    margin-top: 4px;
    font-size: 13px;
    color: var(--muted);
    font-weight: 600;
  }

  .rating {
    margin-top: 6px;
    font-size: 14px;
    color: var(--accent-strong);
  }

  .rating-note {
    margin-left: 6px;
    font-size: 11px;
    color: var(--muted);
  }

  /* ✅ INPUT SECTION */

  .input-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .label-text {
    font-size: 12px;
    color: var(--muted);
  }

  .input {
    height: 44px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--input-bg);
    font-size: 14px;
    outline: none;
    color: var(--text);
  }

  .input.locked {
    background: #0c0f10;
    color: var(--muted);
  }

  /* ✅ DOB + GENDER ROW */

  .row {
    display: flex;
    gap: 12px;
  }

  .row .field {
    flex: 1;
  }

  /* ✅ AGE BOX */

  .age-box {
    margin-top: 4px;
    background: var(--input-bg);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: var(--muted);
    border: 1px solid var(--border);
  }

  /* ✅ LOGOUT */

  .logout-btn {
    margin-top: 10px;
    width: 100%;
    height: 44px;
    border-radius: 12px;
    border: none;
    background: #fee2e2;
    color: #991b1b;
    font-weight: 600;
    cursor: pointer;
  }

  .logout-btn:hover {
    background: #ef4444;
    color: white;
  }

  .input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


  /* ✅ RESPONSIVE */

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

export default function ClientProfileTop({ lang }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  const fileInputRef = useRef(null);
  const PLACEHOLDER = "/src/assets/default_profile.png";

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(PLACEHOLDER);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/users/profile");

      setFullName(data.name || "");
      setAddress(data.address || "");
      setGender(data.gender || "");
      setDob(data.dob ? data.dob.substring(0, 10) : "");

      setPhone(data.phone || "");
      setEmail(data.email || "");
      setVerificationStatus(data.verificationStatus || "unverified");

      if (data.profilePhoto) {
        setProfilePhotoPreview(`http://localhost:5000${data.profilePhoto}`);
      }
    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    if (!profilePhotoFile) return;
    const url = URL.createObjectURL(profilePhotoFile);
    setProfilePhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhotoFile]);

  const handleSave = async () => {
    try {
      if (!fullName.trim()) return alert("Name required");

      const formData = new FormData(); // ✅ FIRST

      formData.append("name", fullName);
      formData.append("address", address);
      formData.append("gender", gender);
      formData.append("dob", dob);

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      await api.patch("/users/profile", formData, {
        transformRequest: (data) => data, // ✅ CRITICAL FIX
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditing(false);
      alert("Profile Updated");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleCancel = () => {
    if (!originalData) return;

    setFullName(originalData.fullName);
    setAddress(originalData.address);
    setGender(originalData.gender);
    setDob(originalData.dob);
    setProfilePhotoPreview(originalData.profilePhotoPreview);

    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const onAvatarClick = () => {
    if (editing) fileInputRef.current?.click();
  };

  const onSelectProfilePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return alert(t(lang, "invalidImage"));
    setProfilePhotoFile(f);
  };

  const calculateAge = (dob) => {
    if (!dob) return "--";

    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();

    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
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
            className="btn"
            onClick={() => {
              if (editing) handleSave();
              else {
                setOriginalData({
                  fullName,
                  address,
                  gender,
                  dob,
                  profilePhotoPreview,
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
          {/* ✅ TOP SECTION */}
          <div className="top-section">
            <div
              className={`avatar-wrap ${editing ? "editable" : ""}`}
              onClick={onAvatarClick}
            >
              <img src={profilePhotoPreview} className="avatar" />
            </div>

            <div className="identity-block">
              <div className="display-name">{fullName}</div>
              <div className="email">{email}</div>

              <div className="status-note">
                {t(lang, "status")}: {verificationStatus}
              </div>

              <div className="rating">
                ⭐⭐⭐⭐⭐
                <span className="rating-note">
                  ({t(lang, "basedOnReliability")})
                </span>
              </div>
            </div>
          </div>

          {/* ✅ INPUT SECTION */}
          <div className="input-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectProfilePhoto}
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
              <span className="label-text">{t(lang, "email")}</span>
              <input value={email} readOnly className="input locked" />
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

            <label className="field">
              <span className="label-text">{t(lang, "phoneRegistered")}</span>
              <input value={phone} readOnly className="input locked" />
            </label>

            {/* ✅ DOB + GENDER ROW */}
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

            {/* ✅ AGE AUTO */}
            <div className="age-box">
              <span>{t(lang, "age")}:</span>
              <strong>{calculateAge(dob)}</strong>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </FormCard>
    </div>
  );
}
