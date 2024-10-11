"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon } from "@/components/icons";
import { Navbar } from "@/components/nav-bar";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-gray-200 p-3 rounded-lg flex items-center space-x-2">
      <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
      <span className="text-gray-500">Thinking...</span>
    </div>
  </div>
);

export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    { title: "View all", label: "candidates", action: "provide list of all candidates" },
    {
      title: "Show me",
      label: "the latest news",
      action: "Show me the latest news on the election",
    },
    {
      title: "What are",
      label: "the economic policies?",
      action: "Compare and contrast the economic policies of the candidates",
    },
    {
      title: "How many",
      label: "days left till the election?",
      action: "When is the parliamentary election ?",
    },
  ];

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    const response: ReactNode = await sendMessage(message);
    setMessages((prevMessages) => [...prevMessages, response]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <motion.div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-gray-500 text-sm bg-gray-50 border-gray-200">
              <p className="flex flex-row justify-center gap-4 items-center text-gray-900">
                <VercelIcon size={16} />
                <span>+</span>
                <MasonryIcon />
              </p>
              <p>
                Welcome to PoliCube political analyst by DataMites. Ask me
                anything about politics and I will try to help you.
              </p>
              <p>
                {" "}
                Learn more about the{" "}
                <Link
                  className="text-blue-600"
                  href="https://elections.gov.lk"
                  target="_blank"
                >
                  2024 presidential Election{" "}
                </Link>
                from politiCube.
              </p>
            </div>
          </motion.div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${index % 2 === 0 ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {message}
            </div>
          </div>
        ))}
        {isLoading && <Loader />}
        <div ref={messagesEndRef} />
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
        {messages.length === 0 &&
          suggestedActions.map((action, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.01 * index }}
              key={index}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <button
                onClick={async () => {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    <Message
                      key={prevMessages.length}
                      role="user"
                      content={action.action}
                    />,
                  ]);
                  await handleSendMessage(action.action);
                }}
                className="w-full text-left border border-gray-300 text-gray-700 bg-white rounded-lg p-4 text-sm hover:bg-gray-100 transition-colors flex flex-col"
              >
                <span className="font-medium">{action.title}</span>
                <span className="text-gray-500 block">{action.label}</span>
              </button>
            </motion.div>
          ))}
      </div>

      <div className="p-4">
        <form
          className="max-w-3xl mx-auto relative"
          onSubmit={async (event) => {
            event.preventDefault();
            const userMessage = input.trim();
            if (userMessage) {
              setMessages((prevMessages) => [
                ...prevMessages,
                <Message key={prevMessages.length} role="user" content={userMessage} />,
              ]);
              setInput("");
              await handleSendMessage(userMessage);
            }
          }}
        >
          <input
            ref={inputRef}
            className="bg-white rounded-full px-6 py-3 w-full outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-md"
            placeholder="Type a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
