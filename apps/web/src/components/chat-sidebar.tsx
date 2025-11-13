"use client";

import { useChat } from "@ai-sdk-tools/store";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatSidebarProps = {
  documentId: string;
};

export default function ChatSidebar({ documentId }: ChatSidebarProps) {
  const { messages, status, sendMessage } = useChat();
  const [input, setInput] = useState("");

  function handleSubmit() {
    sendMessage({ text: input }, { body: { filename: documentId } });
    setInput("");
  }

  console.log(messages)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-[85px] flex-col justify-center border-border border-b p-4">
        <h3 className="font-semibold text-sm">Ask About This Document</h3>
        <p className="mt-1 text-muted-foreground text-xs">
          Ask anything to get quick answers
        </p>
      </div>

      {/* Messages */}
      <div className="relative size-full flex-1">
        <div className="absolute inset-0 bottom-4 space-y-3 overflow-y-auto p-4 pb-48">
          {messages.map((message) => (
            <div
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              key={message.id}
            >
              <div
                className={`max-w-xs rounded-lg p-3 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent px-0 text-foreground"
                }`}
              >
                {message.parts
                  .filter((p) => p.type === "text")
                  .map((part, i) => (
                    <Streamdown key={i}>{part.text}</Streamdown>
                  ))}
              </div>
            </div>
          ))}
          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted p-3 text-foreground text-sm">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <InputGroup className="bg-background dark:bg-neutral-800">
            <InputGroupTextarea
              disabled={status !== "ready"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter") {
                  if (e.shiftKey) {
                    return;
                  }
                  handleSubmit();
                }
              }}
              placeholder="Ask a question..."
              value={input}
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                className="rounded-full"
                size="icon-sm"
                variant="outline"
              >
                <PlusIcon />
              </InputGroupButton>
              <div className="flex-1" />
              <InputGroupButton
                className="rounded-full"
                disabled={status !== "ready" || !input.trim()}
                onClick={handleSubmit}
                size="icon-sm"
                variant="default"
              >
                <ArrowUpIcon />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
