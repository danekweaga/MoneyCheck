import { headers } from "next/headers";

const MOBILE_USER_AGENT_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk/i;

export async function isMobileRequest(): Promise<boolean> {
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "";
  return MOBILE_USER_AGENT_REGEX.test(userAgent);
}
