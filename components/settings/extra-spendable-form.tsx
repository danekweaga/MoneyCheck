"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adjustExtraSpendable, clearExtraSpendable } from "@/lib/actions/profile";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  extraSpendable: number;
  variant?: "mobile" | "desktop";
};

export function ExtraSpendableForm({ extraSpendable, variant = "mobile" }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [isPending, startTransition] = useTransition();

  function runAdjust(delta: number) {
    setError(null);
    setOk(false);
    startTransition(async () => {
      try {
        const result = await adjustExtraSpendable(delta);
        if (result?.error?._form?.[0]) {
          setError(result.error._form[0]);
          return;
        }
        setAmount("");
        setOk(true);
        router.refresh();
      } catch {
        setError("Could not update extra cash right now.");
      }
    });
  }

  function onAddOrSubtract(sign: 1 | -1) {
    const parsed = Number.parseFloat(amount.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed === 0) {
      setError("Enter a non-zero amount.");
      return;
    }
    runAdjust(sign * Math.abs(parsed));
  }

  function onClear() {
    setError(null);
    setOk(false);
    startTransition(async () => {
      try {
        const result = await clearExtraSpendable();
        if (result?.error?._form?.[0]) {
          setError(result.error._form[0]);
          return;
        }
        setOk(true);
        router.refresh();
      } catch {
        setError("Could not update extra cash right now.");
      }
    });
  }

  const btnClass =
    variant === "desktop"
      ? "rounded-xl px-4 py-2 text-sm font-semibold"
      : "flex-1 rounded-xl py-3 text-sm font-semibold";

  return (
    <div className="space-y-4">
      <p className="text-sm text-on-surface-variant">
        Extra cash counted toward spend checks (on top of monthly income):{" "}
        <span className="font-bold text-primary">{formatCurrency(extraSpendable)}</span>
      </p>
      <p className="text-xs text-on-surface-variant">
        Add gifts, tax refunds, sold items, or any outside money. Use a negative amount or Clear when you have spent
        that buffer.
      </p>
      <div className="space-y-2">
        <Label htmlFor="extra-amount" className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
          Amount
        </Label>
        <Input
          id="extra-amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder="e.g. 200"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-11 rounded-xl border-none bg-surface-container-highest"
        />
      </div>
      <div className={variant === "desktop" ? "flex flex-wrap gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <Button
          type="button"
          className={`architect-gradient text-white ${btnClass}`}
          disabled={isPending}
          onClick={() => onAddOrSubtract(1)}
        >
          Add to buffer
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={`bg-surface-container-high ${btnClass}`}
          disabled={isPending}
          onClick={() => onAddOrSubtract(-1)}
        >
          Reduce buffer
        </Button>
        {extraSpendable > 0 ? (
          <Button type="button" variant="outline" className={btnClass} disabled={isPending} onClick={onClear}>
            Clear extra
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
      {ok ? <p className="text-sm font-medium text-primary">Updated.</p> : null}
    </div>
  );
}
