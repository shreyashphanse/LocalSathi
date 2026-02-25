import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import { t } from "../utils/i18n";
import animeBg from "../assets/animebg6.jpg";

export default function StartScreen({ lang }) {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="page-root"
      style={{
        backgroundImage: `url(${animeBg})`,
      }}
    >
      <FormCard
        title={t(lang, "LocalSathi")}
        subtitle={t(lang, "Welcome User!!")}
      >
        <div className={`panel ${showOptions ? "expanded" : ""}`}>
          {/* PRIMARY BUTTONS */}

          <button
            className="btn register"
            onClick={() => setShowOptions(!showOptions)}
          >
            <span>{t(lang, "register")}</span>
          </button>

          {/* EXPANDABLE AREA */}

          <div className={`expand-area ${showOptions ? "show" : ""}`}>
            <button className="btn client" onClick={() => navigate("/client")}>
              <span>{t(lang, "customer")}</span>
            </button>

            <button className="btn labour" onClick={() => navigate("/labour")}>
              <span>{t(lang, "serviceProvider")}</span>
            </button>
          </div>

          <button className="btn login" onClick={() => navigate("/login")}>
            <span>{t(lang, "login")}</span>
          </button>
        </div>
      </FormCard>

      <style jsx>{`
        .page-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* PANEL */

        .panel {
          display: flex;
          flex-direction: column;
          gap: 18px; /* slightly more breathing space */
          align-items: center; /* critical for square layout */
        }

        /* ✅ TRUE SQUARE BUTTON */

        .btn {
          width: 200px;
          height: 140px; /* 🔥 Perfect square */
          border-radius: 22px;
          border: none;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: 0.25s ease;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
          color: white;

          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        /* ✅ IMAGE LAYER */

        .btn::before {
          content: "frontend/labour-reg/src/assets/Regi.png";
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.5; /* ✅ YOUR 50% OPACITY */
          z-index: 1;
        }

        /* ✅ GRADIENT LAYER */

        .btn::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
        }

        /* ✅ TEXT ALWAYS ON TOP */

        .btn span {
          position: relative;
          z-index: 3;
          font-size: 24px;
          text-transform: uppercase;
          font-size: 22px; /* 🔥 Big */
          font-weight: 800; /* 🔥 Bold */
          letter-spacing: 0.5px;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        }

        /* REGISTER */

        .register::before {
          background-image: url("/images/register.jpg");
        }

        .register::after {
          background: linear-gradient(135deg, #68027c, #ff04f2);
        }

        /* LOGIN */

        .login::before {
          background-image: url("/images/login.jpg");
        }

        .login::after {
          background: linear-gradient(135deg, #0e5700, #1eff00);
        }

        /* CLIENT */

        .client::before {
          background-image: url("/images/client.jpg");
        }

        .client::after {
          background: linear-gradient(135deg, #05eeff, #48008b);
        }

        /* LABOUR */

        .labour::before {
          background-image: url("/images/labour.jpg");
        }

        .labour::after {
          background: linear-gradient(135deg, #ff7402, #a50303);
        }

        /* HOVER = PREMIUM FEEL */

        .btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 18px 35px rgba(0, 0, 0, 0.25);
        }

        /* EXPANDABLE AREA */

        .expand-area {
          display: flex;
          gap: 16px;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.4s ease;
        }

        .expand-area.show {
          max-height: 200px;
          opacity: 1;
          transform: translateY(0);
        }
        .form-card h2 {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: 0.8px;

          background: linear-gradient(135deg, #360081, #002e31);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          text-align: center;
        }

        .form-card p {
          font-size: 18px;
          color: rgba(23, 19, 80, 0.89);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
