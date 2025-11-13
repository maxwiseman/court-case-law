"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });

export async function searchDocuments(query: string) {
  const results = await openai.vectorStores.search(
    process.env.OPENAI_VECTOR_STORE ?? "",
    {
      query,
    }
  );

  return results.data;
}
