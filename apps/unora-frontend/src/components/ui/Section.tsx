import type {HTMLAttributes, ReactNode} from "react";
import {useId, useState} from "react";

import {ChevronDown} from "lucide-react";
import type {LucideIcon} from "lucide-react";

import {cn} from "@/lib/cn";

import {SoftSectionLoader} from "./SoftSectionLoader";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  action?: ReactNode;
  /** Indeterminate “soft” line at the very top of the block (e.g. while a PATCH is in flight). */
  busy?: boolean;
  /**
   * When true, the heading becomes a disclosure control and children are shown in a labelled region.
   * Children stay mounted when collapsed (hidden) so form state is preserved.
   */
  collapsible?: boolean;
  /** Initial open state when `collapsible` is true. Defaults to `false`. */
  defaultOpen?: boolean;
  description?: string;
  descriptionClassName?: string;
  title?: string;
  /** When set, shown to the left of the title (same treatment as detailed profile section headings). */
  titleIcon?: LucideIcon;
}

type SectionBodyProps = Omit<SectionProps, "collapsible" | "defaultOpen">;

function CollapsibleSection({
  title,
  titleIcon: TitleIcon,
  description,
  action,
  className,
  descriptionClassName,
  defaultOpen,
  busy,
  children,
  ...props
}: SectionBodyProps & {defaultOpen?: boolean}) {
  const panelId = useId();
  const titleId = useId();
  const descId = useId();
  const [open, setOpen] = useState(() => defaultOpen ?? false);

  const descriptionBlock =
    description != null && description !== "" ? (
      <p
        id={descId}
        className={cn(
          "text-sm leading-relaxed text-unora-mist",
          descriptionClassName
        )}>
        {description}
      </p>
    ) : null;

  return (
    <section
      aria-busy={busy === true ? true : undefined}
      className={cn("space-y-app-3", className)}
      {...props}>
      {busy === true ? <SoftSectionLoader /> : null}
      <div className="flex items-start justify-between gap-app-4">
        <div className="min-w-0 flex-1 space-y-app-1">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-describedby={
              description != null && description !== "" ? descId : undefined
            }
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "tap-highlight-none flex w-full items-center gap-app-2 rounded-xl py-0.5 text-left outline-none transition-colors",
              "hover:bg-unora-cloud/50 focus-visible:ring-2 focus-visible:ring-unora-brand-strong/35 focus-visible:ring-offset-2 focus-visible:ring-offset-unora-snow"
            )}>
            {TitleIcon == null ? null : (
              <TitleIcon
                className="h-5 w-5 shrink-0 text-unora-brand-strong"
                strokeWidth={1.75}
                aria-hidden
              />
            )}
            <span
              id={titleId}
              className="min-w-0 flex-1 font-display text-[1.4rem] font-semibold tracking-tight text-unora-ink">
              {title}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-unora-mist transition-transform duration-200 ease-out",
                open && "rotate-180"
              )}
              strokeWidth={2}
              aria-hidden
            />
          </button>
          {descriptionBlock}
        </div>
        {action}
      </div>
      <div id={panelId} aria-labelledby={titleId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

function StaticSection({
  title,
  titleIcon: TitleIcon,
  description,
  action,
  className,
  descriptionClassName,
  busy,
  children,
  ...props
}: SectionBodyProps) {
  const descriptionBlock =
    description != null && description !== "" ? (
      <p
        className={cn(
          "text-sm leading-relaxed text-unora-mist",
          descriptionClassName
        )}>
        {description}
      </p>
    ) : null;

  const hasHeader =
    (title != null && title !== "") ||
    (description != null && description !== "") ||
    action != null;
  const hasTitleIcon = TitleIcon != null;

  return (
    <section
      aria-busy={busy === true ? true : undefined}
      className={cn("space-y-app-3", className)}
      {...props}>
      {busy === true ? <SoftSectionLoader /> : null}
      {hasHeader ? (
        <div className="flex items-start justify-between gap-app-4">
          <div className="min-w-0 space-y-app-1">
            {title != null && title !== "" ? (
              <div className="flex items-center gap-app-2">
                {TitleIcon == null ? null : (
                  <TitleIcon
                    className="h-5 w-5 shrink-0 text-unora-brand-strong"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
                <h2
                  className={cn(
                    "font-display text-[1.4rem] font-semibold tracking-tight text-unora-ink",
                    hasTitleIcon && "min-w-0 flex-1"
                  )}>
                  {title}
                </h2>
              </div>
            ) : null}
            {descriptionBlock}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Section({
  collapsible,
  defaultOpen,
  title,
  busy,
  ...rest
}: SectionProps) {
  if (collapsible === true && title != null && title !== "") {
    return (
      <CollapsibleSection
        title={title}
        defaultOpen={defaultOpen}
        busy={busy}
        {...rest}
      />
    );
  }

  return <StaticSection title={title} busy={busy} {...rest} />;
}
