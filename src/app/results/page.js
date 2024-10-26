"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Sparkles,
  Users,
  DollarSign,
  Target,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import MarkdownViewer from "@/components/markdownviwer";

const getAISummary = (answers, fileData) => `
Your SaaS business currently operates with a low customer acquisition cost and high gross margins, making it well-positioned for scalable growth. However, the market size is limited, and your customer lifetime value (LTV) could be higher to maximize profitability. With a lengthy sales cycle and low recurring revenue percentage, your focus should be on improving customer retention and recurring revenue models, such as subscriptions or tiered pricing.

To drive growth, target specific sub-segments within your adult customer base, enhance your product's unique value, and consider expanding into adjacent markets. Tracking Monthly Recurring Revenue (MRR) alongside units sold will help monitor recurring revenue improvements and guide future growth decisions. By refining the sales cycle, optimizing costs, and offering more upsell opportunities, your business can boost customer value, increase market penetration, and secure a competitive edge. 
`;

export default function Results() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState("summary");
  const [showSummary, setShowSummary] = useState(false);
  const [output, setOutput] = useState({});

  const generatePrompt = (questions, answers) => {
    const mappedData = questions.map((q) => ({
      question: q.question,
      answer: answers[q.id] || "",
    }));

    let promptString = `Please analyze the following business information and provide strategic insights:\n\n`;

    promptString += `Current State:\n`;
    mappedData.forEach((item) => {
      promptString += `- Question: ${item.question}\n  Answer: ${item.answer}\n\n`;
    });

    promptString += `Please provide analysis in the following areas:\n\n`;
    promptString += `1. Strategic Analysis:\n`;
    promptString += `   - Evaluate the current approach\n`;
    promptString += `   - Identify core strengths and weaknesses\n\n`;
    promptString += `2. Recommendations:\n`;
    promptString += `   - Provide actionable improvements\n`;
    promptString += `   - Suggest strategic priorities\n\n`;
    promptString += `3. Risk Factors:\n`;
    promptString += `   - Identify potential challenges\n`;
    promptString += `   - Suggest mitigation strategies\n\n`;
    promptString += `4. Opportunities:\n`;
    promptString += `   - Highlight growth potential\n`;
    promptString += `   - Suggest next steps\n`;

    return promptString;
  };

  const srver = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        // Replace with your API endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: generatePrompt(questions, answers),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      const result = await response.json();
      setOutput(result);
      console.log("Submission successful:", result);
    } catch (err) {
      console.error("Error submitting answers:", err);
    } finally {
      setIsLoading(false);
      setShowSummary(true);
    }
  };

  useEffect(() => {
    const savedAnswers = localStorage.getItem("questionAnswers");

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    srver();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setIsLoading(true);
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Parsed Excel Data:", jsonData);
        setFileData(jsonData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-8 h-8 text-blue-500" />
      </motion.div>
      <p className="text-gray-400">Analyzing your business data...</p>
    </div>
  );

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
              <span className="font-semibold">Analysis Results</span>
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentSection("summary")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentSection === "summary"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setCurrentSection("upload")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentSection === "upload"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Upload Data
              </button>
            </div>
          </div>
        </header>

        <main className="relative container mx-auto px-4 pt-32 pb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {currentSection === "summary" ? (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      icon: TrendingUp,
                      label: "Growth Rate",
                      value: answers[5] || "N/A",
                    },
                    { icon: Target, label: "TAM", value: answers[2] || "N/A" },
                    {
                      icon: DollarSign,
                      label: "CAC",
                      value: answers[3] || "N/A",
                    },
                    { icon: Users, label: "LTV", value: answers[4] || "N/A" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2"
                    >
                      <stat.icon className="w-5 h-5 text-blue-500" />
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-xl font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* AI Analysis */}
                <div className="relative z-20 p-6 rounded-xl border border-white/10 bg-white/5">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    AI Analysis
                  </h2>
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    showSummary && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="prose prose-invert max-w-none"
                      >
                        <MarkdownViewer analysisResponse={output.response} />
                      </motion.div>
                    )
                  )}
                </div>

                {/* Detailed Responses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(answers).map(([questionId, answer]) => (
                    <div
                      key={questionId}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <p className="text-sm text-gray-400 mb-1">
                        {questions[parseInt(questionId) - 1]?.question ||
                          `Question ${questionId}`}
                      </p>
                      <p className="text-white font-medium">{answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Upload Section */
              <div className="space-y-6">
                {/* ... Your existing upload section code ... */}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
