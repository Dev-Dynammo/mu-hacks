"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Upload,
  Send,
  Star,
  Tag,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import mammoth from "mammoth";
import MarkdownViewer from "@/components/markdownviwer";

const DocxAnalyzer = () => {
  const [docxText, setDocxText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mappedData, setMappedData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState({});

  const categoryColors = {
    customers: "bg-blue-500/20 text-blue-400",
    strategy: "bg-purple-500/20 text-purple-400",
    compliance: "bg-red-500/20 text-red-400",
    operations: "bg-green-500/20 text-green-400",
    finance: "bg-yellow-500/20 text-yellow-400",
  };

  const readDocxFile = async (file) => {
    try {
      if (!file || !file.type.includes("wordprocessingml.document")) {
        throw new Error("Please select a valid DOCX file");
      }

      setLoading(true);
      setError("");
      setQuestions([]);
      setAnswers({});

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      setDocxText(result.value);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
    } catch (err) {
      setError(err.message);
      setDocxText("");
      setFileInfo(null);
    } finally {
      setLoading(false);
    }
  };

  

  const generateQuestions = async () => {
    try {
      setGeneratingQuestions(true);
      setError("");

      const response = await fetch("http://localhost:8000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: docxText }),
      });

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();



      // Extract just the JSON array part from the response string
      const jsonString = data.questions.response.substring(
        data.questions.response.indexOf("["),
        data.questions.response.lastIndexOf("]") + 1
      );

      // Parse the JSON array
      const questions = JSON.parse(jsonString);

      setQuestions(questions);

      // Initialize answers object
      const initialAnswers = questions.reduce((acc, q) => {
        acc[q.id] = "";
        return acc;
      }, {});
      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Error in generateQuestions:", err);
      setError(err.message);
      setQuestions([]);
      setAnswers({});
    } finally {
      setGeneratingQuestions(false);
    }
  };

  console.log(answers);
  console.log(questions);

  useEffect(() => {
    const newMappedData = questions.map((q) => ({
      question: q.question,
      answer: answers[q.id] || "",
    }));
    setMappedData(newMappedData);

    // Optional: Log the updated data
    console.log("Updated mapped data:", newMappedData);
  }, [answers, questions]);

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

  const handleSubmit = async () => {
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
      //       {
      //     "model": "llama3",
      //     "created_at": "2024-10-26T05:27:22.4153426Z",
      //     "response": "**Strategic Analysis:**\n\n1. **Evaluate the current approach:** The business's primary focus is on monetary transactions, and they plan to acquire and retain users through buy campaigns. This suggests a transactional approach, focusing on short-term gains.\n2. **Identify core strengths and weaknesses:** Strengths:\n\t* The company has identified FHE (Fully Homomorphic Encryption) as their competitive advantage, which could be a significant differentiator in the market.\n\t* They seem to prioritize loyalty among team members.\n\nWeaknesses:\n\n\t* Lack of clear strategies for data quality, integrity, regulatory compliance, risk management, and user trust and satisfaction. This suggests a lack of attention to long-term sustainability and reputation.\n\t* The company's approach is primarily transactional, which may not lead to sustainable growth or loyalty among users.\n3. **Identify potential risks:** Risks:\n\t* Inadequate data quality and integrity could harm the business's reputation and result in significant financial losses.\n\t* Failing to address regulatory compliance challenges could lead to severe penalties and damage the company's credibility.\n\t* Poor risk management practices could expose the business to unforeseen liabilities.\n\n**Recommendations:**\n\n1. **Prioritize long-term sustainability:** Focus on building a loyal user base through value-added services, rather than relying solely on buy campaigns.\n2. **Develop robust data quality and integrity strategies:** Implement measures to ensure accurate, reliable, and secure data handling practices.\n3. **Establish effective regulatory compliance processes:** Develop a clear understanding of relevant regulations and implement controls to ensure compliance.\n4. **Invest in risk management:** Identify potential risks and develop mitigation strategies to minimize their impact on the business.\n5. **Leverage FHE as a competitive advantage:** Utilize FHE to secure sensitive data, protect user information, and differentiate your platform from competitors.\n\n**Strategic Priorities:**\n\n1. Develop a robust data quality and integrity strategy\n2. Establish effective regulatory compliance processes\n3. Invest in risk management practices\n4. Build a loyal user base through value-added services\n\n**Opportunities:**\n\n1. **Leverage AI/ML:** Consider integrating AI/ML to improve predictive analytics, enhance user experiences, and drive business decision-making.\n2. **Explore new revenue streams:** Diversify revenue sources by offering additional services or products that complement your primary offerings.\n3. **Develop strategic partnerships:** Collaborate with other businesses to expand reach, share knowledge, and strengthen market presence.\n\n**Growth Potential:**\n\n1. Expand user base through value-added services\n2. Develop strategic partnerships and collaborations\n3. Integrate AI/ML to drive business growth\n\nTo achieve this growth potential, the company should focus on:\n\n1. Building a strong foundation for data quality and integrity\n2. Developing effective regulatory compliance processes\n3. Investing in risk management practices\n4. Leveraging FHE as a competitive advantage\n5. Exploring new revenue streams and strategic partnerships",
      //     "done": true,
      //     "context": [
      //         128006,
      //         882,
      //         128007,
      //         198,
      //     ],
      //     "total_duration": 398422311700,
      //     "load_duration": 8969359700,
      //     "prompt_eval_count": 323,
      //     "prompt_eval_duration": 1073826000,
      //     "eval_count": 603,
      //     "eval_duration": 388372420000
      // }
    } catch (err) {
      //   setError("Failed to submit answers");
      console.error("Error submitting answers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const renderImportanceStars = (importance) => {
    const numStars = Math.min(Math.max(1, Number(importance) || 1), 5);

    return Array(numStars)
      .fill(null)
      .map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ));
  };
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError("");

    const files = [...e.dataTransfer.files];

    if (files.length > 1) {
      setError("Please drop only one file");
      return;
    }

    const file = files[0];
    readDocxFile(file);
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      readDocxFile(file);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 min-h-screen">
        <header className="fixed top-0 left-0 right-0 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-500" />
              <h1 className="text-lg font-semibold">Document Analyzer</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Document Analysis Assistant
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload a DOCX file to generate analysis questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg transition-colors duration-200
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:border-white/20"
                    }
                  `}
                >
                  <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload
                        className={`
                        w-8 h-8 mb-2 transition-colors duration-200
                        ${isDragging ? "text-blue-500" : "text-gray-400"}
                      `}
                      />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">DOCX files only</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Loading State */}
                {(loading || generatingQuestions) && (
                  <div className="flex items-center justify-center py-4 text-blue-400">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>
                      {loading ? "Processing DOCX..." : "Analyzing Document..."}
                    </span>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* File Info */}
                {fileInfo && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <h3 className="font-medium text-white mb-2">
                      File Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-400">Name:</p>
                      <p className="text-white">{fileInfo.name}</p>
                      <p className="text-gray-400">Size:</p>
                      <p className="text-white">{fileInfo.size}</p>
                      <p className="text-gray-400">Last Modified:</p>
                      <p className="text-white">{fileInfo.lastModified}</p>
                    </div>
                  </div>
                )}

                {/* Generate Questions Button */}
                {docxText && !generatingQuestions && questions.length === 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={generateQuestions}
                      className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Analyze Document
                    </Button>
                  </div>
                )}

                {isLoading && (
                  <div className="w-full grid place-items-center">
                    <Loader2 className="animate-spin w-12 h-12 text-gray-200 " />
                  </div>
                )}  

                {output?.response && !isLoading && (
                  <MarkdownViewer analysisResponse={output.response} />
                )}

                {/* Questions */}
                {questions.length > 0 && output !== null && !isLoading && (
                  <div className="space-y-6">
                    <h3 className="font-medium text-white text-lg">
                      Analysis Questions
                    </h3>
                    {questions.map((question) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <h4 className="font-medium text-white text-lg">
                              {question.question}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${
                                  categoryColors[question.category]
                                } font-medium`}
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {question.category}
                              </Badge>
                              <div className="flex items-center">
                                {renderImportanceStars(question.importance)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md mb-4 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-400" />
                          <p className="text-sm text-gray-300">
                            {question.insight_goal}
                          </p>
                        </div>

                        <Textarea
                          placeholder="Enter your analysis here..."
                          value={answers[question.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                <Button onClick={handleSubmit}>Submit</Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DocxAnalyzer;
