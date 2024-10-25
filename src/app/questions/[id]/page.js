"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { questions } from "@/data/questions";

export default function QuestionPage({ params }) {
  const router = useRouter();
  const questionId = parseInt(params.id);
  const question = questions[questionId - 1];
  const [answer, setAnswer] = useState("");

  const progress = (questionId / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:44px_44px]" />

      <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">
              Question {questionId} of {questions.length}
            </span>
          </div>
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

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-3xl">
        <motion.div
          key={questionId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{question.title}</h2>
            <p className="text-gray-400">{question.description}</p>
          </div>

          <div className="space-y-4">
            {question.options && (
              <div className="grid grid-cols-2 gap-4">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswer(option)}
                    className={`p-4 rounded-xl border ${
                      answer === option
                        ? "border-blue-500 bg-blue-500/20 text-blue-400"
                        : "border-white/10 hover:border-white/30 hover:bg-white/5"
                    } transition-all duration-200`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-12">
              <button
                onClick={() => router.push(`/questions/${questionId - 1}`)}
                disabled={questionId === 1}
                className="flex items-center space-x-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  if (questionId < questions.length) {
                    router.push(`/questions/${questionId + 1}`);
                  } else {
                    router.push("/results");
                  }
                }}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
