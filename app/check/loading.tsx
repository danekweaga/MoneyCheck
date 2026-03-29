import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CheckLoading() {
  return (
    <Card className="w-full max-w-lg border-border/80 shadow-lg shadow-slate-900/5">
      <CardHeader className="space-y-2">
        <div className="h-8 w-52 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div key={idx} className="h-10 animate-pulse rounded-md bg-muted" />
        ))}
      </CardContent>
    </Card>
  );
}
