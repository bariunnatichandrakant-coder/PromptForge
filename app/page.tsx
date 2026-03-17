"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ userTopic: input }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-blue-400">Prompt Forge</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Turn your simple ideas into expert-level AI prompts effortlessly.
      </p>

      <div className="w-full max-w-2xl space-y-4">
        <textarea
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          rows={4}
          placeholder="E.g., Write a 7-day workout plan for a beginner..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button
          onClick={generatePrompt}
          disabled={loading || !input}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Forging..." : "Generate Pro Prompt"}
        </button>

        {output && (
          <div className="mt-8 p-6 bg-gray-800 border border-green-500 rounded-lg">
            <h2 className="text-green-400 font-bold mb-2">Your Super Prompt:</h2>
            <p className="whitespace-pre-wrap text-gray-200">{output}</p>
            <button 
              onClick={() => navigator.clipboard.writeText(output)}
              className="mt-4 text-sm text-blue-400 underline"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
