"use client";

import { useState } from "react";
import { FaSpinner } from "react-icons/fa"; 

interface FactCheckResult {
  percentageFact: number;
  additionalInfo: string;
  facts: string[];
  cannotConfirm: string[];
  sources: string[];
  fake: string[];
}

export default function FactChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/fact-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data: FactCheckResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch fact-check results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-12 px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">Fact Checker</h1>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-2xl mb-8">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to fact-check"
          className="w-full p-4 text-xl border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-semibold transition-colors duration-300 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Check"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

      {/* Results */}
      {!loading && result && (
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Fact Check Results</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Accuracy */}
            <div className="bg-blue-100 p-6 rounded-lg shadow">
              <p className="text-2xl font-semibold mb-2 text-blue-600">Accuracy</p>
              <p className="text-lg">{result.percentageFact.toFixed(2)}%</p>
            </div>

            {/* Additional Information */}
            <div className="bg-green-100 p-6 rounded-lg shadow">
              <p className="text-2xl font-semibold mb-2 text-green-600">Additional Information</p>
              <p className="text-lg">{result.additionalInfo}</p>
            </div>

            {/* Facts */}
            {result.facts.length > 0 && (
              <div className="bg-yellow-100 p-6 rounded-lg shadow col-span-2">
                <p className="text-2xl font-semibold mb-2 text-yellow-600">Facts</p>
                <ul className="list-disc pl-6 text-lg">
                  {result.facts.map((fact, index) => (
                    <li key={index} className="mb-2">{fact}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cannot Confirm */}
            {result.cannotConfirm.length > 0 && (
              <div className="bg-orange-100 p-6 rounded-lg shadow col-span-2">
                <p className="text-2xl font-semibold mb-2 text-orange-600">Cannot Confirm</p>
                <ul className="list-disc pl-6 text-lg">
                  {result.cannotConfirm.map((item, index) => (
                    <li key={index} className="mb-2">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sources */}
            {result.sources.length > 0 && (
              <div className="bg-purple-100 p-6 rounded-lg shadow col-span-2">
                <p className="text-2xl font-semibold mb-2 text-purple-600">Sources</p>
                <ul className="list-disc pl-6 text-lg">
                  {result.sources.map((source, index) => (
                    <li key={index} className="mb-2">{source}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fake Information */}
            {result.fake.length > 0 && (
              <div className="bg-red-100 p-6 rounded-lg shadow col-span-2">
                <p className="text-2xl font-semibold mb-2 text-red-600">Fake Information</p>
                <ul className="list-disc pl-6 text-lg">
                  {result.fake.map((item, index) => (
                    <li key={index} className="mb-2">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
