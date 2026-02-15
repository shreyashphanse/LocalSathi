import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import StartScreen from "./screens/start";
import LabourRegi from "./screens/labour/labour_regi";
import ClientRegi from "./screens/client/client_regi";
import Login from "./screens/login";
import LabourProfileTop from "./screens/labour/labour_profile";
import ClientProfileTop from "./screens/client/client_profile";

import JobsFeed from "./screens/labour/jobs_feed";
import PostJob from "./screens/client/post_job";
import MyPostedJobs from "./screens/client/my_posted_jobs";
import MyAcceptedJobs from "./screens/labour/my_accepted_jobs";
import MyCompletedJobs from "./screens/labour/my_completed_jobs";

import AdminLogin from "./screens/admin/admin_login";
import AdminPanel from "./screens/admin/admin_panel";
import RequireAdmin from "./components/RequireAdmin";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);

  // ✅ POSITION STATE (NEW)
  const [position, setPosition] = useState({ x: 12, y: 12 });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!langOpen) return;

    const timer = setTimeout(() => {
      setLangOpen(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [langOpen]);

  // ---------------- DRAG LOGIC ----------------

  const startDrag = (e) => {
    dragging.current = true;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offset.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const onDrag = (e) => {
    if (!dragging.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setPosition({
      x: clientX - offset.current.x,
      y: clientY - offset.current.y,
    });
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);

    window.addEventListener("touchmove", onDrag);
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);

      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [position]);

  return (
    <>
      {/* 🌐 LANGUAGE SWITCHER (DRAGGABLE) */}

      <div
        style={{
          ...switcherStyles.wrapper,
          left: position.x,
          top: position.y,
          right: "auto",
        }}
      >
        {!langOpen ? (
          <button
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            onClick={() => setLangOpen(true)}
            style={switcherStyles.circleBtn}
          >
            🌐
          </button>
        ) : (
          <div style={switcherStyles.dropdown}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={switcherStyles.select}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<StartScreen lang={lang} />} />
        <Route path="/labour" element={<LabourRegi lang={lang} />} />
        <Route path="/client" element={<ClientRegi lang={lang} />} />
        <Route path="/login" element={<Login lang={lang} />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["labour"]}>
              <JobsFeed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/postjob"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myposted"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <MyPostedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myaccepted"
          element={
            <ProtectedRoute allowedRoles={["labour"]}>
              <MyAcceptedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mycompleted"
          element={
            <ProtectedRoute allowedRoles={["labour", "client"]}>
              <MyCompletedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/labourprofile"
          element={<LabourProfileTop lang={lang} />}
        />

        <Route
          path="/clientprofile"
          element={<ClientProfileTop lang={lang} />}
        />

        <Route path="/admin" element={<AdminLogin lang={lang} />} />

        <Route
          path="/admin/panel"
          element={
            <RequireAdmin>
              <AdminPanel lang={lang} />
            </RequireAdmin>
          }
        />

        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

        <Route
          path="*"
          element={<div style={{ padding: 24 }}>Page not found</div>}
        />
      </Routes>
    </>
  );
}

/* ✅ STYLES (UNCHANGED) */

const switcherStyles = {
  wrapper: {
    position: "fixed",
    zIndex: 999,
  },

  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    cursor: "grab", // ✅ NICE TOUCH
    fontSize: 18,
    background: "linear-gradient(180deg, #32373b, #1f2427)",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },

  dropdown: {
    background: "white",
    padding: "6px 10px",
    borderRadius: 22,
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  },

  select: {
    border: "none",
    outline: "none",
    fontSize: 14,
    cursor: "pointer",
    background: "transparent",
  },
};
