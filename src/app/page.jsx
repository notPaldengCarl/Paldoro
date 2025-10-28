"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, useAnimation } from "framer-motion";
import PomodoroTabs from "@/components/PomodoroTabs";
import Taskbar from "@/components/Taskbar";
import Settings from "@/components/Settings";
import Toast from "@/components/Toast";
import ThemeSwitch from "@/components/ThemeSwitch";
import Safeplace from "@/components/Safeplace";

const DEFAULT_TIMERS = { focus: 25 * 60, short: 5 * 60, rant: 15 * 60 };

// Cinematic Animated Header
function Header() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [-50, 0],
      opacity: [0, 1],
      rotate: [-5, 0],
      transition: { type: "spring", stiffness: 120, damping: 12, duration: 1.2 },
    });
  }, [controls]);

  const name = " Carl Paldeng ";

  return (
    <motion.div
      animate={controls}
      className="w-full text-center mb-6 flex flex-col items-center gap-1"
    >
      <div className="flex items-center gap-2">

        {/* Animated letters */}
        <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 flex gap-[2px]">
          Made by{" "}
          {name.split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 12 }}
              className="font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-600 cursor-default"
            >
              {letter}
            </motion.span>
          ))}
        </p>
      </div>

      {/* Contact link */}
      <a
        href="mailto:carlpaldeng.official@gmail.com"
        className="underline text-sm text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-300 transition-all hover:scale-105"
      >
        Contact
      </a>
    </motion.div>
  );
}

export default function Page() {
  const { resolvedTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [timers, setTimers] = useState(DEFAULT_TIMERS);

  const showToast = (payload) => {
    setToast(payload);
    setTimeout(() => setToast(null), 4200);
  };

  const containerBg =
    resolvedTheme === "dark"
      ? "bg-gradient-to-br from-[#071322] to-[#071728] text-gray-100"
      : "bg-gradient-to-br from-gray-100 to-gray-200 text-blue-600";
  const cardBg =
    resolvedTheme === "dark"
      ? "bg-white/5 border border-white/10"
      : "bg-white/60 border border-gray-300";

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 ${containerBg}`}>
      <Header />

      <div className={`pv-card w-full max-w-[1100px] p-8 rounded-2xl shadow-xl backdrop-blur-md ${cardBg}`}>
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Pomodoro Focus
          </h1>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col items-center">
            <PomodoroTabs
              currentTask={currentTask}
              openSettings={() => setShowSettings(true)}
              onToast={showToast}
              timers={timers}
              setTimers={setTimers}
            />
          </div>

          <div className={`rounded-xl p-4 ${cardBg} flex flex-col`}>
            <Taskbar currentTask={currentTask} setCurrentTask={setCurrentTask} />
          </div>
        </div>
      </div>

      {showSettings && (
        <Settings
          timers={timers}
          setTimers={setTimers}
          onClose={() => setShowSettings(false)}
        />
      )}

      {toast && <Toast {...toast} tone={toast.tone || "info"} />}

      <Safeplace />
    </main>
  );
}
