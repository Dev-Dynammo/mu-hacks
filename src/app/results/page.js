// app/results/page.jsx
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";

const getAISummary = (answers, fileData) => `
## Business Overview
🎯 **Business Model**: ${answers[1] || "N/A"}
💰 **Market Size**: ${answers[2] || "N/A"}
📈 **Growth Rate**: Projecting ${answers[3] || "N/A"} growth

## Financial Metrics
- **CAC**: ${answers[3] || "N/A"}
- **LTV**: ${answers[4] || "N/A"}
- **Gross Margins**: ${answers[6] || "N/A"}%

## Key Insights
1. Your ${answers[1] || ""} business model shows strong potential in the ${
  answers[2] || ""
} market
2. Customer acquisition costs are ${answers[3] ? "optimal" : "to be optimized"}
3. Growth metrics indicate ${answers[5] ? "positive" : "room for"} trajectory

## Recommendations
- Focus on optimizing ${answers[7] || "sales cycle"} to improve conversion
- Target ${answers[8] || "key segments"} for maximum impact
- Leverage ${answers[10] || "competitive advantages"} for market positioning
`;

export default function Results() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState("summary");

  useEffect(() => {
    const savedAnswers = localStorage.getItem("questionAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
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
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-3">
                            {children}
                          </h2>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-300 mb-4">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-2 mb-4">{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-300 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-blue-300">{children}</strong>
                        ),
                      }}
                    >
                      {getAISummary(answers, fileData)}
                    </ReactMarkdown>
                  </div>
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
              /* Upload Section - Your existing upload UI */
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
