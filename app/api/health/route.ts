export async function GET() {
  return Response.json(
    { status: "ok", service: "moneycheck" },
    { status: 200 }
  );
}