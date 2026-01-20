import { type Metadata } from "next";

import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { Provider } from "~/components/ui/provider";
import { Bricolage_Grotesque } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Container } from "@chakra-ui/react";
import { NavbarComponent } from "~/components/navbar/block";

export const metadata: Metadata = {
  title: "Secret Santa App",
  description:
    "Share gifts, have fun, and make memories with your friends and family.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// const bricolage = Bricolage_Grotesque({
//   weight: ["400", "500", "600"],
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-bricolage",
// });

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session?.user) {
    console.log(session.user, "[user is logged in at root layout]");
  }

  return (
    <html
      lang="en"
      // className={`${bricolage.variable} ${bricolage.className} `}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <SessionProvider session={session}>
            <Provider>
              <Container maxW="6xl" pb={24}>
                {children}
                <NavbarComponent activeMenuKey={0} />
              </Container>
            </Provider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
