import { type Metadata, type Viewport } from "next";

import "~/styles/fonts.css";

import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { Provider } from "~/components/ui/provider";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Container } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Secret Santa App",
  description:
    "Share gifts, have fun, and make memories with your friends and family.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  // Chrome's auto-translate rewrites text nodes React owns, which crashes hydration
  other: { google: "notranslate" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  // if (session?.user) {
  //   console.log(session.user, "[user is logged in at root layout]");
  // }

  return (
    <html
      lang="en"
      translate="no"
      className={inter.variable}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <SessionProvider session={session}>
            <Provider>
              <Container maxW="6xl" px={{ base: 4, md: 6 }}>
                {children}
              </Container>
            </Provider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
