import type { Metadata } from "next";
import { Mulish } from "next/font/google";

const mulish = Mulish({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "FaQs",
  description: "Faqs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="mx-5 md:mx-24 lg:mx-48">{children}</body>
    </html>
  );
}
