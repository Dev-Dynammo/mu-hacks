"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, FileText, Layout, PlusCircle } from "lucide-react";

export default function Home() {
  const cards = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Generate Questions with AI",
      description: "Let AI guide you through analyzing your startup metrics",
      link: "/pdf",
      badge: "PRO",
      preview: "Answer questions about your business model and metrics",
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      title: "Start from Scratch",
      description: "Build a custom analysis, step by step",
      link: "/questions/1",
      preview: "Create your own analysis framework",
    },

    {
      icon: <FileText className="w-5 h-5" />,
      title: "Import Sales Data",
      description: "Upload your Excel sheets for instant analysis",
      link: "/import",
      preview: "Transform your data into actionable insights",
    },
    {
      icon: <Layout className="w-5 h-5" />,
      title: "Browse Templates",
      description: "Pre-made analysis frameworks you can customize",
      link: "/templates",
      preview: "Choose from various startup analysis templates",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:44px_44px]" />

      <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">Startup Analysis</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Signed in as startup@example.com</span>
            <button className="hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold text-center mb-12">
            Start your startup analysis
          </h1>

          <div className="grid gap-4 max-w-3xl mx-auto">
            {cards.map((card, index) => (
              <Link href={card.link} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-white/10 text-blue-400">
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                          {card.title}
                        </h3>
                        {card.badge && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                            {card.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {card.description}
                      </p>
                      {card.preview && (
                        <div className="mt-4 p-3 rounded-lg bg-black/50 text-sm text-gray-400">
                          {card.preview}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
