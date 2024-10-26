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
  DollarSign,
  Package,
  Percent,
  Loader2,
  Download,
  ChevronDown,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import MarkdownViewer from "@/components/markdownviwer";

export default function Results() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [response, setResponse] = useState(null);

  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const formatNumber = (value) => value.toLocaleString();
  const formatPercent = (value) => `${value}%`;

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setIsLoading(true);
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData = jsonData.map(({ __rowNum__, ...rest }) => rest);
        console.log("Parsed Excel Data:", jsonData);
        
        // const response = await axios.post(
        //   "http://localhost:8000/api/analyze",
        //   jsonData
        // );
        // console.log("Analysis Results:", response.data);
        setResponse({
          success: true,
          analysis: {
            model: "llama3",
            created_at: "2024-10-26T01:56:46.2896418Z",
            response:
              "```markdown\n**Monthly Sales Analysis for January 2021**\n=====================================================\n\n### Summary\n\nThe month of January 2021 saw a total revenue of $1,440,807 with a total of 12,403 units sold across the East and West regions. The average price per unit was $116.83, while the cost of goods sold was $875,627. The profit margin for the month stood at 29.4%.\n\n### Highlights\n\n* **Region-wise performance**: The West region outperformed the East region in terms of revenue and units sold.\n* **Revenue growth**: Revenue grew by 12.5% compared to the previous month.\n* **Average price**: The average price per unit increased by 7.3% compared to the previous month.\n\n### KPI Analysis\n\n| Metric | January 2021 |\n| --- | --- |\n| Total Revenue | $1,440,807 |\n| Units Sold | 12,403 |\n| Average Price per Unit | $116.83 |\n| Cost of Goods Sold | $875,627 |\n| Profit Margin | 29.4% |\n\n### Trend Analysis\n\n* **Revenue trend**: Revenue has been increasing steadily over the past few months.\n* **Units sold trend**: Units sold have also been trending upward, with a slight dip in December.\n* **Average price trend**: Average price per unit has been fluctuating, but is currently on an upward trend.\n\n### Recommendations\n\nBased on the analysis, we recommend:\n\n* **Increase marketing efforts** in the East region to boost sales and revenue.\n* **Optimize pricing strategy** to take advantage of the current upward trend in average price per unit.\n* **Invest in supply chain optimization** to reduce costs and improve profit margins.\n* **Monitor and adjust** inventory levels to ensure they align with demand.\n\n### Solution to Increase Sales\n\nTo increase sales, we suggest implementing a multi-channel marketing campaign targeting both regions. This could include:\n\n* Social media advertising\n* Email marketing campaigns\n* Influencer partnerships\n* Trade show appearances\n\nAdditionally, we recommend leveraging customer loyalty programs and offering special promotions to drive repeat business. By increasing visibility, driving engagement, and fostering loyalty, we can expect to see an increase in sales and revenue.\n\n**Key Takeaways**\n\n1. Focus on the East region for increased marketing efforts.\n2. Optimize pricing strategy to capitalize on upward trend.\n3. Invest in supply chain optimization to improve profit margins.\n4. Monitor and adjust inventory levels to ensure alignment with demand.\n5. Implement multi-channel marketing campaign targeting both regions.\n6. Leverage customer loyalty programs and offer special promotions to drive repeat business.",
            done: true,
            done_reason: "stop",
            context: [128006, 882, 128007, 271, 22818, 6678, 13454, 2626, 13],
            total_duration: 131914943500,
            load_duration: 9087842900,
            prompt_eval_count: 327,
            prompt_eval_duration: 1066860000,
            eval_count: 539,
            eval_duration: 121756624000,
          },
        });
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

  const renderCharts = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-400">
                Total Revenue
              </h3>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-200">
              {formatCurrency(
                fileData.reduce((sum, item) => sum + item.revenue, 0)
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-green-500" />
              <h3 className="text-sm font-medium text-gray-400">Total Units</h3>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-200">
              {formatNumber(
                fileData.reduce((sum, item) => sum + item.units_sold, 0)
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Percent className="h-6 w-6 text-purple-500" />
              <h3 className="text-sm font-medium text-gray-400">Avg Margin</h3>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-200">
              {formatPercent(
                (
                  fileData.reduce((sum, item) => sum + item.profit_margin, 0) /
                  fileData.length
                ).toFixed(2)
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Cost Chart */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Revenue vs Cost of Goods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fileData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={formatCurrency}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    color: "white",
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar
                  dataKey="cost_of_goods"
                  fill="#ef4444"
                  name="Cost of Goods"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Units and Margin Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fileData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip
                    formatter={formatNumber}
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="units_sold"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fileData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatPercent} />
                  <Tooltip
                    formatter={formatPercent}
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit_margin"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
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
          </div>
        </header>

        <main className="relative container mx-auto px-4 pt-32 pb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {!fileData ? (
              <div className="relative z-20 space-y-4">
                <h3 className="text-lg font-medium">Upload Sales Data</h3>
                <div
                  {...getRootProps()}
                  className={`relative z-20 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
                    ${
                      isDragActive
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:border-white/30 bg-white/5"
                    } ${
                    isLoading
                      ? "pointer-events-none grid place-items-center"
                      : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  {isLoading ? (
                    <Loader2 className="animate-spin w-12 h-12" />
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* File Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-blue-500" />
                    <span className="text-white">{uploadedFile.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setFileData(null);
                      setUploadedFile(null);
                    }}
                    className="px-4 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    Upload New File
                  </button>
                </div>
                {/* Charts */}
                {renderCharts()}
                {console.log(response)}
                {response.success && (
                  <MarkdownViewer analysisResponse={response?.analysis?.response} />
                )}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
