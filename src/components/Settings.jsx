"use client";
import { useState, useEffect } from "react";

export default function Settings({ onClose, timers, setTimers }) {
  const [localTimers, setLocalTimers] = useState({
    focus: { min: 25, sec: 0 },
    short: { min: 5, sec: 0 },
    rant: { min: 10, sec: 0 },
  });

  useEffect(() => {
    setLocalTimers({
      focus: { min: Math.floor(timers.focus / 60), sec: timers.focus % 60 },
      short: { min: Math.floor(timers.short / 60), sec: timers.short % 60 },
      rant: { min: Math.floor(timers.rant / 60), sec: timers.rant % 60 },
    });
  }, [timers]);

  function handleChange(e, type, field) {
    const value = Math.max(0, Number(e.target.value)); // prevent negative
    setLocalTimers((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  }

  function saveTimers() {
    setTimers({
      focus: localTimers.focus.min * 60 + localTimers.focus.sec,
      short: localTimers.short.min * 60 + localTimers.short.sec,
      rant: localTimers.rant.min * 60 + localTimers.rant.sec,
    });
    onClose?.();
  }

  function renderInput(type, label) {
    return (
      <div className="flex justify-between items-center gap-2">
        <span>{label}</span>
        <div className="flex gap-1">
          <input
            type="number"
            min={0}
            value={localTimers[type].min}
            onChange={(e) => handleChange(e, type, "min")}
            className="w-16 rounded px-2 text-right"
          />
          <span>:</span>
          <input
            type="number"
            min={0}
            max={59}
            value={localTimers[type].sec}
            onChange={(e) => handleChange(e, type, "sec")}
            className="w-16 rounded px-2 text-right"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        <div className="flex flex-col gap-4">
          {renderInput("focus", "Pomodoro")}
          {renderInput("short", "Break")}
          {renderInput("rant", "Rant")}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 text-white"
          >
            Cancel
          </button>
          <button
            onClick={saveTimers}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
