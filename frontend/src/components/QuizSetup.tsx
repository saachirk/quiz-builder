import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuizSetup.css";

const QuizSetup: React.FC = () => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");

  const handleStartQuiz = () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    navigate("/quiz", {
      state: { topic, numQuestions, difficulty },
    });
  };

  return (
    <div className="setup-wrapper">
      <div className="setup-card">
        <h1>Create Your Quiz</h1>

        {/* Topic */}
        <div className="input-group">
          <label>Quiz Topic</label>
          <input
            type="text"
            placeholder="e.g. Machine Learning"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Number of Questions */}
        <div className="input-group">
          <label>Number of Questions</label>
          <input
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
        </div>

        {/* Difficulty */}
        <div className="input-group">
          <label>Difficulty Level</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button className="start-btn" onClick={handleStartQuiz}>
          Generate Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizSetup;
