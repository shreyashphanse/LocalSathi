import React from "react";

export default function FormCard({ title, subtitle, children, logintitle }) {
  return (
    <main className="card">
      <div className="form-card">
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
        {logintitle && <h1 className="logintitle">{logintitle}</h1>}
        {children}
      </div>

      <style jsx>{`
        .card {
          width: 95%;
          max-width: 480px;

          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.25),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(3px); /* 🔥 MAGIC */
          -webkit-backdrop-filter: blur(18px);

          border-radius: 22px;
          padding: 28px;

          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);

          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-card h2 {
          margin: 0;
        }

        .logintitle {
          margin: 6px 0 12px;
          font-size: 22px;
          font-weight: 700;
          color: var(--primary);
          text-align: center;
        }
      `}</style>
    </main>
  );
}
