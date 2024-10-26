import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";

const MarkdownViewer = ({ analysisResponse }) => {
  if (!analysisResponse) {
    return null;
  }

  // Convert the pipe-based text to proper markdown table
  const formatTableData = (text) => {
    return (
      text
        // Clean up multiple blank lines
        .replace(/\n\s*\n/g, "\n\n")
        // Remove asterisks from section titles while preserving bold texts
        .replace(/\*\* ([^*]+)\*\*/g, "**$1**")
        // Format table headers
        .replace(
          /\|\s*Metric\s*\|\s*January 2021\s*\|/g,
          "\n| Metric | Value |\n| --- | --- |"
        )
        // Remove separator lines
        .replace(/={3,}/g, "")
        // Format table data with consistent spacing
        .replace(
          /\|\s*Total Revenue\s*\|\s*\$1,440,807\s*\|/g,
          "| Total Revenue | $1,440,807 |"
        )
        .replace(
          /\|\s*Units Sold\s*\|\s*12,403\s*\|/g,
          "| Units Sold | 12,403 |"
        )
        .replace(
          /\|\s*Average Price per Unit\s*\|\s*\$116\.83\s*\|/g,
          "| Average Price per Unit | $116.83 |"
        )
        .replace(
          /\|\s*Cost of Goods Sold\s*\|\s*\$875,627\s*\|/g,
          "| Cost of Goods Sold | $875,627 |"
        )
        .replace(
          /\|\s*Profit Margin\s*\|\s*29\.4%\s*\|/g,
          "| Profit Margin | 29.4% |"
        )
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="prose prose-invert max-w-none"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <motion.h1
              variants={item}
              className="text-3xl font-bold text-white mb-8 pb-4 border-b border-white/10"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <motion.h2
              variants={item}
              className="text-2xl font-semibold text-white mt-10 mb-6"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <motion.h3
              variants={item}
              className="text-xl font-semibold text-blue-400 mt-8 mb-4"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <motion.p
              variants={item}
              className="text-gray-300 leading-relaxed mb-6"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <motion.ul
              variants={item}
              className="space-y-3 mb-6 ml-4"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <motion.ol
              variants={item}
              className="list-decimal space-y-3 mb-6 ml-6 text-gray-300"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <motion.li
              variants={item}
              className="text-gray-300 flex items-start gap-3"
            >
              <span className="text-blue-500 min-w-[8px] mt-1.5">•</span>
              <span className="flex-1">{props.children}</span>
            </motion.li>
          ),
          table: ({ node, ...props }) => (
            <motion.div
              variants={item}
              className="my-8 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent"
            >
              <div className="overflow-x-auto">
                <table className="w-full" {...props} />
              </div>
            </motion.div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-white/5 text-gray-200" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-6 py-4 text-left font-medium border-b border-white/10 text-blue-300"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-6 py-4 text-gray-300 border-b border-white/10 whitespace-nowrap [&:nth-child(2)]:text-right font-mono"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            return inline ? (
              <code
                className="bg-black/30 rounded px-1.5 py-0.5 text-sm text-blue-300 font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <motion.pre
                variants={item}
                className="bg-black/30 rounded-xl p-4 overflow-x-auto my-6"
              >
                <code className="text-gray-300 text-sm font-mono" {...props}>
                  {children}
                </code>
              </motion.pre>
            );
          },
          strong: ({ node, ...props }) => (
            <strong className="text-blue-300 font-semibold" {...props} />
          ),
          hr: () => <hr className="border-white/10 my-10" />,
          blockquote: ({ node, ...props }) => (
            <motion.blockquote
              variants={item}
              className="border-l-4 border-blue-500 pl-6 py-1 my-6 text-gray-400 italic"
              {...props}
            />
          ),
        }}
      >
        {formatTableData(analysisResponse)}
      </ReactMarkdown>
    </motion.div>
  );
};

export default MarkdownViewer;
