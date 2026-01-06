import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const adminAuth = localStorage.getItem("adminAuth");
        if (adminAuth) {
            try {
                JSON.parse(adminAuth);
                setIsAuthenticated(true);
            } catch (err) {
                localStorage.removeItem("adminAuth");
                setIsAuthenticated(false);
            }
        }
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LandingPage
                                showLoginModal={showLoginModal}
                                setShowLoginModal={setShowLoginModal}
                                onLoginSuccess={handleLoginSuccess}
                            />
                        )
                    }
                />
                <Route
                    path="/dashboard/*"
                    element={
                        isAuthenticated ? (
                            <AdminDashboard onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

export default App
