"use client";

import {
  Box,
  Dialog,
  Portal,
  useBreakpointValue,
  type DialogRootProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { CloseButton } from "./close-button";

interface SheetProps extends Omit<DialogRootProps, "children"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * @component Sheet
 * A bottom sheet on phones and a centred dialog on larger screens.
 * Compatible with `createOverlay`, which injects `open`/`onOpenChange`.
 */
export function Sheet({
  title,
  description,
  footer,
  children,
  ...rootProps
}: SheetProps) {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? true;

  return (
    <Dialog.Root
      placement={isMobile ? "bottom" : "center"}
      motionPreset={isMobile ? "slide-in-bottom" : "scale"}
      {...rootProps}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          alignItems={isMobile ? "flex-end" : "center"}
          px={isMobile ? 0 : 4}
        >
          <Dialog.Content
            w="full"
            maxW={isMobile ? "full" : "md"}
            m={0}
            maxH="90dvh"
            roundedTop="2xl"
            roundedBottom={isMobile ? 0 : "2xl"}
            pb={isMobile ? "env(safe-area-inset-bottom)" : 0}
          >
            {isMobile && (
              <Box
                aria-hidden
                mx="auto"
                mt={2}
                w={10}
                h={1}
                rounded="full"
                bg="border.emphasized"
              />
            )}

            {(title ?? description) && (
              <Dialog.Header flexDir="column" alignItems="flex-start" gap={1}>
                {title && (
                  <Dialog.Title fontSize="xl">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description color="fg.muted">
                    {description}
                  </Dialog.Description>
                )}
              </Dialog.Header>
            )}

            <Dialog.Body overflowY="auto">{children}</Dialog.Body>

            {footer && (
              <Dialog.Footer flexDir={{ base: "column-reverse", md: "row" }}>
                {footer}
              </Dialog.Footer>
            )}

            <Dialog.CloseTrigger asChild top={3} insetEnd={3}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
