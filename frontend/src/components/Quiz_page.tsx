import React, { useState, useEffect } from "react";
import "../styles/Quiz_page.css";
import { useNavigate, useLocation } from "react-router-dom";

// ✅ Centralized API URL
const API_URL = "http://127.0.0.1:8000";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const { topic, difficulty, numQuestions } = location.state || {
    topic: "General Knowledge",
    difficulty: "medium",
    numQuestions: 5,
  };

  // ✅ Fetch Quiz from Django
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}/api/generate-quiz/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            numberOfQuestions: numQuestions,
            difficulty,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate quiz");
        }

        const data = await response.json();

        const formattedQuestions: Question[] = data.questions.map(
          (q: any, index: number) => ({
            id: index + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })
        );

        setQuestions(formattedQuestions);
      } catch (err) {
        console.error("API ERROR:", err);
        setError("Something went wrong while generating quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topic, difficulty, numQuestions]);

  if (loading) {
    return <div className="quiz-wrapper">Generating quiz...</div>;
  }

  if (error) {
    return <div className="quiz-wrapper">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="quiz-wrapper">No questions generated.</div>;
  }

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
        questions,
        selectedAnswers,
        topic,
        difficulty,
      },
    });
  };

  return (
    <div className="quiz-wrapper">
      <h1 className="quiz-title">Quiz Builder</h1>

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