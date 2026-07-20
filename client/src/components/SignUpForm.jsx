import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "../styles/LoginForm.css";
import { Link } from 'react-router-dom';
const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        console.log(formData);

        alert(`Welcome, ${formData.name}!`);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Create your account</h1>

                <div className="input-box">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FaEnvelope className="icon" />
                </div>

                <div className="input-box">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <div className="input-box">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <button type="submit">Sign Up</button>

                <div className="signup-link">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;