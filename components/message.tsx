"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-black">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-black dark:text-black flex flex-col gap-4">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-black">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-black dark:text-black flex flex-col gap-4">
          {typeof content === "string" ? (
            <div className="text-sm"><Markdown>{content}</Markdown></div>
          ) : (
            <div className="flex flex-col gap-4 w-full">{content}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const MessageWithComponent = ({
  content,
  message
}: {
  content: ReactNode;
  message: string;
}) => {
  return (
    <motion.div
      className="flex flex-col gap-3 w-full md:max-w-[600px] p-4 border rounded-lg shadow-sm bg-white"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-black">
          <BotIcon />
      </div>
      
      <div className="text-black dark:text-black">
        <div className="text-sm mb-2 p-3 bg-gray-50 rounded-lg shadow-inner">
          <Markdown>{message}</Markdown>
        </div>
        <div className="pt-2">
          {content}
        </div>
      </div>
    </motion.div>
  );
};

// if message is toxic use this. has a Caution / warning colors and a different icon
export const ToxicMessage = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-red-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-orange-800 dark:text-orange-800 flex flex-col gap-4">
          ⚠️ {content}
        </div>
      </div>
    </motion.div>
  );
};
