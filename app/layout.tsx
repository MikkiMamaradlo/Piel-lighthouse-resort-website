import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Piel Lighthouse Beach Resort | Tropical Paradise in Batangas",
  description:
    "Experience luxury beachfront accommodations, water activities, and island dining at Piel Lighthouse Beach Resort. Perfect for family getaways and romantic escapes.",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/images/PielLogo.jpg",
        type: "image/jpeg",
      },
    ],
    apple: "/images/PielLogo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get current path to determine portal
                  var path = window.location.pathname;
                  var portal = 'guest';
                  
                  if (path.startsWith('/staff')) {
                    portal = 'staff';
                  } else if (path.startsWith('/admin')) {
                    portal = 'admin';
                  }
                  
                  document.documentElement.setAttribute('data-portal', portal);
                  
                  var localTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  var shouldBeDark = localTheme === 'dark' || (!localTheme && supportDarkMode);
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Listen for theme changes
                  window.addEventListener('storage', function(e) {
                    if (e.key === 'theme') {
                      var newTheme = localStorage.getItem('theme');
                      if (newTheme === 'dark') {
                        document.documentElement.classList.add('dark');
                      } else {
                        document.documentElement.classList.remove('dark');
                      }
                    }
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}







