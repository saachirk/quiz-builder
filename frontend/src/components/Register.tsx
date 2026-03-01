import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";   // for navbar styling
import "../styles/Register.css";


const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [showRequirements, setShowRequirements] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password strength validation
  const validatePassword = (password: string) => {
    const checks = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    return checks;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    const checks = validatePassword(password);
    const passedChecks = Object.values(checks).filter(Boolean).length;
    
    if (passedChecks <= 2) return { strength: 1, label: "Weak", color: "#ef4444" };
    if (passedChecks === 3) return { strength: 2, label: "Fair", color: "#f97316" };
    if (passedChecks === 4) return { strength: 3, label: "Good", color: "#eab308" };
    return { strength: 4, label: "Strong", color: "#22c55e" };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const passwordChecks = validatePassword(formData.password);
    if (!passwordChecks.minLength || !passwordChecks.hasUpperCase || 
        !passwordChecks.hasLowerCase || !passwordChecks.hasNumber || 
        !passwordChecks.hasSpecial) {
      alert("Password must contain at least 8 characters, uppercase, lowercase, number, and special character!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        console.error("Registration error response:", data);
        alert(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Network error during registration:", error);
      alert("Network error. Please check if the server is running and try again.");
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordChecks = validatePassword(formData.password);

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>

        <div className="role-selector">
          {["student", "teacher", "admin"].map((r) => (
            <button
              key={r}
              className={role === r ? "role-btn active" : "role-btn"}
              onClick={() => setRole(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password && (
              <div>
                <div className="password-strength-bar">
                  <div 
                    className="password-strength-fill" 
                    style={{
                      width: `${(passwordStrength.strength / 4) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <p className="strength-label" style={{ color: passwordStrength.color }}>
                  Strength: {passwordStrength.label}
                </p>
              </div>
            )}
            
            <button
              type="button"
              className="requirements-toggle-btn"
              onClick={() => setShowRequirements(!showRequirements)}
            >
              {showRequirements ? "▼" : "▶"} Password Requirements
            </button>

            {showRequirements && (
              <div className="password-requirements">
                <p className="requirement-title">Password Requirements:</p>
                <div className={`requirement ${passwordChecks.minLength ? "met" : ""}`}>
                  <span className="check-icon">{passwordChecks.minLength ? "✓" : "✗"}</span>
                  At least 8 characters
                </div>
                <div className={`requirement ${passwordChecks.hasUpperCase ? "met" : ""}`}>
                  <span className="check-icon">{passwordChecks.hasUpperCase ? "✓" : "✗"}</span>
                  Uppercase letter (A-Z)
                </div>
                <div className={`requirement ${passwordChecks.hasLowerCase ? "met" : ""}`}>
                  <span className="check-icon">{passwordChecks.hasLowerCase ? "✓" : "✗"}</span>
                  Lowercase letter (a-z)
                </div>
                <div className={`requirement ${passwordChecks.hasNumber ? "met" : ""}`}>
                  <span className="check-icon">{passwordChecks.hasNumber ? "✓" : "✗"}</span>
                  Number (0-9)
                </div>
                <div className={`requirement ${passwordChecks.hasSpecial ? "met" : ""}`}>
                  <span className="check-icon">{passwordChecks.hasSpecial ? "✓" : "✗"}</span>
                  Special character (!@#$%^&*...)
                </div>
              </div>
            )}
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="error-text">Passwords do not match!</p>
          )}

          <button 
            type="submit" 
            className="register-btn"
            disabled={
              !formData.password ||
              !passwordChecks.minLength ||
              !passwordChecks.hasUpperCase ||
              !passwordChecks.hasLowerCase ||
              !passwordChecks.hasNumber ||
              !passwordChecks.hasSpecial ||
              formData.password !== formData.confirmPassword
            }
          >
            Register as {role}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
