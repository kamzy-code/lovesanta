"use client";

import { Button, Input, Stack, createOverlay } from "@chakra-ui/react";
import { useState } from "react";
import { Field } from "~/components/ui/field";
import { Sheet } from "~/components/ui/sheet";
import { toaster } from "~/components/ui/toaster";
import { getGiftBudget } from "~/lib/common/gifting";
import { api } from "~/trpc/react";

interface EditBudgetModalProps {
  activityId: string;
  eventId: string;
  settings: unknown;
}

export const EditBudgetModal = createOverlay<EditBudgetModalProps>(
  (props) => {
    const { activityId, eventId, settings, ...rest } = props;
    const utils = api.useUtils();
    const [value, setValue] = useState(
      getGiftBudget(settings)?.toString() ?? "",
    );
    const budget = Number(value.replace(/[^\d.]/g, ""));
    const invalid = !value || !Number.isFinite(budget) || budget <= 0;

    const { mutate: updateSettings, isPending } =
      api.activity.updateGiftingSettings.useMutation({
        onSuccess: async () => {
          await Promise.all([
            utils.activity.getEventActivities.invalidate({ eventId }),
            utils.activity.getActivityById.invalidate({ activityId }),
          ]);
          toaster.create({
            title: "Budget updated",
            type: "success",
            duration: 3000,
          });
          props.onOpenChange?.({ open: false });
        },
        onError: (error) => {
          toaster.create({
            title: "Error",
            description: error.message,
            type: "error",
            duration: 3000,
          });
        },
      });

    return (
      <Sheet
        {...rest}
        title="Gift budget"
        description="The least amount each person should spend on a gift."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!invalid) updateSettings({ activityId, settings: { budget } });
          }}
        >
          <Stack gap={4} pb={2}>
            <Field label="Minimum gift budget (₦)" invalid={!!value && invalid}>
              <Input
                size="lg"
                inputMode="numeric"
                placeholder="e.g. 10,000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              w="full"
              loading={isPending}
              disabled={invalid}
            >
              Save budget
            </Button>
          </Stack>
        </form>
      </Sheet>
    );
  },
);
