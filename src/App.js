import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verification from "./pages/Verification"
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/ForgetPass"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
