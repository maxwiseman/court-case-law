import { useChatStatus } from "@ai-sdk-tools/store";
import type { UIDataTypes, UIMessage, UITools } from "ai";
import { AnimatedStatus } from "./animated-status";
import { toolStatus } from "./tool-status";

export function StatusMessage({
  parts,
}: {
  parts: UIMessage<unknown, UIDataTypes, UITools>["parts"];
}) {
  const status = useChatStatus();
  const ignoredParts = ["data-chat-title"];
  const filteredParts = parts.filter((p) => !ignoredParts.includes(p.type));
  const lastPart = filteredParts.at(-1);
  const latestToolStatus = lastPart?.type.startsWith("tool-")
    ? toolStatus[lastPart.type.replace("tool-", "")]
    : undefined;
  if (status !== "streaming") {
    return null;
  }

  if (
    !lastPart ||
    lastPart.type.startsWith("data-") ||
    lastPart.type === "reasoning"
  ) {
    return <AnimatedStatus className="text-sm" text="Thinking..." />;
  }

  if (lastPart.type.startsWith("tool-") && latestToolStatus) {
    return (
      <AnimatedStatus
        {...latestToolStatus}
        className="text-sm"
        text={`${latestToolStatus.text}...`}
      />
    );
  }
}
