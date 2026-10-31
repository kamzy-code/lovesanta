"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { systemConfig } from "./system-config";
import { RootStyles } from "./root-styles";
import { Toaster } from "./toaster";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={systemConfig}>
      <RootStyles />
      <ProgressBar
        height="4px"
        color="#81f242"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  );
}
