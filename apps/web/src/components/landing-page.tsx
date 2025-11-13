"use client";

import { MessageSquare, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

type LandingPageProps = {
  onStartSearch: () => void;
};

export function LandingPage({ onStartSearch }: LandingPageProps) {
  const [mode, setMode] = useState("search"); // "search" or "ask"
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (input.trim() && mode === "search") {
    //   onStartSearch(input);
    // }
    redirect(`/search?q=${input}`);
    // "Ask" mode will be handled later
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 font-bold text-4xl text-foreground">
            Case Law Search
          </h1>
          <p className="text-lg text-muted-foreground">
            Find the evidence you need in real time
          </p>
        </div>

        {/* Search Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Mode Selector */}
          <div className="mb-6 flex gap-2">
            <Button
              className="h-auto flex-1 py-3 text-base"
              onClick={() => setMode("search")}
              type="button"
              variant={mode === "search" ? "default" : "secondary"}
            >
              <Search className="h-5 w-5" />
              Search
            </Button>
            <Button
              className="h-auto flex-1 py-3 text-base"
              onClick={() => setMode("ask")}
              type="button"
              variant={mode === "ask" ? "default" : "secondary"}
            >
              <MessageSquare className="h-5 w-5" />
              Ask
            </Button>
          </div>
          {/* Input Area */}
          <div className="relative">
            <input
              autoFocus
              className="w-full rounded-lg border border-input bg-background px-6 py-4 text-foreground text-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "search"
                  ? "Search for cases, statutes, or legal documents..."
                  : "Ask a legal question..."
              }
              type="text"
              value={input}
            />
            {mode === "search" && (
              <button
                className="-translate-y-1/2 absolute top-1/2 right-2 p-2 text-muted-foreground transition-colors hover:text-foreground"
                type="submit"
              >
                <Search className="h-6 w-6" />
              </button>
            )}
          </div>
        </form>

        {/* Recent/Suggested */}
        <div className="mt-8 border-border border-t pt-8">
          <p className="mb-3 font-medium text-muted-foreground text-sm">
            Recent Searches
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {[
              "Marbury v. Madison",
              "UN Charter Article 51",
              "Geneva Convention IV",
            ].map((item) => (
              <Button
                // className="rounded-lg bg-muted/50 px-4 py-3 text-left text-foreground text-sm transition-colors hover:bg-muted"
                className="h-auto justify-start border py-3 shadow-none"
                key={item}
                onClick={() => onStartSearch()}
                type="button"
                variant="secondary"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
