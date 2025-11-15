/** biome-ignore-all lint/suspicious/noArrayIndexKey: We don't really have any better options here, but the index shouldn't change */
/** biome-ignore-all lint/nursery/noShadow: <explanation> */
"use client";

import { AIDevtools } from "@ai-sdk-tools/devtools";
import type { UIDataTypes, UIMessage, UITools } from "ai";
import { useChat } from "ai-sdk-tools";
import { X } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { StatusMessage } from "@/components/chat/status-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [queryParam] = useQueryState("q");
  const { messages, sendMessage, status, error, stop } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    // If currently streaming or submitted, stop instead of submitting
    if (status === "streaming" || status === "submitted") {
      stop();
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage({
      text: message.text || "Sent with attachments",
      files: message.files,
    });
  };

  /** biome-ignore lint/correctness/useExhaustiveDependencies: This doesn't need to run all the time */
  useEffect(() => {
    if (messages.length === 0 && queryParam && queryParam.trim().length >= 1) {
      sendMessage({
        text: queryParam,
      });
    }
  }, [queryParam, sendMessage]);

  console.log(messages);

  return (
    <div className="relative flex size-full justify-center">
      {process.env.NODE_ENV === "development" && <AIDevtools />}
      <Button
        asChild
        className="fixed top-4 left-4 z-10"
        size="icon-lg"
        variant="outline"
      >
        <Link href="/">
          <X className="size-5" />
        </Link>
      </Button>

      <Conversation>
        <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col justify-end">
          <div className="w-full bg-linear-to-t from-[1.25rem] from-background to-transparent">
            <div className="mx-auto w-full max-w-2xl">
              <PromptInputProvider>
                <PromptInput
                  className="pointer-events-auto mx-auto mb-4 w-full"
                  globalDrop
                  multiple
                  onSubmit={handleSubmit}
                >
                  <PromptInputHeader className="p-0 has-first:p-3">
                    <PromptInputAttachments className="p-0">
                      {(attachment) => (
                        <PromptInputAttachment data={attachment} />
                      )}
                    </PromptInputAttachments>
                  </PromptInputHeader>
                  <PromptInputBody>
                    <PromptInputTextarea />
                  </PromptInputBody>
                  <PromptInputFooter>
                    <PromptInputTools>
                      <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger />
                        <PromptInputActionMenuContent>
                          <PromptInputActionAddAttachments />
                        </PromptInputActionMenuContent>
                      </PromptInputActionMenu>
                    </PromptInputTools>
                    <PromptInputSubmit
                      className="rounded-full"
                      status={status}
                    />
                  </PromptInputFooter>
                </PromptInput>
              </PromptInputProvider>
            </div>
          </div>
        </div>
        <ConversationContent className="mx-auto max-w-3xl pt-10 pb-64">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
          {status === "error" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {error?.name ?? "An unknown error occurred"}
                </CardTitle>
                <CardDescription>
                  {error?.message}
                  <br />
                  {error?.cause as string | undefined}
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </ConversationContent>
      </Conversation>
    </div>
  );
}

function ChatMessage({
  msg,
}: {
  msg: UIMessage<unknown, UIDataTypes, UITools>;
}) {
  return (
    <Message className="group items-center" from={msg.role}>
      <MessageContent
        className={cn(
          "space-y-2 overflow-visible",
          msg.role === "assistant" && "w-full"
        )}
      >
        {msg.parts
          .filter((p) => p.type === "text")
          .map((part, i) => (
            <MessageResponse key={i}>{part.text}</MessageResponse>
          ))}
        <StatusMessage parts={msg.parts} />
      </MessageContent>
    </Message>
  );
}
