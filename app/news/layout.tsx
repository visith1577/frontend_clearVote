import "../(preview)/globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Political news letter",
  description: "news letter for political news",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
