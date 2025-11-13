import { readdir, readFile, writeFile } from "node:fs/promises";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import z from "zod";

const files = await readdir("./public/documents");

const resultPromises = files.map(async (filename) => {
  const file = await readFile(`./public/documents/${filename}`);
  const res = await generateObject({
    model: openai("gpt-5-mini"),
    providerOptions: {
      openai: { strictJsonSchema: true, reasoningEffort: "low" },
    },
    system:
      "Summarize the document in the perscribed JSON format. The short title should just be the name of the court case or the document. Include the year, and no other information. The short summary should be just 1-2 sentences, and key points should be bullet points (about 3-5).",
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: file.buffer, mediaType: "application/pdf" },
        ],
      },
    ],
    schema: z.object({
      shortTitle: z.string(),
      type: z.enum(["icj judgement", "other court case", "other document"]),
      shortSummary: z.string(),
      detailedSummary: z.string(),
      keyPoints: z.array(z.string()),
    }),
  });
  const summaryData = res.object;
  return { filename, ...summaryData };
});

const results = await Promise.all(resultPromises);

await writeFile("./library.json", JSON.stringify(results));
