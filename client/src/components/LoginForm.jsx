/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginForm.css";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate("/dashboard");
            } else {
                setError(result.error || "Login failed");
            }
        } catch {
            setError("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Brand Section */}
                <div className="login-brand">
                    <div className="brand-icon">📦</div>
                    <h1 className="brand-name">SmartBiz</h1>
                    <p className="brand-tagline">Inventory & Sales Management</p>
                </div>

                {/* Form Section */}
                <div className="login-form-wrapper">
                    <div className="form-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">
                                <FaEnvelope className="input-icon" />
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <FaLock className="input-icon" />
                                Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="form-input password-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Logging in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="signup-section">
                            <p>
                                Don't have an account?{" "}
                                <Link to="/register" className="signup-link">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>

                    <div className="login-footer">
                        <p>&copy; 2026 SmartBiz. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;