import {useCallback, useEffect, useState} from "react";

import {cn} from "@/lib/cn";
import {searchLocationRows} from "@/services/locationAutocomplete";

import {strings} from "../strings";
import type {CitySearchRow} from "./citySearchData";
import type {ProfileCreationFieldPublicToggle} from "./profileCreation/ProfileCreationFields";

const lp = strings.profile.profileCreation.locationPicker;

const SEARCH_DEBOUNCE_MS = 280;

const searchInputClass =
  "w-full rounded-xl border border-unora-line/90 bg-white/95 px-app-3 py-2.5 text-sm text-unora-ink shadow-none outline-none transition placeholder:text-unora-mist/70 focus:border-unora-brand-strong/40 focus:ring-2 focus:ring-unora-brand/20";

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function hasMapboxToken(): boolean {
  const t = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  return typeof t === "string" && t.trim().length > 0;
}

export function CityLocationPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [rows, setRows] = useState<CitySearchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      setDebouncedQuery("");
      setRows([]);
      setSearchError(false);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const t = globalThis.setTimeout(
      () => setDebouncedQuery(query.trim()),
      SEARCH_DEBOUNCE_MS
    );
    return () => globalThis.clearTimeout(t);
  }, [open, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const q = debouncedQuery;
    if (q.length < 2) {
      setRows([]);
      setLoading(false);
      setSearchError(false);
      return;
    }

    if (!hasMapboxToken()) {
      setRows([]);
      setLoading(false);
      setSearchError(false);
      return;
    }

    const ctrl = new AbortController();
    setLoading(true);
    setSearchError(false);

    void (async () => {
      try {
        const next = await searchLocationRows(q, ctrl.signal);
        if (!ctrl.signal.aborted) {
          setRows(next);
        }
      } catch {
        if (!ctrl.signal.aborted) {
          setRows([]);
          setSearchError(true);
        }
      } finally {
        if (!ctrl.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      ctrl.abort();
    };
  }, [open, debouncedQuery]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) {
        return;
      }
      if (e.key === "Escape") {
        onClose();
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const trimmedQuery = query.trim();
  const emptyMessage = (() => {
    if (!hasMapboxToken()) {
      return lp.missingToken;
    }
    if (trimmedQuery.length < 2) {
      return lp.typeToSearch;
    }
    if (trimmedQuery !== debouncedQuery) {
      return lp.searchLoading;
    }
    if (loading) {
      return lp.searchLoading;
    }
    if (searchError) {
      return lp.searchFailed;
    }
    return lp.empty;
  })();

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-unora-snow"
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-picker-title">
      <header className="flex shrink-0 items-center gap-app-2 border-b border-unora-line/70 bg-white/95 px-app-2 py-app-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onClose}
          aria-label={lp.backAria}
          className="tap-highlight-none inline-flex h-11 w-11 items-center justify-center rounded-2xl text-unora-ink transition-colors hover:bg-unora-cloud/80 active:scale-[0.98]">
          <BackIcon />
        </button>
        <h2
          id="city-picker-title"
          className="flex-1 pr-11 text-center font-display text-base font-medium tracking-tight text-unora-ink">
          {lp.title}
        </h2>
      </header>

      <div className="shrink-0 border-b border-unora-line/50 bg-white/90 px-app-4 py-app-3">
        <label className="sr-only" htmlFor="city-picker-search">
          {lp.searchLabel}
        </label>
        <input
          id="city-picker-search"
          type="search"
          autoComplete="off"
          autoFocus
          placeholder={lp.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={searchInputClass}
        />
      </div>

      <ul
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white"
        role="listbox"
        aria-label={lp.listLabel}
        aria-busy={loading}>
        {rows.length === 0 ? (
          <li className="px-app-4 py-app-6 text-center text-sm text-unora-mist">
            {emptyMessage}
          </li>
        ) : (
          rows.map((row: CitySearchRow) => (
            <li
              key={row.id}
              className="border-b border-unora-line/60 last:border-b-0">
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="tap-highlight-none flex w-full px-app-4 py-app-3 text-left text-sm text-unora-ink transition-colors hover:bg-unora-cloud/50 active:bg-unora-cloud/70"
                onClick={() => {
                  onSelect(row.label);
                  onClose();
                }}>
                {row.label}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function LocationFieldTrigger({
  label,
  value,
  placeholder,
  onOpen,
  className,
  publicToggle,
}: {
  label: string;
  placeholder: string;
  value: string;
  className?: string;
  onOpen: () => void;
  publicToggle?: ProfileCreationFieldPublicToggle;
}) {
  return (
    <div className={cn("block", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-unora-mist">
        {label}
      </span>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "mt-app-1 flex w-full rounded-xl border border-unora-line/90 bg-white/90 px-app-3 py-2.5 text-left text-sm shadow-none outline-none transition focus:border-unora-brand-strong/40 focus:ring-2 focus:ring-unora-brand/20",
          value ? "text-unora-ink" : "text-unora-mist"
        )}>
        {value || placeholder}
      </button>
      {publicToggle ? (
        <label className="mt-app-2 flex cursor-pointer items-center justify-start gap-1.5 self-start text-left tap-highlight-none">
          <input
            checked={publicToggle.checked}
            className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-2 border-unora-ink/50 accent-unora-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-unora-brand/30"
            type="checkbox"
            onChange={(e) => publicToggle.onChange(e.target.checked)}
          />
          <span className="text-[11px] font-medium leading-tight text-unora-ink/65">
            {publicToggle.helperText}
          </span>
        </label>
      ) : null}
    </div>
  );
}
