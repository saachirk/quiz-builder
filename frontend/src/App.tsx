import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from "./components/Dashboard";
import Home from './components/Home';
import Login from './components/login';
import Register from "./components/Register";
import Quiz from "./components/Quiz_page";
import Result from "./components/Result";
import QuizSetup from "./components/QuizSetup"; // ✅ FIXED IMPORT

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ Quiz Setup Route */}
        <Route path="/quiz-setup" element={<QuizSetup />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
};

export default App;
