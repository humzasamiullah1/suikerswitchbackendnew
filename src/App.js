import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useEffect, useState } from "react";
  import { auth } from "./firebase/firebaseConfig";
  import {
    onAuthStateChanged,
    signOut,
    setPersistence,
    browserLocalPersistence, // ✅ Local Persistence
  } from "firebase/auth";
  
  import Login from "./pages/Login";
  import Signup from "./pages/Signup";
  import Verification from "./pages/Verification";
  import Dashboard from "./pages/Dashboard";
  import ForgetPassword from "./pages/ForgetPass";
  
  import { useStateValue } from "./context/StateProvider";
  import { actionType } from "./context/reducer";
  import { getuserinformation } from "./components/utils/firebasefunctions"; // Ensure this function fetches user details
  
  function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [{ userDetails }, dispatch] = useStateValue();
  
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
      // ✅ Maintain Persistent Login with Local Storage
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          // ✅ Check if user is logged in
          const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
              try {
                // ✅ Fetch user details from Firestore
                const userInfo = await getuserinformation("users", currentUser.uid);
  
                // ✅ If user is an Admin, update state
                if (userInfo?.usertype === "Admin") {
                  dispatch({
                    type: actionType.SET_USER,
                    payload: userInfo,
                  });
                }
                console.log(userInfo)
  
                setUser(currentUser); // Set authenticated user
              } catch (error) {
                console.error("Error fetching user info:", error);
              }
            } else {
              setUser(null); // No user found
            }
            setLoading(false);
          });
  
          return () => unsubscribe(); // Cleanup function
        })
        .catch((error) => {
          console.error("Session persistence error:", error);
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
    const PrivateRoute = ({ children }) =>
      user ? children : <Navigate to="/" />;
  
    // 🔓 Protect Public Routes
    const PublicRoute = ({ children }) =>
      !user ? children : <Navigate to="/dashboard" />;
  
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
  