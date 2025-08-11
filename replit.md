# Overview

ExitScript is a mobile-first Progressive Web Application (PWA) designed to help users generate AI-powered excuses for uncomfortable social situations. The app provides quick excuse generation across various categories (work, family, health, transport) with different tones, and includes realistic fake call and video call features with voice synthesis to help users exit situations safely. Built as a full-stack TypeScript application with a React frontend and Express backend.

## Recent Changes (August 2025)
- Implemented comprehensive local fallback excuse system with 20-25 excuses per tone/category
- Added realistic webcam integration for video calls showing actual user video feed
- Enhanced video calls with simulated caller video using CSS animations and graphics
- Reduced dependency on OpenAI API by prioritizing local excuses (70% local, 30% AI)
- Added voice synthesis functionality to fake calls using Web Speech API
- Implemented complete dark mode theme throughout the entire application  
- Enhanced fake calls with realistic ringtone generation using Web Audio API
- Added voice conversation starters when fake calls are answered
- Improved accessibility and user experience with automatic theme detection

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom iOS-inspired design system
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **PWA Features**: Service worker for offline functionality, manifest for installability

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for excuse generation and retrieval
- **Development Server**: Integrated Vite development server with HMR
- **Build Process**: ESBuild for server bundling, Vite for client bundling

## Data Storage
- **Production**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Development**: In-memory storage implementation for rapid development
- **Local Storage**: Comprehensive fallback excuse database with 100+ excuses across 4 categories and 3 tones
- **Schema**: Simple excuse storage with category, tone, content, and timestamps
- **Migration**: Drizzle Kit for database schema management

## AI Integration
- **Provider**: OpenAI GPT-4o for occasional excuse generation (30% of requests)
- **Local-First**: Prioritizes 100+ hardcoded fallback excuses for reliability and speed
- **Features**: Context-aware excuse generation based on category and tone
- **Output**: Structured responses with believability scoring and source tracking
- **Error Handling**: Graceful fallbacks to local excuses when AI service is unavailable

## Mobile-First Design
- **UI Pattern**: iOS-inspired interface with iOS system colors and typography
- **Responsive**: Mobile-optimized with safe area handling for notched devices
- **PWA**: Installable app with offline support and native-like experience
- **Video Features**: Webcam integration for realistic video calls with actual user video feed
- **Accessibility**: Radix UI primitives ensure keyboard navigation and screen reader support

# External Dependencies

## Core Services
- **OpenAI API**: GPT-4o model for intelligent excuse generation
- **Neon Database**: Serverless PostgreSQL hosting for production data storage

## Development Tools
- **Vite**: Frontend build tool with hot module replacement
- **Drizzle Kit**: Database migration and schema management
- **TypeScript**: Type safety across frontend, backend, and shared schemas

## UI & Styling
- **Radix UI**: Accessible component primitives for dialog, form, and navigation components
- **Tailwind CSS**: Utility-first styling with custom iOS design tokens
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Inter font family for typography

## State & Data Management
- **TanStack Query**: Server state management with caching and error handling
- **React Hook Form**: Form validation and management
- **Zod**: Runtime type validation for API requests and responses

## PWA & Mobile
- **Service Worker**: Custom implementation for offline functionality and caching
- **Web App Manifest**: PWA configuration for installability and app-like behavior