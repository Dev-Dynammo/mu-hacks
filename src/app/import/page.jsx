// app/results/page.jsx
"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Results() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState({});

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
      {/* Background pattern with lower z-index */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:44px_44px]" />

      {/* Content wrapper with higher z-index */}
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
          </div>
        </header>

        <main className="relative container mx-auto px-4 pt-32 pb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Summary Card */}
            {/* <div className="relative z-20 p-6 rounded-xl border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Analysis Summary
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(answers).map(([questionId, answer]) => (
                  <div key={questionId} className="p-4 rounded-lg bg-black/30">
                    <p className="text-gray-400 text-sm">
                      Question {questionId}
                    </p>
                    <p className="text-white font-medium">{answer}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Upload Section */}
            <div className="relative z-20 space-y-4">
              <h3 className="text-lg font-medium">Upload Sales Data</h3>
              <div
                {...getRootProps()}
                className={`relative z-20 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 hover:border-white/30 bg-white/5"
                  }`}
              >
                <input {...getInputProps()} />
                <Upload
                  className={`w-12 h-12 mx-auto mb-4 ${
                    isDragActive ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <p className="text-gray-400">
                  {isDragActive
                    ? "Drop your file here..."
                    : "Drag & drop your Excel file here, or click to select"}
                </p>
              </div>
            </div>

            {/* Uploaded File Info */}
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-20 p-4 rounded-lg border border-white/10 bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-blue-500" />
                  <span className="text-white">{uploadedFile.name}</span>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="relative z-20 flex justify-between pt-8">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Start Over
              </button>
              <button
                disabled={!fileData}
                onClick={() => console.log("View analysis")}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                  fileData
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-500/20 text-blue-300 cursor-not-allowed"
                } transition-all duration-200`}
              >
                View Full Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
