import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Update password | MoneyCheck",
};

export default function UpdatePasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-16">
      <UpdatePasswordForm />
    </main>
  );
}
