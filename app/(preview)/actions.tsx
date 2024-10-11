import { Message, TextStreamMessage, ToxicMessage, MessageWithComponent } from "@/components/message";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateId, generateText, tool } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import EventList from "@/components/events";
import ElectionResultsChart from "@/components/results";
import { ProsConsHighlight } from "@/components/highlights";
import { Markdown } from "@/components/markdown";
import VoteToSeatScoreboard from "@/components/vote-seats";

const electionData = [
  {
    name: "ANURA KUMARA DISSANAYAKE",
    votes: 5634915,
    color: "#C41E3A",
    party: "NPP",
    acronym: "ANURA KUMARA DISSANAYAKE",
  },
  {
    name: "SAJITH PREMADASA",
    votes: 4363035,
    color: "#4CAF50",
    party: "SJB",
    acronym: "SAJITH PREMADASA",
  },
  {
    name: "RANIL WICKREMESINGHE",
    votes: 2299767,
    color: "#FFD700",
    party: "UNP",
    acronym: "RW",
  },
  {
    name: "NAMAL RAJAPAKSHA",
    votes: 342781,
    color: "#8B4513",
    party: "SLPP",
    acronym: "NR",
  },
];

const events = [
  {
    id: "1",
    title: "Presidential Election Day",
    date: "September 21, 2024",
    description: "Day to vote for the next president.",
  },
  {
    id: "2",
    title: "Parliamentary Election Day announced",
    date: "Octomber 7, 2024",
    description: "Parliamentary Election Day has been announced",
  },
  {
    id: "3",
    title: "Parliamentary Election Day",
    date: "November 14, 2024",
    description: "Vote for the parliament members.",
  },
];

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");
  const messagesClone = getMutableAIState<typeof AI>("messages");

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;


  messagesClone.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `\
      You are an intelligent political information agent for the 2024 Sri Lankan presidential elections. Your primary function is to gather and provide accurate, up-to-date information to users. Follow these guidelines:

      Information Gathering:
      1. Always check the chat history first. If the answer is already available, respond with: CHECK_HISTORY, no need to use any tools.
      2. Prioritize the fetchDataFromRAG tool only to answer questions about candidates manifesto / policy infomation, you can further improve this by doing a web search.
      3. Use the fetchDataFromWeb tool for any information related to the elections or politics.

      Response Protocol:
      - If detecting toxic speech or gibberish, respond with: NO_RESULT
      - If the question is not toxic make sure to use tools and provide comprehensive answer

      Information Scope:
      - Provide information on: candidates, voting process, election dates, political parties, campaign issues, and other directly related topics.
      - Do not share personal information or opinions.
      - Avoid engaging in arguments or debates.

      Additional Guidelines:
      - If uncertain about information, acknowledge the limitation and suggest reliable sources for further research.
      - Offer context and background when it enhances understanding of the topic.
      - Be prepared to explain complex political concepts in simpler terms if requested.
      - Your reply should be comprehensive and address the user's query effectively, Do not drop or simplify any of the information provided.

      Remember, your goal is to be a comprehensive and reliable source of information for the 2024 Sri Lankan presidential elections, using all available tools to provide the most accurate and relevant responses.\ 
      collect all possible information using several tools.
      `,
    messages: messagesClone.get() as CoreMessage[],
    tools: {
        fetchDataFromRAG: tool({
          description: "Fetch data from the RAG database related to candidates policies and manifesto",
          parameters: z.object({
            query: z
              .string()
              .describe(
                "Well designed query to fetch data from the RAG database"
              ),
          }),
          execute: async ({ query }) => {
            const response = await fetch(
              `http://127.0.0.1:8000/rag?input=${encodeURIComponent(query)}`
            );
            return await response.json().then((data) => data.output);
          },
        }),
        fetchDataFromWeb: tool({
          description:
            "fetch realtime and up to date news and web data related to srilankan politics from verified sources",
          parameters: z.object({
            query: z
              .string()
              .describe("Well designed query to fetch data from the web"),
          }),
          execute: async ({ query }) => {
            const response = await fetch(
              `http://127.0.0.1:8000/search?input=${encodeURIComponent(query)}`
            );
            return await response.json().then((data) => data.output);
          },
        }),
    },
    maxSteps: 5,
  });

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: `retrieved infomation: ${text} \n\n user query: ${message}` },
  ]);

  const { value: stream } = await streamUI({
    model: openai("gpt-4o"),
    system: `\
  You are an expert political assistant specializing in the 2024 Sri Lankan presidential elections. Your primary role is to provide accurate, impartial, and comprehensive information to users based on retrieved documents and real-time data. Adhere to the following guidelines:

  1. Information Sources:
    - Prioritize information from the provided retrieved documents, which come from a curated database, and real-time news data from trusted sources.
    - Use your built-in knowledge to provide context or fill gaps, but always prioritize the retrieved information.
    - Be aware of the chat history and avoid repeating information already shared, you can mention the previose conversation but don't repeat.

  2. Response Formulation:
    - Be aware of the user sentiment.
    - reflect on the chat history to build up context when possible.
    - Synthesize information from multiple sources to create cohesive, well-rounded answers.
    - Clearly distinguish between historical facts, current events, and projections/predictions.
    - When presenting conflicting information, acknowledge the discrepancies and explain potential reasons for them.

  3. Scope of Information:
    - Focus on topics directly related to the 2024 Sri Lankan presidential elections, including:
      * Candidates and their platforms
      * Election process and voting procedures
      * Key dates and deadlines
      * Major campaign issues and debates
      * Political parties and coalitions
      * Electoral system and any recent changes
      * Demographic and regional voting patterns
      * The policies and promises of the candidates
      * The manifestos of the political parties

  4. Tone and Neutrality:
    - Maintain a neutral, professional tone at all times.
    - Present information without bias, avoiding language that could be perceived as favoring any candidate or party.
    - When discussing controversial topics, present multiple perspectives fairly.

  5. Handling Queries:
    - If a question is unclear, politely ask for clarification before providing an answer.
    - For questions outside the scope of the 2024 Sri Lankan presidential elections, respectfully redirect the user and explain your area of expertise.
    - If the retrieved information is insufficient to answer a question fully, acknowledge this limitation and provide the best possible answer based on available data.

  6. Data Integrity:
    - Do not invent or assume information not present in the retrieved documents or your training data.
    - If asked about very recent events, clarify the timestamp of your most recent data.
    - When presenting statistics or quotes, cite the source if available.

  7. User Interaction:
    - Respond concisely to direct questions, but offer to provide more detailed information if the user desires.
    - If a user expresses political opinions, acknowledge them respectfully without agreeing or disagreeing.
    - Be prepared to explain complex political concepts or local Sri Lankan political context if needed.
    - When asked about a side by side comparison or a pros & cons analysis, use the tools.
    - for pros & cons analysis use the viewProsCons tool.
    - for side by side comparison use the viewSideBySideComparison tool.

  8. Ethical Considerations:
    - Do not share personal information about candidates, voters, or any individuals.
    - Refrain from making predictions about election outcomes.
    - If asked about voter fraud or election integrity, provide factual information about electoral safeguards without speculating.

  ## meta data for topic
  - 2024 Sri Lankan presidential elections were held on September 21, 2024. 
  - The winner was Anura Kumara Dissanayake, who received 5634915 votes.
  - a second round of vote counting was held for the first time in Sri Lanka's history.
  - The upcoming parliamentary elections are scheduled for November 14, 2024.

  Remember, your goal is to empower users with accurate, up-to-date information about the 2024 Sri Lankan presidential elections, helping them make informed decisions without influencing their political views.\
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content: content },
        ]);
        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      viewProsCons: {
        description:
          "used to get the pros and cons of a political candidate's manifesto or policy on a specific topic",
        parameters: z.object({
          candidate: z.string().describe("The name of the candidate"),
          topic: z.string().describe("The topic to view the pros and cons of"),
          pros: z.array(z.string()).describe("The pros of the topic"),
          cons: z.array(z.string()).describe("The cons of the topic"),
        }),
        generate: async function* ({ candidate, topic, pros, cons }) {
          const toolCallId = generateId();
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewProsCons",
                  args: { candidate, topic, pros, cons },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewProsCons",
                  toolCallId,
                  result: `The pros and cons of ${topic} for ${candidate} are currently displayed on the screen`,
                },
              ],
            },
          ]);

          return (
            <ProsConsHighlight
              topic={`${candidate} - ${topic}`}
              pros={pros}
              cons={cons}
            />
          );
        },
      },
      viewSideBySideComparison: {
        description:
          "used for providing a side by side comparison of something according to user request.",
        parameters: z.object({
          analysis: z.string().describe("a markdown table consisting of a point wise analysis of the candidates."),
          message: z.string().describe("provide an indepth analysis of the candidates based on the comparison points in a well formated answer."),
        }),
        generate: async function* ({
          analysis,
          message,
        }) {
          const toolCallId = generateId();
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewSideBySideComparison",
                  args: { analysis },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewSideBySideComparison",
                  toolCallId,
                  result: 'The side by side comparison',
                },
              ],
            },
          ]);

          return (
            <MessageWithComponent
              content={<Markdown>{analysis}</Markdown>}
              message={message}
            />
          );
        },
      },
      viewEvents: {
        description: "view upcoming and finished events related to election",
        parameters: z.object({
          message: z.string().describe("provide aditional informations to the user based on the retrieved information.")
        }),
        generate: async function* ({message}) {
          const toolCallId = generateId();
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewEvents",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewEvents",
                  toolCallId,
                  result: `The upcoming events are currently displayed on the screen`,
                },
              ],
            },
          ]);

          return (
            <MessageWithComponent
              content={<EventList message={message} events={events} />}
              message={"Here are the events related to Srilakan elections 2024"}
            />  
          );
        },
      },
      viewResults: {
        description: "Used to graphically view the final election results, use when ever latest news regarding presidential election is asked or any other similar sitautions",
        parameters: z.object({
          message: z.string().describe("reply to the user query in markdown. use the retrived information to provide a well formated answer to the user query"),
        }),
        generate: async function* ({
          message,
        }) {
          const toolCallId = generateId();
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewResults",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewResults",
                  toolCallId,
                  result: `The election results are currently displayed on the screen`,
                },
              ],
            },
          ]);

          return (
            <MessageWithComponent
              content={<ElectionResultsChart data={electionData} />}
              message={message}
            />
          );
        },
      },
      guardRails: {
        description:
          "Used when toxic speech / Gibberish / Hate Speech / self harm or any other ethical concern or degratory speech is detected",
        parameters: z.object({
          message: z
            .string()
            .describe(
              "The reply message when toxic speech is detected, provide a warning message to the user"
            ),
        }),
        generate: async function* ({ message }) {
          const toolCallId = generateId();
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "guardRails",
                  args: { message },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "guardRails",
                  toolCallId,
                  result: `The toxic speech has been detected and the user has been warned`,
                },
              ],
            },
          ]);

          return <ToxicMessage role="assistant" content={message} />;
        },
      },
      viewParliamentSeats: {
        description: "visualise the seats in the parliament, predicted based on the votes.",
        parameters: z.object({
          message: z.string().describe("reply to the user query in markdown. reply to the user query based on retrieved information, to provide most sutiable answer to the user query"),
        }),
        generate: async function* ({ message }) {
          const toolCallId = generateId();
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewParliamentSeats",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewParliamentSeats",
                  toolCallId,
                  result: `The parliament seats are currently displayed on the screen`,
                },
              ],
            },
          ]);

          return (
            <MessageWithComponent
              content={<VoteToSeatScoreboard />}
              message={message}
            />
          );
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});
