import Link from "next/link";
import { redirect } from "next/navigation";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { MobileShell } from "@/components/layout/mobile-shell";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

function InstructionsContent() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Quick Start</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-primary">How to Use MoneyCheck</h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Follow these 4 steps to turn any spending decision into a clear, data-backed recommendation.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>1) Set your baseline</CardTitle>
            <CardDescription>Keep monthly income, expenses, and risk tolerance updated in Settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings" className={cn(buttonVariants({ variant: "outline" }))}>
              Open Settings
            </Link>
          </CardContent>
        </Card>

        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>2) Run a money check</CardTitle>
            <CardDescription>Enter amount, rates, and payoff timeline to analyze true cost.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/check" className={cn(buttonVariants({ className: "architect-gradient text-white" }))}>
              Create New Check
            </Link>
          </CardContent>
        </Card>

        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>3) Read your result</CardTitle>
            <CardDescription>
              Focus on budget impact, future value lost, risk level, and regret score before deciding.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-on-surface-variant">
            Low risk usually means manageable, medium asks for planning, and high suggests delaying or reducing spend.
          </CardContent>
        </Card>

        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>4) Track and improve</CardTitle>
            <CardDescription>Review past checks in History and export records when needed.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link href="/history" className={cn(buttonVariants({ variant: "outline" }))}>
              Open History
            </Link>
            <Link href="/api/export/records" className={cn(buttonVariants({ className: "architect-gradient text-white" }))}>
              Export Excel
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function InstructionsPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  return isMobile ? (
    <MobileShell>
      <InstructionsContent />
    </MobileShell>
  ) : (
    <DesktopShell>
      <InstructionsContent />
    </DesktopShell>
  );
}
