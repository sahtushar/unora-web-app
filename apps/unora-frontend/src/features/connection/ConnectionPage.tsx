import {useMemo} from "react";

import {Link2} from "lucide-react";
import {useNavigate} from "react-router-dom";

import {Button, EmptyState, ScreenSkeleton} from "@/components/ui";
import {useSessionQuery} from "@/hooks/useSessionQuery";
import {formatRelativeDay} from "@/lib/format";
import {routes} from "@/lib/routes";

import {strings} from "../strings";
import {
  ConnectionGentleStartersSection,
  ConnectionMainHeading,
  ConnectionMessagesCard,
  ConnectionPeerSummaryCard,
} from "./components";
import {connectionSectionDividerClass} from "./connectionLayout";

const c = strings.connection;

export default function ConnectionPage() {
  const navigate = useNavigate();
  const session = useSessionQuery();

  const active = session.data?.activeConnection ?? null;
  const selfId = session.data?.currentUserId;

  const subtitle = useMemo(() => {
    if (!active) {
      return c.subtitleEmpty;
    }
    return c.subtitleActive(formatRelativeDay(active.connectedAt));
  }, [active]);

  if (session.isLoading || selfId === undefined || selfId === "") {
    return <ScreenSkeleton variant="connection" />;
  }

  if (!active) {
    return (
      <div className="space-y-app-6 py-app-2">
        <ConnectionMainHeading icon={Link2} subtitle={subtitle}>
          {c.title}
        </ConnectionMainHeading>
        <EmptyState
          className="min-h-[52vh]"
          title={c.empty.title}
          description={c.empty.description}
          footnote={c.empty.footnote}
          actions={
            <>
              <Button
                type="button"
                variant="primary"
                className="w-full sm:flex-1"
                onClick={() => navigate(routes.discover)}>
                {c.empty.browseDiscover}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:flex-1"
                onClick={() => navigate(routes.interested)}>
                {c.empty.viewInterested}
              </Button>
            </>
          }
        />
      </div>
    );
  }

  const peer = active.peer;
  const photo = peer.photos[0];

  return (
    <div className="space-y-app-6 py-app-2">
      <ConnectionMainHeading icon={Link2} subtitle={subtitle}>
        {c.title}
      </ConnectionMainHeading>

      <ConnectionPeerSummaryCard
        displayName={peer.displayName}
        age={peer.age}
        headline={peer.headline}
        photo={photo}
        badgeLabel={c.activeBadge}
        detailsLabel={c.detailsDisabled}
        detailsDisabled
      />

      <div className={connectionSectionDividerClass}>
        <ConnectionGentleStartersSection
          title={c.startersSection.title}
          description={c.startersSection.description}
          prompts={active.conversationStarters}
          promptsDisabled
        />
      </div>

      <ConnectionMessagesCard
        messagesHeading={c.messagesHeading}
        messages={active.messages}
        selfId={selfId}
        footnote={c.previewDisabledSending}
      />
    </div>
  );
}
