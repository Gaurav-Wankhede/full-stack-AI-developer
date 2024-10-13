import './globals.css'
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import { Providers } from "./providers"

export const metadata = {
  title: 'Investment Fund Dashboard',
  description: 'Dashboard for investment fund data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex justify-end p-4">
            <ThemeToggle />
          </div>
          <h2 className="text-3xl font-bold text-center mb-6">Investment Fund Dashboard</h2>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
