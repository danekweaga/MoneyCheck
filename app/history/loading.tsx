import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HistoryLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-72 animate-pulse rounded-md bg-muted" />
      </div>
      <Card>
        <CardHeader className="space-y-2">
          <div className="h-5 w-36 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-52 animate-pulse rounded-md bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-11 animate-pulse rounded-md bg-muted" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
