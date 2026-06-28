import {Shield} from "lucide-react";

import {Button, Card, Section} from "@/components/ui";
import type {CurrentUserProfile} from "@/types";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import {profileCreationSectionDividerClass} from "./ProfileCreationFields";

const p = strings.profile;

const verificationOrder = ["phone", "photo", "id"] as const;

export function ProfileCreationVerificationSection({
  user,
}: {
  user: CurrentUserProfile;
}) {
  const v = p.verification;

  return (
    <Section
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.verification}
      className={profileCreationSectionDividerClass}
      titleIcon={Shield}
      title={v.title}
      description={v.description}
      action={
        <Button type="button" size="sm" variant="secondary" disabled>
          {v.manage}
        </Button>
      }>
      <div className="grid gap-app-2 sm:grid-cols-3">
        {verificationOrder.map((key) => {
          const ok = user.verification[key];
          return (
            <Card
              key={key}
              padded
              className="border-unora-line/90 py-app-3 transition-shadow hover:shadow-soft">
              <p className="text-xs font-medium text-unora-mist">
                {v.items[key]}
              </p>
              <p className="mt-app-1 text-sm font-semibold text-unora-ink">
                {ok ? v.verified : v.notYet}
              </p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
