import Link from "next/link";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  creditsRemaining: number;
  creditsUsed: number;
  creditsLimit: number;
};

export function SettingsMobileView({ profile, creditsRemaining, creditsUsed, creditsLimit }: Props) {
  return (
    <MobileShell>
      <section className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Account</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-primary">Settings</h1>
      </section>

      <div className="space-y-4">
        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-semibold">Name:</span> {profile.full_name}</p>
            <p><span className="font-semibold">Risk:</span> {profile.risk_tolerance}</p>
            <p><span className="font-semibold">Income:</span> ${profile.monthly_income.toLocaleString()}</p>
            <p><span className="font-semibold">Expenses:</span> ${profile.monthly_expenses.toLocaleString()}</p>
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

        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/api/export/records" className="architect-gradient block rounded-xl px-4 py-3 text-center text-sm font-bold text-white">
              Download Excel (.xlsx)
            </Link>
            <Link href="/history" className="block rounded-xl bg-surface-container-high px-4 py-3 text-center text-sm font-semibold text-primary">
              Open History
            </Link>
          </CardContent>
        </Card>
      </div>
    </MobileShell>
  );
}
