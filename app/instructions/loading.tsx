import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function InstructionsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-96 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx}>
            <CardHeader className="space-y-2">
              <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-56 animate-pulse rounded-md bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
