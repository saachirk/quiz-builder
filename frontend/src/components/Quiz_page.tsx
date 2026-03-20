import React, { useState, useEffect, useRef } from "react";
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

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionId, setSessionId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(600);
const [tabSwitches, setTabSwitches] = useState<number>(0); 
  const [userName, setUserName] = useState<string>(''); 

  // Load user info on mount
  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    setUserName(name);
  }, []);


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

        // Start secure quiz session
        if (data.quizId) {
          try {
            const startRes = await fetch(`${API_URL}/api/start-quiz/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                quizId: data.quizId,
                topic,
                difficulty
              }),
            });
            if (startRes.ok) {
              const startData = await startRes.json();
              setSessionId(startData.session_id);
              setTimeLeft(startData.duration);
            }
          } catch (startErr) {
            console.error("Failed to start quiz session:", startErr);
          }
        }
      } catch (err) {
        console.error("API ERROR:", err);
        setError("Something went wrong while generating quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topic, difficulty, numQuestions]);

  // Server timer polling
  useEffect(() => {
    if (!sessionId) return;

    const pollTime = async () => {
      try {
        const res = await fetch(`${API_URL}/api/get-time-left/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        if (!res.ok) return;
        const data = await res.json();
        setTimeLeft(data.time_left);
        setTabSwitches(data.switches);
        if (data.expired) {
          handleSubmit();
        }
      } catch (err) {
        console.error("Timer poll error:", err);
      }
    };

    pollingRef.current = setInterval(pollTime, 1000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [sessionId]);

  // Tab switching detection
  useEffect(() => {
    if (!sessionId) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        try {
          const res = await fetch(`${API_URL}/api/report-switch/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          });
          if (res.ok) {
            const data = await res.json();
            setTabSwitches(data.switches || tabSwitches + 1);
            if (data.expired) {
              handleSubmit();
            }
          }
        } catch (err) {
          console.error("Switch report error:", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [sessionId, tabSwitches]);

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

  const handleSubmit = async () => {
    if (!sessionId) {
      // Fallback client-side
      const finalScore = calculateScore();
      navigate("/result", {
        state: {
          score: finalScore,
          totalQuestions: questions.length,
          topic,
          difficulty,
        },
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/submit-quiz/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          answers: selectedAnswers,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/result", {
          state: {
            score: data.score,
            totalQuestions: data.total,
            topic: data.topic,
            switches: data.switches,
          },
        });
      } else {
        // Fallback
        const finalScore = calculateScore();
        navigate("/result", {
          state: {
            score: finalScore,
            totalQuestions: questions.length,
            topic,
            difficulty,
          },
        });
      }
    } catch (err) {
      console.error("Submit failed:", err);
      // Fallback
      const finalScore = calculateScore();
      navigate("/result", {
        state: {
          score: finalScore,
          totalQuestions: questions.length,
          topic,
          difficulty,
        },
      });
    }
  }; 

  return (
      <div className="quiz-wrapper">
        {/* Watermark for user tracking */}
        <div className="watermark">
          <div>User: {userName}</div>
          <div>Session: {new Date().toLocaleTimeString()} - Do not share screen</div>
        </div>
        
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

      <div className="timer-info">
        <span>Time: {Math.floor(timeLeft / 60)}:{Math.floor(timeLeft % 60).toString().padStart(2, "0")}</span>
        <span>Tab switches: {tabSwitches}/5</span>
        {tabSwitches >= 3 && <span className="switch-warning">⚠️ Warning: Stay on this tab to avoid auto-submit!</span>}
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