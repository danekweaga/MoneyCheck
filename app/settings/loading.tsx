import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="space-y-2">
              <div className="h-6 w-56 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-80 animate-pulse rounded-md bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-10 animate-pulse rounded-md bg-muted" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 pt-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-10 animate-pulse rounded-md bg-muted" />
              ))}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="space-y-2">
            <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-5 animate-pulse rounded-md bg-muted" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
