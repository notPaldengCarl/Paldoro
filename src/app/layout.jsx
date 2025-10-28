import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  title: "Paldoro – Focus. Grind. Emerge.",
  description: "Pomodoro timer app with task management and rantspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
