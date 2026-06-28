import {memo} from "react";

import type {ChatMessage} from "@/types";

import {MessageBubble} from "./MessageBubble";

export interface MessageListProps {
  messages: ChatMessage[];
  selfId: string;
}

export const MessageList = memo(function MessageList({
  messages,
  selfId,
}: MessageListProps) {
  return (
    <div className="space-y-app-3" role="log" aria-live="polite">
      {messages.map((m) => (
        <MessageBubble key={m.id} mine={m.authorId === selfId}>
          {m.body}
        </MessageBubble>
      ))}
    </div>
  );
});
