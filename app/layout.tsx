import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { cn } from "@/lib/utils";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team chat Application",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressContentEditableWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="discord-theme"
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
