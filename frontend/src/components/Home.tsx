import React from "react";
import {useNavigate} from "react-router-dom";
import "../styles/Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">QuizBuilder</h1>
        <div>
          <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="nav-btn signup" onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h2>
          Build & Play <span>AI-Powered</span> Quizzes
        </h2>
        <p>
          Generate quizzes from any topic, invite friends, and compete with
          real-time leaderboards.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn">Create Quiz</button>
          <button className="secondary-btn">Join Quiz</button>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <h3>How It Works</h3>
        <div className="card-container">
          <div className="card">
            <h4>1. Enter a Topic</h4>
            <p>Provide any subject and generate a quiz instantly.</p>
          </div>
          <div className="card">
            <h4>2. AI Creates Questions</h4>
            <p>Smart AI builds high-quality questions for you.</p>
          </div>
          <div className="card">
            <h4>3. Share & Compete</h4>
            <p>Invite friends and see live rankings.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section alt">
        <h3>Features</h3>
        <div className="card-container">
          {[
            "AI Quiz Generation",
            "Live Leaderboard",
            "Real-time Timer",
            "Performance Analytics",
            "Shareable Links",
            "Multiplayer Mode",
            "Quiz Library",
            "Mobile Friendly",
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* Preview */}
      <section className="section">
        <h3>Preview a Quiz</h3>
        <div className="preview-card">
          <h4>Machine Learning Basics</h4>
          <p>10 Questions • 5 mins • 120 Players</p>
          <button className="primary-btn">Preview Quiz</button>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h3>Ready to Challenge Your Friends?</h3>
        <p>Create your first AI-powered quiz in seconds.</p>
        <button className="primary-btn">Get Started</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} QuizBuilder. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
