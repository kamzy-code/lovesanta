"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Icon,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuCheck, LuKeyRound } from "react-icons/lu";
import { Field } from "~/components/ui/field";
import { Sheet } from "~/components/ui/sheet";
import { toaster } from "~/components/ui/toaster";
import { api } from "~/trpc/react";

const emptyForm = { currentPassword: "", password: "", confirmPassword: "" };

const MethodRow = ({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) => (
  <HStack gap={4} py={3} align="center">
    <Box fontSize="xl" color="fg.muted">
      {icon}
    </Box>
    <Box flex={1} minW={0}>
      <Text fontWeight="semibold">{title}</Text>
      <Text fontSize="sm" color="fg.muted" truncate>
        {description}
      </Text>
    </Box>
    {action}
  </HStack>
);

export function SignInMethods() {
  const utils = api.useUtils();
  const { data, isPending } = api.user.getSignInMethods.useQuery();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const hasPassword = data?.hasPassword ?? false;
  const hasGoogle = data?.providers.includes("google") ?? false;

  const { mutate: setPassword, isPending: isSaving } =
    api.user.setPassword.useMutation({
      onSuccess: async ({ hadPassword }) => {
        await utils.user.getSignInMethods.invalidate();
        setOpen(false);
        setForm(emptyForm);
        toaster.create({
          title: hadPassword ? "Password changed" : "Password added",
          description: hadPassword
            ? undefined
            : "You can now also log in with your email and password.",
          type: "success",
          duration: 4000,
        });
      },
      onError: (error) => {
        const fieldErrors = error.data?.zodError?.fieldErrors;
        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
          setErrors({
            password: fieldErrors.password?.[0],
            confirmPassword: fieldErrors.confirmPassword?.[0],
          });
          return;
        }
        if (error.message.toLowerCase().includes("current password")) {
          setErrors({ currentPassword: error.message });
          return;
        }
        toaster.create({
          title: "Couldn't save password",
          description: error.message,
          type: "error",
          duration: 4000,
        });
      },
    });

  const update =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((err) => ({ ...err, [key]: undefined }));
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<typeof emptyForm> = {};
    if (hasPassword && !form.currentPassword)
      next.currentPassword = "Enter your current password";
    if (form.password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match";
    if (Object.keys(next).length > 0) return setErrors(next);

    setPassword({
      currentPassword: hasPassword ? form.currentPassword : undefined,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
  };

  return (
    <Card.Root size="sm" rounded="xl">
      <Card.Header>
        <Card.Title>Sign-in methods</Card.Title>
      </Card.Header>
      <Card.Body pt={0}>
        {isPending ? (
          <Stack gap={3}>
            <Skeleton h={12} />
            <Skeleton h={12} />
          </Stack>
        ) : (
          <Stack gap={0} divideY="1px">
            <MethodRow
              icon={<LuKeyRound />}
              title="Email & password"
              description={
                hasPassword
                  ? (data?.email ?? "Password set")
                  : "No password yet. Add one to log in with your email."
              }
              action={
                <Button
                  size="md"
                  variant={hasPassword ? "outline" : "solid"}
                  flexShrink={0}
                  onClick={() => {
                    setErrors({});
                    setOpen(true);
                  }}
                >
                  {hasPassword ? "Change" : "Add password"}
                </Button>
              }
            />
            <MethodRow
              icon={<FcGoogle />}
              title="Google"
              description={hasGoogle ? "Linked to your account" : "Not linked"}
              action={
                hasGoogle ? (
                  <Badge colorPalette="green" variant="subtle" flexShrink={0}>
                    <Icon as={LuCheck} />
                    Connected
                  </Badge>
                ) : null
              }
            />
          </Stack>
        )}
      </Card.Body>

      <Sheet
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        title={hasPassword ? "Change password" : "Add a password"}
        description={
          hasPassword
            ? undefined
            : `Log in with ${data?.email ?? "your email"} and this password, as well as with Google.`
        }
      >
        <form onSubmit={onSubmit}>
          <Stack gap={4} pb={2}>
            {hasPassword && (
              <Field
                label="Current password"
                invalid={!!errors.currentPassword}
                errorText={errors.currentPassword}
              >
                <Input
                  size="lg"
                  type="password"
                  autoComplete="current-password"
                  value={form.currentPassword}
                  onChange={update("currentPassword")}
                />
              </Field>
            )}
            <Field
              label="New password"
              helperText="At least 8 characters"
              invalid={!!errors.password}
              errorText={errors.password}
            >
              <Input
                size="lg"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={update("password")}
              />
            </Field>
            <Field
              label="Confirm password"
              invalid={!!errors.confirmPassword}
              errorText={errors.confirmPassword}
            >
              <Input
                size="lg"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
              />
            </Field>
            <Button type="submit" size="lg" w="full" loading={isSaving}>
              {hasPassword ? "Change password" : "Add password"}
            </Button>
          </Stack>
        </form>
      </Sheet>
    </Card.Root>
  );
}
