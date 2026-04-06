import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getAllMoneyChecks } from "@/lib/data/money-checks";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({ error: "Could not verify session." }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const profile = await getProfileForUser(user.id);
    if (!isProfileComplete(profile)) {
      return NextResponse.json({ error: "Complete onboarding before exporting records." }, { status: 403 });
    }

    const checks = await getAllMoneyChecks(user.id);
    const rows = checks.map((check) => ({
      Date: check.created_at,
      Title: check.title,
      Type: check.type,
      Category: check.category,
      Amount: check.amount,
      InterestRatePercent: check.interest_rate,
      InflationRatePercent: check.inflation_rate,
      MonthsToPayoff: check.months_to_payoff,
      BudgetImpactPercent: check.budget_impact_percent,
      FutureValueLost: check.future_value_lost,
      RiskLevel: check.risk_level,
      RegretScore: check.regret_score,
      Recommendation: check.recommendation,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MoneyChecks");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    const filename = `moneycheck-records-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to export records.", error);
    return NextResponse.json({ error: "Could not export records right now. Please try again." }, { status: 500 });
  }
}
