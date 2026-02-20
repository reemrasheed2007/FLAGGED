import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Landing from "./components/Landing";
import Scanner from "./components/Scanner";
import Questions from "./components/Questions";
import Result from "./components/Result";

import { questions } from "./data/questions";
import { calculateResult } from "./utils/scoring";

// Helper function to get random questions
const getRandomQuestions = (allQuestions, count = 5) => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function App() {
  const [answers, setAnswers] = useState([]);
  // Initialize with random questions immediately
  const [selectedQuestions, setSelectedQuestions] = useState(() => getRandomQuestions(questions, 5));

  const navigate = useNavigate();
  const location = useLocation();

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (newAnswers.length < selectedQuestions.length) {
      navigate(`/question/${newAnswers.length}`, {
        state: { name: location.state?.name },
      });
    } else {
      const finalScore = calculateResult(newAnswers);

      navigate("/result", {
        state: {
          name: location.state?.name,
          score: finalScore,
        },
      });
    }
  };

  const handleRetake = () => {
    setAnswers([]);
    
    // Pick NEW random 5 questions on retake
    setSelectedQuestions(getRandomQuestions(questions, 5));
    
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<Landing navigate={navigate} />} />
      <Route path="/scanner" element={<Scanner />} />

      {selectedQuestions.map((q, index) => (
        <Route
          key={q.id}
          path={`/question/${index}`}
          element={
            <Questions
              question={selectedQuestions[index]}
              onAnswer={handleAnswer}
              index={index}
            />
          }
        />
      ))}

      <Route
        path="/result"
        element={<Result onRestart={handleRetake} />}
      />
    </Routes>
  );
}