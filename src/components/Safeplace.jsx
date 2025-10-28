"use client";
import { useState, useRef, useEffect } from "react";
import { FiSend, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const getMoodColor = (text) => {
  const t = text.toLowerCase();
  if (t.match(/sad|lonely|hurt|cry|pain/)) return "from-blue-700/50 to-purple-700/50";
  if (t.match(/angry|mad|upset|frustrated/)) return "from-red-700/50 to-orange-700/50";
  if (t.match(/happy|grateful|peace|calm/)) return "from-green-700/50 to-teal-700/50";
  return "from-slate-700/50 to-slate-800/50";
};

const INITIAL_MESSAGE = {
  role: "bot",
  text: "Hey 🌿 I’m Safeplace — vent, share, or just talk. I’m here to listen."
};

export default function Safeplace() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  // Load saved state on mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("pv-messages") || "[]");
    const savedInput = localStorage.getItem("pv-input") || "";
    const savedCollapsed = JSON.parse(localStorage.getItem("pv-collapsed") || "true");

    setMessages(savedMessages.length ? savedMessages : [INITIAL_MESSAGE]);
    setInput(savedInput);
    setCollapsed(savedCollapsed);
  }, []);

  // Save state to localStorage
  useEffect(() => localStorage.setItem("pv-messages", JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem("pv-input", input), [input]);
  useEffect(() => localStorage.setItem("pv-collapsed", JSON.stringify(collapsed)), [collapsed]);

  const sendMessage = async () => {
    if (!input.trim() || paused) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setLoading(true);

    try {
      const res = await fetch("/api/safeplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context:
            "You are Safeplace, a gentle listener. Respond with empathy, warmth, and care. Keep responses under 3 sentences.",
        }),
      });
      const data = await res.json();
      const botReply =
        data.text || "I hear you. That sounds heavy — take a deep breath 🫶";

      if (!paused) setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Couldn’t connect, but I’m still here." },
      ]);
    } finally {
      setTyping(false);
      setLoading(false);
    }
  };

  const handleStop = () => {
    setShowConfirm(true);
  };

  const confirmStop = () => {
    setPaused(false);
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    localStorage.removeItem("pv-messages");
    localStorage.removeItem("pv-input");
    setShowConfirm(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const lastMood = getMoodColor(messages[messages.length - 1]?.text || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 flex flex-col items-end z-50"
    >
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className={`w-[320px] max-w-[90vw] h-[400px] bg-gradient-to-b ${lastMood} backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col relative`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">🪷 Safeplace</h2>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-sm break-words ${
                    m.role === "user"
                      ? "bg-blue-600/40 text-right ml-8"
                      : "bg-white/15 text-left mr-8"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {typing && !paused && (
                <div className="flex gap-1 p-2 text-sm bg-white/10 rounded-lg">
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-200" />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-400" />
                  <span className="ml-2 italic text-white/60">Safeplace is listening...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 bg-white/10 rounded-md p-2 text-sm placeholder:text-white/50 focus:outline-none"
                placeholder="Type your thoughts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={paused}
              />
              <button
                onClick={paused ? () => setPaused(false) : sendMessage}
                disabled={loading && !paused}
                className={`p-2 rounded-md transition ${
                  paused
                    ? "bg-yellow-500 hover:bg-yellow-400"
                    : loading
                    ? "bg-blue-400/30"
                    : "bg-white-600 hover:bg-white-500"
                }`}
              >
                {paused ? "Resume" : <FiSend size={16} />}
              </button>
              {!paused && (
                <button
                  onClick={handleStop}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-400 transition"
                >
                  End
                </button>
              )}

            {/* Confirmation Modal */}
            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-center">
                    <p className="mb-4 text-white">
                      Are you sure you want to end the session? This will clear all messages.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={confirmStop}
                      >
                        Yes, end
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                        onClick={() => setShowConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed bubble */}
      {collapsed && (
        <motion.button
          onClick={() => setCollapsed(false)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="w-12 h-12 rounded-full bg-white-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-500 transition"
        >
          🪷
        </motion.button>
      )}
    </motion.div>
  );
}
