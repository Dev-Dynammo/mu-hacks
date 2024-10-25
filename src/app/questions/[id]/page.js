"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { questions } from "@/data/questions";

export default function QuestionPage({ params }) {
  const router = useRouter();
  const questionId = parseInt(params.id);
  const question = questions.find((q) => q.id === questionId);

  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedAnswers = localStorage.getItem("questionAnswers");
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setAnswers(parsedAnswers);
      setInputValue(parsedAnswers[questionId] || "");
    }
  }, [questionId]);

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    localStorage.setItem("questionAnswers", JSON.stringify(newAnswers));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      localStorage.setItem("questionAnswers", JSON.stringify(newAnswers));
    }
  };

  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (questionId < questions.length) {
        router.push(`/questions/${questionId + 1}`);
      } else {
        router.push("/results");
      }
    } else {
      if (questionId > 1) {
        router.push(`/questions/${questionId - 1}`);
      }
    }
  };

  if (!question) {
    router.push("/");
    return null;
  }

  const progress = (questionId / questions.length) * 100;

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 min-h-screen">
        <header className="fixed top-0 left-0 right-0 border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
            >
              <Sparkles className="w-6 h-6 text-blue-500" />
              <span className="font-semibold">
                Question {questionId} of {questions.length}
              </span>
            </button>
            <div className="h-1 w-40 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-500"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </header>

        <main className="relative container mx-auto px-4 pt-32 pb-20 max-w-3xl">
          <motion.div
            key={questionId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{question.question}</h2>
              <p className="text-gray-400">{question.description}</p>
            </div>

            <div className="space-y-4">
              {question.options ? (
                // Multiple choice options
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`relative z-20 p-4 rounded-xl border cursor-pointer ${
                        answers[questionId] === option
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-white/10 hover:border-white/30 hover:bg-white/5"
                      } transition-all duration-200`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                // Text or number input
                <div className="relative z-20">
                  <input
                    type={question.type || "text"}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={`Enter your ${
                      question.type === "number" ? "number" : "answer"
                    }...`}
                    className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    min={question.type === "number" ? "0" : undefined}
                    step={question.type === "number" ? "any" : undefined}
                  />
                </div>
              )}

              <div className="flex justify-between mt-12">
                <button
                  onClick={() => handleNavigation("prev")}
                  disabled={questionId === 1}
                  className={`relative z-20 flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    questionId === 1
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  } transition-all duration-200`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => handleNavigation("next")}
                  disabled={!answers[questionId] && !inputValue}
                  className={`relative z-20 flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    !answers[questionId] && !inputValue
                      ? "bg-blue-500/20 text-blue-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } transition-all duration-200`}
                >
                  <span>
                    {questionId === questions.length ? "Finish" : "Next"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
