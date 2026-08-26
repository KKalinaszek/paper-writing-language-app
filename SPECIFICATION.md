# Language Learning Paper Writing App: Project Specification & Development Plan

## 1. Executive Summary & Project Vision

Modern language learning applications heavily rely on digital autocomplete and predictive text, which inadvertently hinders active recall and muscle memory formation. This project aims to bridge digital prompts with physical paper writing, allowing users to practice handwriting while receiving instant, automated feedback on spelling and grammar.

## 2. Recommended Tech Stack

To build a robust yet streamlined MVP without heavy backend infrastructure, the following browser-based technologies are recommended:

- **Frontend Framework:** React or Vanilla JavaScript for responsive user interactions
- **Styling:** Tailwind CSS for a clean, professional, and scannable interface
- **Camera Access:** HTML5 Web Camera API (getUserMedia) for capturing physical paper directly from a webcam or mobile camera
- **Optical Character Recognition (OCR):** Tesseract.js running entirely in the browser to extract handwritten text without requiring a dedicated backend server
- **String Comparison:** Open-source diffing libraries to compare original prompts against OCR output and highlight character-level discrepancies

## 3. Application Workflow

1. **Prompt Display:** The application displays a target sentence or description in the target language
2. **Physical Writing:** The user writes the sentence out on physical paper (completely bypassing digital autocomplete)
3. **Image Capture:** The user holds the paper up to their device camera and triggers a snapshot
4. **OCR Processing:** Tesseract.js scans the captured image and extracts the handwritten text locally
5. **Diffing & Feedback:** The app compares the strings and highlights spelling or grammatical errors

## 4. Starter Implementation (Webcam & Tesseract MVP)

Basic functional template for integrating local camera capture with Tesseract.js - see `index.html` for full implementation.

## 5. Step-by-Step Development Roadmap

| Phase | Milestone | Key Objectives |
|-------|-----------|-----------------|
| Phase 1 | Scaffolding & UI | Set up clean interface with Tailwind CSS, target prompt container, and live camera viewfinder |
| Phase 2 | Capture Pipeline | Implement snapshot controls with alignment guides for notebook paper framing |
| Phase 3 | OCR Integration | Configure Tesseract.js workers optimized for handwriting character recognition |
| Phase 4 | Diffing & Feedback | Integrate string diffing utilities to render exact typos and corrections on screen |

## 6. Future Expansion Roadmap

- **Level 1 (MVP):** Static printed prompt, paper copying, snapshot, and typo highlighting
- **Level 2 (Audio Dictation):** Audio-only prompts to train listening comprehension alongside writing
- **Level 3 (AI Grading):** Lightweight LLM integration for semantic grammar and nuance feedback
