# Overview

DAAL Web Application is a comprehensive workplace safety training platform designed for the DAAL company. The system provides interactive course management with theory content delivery, testing capabilities, and automated certificate generation. It features a dual-interface design supporting both administrative management and student learning experiences.

# User Preferences

Preferred communication style: Simple, everyday language.
Language preference: Czech language for all user-facing text and interface elements throughout the entire application.

**Czech Localization Status**: Completed comprehensive Czech translation implementation with centralized translations.ts system covering:
- Complete admin interface (dashboard, course editor, code generator, analytics)
- Student interface (theory viewer, test interface, progress tracking)
- Landing page and navigation
- All form elements, buttons, messages, and user feedback
- Certificate generation and PDF content
- Error messages and validation text

Update: January 5, 2025 - Full Czech localization successfully implemented across entire platform.

Update: January 6, 2025 - Successfully implemented working drag-and-drop functionality for course content reordering:
- Fixed timestamp field handling in database updates during drag operations
- Implemented efficient range-based updates (only items that moved are updated)
- Added optimistic cache updates for immediate UI response
- Resolved performance issues and bouncing effects
- Drag and drop now works smoothly for both theory slides and test questions

Update: January 6, 2025 - **MAJOR**: Implemented shared access code functionality for classroom scenarios:
- **Problem Solved**: Previous system only supported individual access codes (1 code = 1 person)
- **New Capability**: Multiple students (20-150) can now use the same access code simultaneously
- **Real-world Use Case**: Company with 150 members in one room, 50-minute course, single teacher-provided code
- **Technical Changes**: 
  - Modified authentication logic to allow multiple concurrent sessions per access code
  - Changed usage limit checking from total count to active session count
  - Added unique session identification by name+email+code combination
  - Supports classroom scenarios where multiple people can have similar emails/names
- **Backward Compatibility**: Existing access codes continue to work as before

Update: January 7, 2025 - **COMPLETED**: Full course delete functionality with proper cascade handling:
- **Problem Solved**: Course deletion was failing due to foreign key constraint violations
- **Technical Implementation**: 
  - Fixed deletion order: certificates → test attempts → student sessions → access codes → theory slides/questions → course
  - Added proper inArray import and step-by-step deletion logic
  - Implemented cache invalidation for both courses and access codes lists
- **User Experience**: Hover-to-reveal delete button with comprehensive Czech confirmation dialog
- **Data Safety**: Complete cascade deletion removes all related data without orphaned records
- **UI Integration**: Automatic selection reset and immediate list refresh after deletion

Update: January 7, 2025 - **COMPLETED**: Seamless theory-to-test transition with loading experience:
- **Problem Solved**: White screen delay and jarring transition when navigating from theory completion to test
- **Technical Solution**: 
  - Replaced browser navigation (window.location.href) with React Router navigation (setLocation)
  - Added enhanced loading overlay with professional animations and progress indicators
  - Implemented proper transition state management and cleanup
- **UX Improvements**: 
  - Completely eliminated white screen flash during navigation
  - Added smooth loading animations with spinner, progress bar, and bouncing dots
  - Applied comprehensive Czech messaging and dark mode styling
  - Reduced transition time to 1.5 seconds for optimal user experience
- **Technical Impact**: Maintains application state during navigation, providing seamless single-page application experience

Update: January 7, 2025 - **COMPLETED**: Unified loading spinner system across entire application:
- **Problem Solved**: Inconsistent loading indicators (different spinners, balls, progress bars, skeletons) throughout app
- **Technical Implementation**:
  - Created centralized Spinner and LoadingScreen components with consistent emerald theme
  - Standardized all loading states to use bigger, professional spinners
  - Removed complex animations (bouncing dots, progress bars) in favor of clean spinner design
  - Added size variants (sm, md, lg, xl) for different contexts
- **Components Updated**: Theory viewer, test interface, certificate viewer, analytics, student dashboard
- **User Experience**: Clean, consistent loading experience with proper Czech messaging and dark mode support

Update: January 8, 2025 - **CRITICAL BUG FIX**: Resolved major analytics data integrity issue:
- **Problem Solved**: Students who never took tests were incorrectly showing "20%" test scores in analytics
- **Root Cause**: Drizzle ORM SQL subqueries were returning corrupted data, mixing results from different sessions
- **Technical Solution**: 
  - Completely rewrote backend analytics query in `getCompanyAccessCodesDetailed` method
  - Replaced buggy SQL subqueries with separate sequential queries for each student session
  - Fixed data mapping to ensure NULL test scores display correctly as NULL, not false percentages
- **Data Integrity**: Analytics now accurately displays actual test performance vs. no-test status
- **Impact**: Company admin analytics now show reliable, trustworthy data for training compliance tracking

Update: January 8, 2025 - **COMPLETED**: Accordion interface for company administration analytics:
- **Problem Solved**: Company analytics detailed section was overwhelming with all access codes expanded
- **Implementation**: 
  - Added nested accordion structure for course types and individual access codes
  - All sections default to closed state for better organization and overview
  - Two-level accordion: Course level → Access code level → Student details
  - Maintains all functionality while improving UX with collapsible sections
- **User Experience**: Clean, organized interface where admins can focus on specific courses/codes
- **Technical**: Used shadcn/ui Accordion components with proper Czech styling and emerald theme

Update: January 8, 2025 - **COMPLETED**: Logout loading overlay system across entire application:
- **Problem Solved**: White screen flash during logout process for both admin and student users
- **Technical Implementation**:
  - Created LoadingOverlay component with fullscreen backdrop and professional spinner
  - Modified logout function to accept React Router navigation callback
  - Added loading state management with 1.5 second delay for smooth transition
  - Replaced window.location.href with React Router navigation to eliminate white screen
- **Coverage**: Implemented across all logout points (admin dashboard, student dashboard, admin codes, admin courses)
- **User Experience**: Seamless logout with professional "Odhlašování..." message and loading animation
- **Consistency**: Unified with existing loading system using emerald theme and Czech localization

Update: January 8, 2025 - **COMPLETED**: Image upload and lightbox viewer system for theory slides:
- **Problem Solved**: Large image uploads failing due to Express body size limits, and oversized images affecting readability
- **Technical Implementation**:
  - Increased Express body parser limits to 50MB for image uploads
  - Added responsive CSS styling for automatic image resizing (max-height: 400px, responsive width)
  - Implemented full-screen lightbox modal for detailed image viewing
  - Added hover effects and click indicators for enhanced user experience
- **Features**: Click any image to view full-size with dark overlay, close button, and "click to close" functionality
- **User Experience**: Professional image handling with automatic sizing and easy full-screen viewing for detailed content like receipts/documents
- **Cross-Platform**: Works on all screen sizes with proper responsive scaling

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