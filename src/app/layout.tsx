import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import StyledJsxRegistry from "./registry";
import StyletronProviderWrapper from "./StyletronProviderWrapper";

const inter = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cadence",
  description: "Fault-Tolerant Stateful Code Platform, focus on your business logic and let Cadence take care of the complexity of distributed systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StyledJsxRegistry />
      <body className={inter.className}>
        <StyletronProviderWrapper>
          {children}
        </StyletronProviderWrapper>
      </body>
    </html>
  );
}
