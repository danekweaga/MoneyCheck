import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { isProfileComplete, getProfileForUser } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let primaryHref = "/signup";
  let primaryLabel = "Create your account";
  let secondaryHref = "/login";
  let secondaryLabel = "Sign in";

  if (user) {
    const profile = await getProfileForUser(user.id);
    const complete = isProfileComplete(profile);
    primaryHref = complete ? "/dashboard" : "/onboarding";
    primaryLabel = complete ? "Go to dashboard" : "Complete onboarding";
    secondaryHref = "/check/new";
    secondaryLabel = "Start a money check";
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-16">
      <section className="space-y-6">
        <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Personal spending decision tool
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Check purchases against your budget before you spend.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          MoneyCheck helps you evaluate cost, budget impact, and long-term tradeoffs so you can make smarter
          personal money decisions.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={primaryHref} className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
          >
            {secondaryLabel}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <h2 className="text-base font-semibold">Budget impact</h2>
          <p className="mt-2 text-sm text-muted-foreground">See how each decision affects your monthly income.</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <h2 className="text-base font-semibold">Future value</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Estimate what that money could become if you invested it.
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <h2 className="text-base font-semibold">Clear recommendation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a simple low, medium, or high risk signal for each choice.
          </p>
        </div>
      </section>
    </main>
  );
}
