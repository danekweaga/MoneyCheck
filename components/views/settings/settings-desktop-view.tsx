import Link from "next/link";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  creditsRemaining: number;
  creditsUsed: number;
  creditsLimit: number;
};

export function SettingsDesktopView({ profile, creditsRemaining, creditsUsed, creditsLimit }: Props) {
  return (
    <DesktopShell>
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Account</p>
        <h1 className="mt-1 text-5xl font-extrabold tracking-tight text-primary">Settings</h1>
        <p className="mt-2 text-on-surface-variant">Manage profile, AI credits, and record exports.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <p><span className="font-semibold">Name:</span> {profile.full_name}</p>
            <p><span className="font-semibold">Risk Tolerance:</span> {profile.risk_tolerance}</p>
            <p><span className="font-semibold">Monthly Income:</span> ${profile.monthly_income.toLocaleString()}</p>
            <p><span className="font-semibold">Monthly Expenses:</span> ${profile.monthly_expenses.toLocaleString()}</p>
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
          </CardContent>
        </Card>
      </div>

      <Card className="architect-shadow mt-6 border-outline-variant/30 bg-surface-container-lowest">
        <CardHeader>
          <CardTitle>Export Financial Records</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/api/export/records" className="architect-gradient rounded-xl px-5 py-3 text-sm font-bold text-white">
            Download Excel (.xlsx)
          </Link>
          <Link href="/history" className="rounded-xl bg-surface-container-high px-5 py-3 text-sm font-semibold text-primary">
            View Full History
          </Link>
        </CardContent>
      </Card>
    </DesktopShell>
  );
}
