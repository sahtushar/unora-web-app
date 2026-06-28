import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {Compass, Link2, Orbit, Sparkles} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";

import {
  ActiveConnectionHint,
  Button,
  DismissibleInlineNotice,
  EmptyState,
  ScreenSkeleton,
} from "@/components/ui";
import {useActiveConnection} from "@/hooks/useActiveConnection";
import {useDiscoverQueue} from "@/hooks/useDiscoverQueue";
import {cn} from "@/lib/cn";
import type {DiscoverLocationState} from "@/lib/discoverNavigationState";
import {routes} from "@/lib/routes";
import type {DiscoverProfile} from "@/types";

import {strings} from "../strings";
import {ProfileCard} from "./components/ProfileCard";
import {SimilarInterestsStrip} from "./components/SimilarInterestsStrip";
import {detailedProfileSectionDividerClass} from "./detailedProfile/DetailedProfileShared";

function DiscoverMainHeading({
  icon: Icon,
  children,
}: {
  children: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-app-2">
      <Icon
        className="h-7 w-7 shrink-0 text-unora-brand-strong sm:h-8 sm:w-8"
        strokeWidth={1.5}
        aria-hidden
      />
      <h1 className="font-display text-[1.85rem] font-semibold leading-tight tracking-tight text-unora-ink sm:text-[2rem]">
        {children}
      </h1>
    </div>
  );
}

function DiscoverSectionHeading({
  icon: Icon,
  children,
  className,
}: {
  children: ReactNode;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-app-2", className)}>
      <Icon
        className="h-5 w-5 shrink-0 text-unora-brand-strong"
        strokeWidth={1.75}
        aria-hidden
      />
      <h2 className="text-[0.95rem] font-semibold tracking-tight text-unora-ink">
        {children}
      </h2>
    </div>
  );
}

function DiscoverEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c4.97 0 9 3.13 9 7 0 2.6-1.7 4.9-4.3 6.2L12 21l-4.7-4.8C4.7 14.9 3 12.6 3 10c0-3.87 4.03-7 9-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 10h7M12 7.5v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconInfo({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 10v6M12 7h.01"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DiscoverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queue = useDiscoverQueue();
  const connection = useActiveConnection();
  const [localQueue, setLocalQueue] = useState<string[] | null>(null);
  const [likeBlockOpen, setLikeBlockOpen] = useState(false);
  /** Bumps on each blocked like so the notice remounts (replay border animation) and scroll runs. */
  const [likeBlockCue, setLikeBlockCue] = useState(0);
  const likeBlockNoticeRef = useRef<HTMLOutputElement>(null);
  const endSentinelRef = useRef<HTMLDivElement>(null);
  const [endOfFeedVisible, setEndOfFeedVisible] = useState(false);
  const d = strings.discover;

  const scrollEndTagline = useMemo(() => {
    const lines = strings.brand.taglines;
    const i = Math.floor(Math.random() * lines.length);
    return lines[i] ?? lines[0] ?? "";
  }, []);

  const profiles = useMemo(() => queue.data ?? [], [queue.data]);
  const filtered = useMemo(() => {
    if (!localQueue) {
      return profiles;
    }
    return profiles.filter((p) => localQueue.includes(p.id));
  }, [profiles, localQueue]);

  const current = filtered[0];
  const similar = useMemo(() => filtered.slice(1, 6), [filtered]);
  const hasActive = Boolean(connection.data);

  const onPass = useCallback(
    (id: string) => {
      setLocalQueue((prev) => {
        const base = prev ?? profiles.map((p) => p.id);
        return base.filter((x) => x !== id);
      });
    },
    [profiles]
  );

  const onLike = useCallback(
    (id: string) => {
      if (hasActive) {
        setLikeBlockOpen(true);
        setLikeBlockCue((n) => n + 1);
        return false;
      }
      setLikeBlockOpen(false);
      setLocalQueue((prev) => {
        const base = prev ?? profiles.map((p) => p.id);
        return base.filter((x) => x !== id);
      });
    },
    [hasActive, profiles]
  );

  const onSelectSimilarProfile = useCallback(
    (profile: DiscoverProfile) => {
      setLocalQueue((prev) => {
        const base = prev ?? profiles.map((p) => p.id);
        const rest = base.filter((id) => id !== profile.id);
        return [profile.id, ...rest];
      });
    },
    [profiles]
  );

  const noopPass = useCallback((_id: string) => {}, []);
  const noopLike = useCallback((_id: string) => {}, []);

  useEffect(() => {
    if (!hasActive) {
      setLikeBlockOpen(false);
    }
  }, [hasActive]);

  useEffect(() => {
    const intent = (location.state as DiscoverLocationState | null)
      ?.discoverIntent;
    if (!intent) {
      return;
    }

    if (intent.intent === "pass") {
      setLocalQueue((prev) => {
        const base = prev ?? profiles.map((p) => p.id);
        return base.filter((x) => x !== intent.profileId);
      });
    } else if (hasActive) {
      setLikeBlockOpen(true);
      setLikeBlockCue((n) => n + 1);
    } else {
      setLocalQueue((prev) => {
        const base = prev ?? profiles.map((p) => p.id);
        return base.filter((x) => x !== intent.profileId);
      });
    }

    navigate(".", {replace: true, state: {}});
  }, [location.state, navigate, hasActive, profiles]);

  useEffect(() => {
    if (likeBlockCue === 0) {
      return;
    }
    let alive = true;
    const id = globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(() => {
        if (!alive) {
          return;
        }
        likeBlockNoticeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      });
    });
    return () => {
      alive = false;
      globalThis.cancelAnimationFrame(id);
    };
  }, [likeBlockCue]);

  useEffect(() => {
    const node = endSentinelRef.current;
    if (!node) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }
        setEndOfFeedVisible(entry.isIntersecting);
      },
      {
        root: null,
        /** Fire slightly above the physical bottom so copy clears the tab bar. */
        rootMargin: "0px 0px 96px 0px",
        threshold: 0,
      }
    );
    io.observe(node);
    return () => {
      io.disconnect();
    };
  }, [similar.length, hasActive, current?.id, likeBlockOpen]);

  if (queue.isLoading) {
    return <ScreenSkeleton variant="discover" />;
  }

  if (!current) {
    return (
      <div className="space-y-app-6 py-app-2">
        <div className="flex items-start justify-between gap-app-3">
          <DiscoverMainHeading icon={Compass}>{d.title}</DiscoverMainHeading>
        </div>
        <EmptyState
          icon={<DiscoverEmptyIcon />}
          title={d.empty.title}
          description={d.empty.description}
          footnote={d.empty.footnote}
          actions={
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => navigate(routes.connection)}>
              {d.empty.ctaConnection}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-app-2">
      <header className="flex items-start justify-between gap-app-4">
        <div className="min-w-0 space-y-app-1">
          <DiscoverMainHeading icon={Compass}>{d.title}</DiscoverMainHeading>
        </div>
      </header>

      {connection.data ? (
        <div className="mt-app-6 flex flex-col gap-app-3">
          <DiscoverSectionHeading icon={Link2}>
            {d.activeConnectionHeading}
          </DiscoverSectionHeading>
          <ActiveConnectionHint />
          <ProfileCard
            key={connection.data.peer.id}
            hideDiscoverActions
            onLike={noopLike}
            onPass={noopPass}
            profile={connection.data.peer}
          />
        </div>
      ) : null}

      <section
        className={cn(
          "space-y-app-3",
          hasActive ? detailedProfileSectionDividerClass : "mt-app-6"
        )}>
        <DiscoverSectionHeading icon={Sparkles}>
          {d.recommendedHeading}
        </DiscoverSectionHeading>
        {likeBlockOpen && hasActive ? (
          <DismissibleInlineNotice
            key={likeBlockCue}
            ref={likeBlockNoticeRef}
            title={d.likeBlockedTitle}
            description={d.likeBlockedBody}
            dismissLabel={d.likeBlockedDismiss}
            onDismiss={() => setLikeBlockOpen(false)}
          />
        ) : null}
        <ProfileCard
          key={current.id}
          profile={current}
          onLike={onLike}
          onPass={onPass}
        />
        <div className="flex items-start gap-app-2 text-xs leading-relaxed text-unora-mist">
          <IconInfo className="mt-0.5 shrink-0 text-unora-mist" />
          <span>{d.recommendationNote}</span>
        </div>
      </section>

      {similar.length > 0 && (
        <section
          className={cn("space-y-app-3", detailedProfileSectionDividerClass)}>
          <DiscoverSectionHeading icon={Orbit}>
            {d.similarInterestsHeading}
          </DiscoverSectionHeading>
          <SimilarInterestsStrip
            profiles={similar}
            onSelectProfile={onSelectSimilarProfile}
          />
        </section>
      )}

      {endOfFeedVisible ? (
        <p
          aria-live="polite"
          className="mt-app-6 max-w-md px-app-2 text-center font-display text-sm font-medium leading-relaxed tracking-tight text-unora-mist opacity-30">
          {scrollEndTagline}
        </p>
      ) : null}
      <div ref={endSentinelRef} className="h-px w-full shrink-0" aria-hidden />
    </div>
  );
}
