import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowLeft,
  FaBox,
  FaChartLine,
  FaShieldAlt,
  FaBolt,
  FaSpinner,
  FaTimesCircle,
  FaCheck,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/SignUpForm.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      calculatePasswordStrength(value);
    }
    if (error) setError("");
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    const texts = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
    return texts[passwordStrength] || "";
  };

  const getPasswordStrengthLevel = () => {
    if (passwordStrength <= 1) return "weak";
    if (passwordStrength === 2) return "fair";
    if (passwordStrength === 3) return "good";
    if (passwordStrength === 4) return "strong";
    return "very-strong";
  };

  const requirements = [
    { met: formData.password.length >= 8, label: "At least 8 characters" },
    { met: /[A-Z]/.test(formData.password), label: "One uppercase letter" },
    { met: /[a-z]/.test(formData.password), label: "One lowercase letter" },
    { met: /[0-9]/.test(formData.password), label: "One number" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service");
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const features = [
    {
      icon: FaChartLine,
      title: "Real-time Analytics",
      description: "Track sales and inventory instantly",
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Reliable",
      description: "Enterprise-grade data protection",
    },
    {
      icon: FaBolt,
      title: "Lightning Fast",
      description: "Optimized for peak performance",
    },
  ];

  const benefits = [
    "Free 14-day trial",
    "No credit card required",
    "Cancel anytime",
  ];

  return (
    <div className="sg-page">
      {/* Background decoration */}
      <div className="sg-bg-decoration">
        <div className="sg-blob sg-blob--1" />
        <div className="sg-blob sg-blob--2" />
        <div className="sg-blob sg-blob--3" />
      </div>

      <div className="sg-container">
        {/* Back button */}
        <Link to="/" className="sg-back-btn">
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>

        {/* Left: Brand Showcase */}
        <div className="sg-brand">
          <div className="sg-brand-content">
            <div className="sg-brand-header">
              <div className="sg-brand-icon">
                <FaBox />
              </div>
              <div>
                <h1 className="sg-brand-name">SmartBiz</h1>
                <p className="sg-brand-tagline">Business Suite</p>
              </div>
            </div>

            <div className="sg-brand-hero">
              <h2 className="sg-brand-title">
                Start managing
                <br />
                <span className="sg-gradient-text">smarter today.</span>
              </h2>
              <p className="sg-brand-description">
                Join thousands of businesses that trust SmartBiz to power their
                operations.
              </p>
            </div>

            <div className="sg-benefits">
              {benefits.map((benefit, index) => (
                <div key={index} className="sg-benefit">
                  <div className="sg-benefit-check">
                    <FaCheck />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="sg-features">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="sg-feature"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="sg-feature-icon">
                      <Icon />
                    </div>
                    <div>
                      <div className="sg-feature-title">{feature.title}</div>
                      <div className="sg-feature-desc">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Sign Up Form */}
        <div className="sg-form-wrap">
          <div className="sg-form-content">
            <div className="sg-form-header">
              <h2 className="sg-form-title">Create your account</h2>
              <p className="sg-form-subtitle">
                Get started with your free 14-day trial
              </p>
            </div>

            {error && (
              <div className="sg-error" role="alert">
                <div className="sg-error-icon">!</div>
                <span>{error}</span>
              </div>
            )}

            <form className="sg-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="sg-field">
                <label htmlFor="name">Full name</label>
                <div className="sg-input-wrap">
                  <FaUser className="sg-input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="sg-input"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sg-field">
                <label htmlFor="email">Email address</label>
                <div className="sg-input-wrap">
                  <FaEnvelope className="sg-input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="sg-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="sg-field">
                <label htmlFor="password">Password</label>
                <div className="sg-input-wrap">
                  <FaLock className="sg-input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="sg-input sg-input--password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="sg-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="sg-strength">
                    <div className="sg-strength-bars">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`sg-strength-bar ${
                            bar <= passwordStrength
                              ? `sg-strength-bar--${getPasswordStrengthLevel()}`
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`sg-strength-label sg-strength-label--${getPasswordStrengthLevel()}`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <div className="sg-requirements">
                    {requirements.map((req, i) => (
                      <div
                        key={i}
                        className={`sg-requirement ${
                          req.met ? "sg-requirement--met" : ""
                        }`}
                      >
                        {req.met ? (
                          <FaCheckCircle />
                        ) : (
                          <span className="sg-req-dot" />
                        )}
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="sg-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="sg-input-wrap">
                  <FaLock className="sg-input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="sg-input sg-input--password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="sg-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {formData.confirmPassword && formData.password && (
                  <div
                    className={`sg-match ${
                      formData.password === formData.confirmPassword
                        ? "sg-match--yes"
                        : "sg-match--no"
                    }`}
                  >
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <FaCheckCircle />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <label className="sg-checkbox">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className="sg-checkbox-box">
                  <FaCheck />
                </span>
                <span className="sg-checkbox-label">
                  I agree to the{" "}
                  <Link to="/terms" className="sg-inline-link">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="sg-inline-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="sg-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="sg-spinner" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create account</span>
                )}
              </button>

              {/* Divider */}
              <div className="sg-divider">
                <span>or</span>
              </div>

              {/* Login link */}
              <div className="sg-login">
                <span>Already have an account?</span>
                <Link to="/login" className="sg-login-link">
                  Sign in
                </Link>
              </div>
            </form>

            <div className="sg-form-footer">
              <p>© {new Date().getFullYear()} SmartBiz. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;