import "../(preview)/globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Political fact checker",
  description: "fact checker",
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
