import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

type Props = {
  variant?: "default" | "icon";
};

export function LogoutButton({ variant = "default" }: Props) {
  if (variant === "icon") {
    return (
      <form action={logout}>
        <button
          type="submit"
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-indigo-50/50 hover:text-indigo-600 dark:hover:bg-slate-800"
          aria-label="Log out"
        >
          <span className="material-symbols-outlined text-[22px] sm:text-[24px]">logout</span>
        </button>
      </form>
    );
  }

  return (
    <form action={logout}>
      <Button type="submit" variant="outline" size="sm">
        Logout
      </Button>
    </form>
  );
}
