import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";   // ✅ NEW
import "../styles/login.css";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [remember, setRemember] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();   // ✅ NEW

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ simulate login
    localStorage.setItem("isLoggedIn", "true");

    navigate("/quiz-setup");
};

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Welcome back</h1>

                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="input-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <span
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="options">
                        <label className="remember">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                            />
                            Remember me
                        </label>

                        <span className="forgot">Forgot password?</span>
                    </div>

                    <button type="submit" className="login-button">
                        Sign in
                    </button>
                </form>

                <p className="signup-text">
                    Don't have an account? <span>Sign up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
