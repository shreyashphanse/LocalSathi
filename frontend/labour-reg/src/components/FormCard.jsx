import React from "react";

export default function FormCard({ title, children, logintitle }) {
  return (
    <main className="card">
      <h1 className="title">{title}</h1>
      <h1 className="logintitle">{logintitle}</h1>
      {children}
      <style>{`
        .card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 12px;
          padding: 28px;
          box-shadow: 0 8px 28px rgba(18, 25, 40, 0.08);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
        }
        .title {
          margin: 6px 0 12px;
          font-size: 22px;
          font-weight: 700;
          color: #0c2c83ff;
          text-align: center;
        }
        .logintitle {
          margin: 6px 0 12px;
          font-size: 22px;
          font-weight: 700;
          color: #064d00ff;
          text-align: center;
        }
      `}</style>
    </main>
  );
}
