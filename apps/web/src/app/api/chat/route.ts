import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  type ModelMessage,
  streamText,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  const { messages, filename }: { messages: UIMessage[]; filename?: string } =
    await req.json();

  const caseAtBarContext = {
    role: "user",
    content: [
      {
        type: "text",
        text: "This case is being considered in from of the International Court of Justice at Model UN. Answer questions with regard to this case.",
      },
      {
        type: "file",
        data: new URL("https://mun.maxw.ai/documents/Ecuador v Mexico.pdf"),
        mediaType: "application/pdf",
      },
    ],
  } as ModelMessage;
  const selectedDocumentContext = filename
    ? ({
        role: "user",
        content: [
          { type: "text", text: "I'm currently looking at this document." },
          {
            type: "file",
            data: new URL(`https://mun.maxw.ai/documents/${filename}`),
            mediaType: "application/pdf",
          },
        ],
      } as ModelMessage)
    : null;

  const result = streamText({
    model: openai("gpt-5-mini"),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        verbosity: "low",
      },
    },
    tools: {
      file_search: openai.tools.fileSearch({
        vectorStoreIds: [process.env.OPENAI_VECTOR_STORE ?? ""],
        ranking: {
          ranker: "auto",
          scoreThreshold: 0.5,
        },
      }),
    },
    system: "Try to respond in 1-5 sentences. Use markdown for formatting.",
    messages: selectedDocumentContext
      ? [
          caseAtBarContext,
          selectedDocumentContext,
          ...convertToModelMessages(messages),
        ]
      : [caseAtBarContext, ...convertToModelMessages(messages)],
  });

  return result.toUIMessageStreamResponse();
}
