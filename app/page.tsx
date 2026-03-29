import { redirect } from "next/navigation";
import { isProfileComplete, getProfileForUser } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  redirect("/dashboard");
}
