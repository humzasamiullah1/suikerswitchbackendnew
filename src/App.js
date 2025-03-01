// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebaseConfig";
import { 
    onAuthStateChanged, 
    signOut, 
    setPersistence, 
    browserSessionPersistence 
} from "firebase/auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verification from "./pages/Verification";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/ForgetPass";

import { StateProvider } from "./context/StateProvider";
import reducer from "./context/reducer";
import { initialState } from "./context/initialState";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Manual Logout Handler
    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            setUser(null);
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout Error:", error);
        }
    };

    useEffect(() => {
        // ✅ Firebase Session Persistence (Session Storage)
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser ?? null);
                    setLoading(false);
                });
            })
            .catch((error) => {
                console.error("Session persistence error:", error);
                setLoading(false);
            });

    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // 🔒 Protect Private Routes
    const PrivateRoute = ({ children }) => (user ? children : <Navigate to="/" />);

    // 🔓 Protect Public Routes
    const PublicRoute = ({ children }) => (!user ? children : <Navigate to="/dashboard" />);

    // 🚧 Handle Invalid Routes
    const NotFoundRoute = () => <Navigate to={user ? "/dashboard" : "/"} />;

    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <Router>
                <Routes>
                    {/* 🏠 Public Routes */}
                    <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                    <Route path="/verification" element={<PublicRoute><Verification /></PublicRoute>} />
                    <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
                    
                    {/* 🔒 Private Routes */}
                    <Route path="/dashboard/*" element={<PrivateRoute><Dashboard onLogout={handleLogout} /></PrivateRoute>} />
                    
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
            </Router>
        </StateProvider>
    );
}

export default App;
