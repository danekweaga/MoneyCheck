"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending ? "Signing out..." : "Logout"}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <LogoutSubmitButton />
    </form>
  );
}
