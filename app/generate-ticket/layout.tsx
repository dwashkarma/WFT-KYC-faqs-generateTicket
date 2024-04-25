import type { Metadata } from "next";
import { Inter, Mulish } from "next/font/google";

const mulish = Mulish({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Generate Ticket",
  description: "Create ticket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", justifyContent: "center" }}>
        {children}
      </body>
    </html>
  );
}
