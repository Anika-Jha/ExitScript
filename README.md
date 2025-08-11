# ExitScript

---

## Live Demo

Check out the live application here: [https://exitscript.onrender.com/](https://exitscript.onrender.com/)

---


## Overview

ExitScript is a mobile-first Progressive Web Application (PWA) designed to help users generate AI-powered excuses for uncomfortable social situations. The app provides quick excuse generation across various categories (work, family, health, transport) with different tones, and includes realistic fake call and video call features with voice synthesis to help users exit situations safely. It is built as a full-stack TypeScript application with a React frontend and Express backend.

---

## Features

- Comprehensive local fallback excuse system  
- Realistic webcam integration for video calls showing actual user video feed- asks for webcam permission 
- Enhanced video calls with simulated caller video using CSS animations and graphics  
- Reduced dependency on OpenAI API by prioritizing local excuses (70% local, 30% AI)  
- Voice synthesis functionality to fake calls using Web Speech API  
- Complete dark mode theme throughout the application  
- Realistic ringtone generation for fake calls using Web Audio API  
- Voice conversation starters when fake calls are answered  
- Improved accessibility and automatic theme detection for better UX  

---

## User Preferences

- Preferred communication style: Simple, everyday language  

---

## System Architecture

### Frontend

- **Framework:** React 18 with TypeScript, built using Vite  
- **UI Library:** Shadcn/ui components built on Radix UI for accessibility  
- **Styling:** Tailwind CSS with a custom iOS-inspired design system  
- **State Management:** TanStack Query for server state, React hooks for local state  
- **Routing:** Wouter for lightweight client-side routing  
- **PWA Features:** Service worker for offline support and manifest for installability  

### Backend

- **Runtime:** Node.js with Express.js  
- **Language:** TypeScript with ES modules  
- **API:** RESTful endpoints for excuse generation and retrieval  
- **Development Server:** Vite integrated with Hot Module Replacement (HMR)  
- **Build Process:** ESBuild for server bundling, Vite for client bundling  

### Data Storage

- **Production:** PostgreSQL hosted on Neon, accessed via Drizzle ORM  
- **Development:** In-memory storage for rapid iteration  
- **Local Storage:** 100+ hardcoded fallback excuses across 4 categories and 3 tones  
- **Schema Management:** Drizzle Kit for migrations  

### AI Integration

- **Provider:** OpenAI GPT-4o for approximately 30% of excuse generation requests  
- **Local-First:** Prioritizes fallback excuses for speed and reliability  
- **Features:** Context-aware, structured responses with believability scoring  
- **Error Handling:** Graceful fallback to local excuses when AI is unavailable  

---

## Mobile-First Design

- iOS-inspired UI with system colors and typography  
- Responsive with safe area handling for notched devices  
- PWA installable with offline support and native-like feel  
- Webcam integration for real video call feeds  
- Accessibility ensured via Radix UI primitives (keyboard navigation, screen readers)  

---

## External Dependencies

### Core Services

- OpenAI API (GPT-4o model) for intelligent excuse generation  
- Neon serverless PostgreSQL for production data  

### Development Tools

- Vite for frontend build and HMR  
- Drizzle Kit for database schema and migration management  
- TypeScript for type safety throughout the stack  

### UI & Styling

- Radix UI component primitives  
- Tailwind CSS with iOS design tokens  
- Font Awesome icons  
- Google Fonts (Inter)  

### State & Data Management

- TanStack Query for server state caching and error handling  
- React Hook Form for form management  
- Zod for runtime API schema validation  

### PWA & Mobile

- Custom service worker for offline caching  
- Web App Manifest for PWA installability  

