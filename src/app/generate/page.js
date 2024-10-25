"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Sparkles, ArrowRight, Loader2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const GenerateQuestionsWithWebpage = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");

  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!url) {
      setError("Please enter a website URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would make your API call to generate questions
      // For now, we'll simulate with sample questions
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const questions = [
        {
          id: 1,
          question: "What is their primary business model?",
          description: "Based on the website analysis",
          options: ["B2B", "B2C", "SaaS", "Marketplace"],
        },
        {
          id: 2,
          question: "What is their main value proposition?",
          description: "Key selling point from the website",
          type: "text",
        },
        {
          id: 3,
          question: "How many team members are visible?",
          description: "Count from team/about page",
          type: "number",
        },
      ];
      setGeneratedQuestions(questions);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentStep + 1]: option };
    setAnswers(newAnswers);
    localStorage.setItem("questionAnswers", JSON.stringify(newAnswers));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      const newAnswers = { ...answers, [currentStep + 1]: value };
      setAnswers(newAnswers);
      localStorage.setItem("questionAnswers", JSON.stringify(newAnswers));
    }
  };

  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (currentStep < generatedQuestions.length - 1) {
        setCurrentStep((prev) => prev + 1);
        setInputValue(answers[currentStep + 2] || "");
      }
    } else {
      if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
        setInputValue(answers[currentStep] || "");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 min-h-screen">
        <header className="fixed top-0 left-0 right-0 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h1 className="text-lg font-semibold">
                  {generatedQuestions
                    ? `Question ${currentStep + 1} of ${
                        generatedQuestions.length
                      }`
                    : "Startup Analyzer"}
                </h1>
              </div>
              {generatedQuestions && (
                <div className="h-1 w-40 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((currentStep + 1) / generatedQuestions.length) * 100
                      }%`,
                    }}
                    className="h-full bg-blue-500"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
          {!generatedQuestions ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Generate Analysis Questions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter a startup&apos;s website URL to generate relevant
                    analysis questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                          isLoading
                            ? "bg-blue-500/20 text-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            Generate
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {error && (
                      <Alert
                        variant="destructive"
                        className="bg-red-500/10 border-red-500/20 text-red-400"
                      >
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  {generatedQuestions[currentStep].question}
                </h2>
                <p className="text-gray-400">
                  {generatedQuestions[currentStep].description}
                </p>
              </div>

              <div className="space-y-4">
                {generatedQuestions[currentStep].options ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedQuestions[currentStep].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={`relative z-20 p-4 rounded-xl border cursor-pointer ${
                          answers[currentStep + 1] === option
                            ? "border-blue-500 bg-blue-500/20 text-blue-400"
                            : "border-white/10 hover:border-white/30 hover:bg-white/5"
                        } transition-all duration-200`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative z-20">
                    <input
                      type={generatedQuestions[currentStep].type || "text"}
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder={`Enter your ${
                        generatedQuestions[currentStep].type === "number"
                          ? "number"
                          : "answer"
                      }...`}
                      className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                      min={
                        generatedQuestions[currentStep].type === "number"
                          ? "0"
                          : undefined
                      }
                      step={
                        generatedQuestions[currentStep].type === "number"
                          ? "any"
                          : undefined
                      }
                    />
                  </div>
                )}

                <div className="flex justify-between mt-12">
                  <button
                    onClick={() => handleNavigation("prev")}
                    disabled={currentStep === 0}
                    className={`relative z-20 flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      currentStep === 0
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    } transition-all duration-200`}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("next")}
                    disabled={!answers[currentStep + 1] && !inputValue}
                    className={`relative z-20 flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      !answers[currentStep + 1] && !inputValue
                        ? "bg-blue-500/20 text-blue-300 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } transition-all duration-200`}
                  >
                    <span>
                      {currentStep === generatedQuestions.length - 1
                        ? "Finish"
                        : "Next"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GenerateQuestionsWithWebpage;
