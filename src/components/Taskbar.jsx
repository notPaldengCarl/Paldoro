"use client";
import { useEffect, useState, useRef } from "react";
import {
  FiPlus,
  FiTrash2,
  FiCheck,
  FiChevronDown,
  FiFolderPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Taskbar({ currentTask, setCurrentTask }) {
  const { resolvedTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [note, setNote] = useState("");
  const [project, setProject] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customProject, setCustomProject] = useState("");
  const [useCustomProject, setUseCustomProject] = useState(false);

  // Notification modal
  const [notification, setNotification] = useState(null);
  const alarmRef = useRef(null);

  useEffect(() => {
    // Load tasks from localStorage
    const saved = localStorage.getItem("pv-tasks");
    if (saved) setTasks(JSON.parse(saved));

    // Setup alarm audio
    alarmRef.current = new Audio("/alarm.mp3"); // add your alarm mp3 in /public
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("pv-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Unique projects
  const projects = Array.from(new Set(tasks.map((t) => t.project))).filter(
    (p) => p && p.trim() !== ""
  );

  function addTask() {
    if (!title.trim()) return toast.error("Enter a task title first!");

    const projectName = useCustomProject
      ? customProject.trim() || "General"
      : project || "General";

    const newTask = {
      id: Date.now(),
      title,
      priority,
      note,
      project: projectName,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setNote("");
    setProject("");
    setCustomProject("");
    setUseCustomProject(false);
    toast.success("Task added!");
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
    if (currentTask?.id === id) setCurrentTask(null);
  }

  function prioritize(t) {
    if (t.completed) return toast.error("Cannot prioritize a completed task!");
    setCurrentTask(t);
    toast.success(`Prioritized: ${t.title}`);
  }

  function markDone(id) {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);

    const doneTask = tasks.find((t) => t.id === id);
    if (doneTask && !doneTask.completed) {
      // Play alarm
      alarmRef.current?.play();

      // Show modal notification
      setNotification({
        title: `Task "${doneTask.title}" finished!`,
        taskId: doneTask.id,
      });

      if (currentTask?.id === id) setCurrentTask(null);
    }

    if (updated.every((t) => t.completed) && updated.length > 0) {
      // All tasks done notification
      alarmRef.current?.play();
      setNotification({
        title: "All tasks completed! 🎉",
        taskId: null,
      });
    }
  }

  // Group tasks by project
  const groupedTasks = tasks.reduce((acc, t) => {
    acc[t.project] = acc[t.project] || [];
    acc[t.project].push(t);
    return acc;
  }, {});

  // Priority text color mapping
  const priorityColors = {
    High: "text-red-400 dark:text-red-300",
    Medium: "text-yellow-400 dark:text-yellow-300",
    Low: "text-green-400 dark:text-green-300",
  };

  return (
    <div className="w-full flex flex-col">
      {/* Notification Modal */}
      {notification && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-bold mb-4">{notification.title}</h3>
            <button
              onClick={() => {
                setNotification(null); // hide modal
                alarmRef.current?.pause(); // stop alarm
                alarmRef.current.currentTime = 0; // reset audio
              }}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Tasks
      </h3>

      {/* Task Creation */}
      <div className="flex flex-col gap-2 mb-3 bg-gray-100/20 dark:bg-gray-900/20 p-3 rounded-xl border border-gray-300/20 dark:border-gray-700/20">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            className="flex-1 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-2">
            <select
              className="p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-2 rounded-lg bg-gray-200/20 dark:bg-gray-700/20 hover:bg-gray-300/30 dark:hover:bg-gray-600/30 transition"
            >
              <FiChevronDown
                className={`transition-transform duration-200 ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onClick={addTask}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FiPlus />
            </button>
          </div>
        </div>

        {/* Advanced section */}
        {showAdvanced && (
          <div className="flex flex-col gap-2 text-sm mt-2">
            {/* Project Picker */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              {!useCustomProject ? (
                <select
                  className="flex-1 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 text-sm"
                  value={project}
                  onChange={(e) =>
                    e.target.value === "_new"
                      ? setUseCustomProject(true)
                      : setProject(e.target.value)
                  }
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                  <option value="_new">+ New project</option>
                </select>
              ) : (
                <div className="flex gap-2 w-full flex-wrap">
                  <input
                    value={customProject}
                    onChange={(e) => setCustomProject(e.target.value)}
                    placeholder="Enter new project name"
                    className="flex-1 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <button
                    onClick={() => setUseCustomProject(false)}
                    className="p-2 rounded-lg bg-gray-200/20 dark:bg-gray-700/20 hover:bg-gray-300/30 dark:hover:bg-gray-600/30 transition"
                    title="Back to existing projects"
                  >
                    <FiFolderPlus />
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note or description..."
              rows={3}
              className="p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 text-sm resize-none"
            />
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400/30 dark:scrollbar-thumb-gray-600/40 scrollbar-track-transparent">
        {Object.keys(groupedTasks).length === 0 && (
          <div className="text-xs text-gray-600 dark:text-gray-400 italic text-center py-4">
            No tasks yet
          </div>
        )}

        {Object.entries(groupedTasks).map(([projectName, group]) => (
          <div key={projectName}>
            <h4 className="text-sm font-semibold text-blue-400 dark:text-blue-300 mb-1 pl-1">
              {projectName}
            </h4>

            <div className="space-y-2">
              {group.map((t) => (
                <div
                  key={t.id}
                  className={`flex flex-col gap-1 p-3 rounded-lg transition ${
                    currentTask?.id === t.id
                      ? "bg-blue-600/20"
                      : "bg-gray-100/10 dark:bg-gray-900/10"
                  } ${t.completed ? "opacity-50 line-through" : "hover:bg-gray-200/20 dark:hover:bg-gray-800/20"}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 flex-wrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t.title}
                      </div>
                      <div className={`text-xs ${priorityColors[t.priority]}`}>
                        {t.priority}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                      <button
                        onClick={() => prioritize(t)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          currentTask?.id === t.id
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500/30 text-blue-100 hover:bg-blue-600/40"
                        } transition`}
                      >
                        {currentTask?.id === t.id ? "Prioritized" : "Prioritize"}
                      </button>
                      <button
                        onClick={() => markDone(t.id)}
                        className="px-2 py-1 rounded bg-green-500/30 text-xs text-white hover:bg-green-600/40 flex items-center gap-1 transition"
                      >
                        <FiCheck /> Done
                      </button>
                      <button
                        onClick={() => removeTask(t.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {t.note && (
                    <div className="text-xs mt-1 italic opacity-75 whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {t.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
