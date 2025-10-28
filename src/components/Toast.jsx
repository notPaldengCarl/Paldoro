// app/layout.jsx
"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import "../app/globals.css";

export default function RootLayout({ children }) {
  const [pageTitle, setPageTitle] = useState("Timer - Task");

  // Optional: dynamically change title if needed
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{pageTitle}</title>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
