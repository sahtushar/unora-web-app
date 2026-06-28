import type {ReactNode} from "react";

import type {LucideIcon} from "lucide-react";

import {cn} from "@/lib/cn";

export interface InterestedMatchSectionProps {
  children: ReactNode;
  title: string;
  className?: string;
  /** Short supporting line under the section title. */
  description?: string;
  /** Icon beside the description line. */
  descriptionIcon?: LucideIcon;
  /** Icon beside the section title. */
  titleIcon?: LucideIcon;
}

export function InterestedMatchSection({
  title,
  className,
  description,
  descriptionIcon: DescriptionIcon,
  titleIcon: TitleIcon,
  children,
}: InterestedMatchSectionProps) {
  return (
    <section className={cn("space-y-app-3", className)} aria-label={title}>
      <div className="space-y-app-2">
        <h2 className="flex items-center gap-app-2 font-display text-lg font-semibold tracking-tight text-unora-ink sm:text-xl">
          {TitleIcon ? (
            <TitleIcon
              className="h-5 w-5 shrink-0 text-unora-brand-strong"
              strokeWidth={1.75}
              aria-hidden
            />
          ) : null}
          <span className="min-w-0">{title}</span>
        </h2>
        {description !== undefined && description !== "" ? (
          <p className="flex items-start gap-app-2 text-sm leading-relaxed text-unora-mist">
            {DescriptionIcon ? (
              <DescriptionIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-unora-brand-strong/75"
                strokeWidth={2}
                aria-hidden
              />
            ) : null}
            <span className="min-w-0">{description}</span>
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
