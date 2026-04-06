export default function OnboardingLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 pb-12 pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-72 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-96 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="h-11 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </div>
    </main>
  );
}
