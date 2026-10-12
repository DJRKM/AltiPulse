# 🏔️ AltiPulse

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Terrain-black?style=flat&logo=three.js)](https://threejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive_Maps-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Next-generation alpine trail telemetry and expedition cockpit designed for mountaineers, trail runners, and high-altitude explorers.**

AltiPulse combines real-time altitude telemetry, 3D topographic visualization, live weather dynamics, and route exploration into an ultra-modern, dark-mode cockpit interface.

---

## 🌟 Key Features

### 🧭 Start Hike Telemetry Cockpit
- **Live Metric Tracking**: Real-time monitoring of elevation, ascent/descent delta, gradient percentage, pace, and trip duration.
- **Topographic Compass**: Integrated digital compass HUD with heading telemetry and waypoint tracking.
- **Biometric & Vitals Simulation**: Live pacing feedback tailored for high-altitude endurance and oxygenation zones.

### 🗺️ Interactive Topographic & Trail Maps
- **Leaflet & Three.js Integration**: Multi-layered vector trail paths rendered with elevation contour markers and dynamic waypoint popups.
- **Trail Route Profiles**: Interactive elevation gain charts allowing hikers to preview technical ascents and ridge sections.
- **Trail Discovery Catalog**: Filterable trails across difficulty tiers (Beginner, Intermediate, Alpine Expert), terrain types, and vertical elevation meters.

### 🌦️ Atmospheric Weather Engine
- **Dynamic Backgrounds**: Responsive canvas-driven ambient weather effects (sun, dense cloud cover, alpine rainfall, snow blizzards, and dusk/night cycles).
- **Mountain Safety Telemetry**: Live temperature, wind velocity, precipitation index, and visibility indicators.

### 🔐 Expedition Profiles & Authentication
- **Supabase SSR Integration**: Secure user registration, persistent login sessions, profile bookmarks, and completed trail history.
- **Custom Cockpit HUD**: High-contrast biometric-inspired UI controls designed for low-light visibility and glove-friendly touch/keyboard interactions.

### 💻 Native macOS Companion Wrapper
- Includes a dedicated Swift desktop wrapper (`main.swift`) that launches AltiPulse as a floating, bezel-free macOS desktop HUD.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19 | Server and client components with optimized route caching and streaming. |
| **Styling** | Tailwind CSS v4, Lucide Icons | High-performance CSS engine with glassmorphic cockpit styling. |
| **3D & Mapping** | Three.js, Leaflet, Canvas Confetti | 3D terrain rendering, GPS trail overlays, and celebration animations. |
| **Backend & Auth** | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) | Cloud database, session handling, and expedition data persistence. |
| **Native Wrapper** | Swift & WebKit (`Cocoa`, `WKWebView`) | Lightweight native macOS desktop runner. |

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **npm** or **pnpm** / **yarn**

### ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DJRKM/AltiPulse.git
   cd AltiPulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥️ Running the macOS Desktop App

To compile and run the native floating macOS companion window:

```bash
swiftc main.swift -o AltiPulseApp
./AltiPulseApp
```
*(Ensure `npm run dev` is running on port 3000 beforehand).*

---

## 📁 Project Structure

```
altipulse/
├── public/                 # Video backgrounds, sound assets, fonts, trail images
├── src/
│   ├── app/
│   │   ├── globals.css     # Tailwind CSS styles and custom glassmorphism utilities
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Main AltiPulse expedition dashboard
│   ├── components/
│   │   ├── AuthCockpit.tsx           # Supabase sign-in/sign-up cockpit
│   │   ├── DynamicBackground.tsx     # Ambient atmospheric weather canvas
│   │   ├── RealLeafletMap.tsx        # Interactive trail route maps
│   │   ├── StartExplorationScreen.tsx# Trail catalog and difficulty filters
│   │   ├── StartHikeCockpit.tsx      # Active expedition tracking HUD
│   │   ├── TopographicCompassMap.tsx # 3D compass and contour renderer
│   │   └── WelcomeSequence.tsx       # Introduction animations
│   └── lib/
│       └── supabase.ts     # Supabase client initialization
├── main.swift              # Native Swift desktop runner
├── package.json
└── tsconfig.json
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
