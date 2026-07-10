import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/LoginForm.css";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log({
            email,
            password,
        });

        alert(`Sending data:\nEmail: ${email}`);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Access your account</h1>

                <div className="input-box">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <div className="recall-forget">
                    <label>
                        <input type="checkbox" />
                        Remember me
                    </label>

                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="signup-link">
                    <p>
                        Don't have an account? <a href="#">Sign up</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;