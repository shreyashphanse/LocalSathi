// src/screens/client_profile.jsx
import React, { useState } from "react";
import FormCard from "../components/FormCard";

/**
 * ClientProfileTop — top half of client profile.
 * - same layout as labour_profile but with charcoal-grey palette
 * - email is required (validated when saving)
 * - removed work location range
 * - added jobDescription (textarea) and address fields
 *
 * IDs available for backend wiring:
 *  - profilePic, displayName, emailDisplay
 *  - fullName, phone, gender, jobDescription, address
 */

export default function ClientProfileTop() {
  const [editing, setEditing] = useState(false);

  // Controlled fields
  const [fullName, setFullName] = useState("Jane Client");
  const [phone] = useState("+91-9876543210"); // locked registered phone
  const [email, setEmail] = useState("janec@example.com"); // required
  const [gender, setGender] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [address, setAddress] = useState("");

  const validateEmail = (value) => {
    if (!value) return false;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  };

  const toggleEdit = () => {
    if (editing) {
      // Attempting to save -> validate required fields
      const trimmedEmail = (email || "").trim();
      if (!trimmedEmail) {
        alert("Email is required.");
        return;
      }
      if (!validateEmail(trimmedEmail)) {
        alert("Please enter a valid email address.");
        return;
      }
      // valid -> exit edit mode (here you would call save API)
      setEditing(false);
      alert("Profile saved (simulation).");
      return;
    }
    setEditing(true);
  };

  return (
    <div className="profile-root">
      <div className="page-header">
        <div>
          <h2 className="welcome">Profile</h2>
          <div className="sub">Manage your account details</div>
        </div>
        <div className="actions">
          <button
            className="btn edit"
            onClick={toggleEdit}
            aria-pressed={editing}
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <FormCard>
        <div className="profile-top">
          <div className="profile-row">
            <div className="left">
              <div className="avatar-wrap">
                <img
                  id="profilePic"
                  src="/src/assets/avatar-placeholder.png"
                  alt="avatar"
                  className="avatar"
                />
              </div>

              <div className="identity">
                <div className="display-name" id="displayName">
                  {fullName}
                </div>

                <div className="email" id="emailDisplay">
                  {email ? email : "(email required)"}
                </div>
              </div>
            </div>

            <div className="right">
              <div className="grid">
                {/* Full name */}
                <label className="field">
                  <span className="label-text">Full name</span>
                  <input
                    id="fullName"
                    className="input"
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    readOnly={!editing}
                  />
                </label>

                {/* Email (required) */}
                <label className="field">
                  <span className="label-text">Email (required)</span>
                  <input
                    id="emailInput"
                    className="input"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={!editing}
                  />
                </label>

                {/* Phone (locked) */}
                <label className="field">
                  <span className="label-text">Phone (registered)</span>
                  <input
                    id="phone"
                    className="input locked"
                    type="tel"
                    value={phone}
                    readOnly
                    aria-readonly="true"
                  />
                </label>

                {/* Gender */}
                <label className="field">
                  <span className="label-text">Gender</span>
                  <select
                    id="gender"
                    className="input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={!editing}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                {/* Job description (textarea) - spans both columns */}
                <div className="field full-span">
                  <span className="label-text">Job description</span>
                  <textarea
                    id="jobDescription"
                    className="textarea"
                    placeholder="Describe the job or service you need (skills, summary)"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    readOnly={!editing}
                  />
                </div>

                {/* Address (spans both columns) */}
                <div className="field full-span">
                  <span className="label-text">Address</span>
                  <input
                    id="address"
                    className="input"
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    readOnly={!editing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormCard>

      <style jsx>{`
        /* Charcoal / graphite theme variables */
        :root {
          --bg-100: #0f1720; /* page background dark */
          --panel: #1a1f24; /* card background */
          --muted: #9aa3a8;
          --accent: #bdbdbd;
          --accent-strong: #e6e6e6;
          --input-bg: #101418;
          --border: rgba(230, 230, 230, 0.06);
          --text: #e9eef0;
        }

        .profile-root {
          padding: 28px;
          background: linear-gradient(180deg, #0b0d0f, #0f1316);
          min-height: 100vh;
          color: var(--text);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 12px;
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
        .actions .btn {
          background: linear-gradient(180deg, #32373b, #1f2427);
          color: var(--accent-strong);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        /* inside FormCard: override FormCard's white background visually by relying on FormCard's internal styles,
           but style the inner elements to match charcoal theme */
        .profile-top {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .profile-row {
          display: flex;
          gap: 20px;
          align-items: flex-start;
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
          background: #111315;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .identity {
          display: flex;
          flex-direction: column;
        }

        .display-name {
          font-weight: 700;
          font-size: 18px;
          color: var(--accent-strong);
        }

        .email {
          margin-top: 6px;
          color: var(--muted);
          font-size: 13px;
        }

        .right {
          flex: 1;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 22px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .full-span {
          grid-column: 1 / span 2;
        }

        .label-text {
          font-size: 12px;
          color: var(--muted);
        }

        .input,
        .textarea {
          height: 44px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--input-bg);
          font-size: 14px;
          outline: none;
          color: var(--text);
        }

        .textarea {
          height: 110px;
          resize: vertical;
          padding: 10px;
        }

        .input:focus,
        .textarea:focus {
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .input.locked {
          background: #0c0f10;
          color: #9aa3a8;
        }

        /* responsive adjustments */
        @media (max-width: 900px) {
          .profile-row {
            flex-direction: column;
          }
          .left {
            width: 100%;
            justify-content: flex-start;
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
