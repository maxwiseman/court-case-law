import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, filename }: { messages: UIMessage[]; filename?: string } =
    await req.json();

  const result = streamText({
    model: openai("gpt-5-mini"),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        verbosity: "low",
      },
    },
    tools: {
      fileSearch: openai.tools.fileSearch({
        vectorStoreIds: [process.env.OPENAI_VECTOR_STORE ?? ""],
      }),
    },
    system: "Respond in 1-5 sentences",
    messages: filename ? [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: new URL(`https://mun.maxw.ai/documents/${filename}`),
            mediaType: "application/pdf",
          },
        ],
      },
      ...convertToModelMessages(messages),
    ] : convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
