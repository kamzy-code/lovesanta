"use client";

import { VStack, Button } from "@chakra-ui/react";
import { PinInput } from "~/components/ui/pin-input";
import { api } from "~/trpc/react";
import { Field } from "~/components/ui/field";
import { useForm } from "react-hook-form";

export function ProfilePasscodeCard() {
  const utils = api.useUtils();
  // const updatePasscode = api.post.updatePasscode.useMutation({
  //   onSuccess: async () => {
  //     await utils.post.invalidate();
  //   },

  //   onError: async (error) => {
  //     alert(error.message);
  //     await utils.post.invalidate();
  //   },
  // });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ passcode: string }>();

  const onSubmit = handleSubmit(async (data) => {
    // await updatePasscode.mutateAsync({ passcode: data.passcode });
    window.location.reload();
  });
  return (
    <form onSubmit={onSubmit} >
      <VStack
        pt={3}
        px={1}
        w={"full"}
        colorPalette="gray"
        borderColor={"fg.subtle"}
      >
        <div className="flex items-center">

        <Field errorText={errors.passcode?.message}>
          <PinInput
            w={"full"}
            count={6}
            size="md"
            spaceX={0.5}
            fontSize={"16px"}
            placeholder=""
            {...register("passcode", { required: "passcode is required" })}
          />
        </Field>
        </div>

        <Button
          type="submit"
          w={"full"}
          size="xs"
          variant="outline"
          loading={isSubmitting}
        >
          Change passcode
        </Button>
      </VStack>
    </form>
  );
}
