import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Signup Page</h2>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;
