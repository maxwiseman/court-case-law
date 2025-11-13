"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { SearchPage } from "@/components/search-page";

export default function Home() {
  const [appState, setAppState] = useState<"landing" | "search" | "viewing">(
    "landing"
  );

  const handleStartSearch = () => {
    setAppState("search");
  };

  if (appState === "landing") {
    return <LandingPage onStartSearch={handleStartSearch} />;
  }

  return <SearchPage />;
}
