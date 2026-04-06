import Link from "next/link";
import { MobileShell } from "@/components/layout/mobile-shell";
import { ExtraSpendableForm } from "@/components/settings/extra-spendable-form";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  profile: Profile;
  creditsRemaining: number;
  creditsUsed: number;
  creditsLimit: number;
  hasCreditsError?: boolean;
};

export function SettingsMobileView({ profile, creditsRemaining, creditsUsed, creditsLimit, hasCreditsError = false }: Props) {
  return (
    <MobileShell>
      <section className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Account</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-primary">Settings</h1>
      </section>

      <div className="space-y-4">
        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>Profile & monthly budget</CardTitle>
            <CardDescription>Change income, expenses, savings goal, and risk level.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSettingsForm profile={profile} variant="mobile" />
          </CardContent>
        </Card>

        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>Extra cash</CardTitle>
            <CardDescription>Gifts, refunds, or other money to count with your income for checks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExtraSpendableForm extraSpendable={profile.extra_spendable} variant="mobile" />
          </CardContent>
        </Card>

        <Card className="architect-gradient border-0 text-white">
          <CardHeader>
            <CardTitle>AI Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Remaining today: <strong>{creditsRemaining}</strong></p>
            <p>Used today: <strong>{creditsUsed}</strong></p>
            <p>Daily limit: <strong>{creditsLimit}</strong></p>
            {hasCreditsError ? (
              <p className="pt-2 text-xs text-white/90">
                We could not refresh live credit usage right now. Values shown may be stale.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/api/export/records" className={cn(buttonVariants({ className: "architect-gradient block w-full rounded-xl px-4 py-3 text-center text-sm font-bold text-white" }))}>
              Download Excel (.xlsx)
            </Link>
            <Link href="/history" className={cn(buttonVariants({ variant: "secondary", className: "block w-full rounded-xl bg-surface-container-high px-4 py-3 text-center text-sm font-semibold text-primary" }))}>
              Open History
            </Link>
          </CardContent>
        </Card>
      </div>
    </MobileShell>
  );
}
