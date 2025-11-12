import React, { useRef, useState } from "react";
import FormCard from "../components/FormCard";
import { ensureMobileFocus } from "../utils/mobileFocus";

export default function Login() {
  const formRef = useRef(null);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = () => {
    const phone = document.getElementById("phone").value.trim();
    if (!phone) {
      alert("Please enter phone number to receive OTP");
      document.getElementById("phone").focus();
      return;
    }
    // TODO: call backend to send OTP. For now simulate:
    console.log("Send OTP to:", phone);
    setOtpSent(true);
    alert("OTP sent to " + phone + " (simulation).");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone").value.trim();
    const otp = document.getElementById("otp").value.trim();

    if (!phone) {
      alert("Phone number is required");
      document.getElementById("phone").focus();
      return;
    }

    if (!otp) {
      alert("Please enter the OTP");
      document.getElementById("otp").focus();
      return;
    }

    // simple OTP format check (6 digits)
    const otpPattern = /^\d{4,6}$/;
    if (!otpPattern.test(otp)) {
      alert("Enter a valid OTP (4-6 digits)");
      document.getElementById("otp").focus();
      return;
    }

    // TODO: verify OTP with backend. For now, simulate success:
    console.log({ phone, otp });
    alert("Logged in (simulation). Replace with backend verification.");
  };

  return (
    <div className="page-root">
      <FormCard logintitle="Login">
        <form ref={formRef} className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label-text">Phone no.</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="Enter phone number"
              onFocus={ensureMobileFocus}
              required
              className="input"
            />
          </label>

          <div className="otp-row">
            <label className="field otp-field">
              <span className="label-text">OTP</span>
              <input
                id="otp"
                name="otp"
                type="tel"
                inputMode="numeric"
                placeholder="Enter OTP"
                onFocus={ensureMobileFocus}
                className="input"
              />
            </label>

            <button
              type="button"
              className="btn send-otp"
              onClick={sendOtp}
              aria-pressed={otpSent}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>
          </div>

          <button id="loginBtn" className="submit-btn" type="submit">
            Login
          </button>
        </form>

        <style jsx>{`
          /* subtle professional green palette */
          :root {
            --g-bg: #f3f9f1; /* very light green */
            --g-panel: #ffffff;
            --g-muted: #647056;
            --g-input-bg: #f7fbf6;
            --g-border: rgba(79, 138, 82, 0.12);
            --g-accent: #4f8a52; /* mid green */
            --g-accent-strong: #2f6f3f; /* darker green for buttons */
            --maxw: 420px;
          }

          .page-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: var(--g-bg);
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .field {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .label-text {
            font-size: 13px;
            color: var(--g-muted);
          }

          .input {
            height: 44px;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid var(--g-border);
            background: var(--g-input-bg);
            font-size: 15px;
            outline: none;
          }

          .input:focus {
            box-shadow: 0 0 0 4px rgba(79, 138, 82, 0.08);
            border-color: var(--g-accent);
          }

          .otp-row {
            display: flex;
            gap: 10px;
            align-items: end;
          }

          .otp-field {
            flex: 1;
          }

          .btn {
            height: 44px;
            min-width: 110px;
            border-radius: 10px;
            border: none;
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
          }

          .send-otp {
            background: linear-gradient(180deg, #6aa969, #4f8a52);
            color: #fff;
            padding: 0 12px;
          }

          .send-otp:active {
            transform: scale(0.98);
          }

          .submit-btn {
            margin-top: 6px;
            height: 46px;
            border-radius: 10px;
            border: none;
            background: var(--g-accent-strong);
            color: white;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
          }

          .submit-btn:active {
            transform: translateY(1px);
          }

          @media (max-width: 480px) {
            .page-root {
              padding-bottom: env(safe-area-inset-bottom, 24px);
            }
            .otp-row {
              flex-direction: column;
              align-items: stretch;
            }
            .btn.send-otp {
              min-width: auto;
              width: 100%;
            }
          }
        `}</style>
      </FormCard>
    </div>
  );
}
