import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Result.css";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);

  // SAFE ACCESS (prevents crash)
  const score = location.state?.score ?? 0;
  const totalQuestions = location.state?.totalQuestions ?? 0;
  const questions = location.state?.questions ?? [];
  const selectedAnswers = location.state?.selectedAnswers ?? [];
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const hasData = totalQuestions > 0;

  const getPerformanceMessage = () => {
    if (percentage >= 80) return "🎉 Excellent! You're a Quiz Master!";
    if (percentage >= 60) return "👍 Good Job! Keep it up!";
    if (percentage >= 40) return "📚 Not bad! Review and try again!";
    return "💪 Don't give up! Practice makes perfect!";
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isHovering: boolean) => {
    if (isHovering) {
      (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
      (e.target as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
    } else {
      (e.target as HTMLButtonElement).style.transform = "translateY(0)";
      (e.target as HTMLButtonElement).style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
    }
  };

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a3e 0%, #0f0f1e 50%, #2d1b69 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
    padding: "20px",
    margin: 0,
    zIndex: 9999,
    overflowY: "auto",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(20, 20, 40, 0.6)",
    backdropFilter: "blur(10px)",
    padding: "45px",
    maxWidth: "700px",
    width: "100%",
    borderRadius: "16px",
    textAlign: "center",
    color: "#ffffff",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#c7d2fe",
    fontWeight: 700,
    textAlign: "center",
  };

  const scoreStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "12px",
    color: "#e0e7ff",
  };

  const detailsStyle: React.CSSProperties = {
    margin: "12px 0",
    fontSize: "16px",
    color: "#c7d2fe",
    lineHeight: 1.6,
  };

  const percentageStyle: React.CSSProperties = {
    marginTop: "20px",
    fontSize: "48px",
    fontWeight: "bold",
    color: "#a78bfa",
  };

  const messageStyle: React.CSSProperties = {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#5eead4",
  };

  const buttonsStyle: React.CSSProperties = {
    marginTop: "30px",
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s ease",
    fontWeight: 600,
    minWidth: "140px",
    color: "white",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  };

  const retakeBtnStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#6366f1",
    border: "none",
  };

  const homeBtnStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#8b5cf6",
    border: "none",
  };

  const questionItemStyle: React.CSSProperties = {
    backgroundColor: "rgba(30, 30, 60, 0.4)",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "20px",
    textAlign: "left",
  };

  const questionNumberStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#a78bfa",
    marginBottom: "10px",
  };

  const questionTextStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#c7d2fe",
    marginBottom: "15px",
    fontWeight: 500,
  };

  const answerStyle = (isCorrect: boolean): React.CSSProperties => ({
    fontSize: "14px",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px",
    backgroundColor: isCorrect ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
    border: `1px solid ${isCorrect ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)"}`,
    color: isCorrect ? "#86efac" : "#fca5a5",
  });

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {hasData ? (
          <>
            <h1 style={titleStyle}>Quiz Result</h1>
            <div style={scoreStyle}>Your Score</div>
            <div style={detailsStyle}>{score} out of {totalQuestions} questions correct</div>
            <div style={percentageStyle}>{percentage}%</div>
            <div style={messageStyle}>{getPerformanceMessage()}</div>

            <button 
              style={{
                ...buttonStyle,
                backgroundColor: showReview ? "#ef4444" : "#10b981",
                marginTop: "25px"
              }}
              onClick={() => setShowReview(!showReview)}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              {showReview ? "Hide Answers" : "Review Your Answers"}
            </button>

            {/* Display all questions with answers */}
            {showReview && (
            <div style={{ marginTop: "30px", textAlign: "left" }}>
              <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#c7d2fe" }}>Review Your Answers</h3>
              {questions.map((question: Question, index: number) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                return (
                  <div key={question.id} style={questionItemStyle}>
                    <div style={questionNumberStyle}>Q{index + 1}: {isCorrect ? "✅ Correct" : "❌ Incorrect"}</div>
                    <div style={questionTextStyle}>{question.question}</div>
                    
                    <div style={{ fontSize: "14px", marginTop: "10px" }}>
                      <div style={{ color: "#c7d2fe", marginBottom: "8px" }}>
                        <strong>Your Answer:</strong>
                      </div>
                      <div style={answerStyle(isCorrect)}>
                        {selectedAnswers[index] || "Not answered"}
                      </div>
                    </div>

                    {!isCorrect && (
                      <div style={{ fontSize: "14px", marginTop: "10px" }}>
                        <div style={{ color: "#c7d2fe", marginBottom: "8px" }}>
                          <strong>Correct Answer:</strong>
                        </div>
                        <div style={answerStyle(true)}>
                          {question.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </>
        ) : (
          <>
            <h1 style={titleStyle}>Take a Quiz First!</h1>
            <div style={detailsStyle}>Complete a quiz to see your results here.</div>
          </>
        )}
        
        <div style={buttonsStyle}>
          <button 
            style={retakeBtnStyle} 
            onClick={() => navigate("/quiz")}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            {hasData ? "Retake Quiz" : "Start Quiz"}
          </button>
          <button 
            style={homeBtnStyle} 
            onClick={() => navigate("/")}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;