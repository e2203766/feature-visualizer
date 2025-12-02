# React + TypeScript + Vite
README.md 
Wärtsilä Feature Explorer
Next-generation UX concepts for enterprise search, engineering data and digital workflows
 Executive Summary (Pitch)
Wärtsilä Feature Explorer is an interactive prototype demonstrating how future digital tooling for Engineering, Sourcing and Product Data Management could look and feel.
The application showcases modern UI patterns, rapid discovery tools, visual previews, and guided experiences, enabling teams to:
•	Find parts faster
•	Understand changes quicker
•	Reduce onboarding effort
•	Improve accuracy in product selection
•	Explore new UX concepts before production implementation
This interactive demo combines real workflows, synthetic data, and polished UI to give internal teams a clear vision of where our digital experience is heading.
Project Goals
Goal	Description
Reduce cognitive load	By modernizing navigation, search, and comparison workflows
Support faster decision-making	With smarter filtering, 3D previews, visual highlights
Improve onboarding	Through guided tours, command palette, digest summaries
Test new UX ideas quickly	A safe sandbox to evaluate feature concepts with stakeholders

 Live Demo 

 Features Overview
1. Smart Search
•	Instant search by ID, name, material, standard
•	Geometry-match slider
•	Chips for quick filters
•	“Advanced Search” with multi-criteria filtering
•	Voice search (mic button)
•	Recently viewed history

 2. Highlight System
A reusable, configurable system for onboarding & feature announcement:
•	Glow / badge highlight variants
•	Dismissible indicators
•	Per-user persistence (localStorage)
•	Used on:
o	Bulk upload
o	Export
o	Frequently bought together
o	Recently viewed
o	3D viewer

 3. Bulk Upload & Quality Check
•	Paste Excel ID lists
•	Validate & highlight unknown items
•	Clean list export
•	Error summary
•	Frictionless flow for engineering & sourcing tasks

 4. Compare View
•	Select 2–3 items
•	Side-by-side attribute comparison
•	Responsive, readable, structured layout

 5. Guided Tour
•	3-step walkthrough
•	Highlighted UI elements
•	Smooth animation (Framer Motion)
•	Ideal for onboarding new users
6. Video Walkthrough Modal
•	Auto-play
•	Used for feature announcements, digest messages
•	Includes demo videos (demo1.mp4, demo2.mp4)

 7. Command Palette (Ctrl+K)
•	Jump to advanced search
•	Open onboarding tools
•	Execute quick actions
•	Instant navigation

 8. Digest Modal
•	“What changed since your last visit”
•	Integrated deep-links: Read, Video, Try
•	Ideal for internal product communications

 9. Concept Gallery
Gallery of UX demos, grouped by goal:
Category	Concepts
SEE	Highlights, How-to guide
UNDERSTAND	Guided tour, Compare view
USE	Preset filters, Bulk upload & Export, Command palette
ENGAGE	Email / Chat digest

10. 3D / Photo Viewer (NEW)
A new concept illustrating how part-detail pages can include rich media:
•	High-quality image or rendering
•	Embedded 3D demo video
•	CAD-style measurement overlay (via screenshot)
•	Download links:
o	CAD model
o	Datasheet
o	Feature catalogue

 Tech Stack
Layer	Technology
UI Framework	React 18 + TypeScript
Build	Vite
Animations	Framer Motion
Styles	TailwindCSS
State	React hooks
Data	Local demo dataset (JSON/TS)
Assets	MP4, PNG stored locally
Deployment	GitHub Pages (optional)

 Project Structure
src/
 ├── components/
 │     ├── search/              # Search bar, filtering, results table
 │     ├── modals/              # All modals (video, 3D viewer, guided tour)
 │     ├── ui/                  # Indicator, primitives, reusable UI atoms
 │     ├── layout/              # Top bar, tabs
 │     ├── concepts/            # Concept gallery demos
 │
 ├── assets/                    # demo1.mp4, demo2.mp4, images
 ├── data/                      # parts, chips, news (demo fixtures)
 ├── utils/                     # animation utilities
 ├── types.ts                   # Global TypeScript definitions
 └── App.tsx                    # Main entry point & routing logic

 Getting Started
1. Install dependencies
npm install
2. Run dev server
npm run dev
Open:
http://localhost:5173
3. Build for Production
npm run build
4. Preview production bundle
npm run preview

 Deployment (GitHub Pages)
1.	Commit changes
2.	Push to main
3.	GitHub Actions build & deploy automatically
4.	Your site appears under Settings → Pages
Ensure vite.config.ts contains:
export default defineConfig({
  base: "/feature-visualizer/",
});

 Roadmap
Q1 — UX Foundations
•	Smart search
•	Highlight system
•	Compare view
•	Concept gallery
Q2 — Enhanced Media Support
•	3D / photo viewer
•	Interactive CAD rotation (Three.js)
•	Multiple image gallery
Q3 — Productivity Features
•	Save search presets
•	Export to Excel (full dataset)
•	User preferences (theme, layout, columns)
Q4 — Integrations (Prototype only)
•	API-based part catalog
•	CAD file streaming
•	Link to PLM / SAP mock endpoints

 Release Notes (Internal)
v0.9.5 — Media Preview Update
•	Added full 3D / photo modal
•	Added demo2.png / demo2.mp4
•	Added download links inside modal
v0.9.0 — Highlight System Overhaul
•	Glow + Badge modes
•	Global enable/disable toggle
•	Persistent dismiss state
v0.8.0 — Bulk Upload Enhancements
•	Error detection
•	Inline correction
•	CSV export
v0.7.0 — Concept Gallery
•	9 UX demos grouped by type
•	Integrated animations

 Author
Prototype designed & developed by Kostiantyn Chyhirin
with assistance TaisiaShevchuk, greedyTaiga, Dolgunik.


