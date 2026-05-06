import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
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
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            Create your account
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-border/70 bg-card p-5">
          <h2 className="text-base font-semibold">Budget impact</h2>
          <p className="mt-2 text-sm text-muted-foreground">See how each decision affects your monthly income.</p>
        </article>
        <article className="rounded-xl border border-border/70 bg-card p-5">
          <h2 className="text-base font-semibold">Future value</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Estimate what that money could become if you invested it.
          </p>
        </article>
        <article className="rounded-xl border border-border/70 bg-card p-5">
          <h2 className="text-base font-semibold">Clear recommendation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a simple low, medium, or high risk signal for each choice.
          </p>
        </article>
      </section>
    </main>
  );
}
