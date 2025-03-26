import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react" // Added import for React
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavigationMenu } from "@/components/navigation-menu"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { PixelLogo } from "@/components/pixel-logo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bluey's ASL/FSL Translator",
  description:
    "An innovative application designed to bridge communication gaps between sign language users and non-signers, supporting both American Sign Language (ASL) and Filipino Sign Language (FSL).",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div>
                      <PixelLogo />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      American & Filipino Sign Language
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Menu className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <NavigationMenu />
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>
            </header>

            {children}
          </div>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  `,
          }}
        />
      </body>
    </html>
  )
}



import './globals.css'