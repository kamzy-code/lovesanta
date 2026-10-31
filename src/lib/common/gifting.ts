import { z } from "zod";

export const giftingSettingsSchema = z.object({
  budget: z.coerce
    .number({ invalid_type_error: "Budget must be a number" })
    .positive("Budget must be greater than 0"),
});

export type GiftingSettings = z.infer<typeof giftingSettingsSchema>;

/**
 * @function getGiftBudget
 * Reads the minimum gift amount from an activity's settings JSON.
 * Older activities stored the budget as free text (e.g. "10,000"), so we
 * strip anything that isn't a digit or dot before parsing.
 */
export const getGiftBudget = (settings: unknown): number | null => {
  if (!settings || typeof settings !== "object") return null;
  const raw = (settings as Record<string, unknown>).budget;
  const value =
    typeof raw === "number"
      ? raw
      : typeof raw === "string" && raw !== ""
        ? Number(raw.replace(/[^\d.]/g, ""))
        : NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
};

// Formatted by hand: Intl output differs between Node and some browsers' ICU
// data ("₦" vs "NGN"), which causes hydration mismatches
export const formatNaira = (amount: number) =>
  `₦${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const formatGiftBudget = (settings: unknown): string | null => {
  const budget = getGiftBudget(settings);
  return budget === null ? null : formatNaira(budget);
};
