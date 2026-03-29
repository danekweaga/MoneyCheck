import { redirect } from "next/navigation";
import { ResultDesktopView } from "@/components/views/result/result-desktop-view";
import { ResultMobileView } from "@/components/views/result/result-mobile-view";
import { getMoneyCheckById } from "@/lib/data/money-checks";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

type ResultPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CheckResultPage({ searchParams }: ResultPageProps) {
  const { id } = await searchParams;
  if (!id) redirect("/history");

  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const check = await getMoneyCheckById(user.id, id);
  if (!check) redirect("/history");

  return isMobile ? <ResultMobileView check={check} /> : <ResultDesktopView check={check} />;
}
