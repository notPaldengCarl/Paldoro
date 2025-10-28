# Pomodoro App with Gemini AI Integration

A **modern Pomodoro productivity app** built with **Next.js**, featuring **task tracking, Rantspace, and AI-powered chatbot** using **Google Gemini**. Helps users focus, manage tasks, and vent or brainstorm ideas efficiently.


Link: https://paldoro.netlify.app/
---

## Features

### Pomodoro Timer
- Standard Pomodoro timer with **focus and break sessions**.
- **Customizable timers** for Pomodoro, Break, and Rantspace.
- **Circular progress indicator** showing elapsed time.
- **Start / Pause / Reset controls**.
- Popup and audio notifications when sessions finish.

### Task Management
- Users can **assign tasks** and track completion.
- **Task priority** displayed at the top of the tab.
- Alerts when **all tasks are completed**.

### Break & Rantspace
- **Break tab** for short rests.
- **Rantspace tab** to vent, plan, or release thoughts.
- Rantspace includes **timer + textarea + save button**.
- Rantspace content is **saved locally** in the browser.

### AI Chatbot (Google Gemini Integration)
- Chat with **Gemini AI** directly in-app.
- API calls handled via **Next.js serverless API routes**.
- Supports **prompt-based AI interactions** for brainstorming or casual conversation.

### Notifications & Alerts
- **Audio alarm** when sessions or tasks finish.
- **Popup notifications** for task completion or timer end.
- Toast messages for actions like “Rant saved”.

### Dark Mode & Responsive UI
- Fully responsive design for **desktop and mobile**.
- Dark mode ready (Tailwind CSS / inline styles).
- Smooth **animations** using Framer Motion.

### Deployment Ready
- Compatible with **Vercel**, **Netlify**, or other hosting platforms.
- No database required (Rantspace saved locally).
- Environment variables used for **Gemini API key**.

---

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-project-directory>

# Install dependencies
npm install
