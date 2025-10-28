"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiSettings } from "react-icons/fi";

export default function PomodoroRant({ currentTask, setCurrentTask, tasks, openSettings, onToast, timers }) {
  const [tab, setTab] = useState("pomodoro"); 
  const [time, setTime] = useState(timers.focus);
  const [running, setRunning] = useState(false);
  const [rant, setRant] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const totalRef = useRef(timers.focus);

  const darkBlue = "#0B3D91";

  // Alarm
  const alarmRef = useRef(null);
  useEffect(() => {
    alarmRef.current = new Audio("/alarm.mp3");
    alarmRef.current.loop = true;
  }, []);

  // Update total when switching tabs
  useEffect(() => {
    totalRef.current =
      tab === "pomodoro"
        ? timers.focus
        : tab === "break"
        ? timers.short
        : timers.rant;
    setTime(totalRef.current);
    setRunning(false);
  }, [tab, timers]);

  // Countdown
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Task finished
  useEffect(() => {
    if (time === 0 && running) {
      setRunning(false);
      alarmRef.current?.play();

      const taskMsg = currentTask
        ? `Task "${currentTask.title}" finished!`
        : tab === "rant"
        ? "Rantspace session finished!"
        : "Timer finished!";
      setPopupMessage(taskMsg);
      setShowPopup(true);

      if (currentTask) currentTask.completed = true;

      const allDone = tasks?.every((t) => t.completed);
      if (allDone) {
        setPopupMessage("All tasks completed! 🎉");
        setShowPopup(true);
      }
    }
  }, [time, running, currentTask, tasks, tab]);

  function acknowledgePopup() {
    setShowPopup(false);
    alarmRef.current?.pause();
    alarmRef.current.currentTime = 0;
  }

  // Load saved rant
  useEffect(() => {
    const saved = localStorage.getItem("pv-rant") || "";
    setRant(saved);
  }, []);

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  function saveRant() {
    localStorage.setItem("pv-rant", rant);
    onToast?.({ title: "Rant saved", tone: "success" });
  }

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const pct = 1 - time / (totalRef.current || 1);
  const dash = circumference * pct;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center max-w-sm w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {popupMessage}
              </p>
              <button
                onClick={acknowledgePopup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="w-full flex flex-wrap gap-3 justify-center">
        {["pomodoro", "break", "rant"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 sm:flex-none sm:px-6 py-2 rounded transition font-medium ${
              tab === t
                ? `bg-blue-600 text-white`
                : `bg-white/5 text-[${darkBlue}] hover:bg-white/10`
            }`}
          >
            {t === "pomodoro" ? "Pomodoro" : t === "break" ? "Break" : "Rantspace"}
          </button>
        ))}
      </div>

      {/* Timer & Controls (all tabs) */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="relative w-[240px] h-[240px] max-w-[80vw]">
          <svg width="100%" height="100%" viewBox="0 0 240 240">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#EAF6FF" />
                <stop offset="100%" stopColor={darkBlue} />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r={radius} stroke="rgba(0,0,0,0.06)" strokeWidth="12" fill="none" />
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="url(#g1)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - dash}
              transform="rotate(-90 120 120)"
              style={{ transition: "stroke-dashoffset 0.4s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold" style={{ color: darkBlue }}>
            {formatTime(time)}
          </div>
        </div>

        {/* Task info or Rantspace label */}
        <div className="text-center">
          <div className="font-semibold" style={{ color: darkBlue }}>
            {tab === "rant" ? "Rantspace" : currentTask ? `${currentTask.title} (${currentTask.priority})` : ""}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <button onClick={() => setRunning((r) => !r)} className="px-6 py-2 rounded bg-blue-600 text-white font-medium">
            {running ? "Pause" : "Start"}
          </button>
          <button onClick={() => { setTime(totalRef.current); setRunning(false); }} className="p-2 rounded border" style={{ color: darkBlue, borderColor: darkBlue }}>
            <FiRefreshCw />
          </button>
          <button onClick={() => openSettings?.()} className="p-2 rounded border" style={{ color: darkBlue, borderColor: darkBlue }}>
            <FiSettings />
          </button>
        </div>
      </div>

      {/* Rant textarea (only Rantspace) */}
      {tab === "rant" && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
          <textarea
            value={rant}
            onChange={(e) => setRant(e.target.value)}
            placeholder="Rantspace — vent, plan, release. Saved locally."
            className="w-full max-w-[420px] h-64 p-4 rounded-lg text-lg resize-none focus:outline-none focus:ring-2"
            style={{ color: darkBlue, borderColor: darkBlue, backgroundColor: "rgba(255,255,255,0.05)" }}
          />
          <button
            onClick={saveRant}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
