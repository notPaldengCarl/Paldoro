"use client";

import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevent hydration mismatch

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="p-3 rounded-full border border-white/20 
                 hover:shadow-[0_0_12px_var(--accent)] 
                 hover:border-[var(--accent)] 
                 transition duration-300"
      style={{
        background:
          resolvedTheme === "light"
            ? "rgba(0,0,0,0.05)"
            : "rgba(255,255,255,0.08)",
      }}
    >
      {resolvedTheme === "light" ? (
        <FiMoon className="text-[var(--accent)]" />
      ) : (
        <FiSun className="text-[var(--accent)]" />
      )}
    </button>
  );
}
