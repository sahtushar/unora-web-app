import {Avatar, Badge, Button, Card} from "@/components/ui";
import {cn} from "@/lib/cn";
import type {Photo} from "@/types";

export function ConnectionPeerSummaryCard({
  displayName,
  age,
  headline,
  photo,
  badgeLabel,
  detailsLabel,
  detailsDisabled = true,
  onDetailsClick,
  className,
}: {
  age: number;
  badgeLabel: string;
  detailsLabel: string;
  displayName: string;
  headline: string;
  photo: Photo | undefined;
  className?: string;
  detailsDisabled?: boolean;
  onDetailsClick?: () => void;
}) {
  return (
    <Card
      padded
      className={cn(
        "flex items-center gap-app-3 border-unora-line/90 transition-shadow duration-300 hover:shadow-card sm:gap-app-4",
        className
      )}>
      <Avatar
        src={photo?.url}
        alt={photo?.alt ?? displayName}
        size="lg"
        fallback={displayName}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-app-2">
          <p className="truncate font-display text-lg font-semibold tracking-tight text-unora-ink">
            {displayName}, {age}
          </p>
          <Badge tone="ink">{badgeLabel}</Badge>
        </div>
        <p className="mt-0.5 truncate text-sm leading-relaxed text-unora-mist">
          {headline}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 text-unora-mist hover:text-unora-ink"
        disabled={detailsDisabled}
        onClick={onDetailsClick}>
        {detailsLabel}
      </Button>
    </Card>
  );
}
