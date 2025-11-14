import { writeFile } from "node:fs/promises";
import documentLibrary from "./library.json";

const result = documentLibrary.map(
  (doc) => `## ${doc.shortTitle} (${doc.date})
### Overview
${doc.shortSummary}
### Key Points
${doc.keyPoints.map((kp) => `- ${kp}\n`).join("")}\n`
);

writeFile("doc.md", result.join("").trim());
