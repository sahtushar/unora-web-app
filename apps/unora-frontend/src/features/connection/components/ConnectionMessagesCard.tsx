import {Card} from "@/components/ui";
import {cn} from "@/lib/cn";
import type {ChatMessage} from "@/types";

import {MessageList} from "./MessageList";

export function ConnectionMessagesCard({
  messagesHeading,
  messages,
  selfId,
  footnote,
  className,
}: {
  footnote: string;
  messages: ChatMessage[];
  messagesHeading: string;
  selfId: string;
  className?: string;
}) {
  return (
    <Card
      padded={false}
      className={cn(
        "flex min-h-[280px] flex-1 flex-col border-unora-line/90 shadow-soft transition-shadow duration-300 hover:shadow-card",
        className
      )}>
      <div className="border-b border-unora-line/70 px-app-4 py-app-3 sm:px-app-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-unora-mist">
          {messagesHeading}
        </p>
      </div>
      <div className="flex flex-1 flex-col space-y-app-4 overflow-y-auto p-app-4 sm:p-app-5">
        <MessageList messages={messages} selfId={selfId} />
        <p className="text-center text-[11px] leading-relaxed text-unora-mist">
          {footnote}
        </p>
      </div>
    </Card>
  );
}
