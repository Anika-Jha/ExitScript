# Overview

ExitScript is a mobile-first Progressive Web Application (PWA) designed to help users generate AI-powered excuses for uncomfortable social situations. The app provides quick excuse generation across various categories (work, family, health, transport) with different tones, and includes a fake call feature to help users exit situations safely. Built as a full-stack TypeScript application with a React frontend and Express backend.

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
- **Schema**: Simple excuse storage with category, tone, content, and timestamps
- **Migration**: Drizzle Kit for database schema management

## AI Integration
- **Provider**: OpenAI GPT-4o for excuse generation
- **Features**: Context-aware excuse generation based on category and tone
- **Output**: Structured responses with believability scoring
- **Error Handling**: Graceful fallbacks when AI service is unavailable

## Mobile-First Design
- **UI Pattern**: iOS-inspired interface with iOS system colors and typography
- **Responsive**: Mobile-optimized with safe area handling for notched devices
- **PWA**: Installable app with offline support and native-like experience
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