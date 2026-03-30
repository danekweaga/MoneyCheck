"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { signInWithApple, signInWithGoogle } from "@/lib/auth/oauth";

const googleIcon =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAkUbpLt-QrsvHnwDoX541CzNRi0e_FTANt4UUDR9golamaSxMlj7sQacxJ68ZEJ6_adTF9hWqxSf_93jbxcummKPTTb0rDa63HSXfXpqI878zUtCM9OqijHvyCqUikTTALDe5bcg3bDmToC1iVH1RkDvvKB4aJe9LfzN4nBy6jP-9N2eB9pogxY55fo3k_q098FvNWR9T4xKoWuI0RoRdME17DGU25UD3LR1UvedqCR8IT2J_JgAv9Zl1gH4oX0ArF1rO-WIRo3VVe";

type Props = {
  layout?: "grid" | "stack";
};

export function SocialAuthButtons({ layout = "grid" }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onGoogle() {
    setError(null);
    startTransition(async () => {
      const res = await signInWithGoogle();
      if (res.error) setError(res.error);
    });
  }

  function onApple() {
    setError(null);
    startTransition(async () => {
      const res = await signInWithApple();
      if (res.error) setError(res.error);
    });
  }

  const gridClass = layout === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4";

  return (
    <div className="w-full space-y-2">
      <div className={gridClass}>
        <button
          type="button"
          disabled={isPending}
          onClick={onGoogle}
          className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-lowest py-3 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-60"
        >
          <Image src={googleIcon} alt="" width={20} height={20} className="h-5 w-5" unoptimized />
          Google
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onApple}
          className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-lowest py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            ios
          </span>
          Apple
        </button>
      </div>
      {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
