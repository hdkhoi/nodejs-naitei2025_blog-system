import Navbar from "@/components/Navbar";
import "./globals.css";
import { Geist } from 'next/font/google'
 
const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-background`}>
        <Navbar />
        <main className="container mx-auto p-4 gap-5 grid">

        {children}
        </main>
      </body>
    </html>
  );
}
