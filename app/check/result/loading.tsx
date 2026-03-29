import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CheckResultLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
      <Card>
        <CardHeader>
          <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-5 animate-pulse rounded-md bg-muted" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
