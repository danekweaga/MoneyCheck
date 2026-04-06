import Link from "next/link";
import { DesktopShell } from "@/components/layout/desktop-shell";
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

export function SettingsDesktopView({ profile, creditsRemaining, creditsUsed, creditsLimit, hasCreditsError = false }: Props) {
  return (
    <DesktopShell>
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Account</p>
        <h1 className="mt-1 text-5xl font-extrabold tracking-tight text-primary">Settings</h1>
        <p className="mt-2 text-on-surface-variant">Update income, extra cash from gifts or refunds, AI credits, and exports.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
            <CardHeader>
              <CardTitle>Profile & monthly budget</CardTitle>
              <CardDescription>Raise or lower your base monthly income and other onboarding fields anytime.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettingsForm profile={profile} variant="desktop" />
            </CardContent>
          </Card>
          <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
            <CardHeader>
              <CardTitle>Extra cash (gifts, refunds, side money)</CardTitle>
              <CardDescription>
                This stacks on top of monthly income when MoneyCheck calculates budget impact and regret scores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtraSpendableForm extraSpendable={profile.extra_spendable} variant="desktop" />
            </CardContent>
          </Card>
        </div>

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
      </div>

      <Card className="architect-shadow mt-6 border-outline-variant/30 bg-surface-container-lowest">
        <CardHeader>
          <CardTitle>Export Financial Records</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/api/export/records" className={cn(buttonVariants({ className: "architect-gradient rounded-xl px-5 py-3 text-sm font-bold text-white" }))}>
            Download Excel (.xlsx)
          </Link>
          <Link href="/history" className={cn(buttonVariants({ variant: "secondary", className: "rounded-xl bg-surface-container-high px-5 py-3 text-sm font-semibold text-primary" }))}>
            View Full History
          </Link>
        </CardContent>
      </Card>
    </DesktopShell>
  );
}
