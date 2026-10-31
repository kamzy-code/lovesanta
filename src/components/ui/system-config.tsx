import { createSystem, defaultConfig } from "@chakra-ui/react";
import { defineTextStyles } from "@chakra-ui/react";

export const textStyles = defineTextStyles({
  body: {
    description: "The body text style - used in paragraphs",
    value: {
      fontFamily: "body",
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "24",
      letterSpacing: "0",
      textDecoration: "None",
      textTransform: "None",
    },
  },
  heading: {
    description: "The heading text style - used in titles",
    value: {
      fontFamily: "heading",
      fontWeight: "500",
      letterSpacing: "0",
      textDecoration: "None",
      textTransform: "None",
    },
  },
});

export const systemConfig = createSystem(defaultConfig, {
  cssVarsPrefix: "xk",

  theme: {
    textStyles,
    breakpoints: {
      sm: "40em",
      md: "52em",
      lg: "69em",
      xl: "96em",
      "2xl": "134em",
    },
    tokens: {
      fonts: {
        // --font-inter is set by next/font in the root layout
        heading: { value: "var(--font-inter), system-ui, sans-serif" },
        body: { value: "var(--font-inter), system-ui, sans-serif" },
      },
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          100: { value: "#e6f2ff" },
          200: { value: "#bfdeff" },
          300: { value: "#99caff" },
          950: { value: "#001a33" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.brand.100}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
      },
    },
  },
  globalCss: {
    "html, #__next": {
      height: "100%",
      fontFamily: "body",
      fontSize: "16px",
      fontWeight: "400",
      letterSpacing: "normal",
    },
    body: {
      overflowY: "scroll", // Always show scrollbar to avoid flickering
      // clears the fixed bottom nav / action bar, plus the home indicator
      paddingBottom: "calc(96px + env(safe-area-inset-bottom))",
      fontFamily: "body",
      overscrollBehaviorY: "none",
    },
    html: {
      scrollBehavior: "smooth",
      textSizeAdjust: "100%",
    },
    // native feel: no grey tap flash, no double-tap zoom delay on controls
    "a, button, [role=button], [role=tab], label, summary": {
      WebkitTapHighlightColor: "transparent",
      touchAction: "manipulation",
    },
    // 16px+ inputs stop mobile browsers zooming in on focus
    "input, textarea, select": {
      fontSize: "max(16px, 1em)",
    },
  },
});
