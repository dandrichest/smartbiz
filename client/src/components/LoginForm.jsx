import { useState } from "react";
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaBox,
  FaChartLine,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
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

  const features = [
    {
      icon: FaChartLine,
      title: "Real-time Analytics",
      description: "Track sales and inventory in real-time",
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your data",
    },
    {
      icon: FaBolt,
      title: "Lightning Fast",
      description: "Optimized for speed and performance",
    },
  ];

  return (
    <div className="lg-page">
      {/* Background decoration */}
      <div className="lg-bg-decoration">
        <div className="lg-blob lg-blob--1" />
        <div className="lg-blob lg-blob--2" />
        <div className="lg-blob lg-blob--3" />
      </div>

      <div className="lg-container">
        {/* Back button */}
        <Link to="/" className="lg-back-btn">
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>

        {/* Left: Brand Showcase */}
        <div className="lg-brand">
          <div className="lg-brand-content">
            <div className="lg-brand-header">
              <div className="lg-brand-icon">
                <FaBox />
              </div>
              <div>
                <h1 className="lg-brand-name">SmartBiz</h1>
                <p className="lg-brand-tagline">Business Suite</p>
              </div>
            </div>

            <div className="lg-brand-hero">
              <h2 className="lg-brand-title">
                Manage your business
                <br />
                <span className="lg-gradient-text">smarter, not harder.</span>
              </h2>
              <p className="lg-brand-description">
                All-in-one platform for inventory, sales, and customer
                management. Built for modern businesses.
              </p>
            </div>

            <div className="lg-features">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="lg-feature"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="lg-feature-icon">
                      <Icon />
                    </div>
                    <div>
                      <div className="lg-feature-title">{feature.title}</div>
                      <div className="lg-feature-desc">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="lg-form-wrap">
          <div className="lg-form-content">
            <div className="lg-form-header">
              <h2 className="lg-form-title">Welcome back</h2>
              <p className="lg-form-subtitle">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="lg-error" role="alert">
                <div className="lg-error-icon">!</div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="lg-form">
              {/* Email */}
              <div className="lg-field">
                <label htmlFor="email">Email address</label>
                <div className="lg-input-wrap">
                  <FaEnvelope className="lg-input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="lg-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lg-field">
                <div className="lg-field-header">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="lg-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="lg-input-wrap">
                  <FaLock className="lg-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="lg-input lg-input--password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lg-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="lg-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="lg-checkbox-box">
                  <FaCheckCircle />
                </span>
                <span className="lg-checkbox-label">
                  Remember me for 30 days
                </span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                className="lg-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="lg-spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>

              {/* Divider */}
              <div className="lg-divider">
                <span>or</span>
              </div>

              {/* Sign up link */}
              <div className="lg-signup">
                <span>Don't have an account?</span>
                <Link to="/register" className="lg-signup-link">
                  Create account
                </Link>
              </div>
            </form>

            <div className="lg-form-footer">
              <p>© {new Date().getFullYear()} SmartBiz. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;