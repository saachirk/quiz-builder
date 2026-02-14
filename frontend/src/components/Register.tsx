import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";   // for navbar styling
import "../styles/Register.css";
import "../styles/Register.css";


const Register = () => {
  const navigate = useNavigate();  
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", { ...formData, role });
  };

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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-btn">
            Register as {role}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
