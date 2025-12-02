README.md — Wärtsilä Feature Explorer

Next-generation UX concepts for enterprise search, engineering data and digital workflows

Executive Summary (Pitch)
Wärtsilä Feature Explorer is an interactive prototype demonstrating how future digital tooling for Engineering, Sourcing and Product Data Management could look and feel. The application showcases modern UI patterns, rapid discovery tools, visual previews, and guided experiences, enabling teams to:
• Find parts faster
• Understand changes quicker
• Reduce onboarding effort
• Improve accuracy in product selection
• Explore new UX concepts before production implementation

This interactive demo combines real workflows, synthetic data, and polished UI to give internal teams a clear vision of where our digital experience is heading.

Project Goals
Goal — Description
Reduce cognitive load — By modernizing navigation, search, and comparison workflows
Support faster decision-making — With smarter filtering, 3D previews, visual highlights
Improve onboarding — Through guided tours, command palette, digest summaries
Test new UX ideas quickly — A safe sandbox to evaluate feature concepts with stakeholders

Features Overview

Smart Search
• Instant search by ID, name, material, standard
• Geometry-match slider
• Chips for quick filters
• “Advanced Search” with multi-criteria filtering
• Voice search (mic button)
• Recently viewed history

Highlight System
A reusable, configurable system for onboarding & feature announcement:
• Glow / badge highlight variants
• Dismissible indicators
• Per-user persistence (localStorage)
• Used on Bulk upload, Export, FBT, Recently viewed, 3D viewer

Bulk Upload & Quality Check
• Paste Excel ID lists
• Validate & highlight unknown items
• Clean list export
• Error summary

Compare View
• Select 2–3 items
• Side‑by‑side comparison
• Responsive layout

Guided Tour
• 3‑step onboarding
• Smooth animation (Framer Motion)

Video Walkthrough Modal
• Auto‑play
• Demo videos (demo1.mp4, demo2.mp4)

Command Palette (Ctrl+K)
• Quick navigation & actions

Digest Modal
• “What changed since your last visit”
• Deep links: Read, Video, Try

Concept Gallery
SEE — Highlights, How‑to
UNDERSTAND — Guided tour, Compare view
USE — Preset filters, Bulk upload & Export, Command palette
ENGAGE — Email / Chat digest

3D / Photo Viewer (NEW)
• Image / rendering
• Embedded 3D demo video
• CAD‑style screenshot
• Download links: CAD, Datasheet, Feature catalogue

Tech Stack
UI Framework — React 18 + TypeScript
Build — Vite
Animations — Framer Motion
Styles — TailwindCSS
State — React hooks
Data — Local fixtures
Assets — MP4, PNG
Deployment — GitHub Pages

Project Structure
src/
  components/
    search/
    modals/
    ui/
    layout/
    concepts/
  assets/
  data/
  utils/
  types.ts
  App.tsx

Getting Started
1. npm install
2. npm run dev  → http://localhost:5173
3. npm run build
4. npm run preview

Deployment (GitHub Pages)
1. Commit & push
2. GitHub Actions deploy
3. Ensure vite.config.ts contains base path

Roadmap
Q1 — UX Foundations
Q2 — Enhanced Media Support
Q3 — Productivity Features
Q4 — Integrations (Prototype)

Release Notes
v0.9.5 — Media Preview Update
v0.9.0 — Highlight System Overhaul
v0.8.0 — Bulk Upload Enhancements
v0.7.0 — Concept Gallery



 Author
Prototype designed & developed by Kostiantyn Chyhirin
with assistance TaisiaShevchuk, greedyTaiga, Dolgunik.


