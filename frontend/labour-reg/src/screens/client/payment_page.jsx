import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function PaymentPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!proof) {
        alert("Payment proof is required");
        return;
      }

      setLoading(true);

      await api.patch(`/payments/${paymentId}/proof`, {
        proofImage: proof,
      });

      alert("Proof submitted successfully");

      navigate("/home"); // adjust if your route differs
    } catch (err) {
      console.error(err);
      // alert(err.response?.data?.message || "Upload failed");
      // temporary console print
      // console.log(err.response);
      // alert(err.response?.data?.message);
      console.log("BACKEND ERROR:", err.response?.data);
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-root">
      <div className="payment-card">
        <h2>Submit Payment Proof</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onloadend = () => {
              setProof(reader.result);
            };

            reader.readAsDataURL(file);
          }}
        />

        {proof && <img src={proof} alt="Proof Preview" className="preview" />}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Uploading..." : "Submit Proof"}
        </button>
      </div>

      <style jsx>{`
        .payment-root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f9fafb;
        }

        .payment-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          width: 380px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        h2 {
          margin: 0;
          color: #065f46;
        }

        input {
          padding: 8px;
        }

        .preview {
          width: 100%;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        button {
          height: 42px;
          border: none;
          border-radius: 12px;
          background: #10b981;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        button:hover {
          background: #059669;
        }

        button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
