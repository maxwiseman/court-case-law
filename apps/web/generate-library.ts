import { readdir, readFile, writeFile } from "node:fs/promises";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import z from "zod";

const files = (await readdir("./public/documents")).filter(i => i !== "Ecuador v Mexico.pdf" && i.endsWith(".pdf"));
const caseFile = await readFile("./public/documents/Ecuador v Mexico.pdf")

const resultPromises = files.map(async (filename) => {
  const file = await readFile(`./public/documents/${filename}`);
  const res = await generateObject({
    model: openai("gpt-5-mini"),
    providerOptions: {
      openai: { strictJsonSchema: true, reasoningEffort: "low", verbosity: "low" },
    },
    system:
      `Summarize ${filename.replace(".pdf", "")}, in relation to the case at bar (Ecuador v Mexico), in the perscribed JSON format. Your summary should explain how the given case could be used to argue the case at bar. The short title should just be the name of the court case or the document. Use title case for this and don't include dates here unless it's part of the title (ex. \"War of 1812\" should obviously still have the year). The date field should be provided as just years and can be a range where applicable. The short summary should be just 1-2 sentences, and key points should be bullet points (about 3-5, don't include the bullet point character).`,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "This case is being considered in from of the International Court of Justice at Model UN. Respond with regard to this case." },
          {
            type: "file",
            data: caseFile.buffer,
            mediaType: "application/pdf",
          },
        ],
      },
      {
        role: "user",
        content: [
          { type: "file", data: file.buffer, mediaType: "application/pdf" },
        ],
      },
    ],
    schema: z.object({
      shortTitle: z.string(),
      date: z.string(),
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
