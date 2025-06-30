import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
  getAuth,
  setPersistence,
  browserLocalPersistence, // ✅ Local Persistence
} from "firebase/auth";
// import { useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verification from "./pages/Verification";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/ForgetPass";
import StripeForm from "./components/Stripe/StripeForm";
import { useStateValue } from "./context/StateProvider";
import { actionType } from "./context/reducer";
import { getuserinformation } from "./components/utils/firebasefunctions"; // Ensure this function fetches user details
import PaymentComplete from "./pages/PaymentComplete";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [{ userDetails }, dispatch] = useStateValue();
  const [isNewUser, setIsNewUser] = useState(false);
  const stripePromise = loadStripe(
    "pk_test_51NfVkoAdN8nseiVbFQG16E8QRBvJxD2ZMHPcdpYEmVOAeOkiYYk8yeVIqXk8M3jjlXCiB34jiPSI9ZTKLi76n5VW00sSVl4Phs"
  );
  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      setUser(null);
      dispatch({ type: actionType.SET_USER, payload: null });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const userInfo = await getuserinformation("users", uid);
          dispatch({ type: actionType.SET_USER, payload: userInfo });
          setUser(userInfo);
          console.log("userInfo", userInfo);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        dispatch({ type: actionType.SET_USER, payload: null });
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔒 Protect Private Routes
  // const PublicRoute = ({ children }) => {

  //   return user && !isNewUser ? <Navigate to="/dashboard" replace /> : children;
  // };
  const PublicRoute = ({ children }) => {
    const loc = useLocation();
    if (
      user &&
      !isNewUser &&
      loc.pathname !== "/PaymentComplete" &&
      loc.pathname !== "/subscription-requests"
    )
      return <Navigate to="/dashboard" replace />;
    return children;
  };

  // const PrivateRoute = ({ children }) => {
  //   return user ? children : <Navigate to="/" replace />;
  // };

  const PrivateRoute = ({ children }) => {
    const loc = useLocation();
    if (
      user &&
      !isNewUser &&
      loc.pathname !== "/PaymentComplete" &&
      loc.pathname !== "/subscription-requests"
    )
      return user ? children : <Navigate to="/" replace />;
    return children;
  };

  // 🚧 Handle Invalid Routes
  const NotFoundRoute = () => <Navigate to={user ? "/dashboard" : "/"} />;

  return (
    <main className="w-full">
      <Routes>
        {/* 🏠 Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/verification"
          element={
            <PublicRoute>
              <Verification />
            </PublicRoute>
          }
        />
        <Route
          path="/forget-password"
          element={
            <PublicRoute>
              <ForgetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/subscription-requests"
          element={
            <PublicRoute>
              <StripeForm />
            </PublicRoute>
          }
        />
        <Route
          path="/PaymentComplete"
          element={
            <PublicRoute>
              <Elements stripe={stripePromise}>
                <PaymentComplete />
              </Elements>
            </PublicRoute>
          }
        />

        {/* 🔒 Private Routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* 🚧 Catch-All for Invalid Routes */}
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );
}

export default App;
