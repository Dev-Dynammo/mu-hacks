"use client";
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, Send, Star, Tag, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import mammoth from 'mammoth';

const DocxAnalyzer = () => {
  const [docxText, setDocxText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [answers, setAnswers] = useState({});

  const categoryColors = {
    customers: "bg-blue-100 text-blue-800",
    strategy: "bg-purple-100 text-purple-800",
    compliance: "bg-red-100 text-red-800",
    operations: "bg-green-100 text-green-800",
    finance: "bg-yellow-100 text-yellow-800"
  };

  const readDocxFile = async (file) => {
    try {
      if (!file || !file.type.includes('wordprocessingml.document')) {
        throw new Error('Please select a valid DOCX file');
      }

      setLoading(true);
      setError('');
      setQuestions([]);
      setAnswers({});

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      setDocxText(result.value);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString()
      });

    } catch (err) {
      setError(err.message);
      setDocxText('');
      setFileInfo(null);
    } finally {
      setLoading(false);
    }
  };

const generateQuestions = async () => {
  try {
    setGeneratingQuestions(true);
    setError('');

    const response = await fetch('http://localhost:8000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: docxText }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data)
    
    // Extract just the JSON array part from the response string
    const jsonString = data.questions.response.substring(
      data.questions.response.indexOf('['),
      data.questions.response.lastIndexOf(']') + 1
    );
    
    // Parse the JSON array
    const questions = JSON.parse(jsonString);
    
    setQuestions(questions);
    
    // Initialize answers object
    const initialAnswers = questions.reduce((acc, q) => {
      acc[q.id] = '';
      return acc;
    }, {});
    setAnswers(initialAnswers);

  } catch (err) {
    console.error('Error in generateQuestions:', err);
    setError(err.message);
    setQuestions([]);
    setAnswers({});
  } finally {
    setGeneratingQuestions(false);
  }
};
  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
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
    setError('');

    const files = [...e.dataTransfer.files];
    
    if (files.length > 1) {
      setError('Please drop only one file');
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Analysis Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex justify-center relative
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            `}
          >
            <label className={`
              flex flex-col items-center justify-center 
              w-full h-32 
              border-2 border-dashed rounded-lg 
              cursor-pointer 
              transition-colors duration-200
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}
            `}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className={`
                  w-8 h-8 mb-2 
                  transition-colors duration-200
                  ${isDragging ? 'text-blue-500' : 'text-gray-500'}
                `} />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
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
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">
                {loading ? 'Processing DOCX...' : 'Analyzing Document...'}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Info */}
          {fileInfo && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">File Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">Name:</p>
                <p className="text-gray-900">{fileInfo.name}</p>
                <p className="text-gray-600">Size:</p>
                <p className="text-gray-900">{fileInfo.size}</p>
                <p className="text-gray-600">Last Modified:</p>
                <p className="text-gray-900">{fileInfo.lastModified}</p>
              </div>
            </div>
          )}

          {/* Generate Questions Button */}
          {docxText && !generatingQuestions && questions.length === 0 && (
            <div className="flex justify-center">
              <Button
                onClick={generateQuestions}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Analyze Document
              </Button>
            </div>
          )}

          {/* Questions */}
          {questions.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-900 text-lg">Analysis Questions</h3>
              {questions.map((question) => (
                <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900 text-lg">{question.question}</h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`${categoryColors[question.category]} font-medium`}
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
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-gray-600">{question.insight_goal}</p>
                  </div>

                  <Textarea
                    placeholder="Enter your analysis here..."
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocxAnalyzer;