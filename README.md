# AptiQuest — Modern Aptitude & Reasoning Assessment Platform

A production-quality aptitude testing web application built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**. Features fluid micro-interactions, dark/light theme support, direction-aware question transitions, a circular SVG countdown timer, localStorage session persistence, responsive question palette, and comprehensive category analytics with instant answer review.

---

## ✨ Features

- **27 Standardized Aptitude Questions** across 4 domains:
  - 📐 Arithmetic & Quantitative Reasoning
  - 💬 Verbal Ability & English
  - 🧭 Logical Reasoning & Deduction
  - 🧩 Riddles & Lateral Thinking
- **Sleek UI/UX Design**:
  - Dark mode by default with an instant Light/Dark theme toggle
  - Low-GPU animated gradient mesh ambient background (indigo → violet → cyan)
  - Glassmorphic card styling with backdrop blur and border glows
  - Responsive layout for devices from 360px up to 1440px+
- **Fluid 60fps Animations**:
  - Direction-aware slide & fade transitions between questions (forward vs backward)
  - Circular SVG countdown timer that shifts to **amber** (< 5 min) and **pulsing red** (< 1 min)
  - Spring-based hover lift and tap effects on option cards
  - Result score count-up and celebratory **confetti** (for scores ≥ 60%)
  - Full respect for `prefers-reduced-motion` settings
- **Robust Test Engine**:
  - **Question Shuffling**: Questions are randomized on every new test attempt while option order remains intact
  - **Local Session Persistence**: Automatically preserves your current progress, answers, marked questions, and remaining time across browser refreshes
  - **Interactive Question Palette**: Desktop sticky sidebar and mobile drawer with real-time status indicators (Unanswered, Answered, Marked for Review, Current)
  - **Full Keyboard Navigation**:
    - `A`, `B`, `C`, `D` or `1`, `2`, `3`, `4`: Select option
    - `←` / `→`: Navigate questions
    - `M`: Toggle Mark for Review
    - `Esc`: Close confirmation modal
  - **Submission Safety**: Confirmation modal displaying answered, unanswered, and marked counts before finalizing
- **Detailed Result Analytics**:
  - Score counter, accuracy percentage ring, and performance tiers (Outstanding, Excellent, Good, Keep Practicing)
  - Category-by-category breakdown with animated horizontal accuracy bars
  - Full answer review with filter tabs (*All*, *Correct*, *Incorrect*, *Skipped*) showing user choice vs correct option and detailed step-by-step explanations

---

## 🚀 Quick Start

### 1. Installation
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed. Clone or navigate to the project directory and run:

```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 📝 How to Add New Questions

All test questions live in [`src/data/questions.js`](src/data/questions.js). To add a new question, add an object to the exported `questions` array adhering to the following schema:

```javascript
{
  id: 28,                            // Unique numeric ID
  category: "Arithmetic",            // "Arithmetic" | "Verbal" | "Logical" | "Riddles"
  q: "What is 15% of 80?",           // Question text
  options: ["10", "12", "14", "16"], // Exactly 4 options
  answer: 1,                         // 0-indexed correct option (0=A, 1=B, 2=C, 3=D)
  explanation: "15% of 80 = (15/100) * 80 = 12." // Step-by-step rationale
}
```

The app automatically handles scoring, category breakdown, question count, and navigation.

---

## 📂 Project Structure

```
apptitude web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BackgroundMesh.jsx   # Ambient animated gradient mesh background
│   │   ├── ConfirmModal.jsx     # Pre-submission confirmation summary dialog
│   │   ├── Header.jsx           # Top branding bar with theme toggle & user indicator
│   │   ├── Landing.jsx          # Welcome hero screen, name input & rules
│   │   ├── OptionCard.jsx       # Interactive option card (A-D) with checkmark
│   │   ├── Palette.jsx          # Question grid palette (desktop sidebar & mobile drawer)
│   │   ├── QuestionCard.jsx     # Slide/fade question card with category pills
│   │   ├── Result.jsx           # Result score card, circular ring & confetti
│   │   ├── ReviewList.jsx       # Answer review list with filters & explanations
│   │   ├── Test.jsx             # Active test controller and keyboard listener
│   │   ├── ThemeToggle.jsx      # Dark / light theme switch button
│   │   └── Timer.jsx            # SVG circular timer with alert states
│   ├── context/
│   │   └── TestContext.jsx      # Core test state, persistence, evaluation & timer
│   ├── data/
│   │   └── questions.js         # Complete set of 27 aptitude questions
│   ├── utils/
│   │   └── shuffle.js           # Fisher-Yates shuffle algorithm
│   ├── App.jsx                  # Main router & AnimatePresence screen transitions
│   ├── index.css                # Tailwind directives and glassmorphism styles
│   └── main.jsx                 # React root mounting
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🛡️ License

MIT License. Designed and engineered for high-performance cognitive assessments.
"# Aptiquest" 
