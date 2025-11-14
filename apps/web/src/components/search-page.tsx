"use client";

import { ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useStore } from "zustand";
import documentLibrary from "@/../library.json";
import ChatSidebar from "@/components/chat-sidebar";
import DocumentList from "@/components/document-list";
import PDFViewer from "@/components/pdf-viewer";
import { recentSearchStore } from "@/lib/recent-search-store";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export function SearchPage() {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const [inputValue, setInputValue] = useState(query);
  const addQuery = useStore(recentSearchStore, (i) => i.addQuery);
  const [selectedDocumentId, setSelectedDocumentId] =
    useQueryState("selectedDoc");
  const selectedDocument = documentLibrary.find(
    (item) => item.filename === selectedDocumentId
  );

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    setQuery(inputValue);
    if (inputValue.trim().length > 5) addQuery(inputValue);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Search & Document List (visible on search and viewing states) */}
      {selectedDocumentId && (
        <div className="flex w-80 flex-col border-border border-r bg-card">
          {/* Compact Search Header */}
          <div className="flex gap-1 border-border border-b p-3">
            <Button
              className="h-auto py-2 text-muted-foreground"
              onClick={() => setSelectedDocumentId(null)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ArrowLeft className="h-4 w-4" />
              {/*Back*/}
            </Button>
            <InputGroup className="shadow-none">
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                autoFocus
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search..."
                value={inputValue}
              />
            </InputGroup>
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto">
            <DocumentList searchQuery={query} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {selectedDocument ? (
          // Split view: PDF + Chat
          <div className="flex flex-1 gap-0">
            {/* PDF Viewer & Summary */}
            <div className="flex flex-1 flex-col border-border border-r">
              <PDFViewer document={selectedDocument} />
            </div>

            {/* Chat Sidebar */}
            <div className="flex w-80 flex-col border-border border-l-0 bg-card">
              <ChatSidebar documentId={selectedDocument.filename} />
            </div>
          </div>
        ) : (
          // Full-screen search results
          <>
            {/* Header */}
            <div className="border-border border-b bg-card p-4">
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  className="size-11 rounded-lg p-1.5 transition-colors hover:bg-muted"
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Link href="/">
                    <X className="size-5 text-muted-foreground" />
                  </Link>
                </Button>
                <InputGroup className="h-auto py-1 shadow-none">
                  <InputGroupAddon>
                    <Search className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    autoFocus
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search cases, statutes, documents..."
                    value={inputValue}
                  />
                </InputGroup>
              </div>
            </div>

            {/* Full Results List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl">
                <p className="mb-4 text-muted-foreground text-sm">
                  Results for{" "}
                  <span className="font-semibold text-foreground">
                    "{query}"
                  </span>
                </p>
                <DocumentList fullscreen={true} searchQuery={query} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
