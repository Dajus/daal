# Overview

DAAL Web Application is a comprehensive workplace safety training platform designed for the DAAL company. The system provides interactive course management with theory content delivery, testing capabilities, and automated certificate generation. It features a dual-interface design supporting both administrative management and student learning experiences.

# User Preferences

Preferred communication style: Simple, everyday language.
Language preference: Czech language for all user-facing text and interface elements throughout the entire application.

# System Architecture

## Frontend Architecture
The application uses a React-based single-page application (SPA) built with Vite as the bundler. The frontend leverages TypeScript for type safety and follows a component-based architecture using shadcn/ui components built on Radix UI primitives. The routing is handled by Wouter for lightweight client-side navigation.

**Key Design Decisions:**
- **Component Library:** shadcn/ui with Radix UI provides accessible, customizable components
- **State Management:** TanStack Query for server state management and caching
- **Styling:** Tailwind CSS with CSS custom properties for theming
- **Type Safety:** Full TypeScript implementation across all components

## Backend Architecture
The server uses Express.js with a custom middleware setup for request logging and error handling. The API follows RESTful conventions with JWT-based authentication for admins and session-based authentication for students.

**Authentication Strategy:**
- **Admin Authentication:** JWT tokens with username/password login
- **Student Authentication:** Access code system with name/email verification
- **Session Management:** Student sessions tracked in database for progress monitoring

**API Design:**
- Separate route handlers for admin and student endpoints
- Middleware-based authentication guards
- Centralized error handling with consistent response formats

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema supports multi-tenant course management with detailed tracking of student progress.

**Database Schema Design:**
- **Course Management:** Flexible course structure with theory slides and test questions
- **User Management:** Separate admin and student session tables
- **Progress Tracking:** Detailed attempt history and completion status
- **Certificate System:** Automated certificate generation with verification codes

**Key Tables:**
- `admins` - Administrative user accounts
- `courses` - Course definitions with configuration
- `companies` - Company/organization management
- `accessCodes` - Course access control system
- `studentSessions` - Student enrollment and progress
- `testAttempts` - Detailed test result tracking
- `certificates` - Generated certificates with verification

## File Upload and Media Management
The system supports file uploads through integration with cloud storage services, specifically designed for course media content like images and videos in theory slides.

**Media Strategy:**
- Cloud-based storage for scalability
- Support for multiple media types in theory content
- Optimized delivery for learning materials

## PDF Generation System
Certificate generation is handled client-side using jsPDF, providing immediate certificate delivery upon test completion.

**Certificate Features:**
- Professional PDF layout with company branding
- Unique verification codes for authenticity
- Automated generation upon passing test scores
- Download and sharing capabilities

## Development and Deployment Setup
The project uses a monorepo structure with shared TypeScript types between frontend and backend. The build process compiles both client and server code with appropriate bundling strategies.

**Build Strategy:**
- Vite for frontend bundling with React optimization
- esbuild for server-side bundling with Node.js compatibility
- Shared type definitions in `/shared` directory
- Environment-based configuration management

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database for data persistence
- **Drizzle ORM**: Type-safe database operations and migrations

## Authentication and Security
- **bcrypt**: Password hashing for admin accounts
- **jsonwebtoken**: JWT token generation and verification
- **Custom access code system**: For student authentication

## UI and Frontend Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing library
- **Lucide React**: Icon library

## PDF and Document Generation
- **jsPDF**: Client-side PDF generation for certificates

## Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the application
- **ESBuild**: Server-side bundling
- **Replit**: Development environment integration

## File Storage (Configured)
- **Google Cloud Storage**: Media file storage for course content
- **Uppy**: File upload interface components

The application is designed for deployment on Vercel or similar platforms, with database connections configured for Neon PostgreSQL and environment-based configuration management.