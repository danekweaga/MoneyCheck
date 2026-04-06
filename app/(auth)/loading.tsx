export default function AuthLoading() {
  return (
    <main className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-md space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-52 animate-pulse rounded-md bg-muted" />
        <div className="h-11 animate-pulse rounded-md bg-muted" />
        <div className="h-11 animate-pulse rounded-md bg-muted" />
        <div className="h-11 animate-pulse rounded-md bg-muted" />
      </div>
    </main>
  );
}
