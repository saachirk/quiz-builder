import React, { useState } from "react";
import "../styles/Quiz_page.css";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ UPDATED

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which language does React use?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: "JavaScript",
  },
  {
    id: 3,
    question: "Which hook manages state?",
    options: ["useEffect", "useState", "useRef", "useMemo"],
    correctAnswer: "useState",
  },
  {
    id: 4,
    question: "What is MongoDB?",
    options: ["SQL DB", "NoSQL DB", "Language", "Framework"],
    correctAnswer: "NoSQL DB",
  },
  {
    id: 5,
    question: "Which company created React?",
    options: ["Google", "Meta", "Microsoft", "Amazon"],
    correctAnswer: "Meta",
  },
];

const QuizPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ NEW

  // ✅ Receive setup data (if coming from quiz setup)
  const { topic, difficulty } = location.state || {
    topic: "General Knowledge",
    difficulty: "medium",
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (option: string) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = option;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();

    navigate("/result", {
      state: {
        score: finalScore,
        totalQuestions: questions.length,
        questions: questions,
        selectedAnswers: selectedAnswers,
      },
    });
  };

  return (
    <div className="quiz-wrapper">
      <h1 className="quiz-title">Quiz Builder</h1>

      {/* ✅ NEW: Show quiz info */}
      <p className="quiz-info">
        Topic: <b>{topic}</b> | Difficulty: <b>{difficulty}</b>
      </p>

      <p className="question-count">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="quiz-card">
        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`option ${
                selectedAnswers[currentIndex] === option ? "active" : ""
              }`}
            >
              <input
                type="radio"
                checked={selectedAnswers[currentIndex] === option}
                onChange={() => handleSelect(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="button-area">
          <button
            className="prev-btn"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
