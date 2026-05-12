import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/src/config";
import Sidebar from "@/src/components/layout/Sidebar";

export const metadata: Metadata = {
  title: `${SITE_NAME} Monitoring`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
