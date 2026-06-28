import {cn} from "@/lib/cn";

export function MessageBubble({
  mine,
  children,
  className,
}: {
  children: string;
  mine: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("flex", mine ? "justify-end" : "justify-start", className)}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-app-3 py-2.5 text-sm leading-relaxed shadow-sm",
          mine
            ? "rounded-br-md bg-unora-ink text-unora-snow"
            : "rounded-bl-md bg-white/95 text-unora-ink ring-1 ring-unora-line/80"
        )}>
        {children}
      </div>
    </div>
  );
}
