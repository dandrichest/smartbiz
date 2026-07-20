import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/SignUpForm.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
        // Clear error when user types
        if (error) setError('');
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
        const texts = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        return texts[passwordStrength] || '';
    };

    const getPasswordStrengthColor = () => {
        const colors = ['', '#EF4444', '#F59E0B', '#FBBF24', '#10B981', '#059669'];
        return colors[passwordStrength] || '';
    };

    const getPasswordStrengthWidth = () => {
        return (passwordStrength / 5) * 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
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
            navigate('/login');
        } else {
            setError(result.error || 'Registration failed');
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                {/* Brand Section */}
                <div className="signup-brand">
                    <div className="brand-icon">📦</div>
                    <h1 className="brand-name">SmartBiz</h1>
                    <p className="brand-tagline">Inventory & Sales Management</p>
                    <div className="brand-features">
                        <div className="brand-feature">
                            <span className="feature-icon">✅</span>
                            <span>Easy inventory tracking</span>
                        </div>
                        <div className="brand-feature">
                            <span className="feature-icon">📊</span>
                            <span>Real-time analytics</span>
                        </div>
                        <div className="brand-feature">
                            <span className="feature-icon">👥</span>
                            <span>Customer management</span>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="signup-form-wrapper">
                    <div className="form-header">
                        <h2>Create Account</h2>
                        <p>Join SmartBiz and start managing your business</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">
                                <FaUser className="input-icon" />
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <FaEnvelope className="input-icon" />
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
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
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                            
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div 
                                            className="strength-fill"
                                            style={{
                                                width: `${getPasswordStrengthWidth()}%`,
                                                backgroundColor: getPasswordStrengthColor()
                                            }}
                                        />
                                    </div>
                                    <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                                        {getPasswordStrengthText()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                <FaCheckCircle className="input-icon" />
                                Confirm Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="form-input password-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password && (
                                <div className={`password-match ${formData.password === formData.confirmPassword ? 'match' : 'mismatch'}`}>
                                    {formData.password === formData.confirmPassword ? (
                                        <span>✅ Passwords match</span>
                                    ) : (
                                        <span>❌ Passwords do not match</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="signup-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="login-section">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="login-link">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>

                    <div className="signup-footer">
                        <p>&copy; 2026 SmartBiz. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;