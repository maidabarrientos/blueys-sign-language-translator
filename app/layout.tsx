import "./globals.css"
import type { MetadataRoute } from "next/server"
import { Inter } from "next/font/google"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: MetadataRoute = {
  title: "Bluey's ASL/FSL Translator",
  description:
    "An innovative application designed to bridge communication gaps between sign language users and non-signers, supporting both American Sign Language (ASL) and Filipino Sign Language (FSL).",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
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