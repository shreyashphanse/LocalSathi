import { Routes, Route } from "react-router-dom";
import StartScreen from "./screens/start";
import LabourRegi from "./screens/labour_regi";
import ClientRegi from "./screens/client_regi";
import Login from "./screens/login";
import LabourProfileTop from "./screens/labour_profile";
import ClientProfileTop from "./screens/client_profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/labour" element={<LabourRegi />} />
      <Route path="/client" element={<ClientRegi />} />
      <Route path="/login" element={<Login />} />
      <Route path="/labourprofile" element={<LabourProfileTop />} />
      <Route path="/clientprofile" element={<ClientProfileTop />} />
    </Routes>
  );
}
