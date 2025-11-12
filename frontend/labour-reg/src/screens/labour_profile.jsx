// src/screens/labour_profile.jsx
import React, { useState } from "react";
import FormCard from "../components/FormCard";

/**
 * LabourProfileTop — top half of labour profile.
 * - fullName and email are controlled and update display immediately
 * - phone is NOT editable (locked to registration value)
 * - removed ribbon, nickname, timezone, language
 * - country replaced by work location range (startLocation, endLocation)
 *
 * IDs available for backend wiring:
 *  - profilePic, displayName, emailDisplay
 *  - fullName, phone, gender, startLocation, endLocation
 */

export default function LabourProfileTop() {
  const [editing, setEditing] = useState(false);

  // Controlled fields
  const [fullName, setFullName] = useState("John Doe");
  const [phone] = useState("+91-9876543210"); // locked phone (example). Replace with actual registered value.
  const [email, setEmail] = useState("johndoe@example.com"); // editable and shown
  const [gender, setGender] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

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
            onClick={() => setEditing((s) => !s)}
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
                {/* display-name shows the controlled fullName state */}
                <div className="display-name" id="displayName">
                  {fullName}
                </div>

                {/* email display (keeps in sync with email state) */}
                <div className="email" id="emailDisplay">
                  {email ? email : "(email optional)"}
                </div>
              </div>
            </div>

            <div className="right">
              <div className="grid">
                {/* Full name - editable when editing is true (or you can keep always editable if desired) */}
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

                {/* Email - editable and synced to display */}
                <label className="field">
                  <span className="label-text">Email</span>
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

                {/* Phone - always readOnly (provided at registration) */}
                <label className="field">
                  <span className="label-text">Phone (registered)</span>
                  <input
                    id="phone"
                    className="input locked"
                    type="tel"
                    placeholder="Phone number"
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

                {/* Work location range: start & end locations */}
                <div className="work-location-wrap">
                  <span className="label-text">Work location range</span>
                  <div className="location-row">
                    <input
                      id="startLocation"
                      className="input location-input"
                      type="text"
                      placeholder="Start location"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      readOnly={!editing}
                    />
                    <input
                      id="endLocation"
                      className="input location-input"
                      type="text"
                      placeholder="End location"
                      value={endLocation}
                      onChange={(e) => setEndLocation(e.target.value)}
                      readOnly={!editing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormCard>

      <style jsx>{`
        /* Emerald theme variables (subtle professional shades) */
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
          gap: 12px;
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
        .actions .btn {
          background: linear-gradient(
            180deg,
            var(--emerald-300),
            var(--emerald-500)
          );
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        /* inside FormCard */
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
          background: #fff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
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
          color: var(--emerald-700);
        }

        .email {
          margin-top: 6px;
          color: #4b5f4e;
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
          color: var(--text);
        }

        .input:focus {
          box-shadow: 0 0 0 6px rgba(47, 133, 90, 0.06);
          border-color: var(--emerald-500);
        }

        /* locked phone styling (visually distinct) */
        .input.locked {
          background: #f7f9f6;
          color: #334e3c;
        }

        /* work location */
        .work-location-wrap {
          grid-column: 1 / span 2;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .location-row {
          display: flex;
          gap: 10px;
        }

        .location-input {
          flex: 1;
        }

        /* responsive */
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
          .work-location-wrap {
            grid-column: auto;
          }
        }
      `}</style>
    </div>
  );
}
