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
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) redirect("/login");

  if (!id) {
    return isMobile ? (
      <ResultMobileView errorMessage="We could not find a result ID in this URL." />
    ) : (
      <ResultDesktopView errorMessage="We could not find a result ID in this URL." />
    );
  }

  const check = await getMoneyCheckById(user.id, id);
  if (!check) {
    return isMobile ? (
      <ResultMobileView errorMessage="This result does not exist or you no longer have access to it." />
    ) : (
      <ResultDesktopView errorMessage="This result does not exist or you no longer have access to it." />
    );
  }

  return isMobile ? <ResultMobileView check={check} /> : <ResultDesktopView check={check} />;
}
