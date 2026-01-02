# Recent Features & Improvements

## Last 5 Git Commits Summary

### 🎨 Commit 1: Profile Page Redesign & Contribution Heatmap (Latest)
**Author**: Tejas Dherange | **Date**: Jan 02, 2026

#### Major Features Added:
- **Profile Page Complete Redesign**:
  - Full-width layout (99vw) with premium glassmorphism effects
  - Gradient backgrounds and card-based design
  - Animated avatar with hover effects and image upload button
  - Quick stats cards with gradient backgrounds
  - Smooth scale and rotation animations on all interactive elements
  - Improved info cards with icon transitions
  - Sticky sidebar for better UX

- **Contribution Heatmap Year Selector**:
  - Added year selector to view contributions for current year and past 2 years
  - Refresh button with spinning animation
  - Auto-updates when code is submitted
  - Fixed date filtering to show correct year's data
  - Backend updated to fetch 3 years of submission data

- **Code Editor Boilerplate Hiding**:
  - Created `codeTemplates.js` utility to extract user-editable code
  - Hides imports, input reading, and main method wrappers
  - Shows only the core function (like LeetCode)
  - Supports JavaScript, Python, and Java
  - Automatically merges hidden code during execution
  - Works with existing database structure (no migration needed)

- **Unit Conversions**:
  - Memory displayed in MB (converted from KB)
  - Time displayed in milliseconds (converted from seconds)
  - Applied to both `RunResultsTable` and `Submission` components

#### Improvements:
- **Text Colors**: Made text colors more natural and professional (removed AI-generated gradient look)
- **Monaco Editor**: Enhanced with font ligatures, smooth cursor animation, bracket colorization
- **Submission Component**: Added modern complexity graph with dual-chart visualization (Bar + Doughnut)
- **Better Typography**: Improved font weights and sizes across profile page

#### Files Changed:
- `ProfilePage.jsx` - Complete UI/UX redesign
- `ContributionHeatmap.jsx` - Year selector and auto-refresh
- `contribution.controllers.js` - Extended date range to 3 years
- `useActivityStore.js` - State management for contributions
- `codeTemplates.js` - NEW utility for code parsing
- `ProblemPage.jsx` - Code hiding implementation
- `Submission.jsx` - Complexity visualization
- `RunResultsTable.jsx` - Unit conversions

#### Bug Fixes:
- Fixed heatmap date filtering for correct year display
- Resolved timezone issues with contribution dates
- Fixed activity auto-refresh on new submissions

---

### 🎯 Commit 2: UI/UX Modernization & Contest System Polish
**Author**: Tejas Dherange | **Date**: Jan 01, 2026

#### Major Features Added:
- **Pricing Page Redesign**: Implemented dark theme with emerald accents, animated backgrounds, and "Glassmorphism" pricing cards.
- **Contest Page Overhaul**:
  - Completely redesigned with focus on "Code. Compete. Conquer." branding.
  - Added new "Stats HUD" for live/upcoming insights.
  - Implemented "Explore Contests" section with integrated search.
  - Fixed infinite loading bug in `ContestsTable` by optimizing fetch logic.
- **Create Contest Page Update**:
  - Matched aesthetic with glassmorphic forms and animated backdrops.
  - Improved form UX with step-like sections and better input states.

#### Improvements:
- **Unified Design Language**: Consistent use of Emerald Green accents and framer-motion animations across key pages.
- **Performance**: Resolved re-rendering loops in contest data fetching.
- **Responsive Layouts**: Full-width header designs and responsive grid layouts for stats and cards.

#### Files Changed:
- `PricingPage.jsx`
- `ContestPage.jsx`
- `CreateContestPage.jsx`
- `ContestsTable.jsx`

---

### 🎯 Commit 2: Pattern Management System
**Author**: Tejas Dherange | **Date**: Dec 31, 2025

#### Major Features Added:
- **Pattern Detail Page**: Comprehensive view for individual patterns with problem filtering and progress tracking
- **Patterns Page**: Interactive listing of all available learning patterns with search functionality
- **Pattern Store**: Complete state management solution using Zustand for patterns (CRUD operations)
- **Admin Features**:
  - Create, update, and delete patterns
  - Add/remove problems to patterns
  - Manage pattern visibility and ordering
- **User Features**:
  - View all patterns with progress indicators
  - Filter problems by difficulty and status
  - Track completion progress for each pattern
  - Search patterns by name or description

#### New Components:
- `PatternDetailPage.jsx` - Individual pattern view with problem management
- `PatternsPage.jsx` - Pattern listing with search and progress recalculation
- `AddProblemToPatternModal.jsx` - Modal for adding problems to patterns
- `CreatePatternModal.jsx` - Modal for creating/editing patterns
- `ManagePatternsPage.jsx` - Admin dashboard for pattern management
- `PatternCard.jsx` - Reusable pattern display component
- `usePatternStore.js` - Zustand store for pattern state management

#### Backend Implementation:
- **New API Routes**: `/api/patterns/*` with full CRUD operations
- **Pattern Controllers**: 725 lines of new controller logic
- **Database Schema**: Added Pattern, ProblemInPattern, and PatternProgress models
- **Seed Data**: Automated seeding for common patterns (Two Pointers, Sliding Window, etc.)

#### Files Changed: 26 files | +9,570 additions, -211 deletions

---

### 🎨 Commit 3: Shadcn/UI Integration & Skeleton Loading
**Author**: Tejas Dherange | **Date**: Nov 29, 2025 (5 weeks ago)

#### Features:
- **Shadcn/UI Setup**: Integrated shadcn component library
- **Skeleton Components**: Added loading skeletons for better UX
- **Enhanced Profile Page**: Redesigned with skeleton loading states
- **Contest Improvements**: Better loading indicators for contest submissions
- **TypeScript Configuration**: Added comprehensive TS support

#### New Files:
- `components.json` - Shadcn configuration
- `skeleton.tsx` - Reusable skeleton component
- `utils.ts` - Utility functions for className merging
- TypeScript configs (`tsconfig.app.json`, `tsconfig.json`, `tsconfig.node.json`)

#### Dependencies Added:
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- TypeScript support packages

#### Files Changed: 15 files | +548 additions, -196 deletions

---

### 🔍 Commit 4: Submission Fetching Issue Resolution
**Author**: Tejas Dherange | **Date**: Nov 29, 2025 (5 weeks ago)

#### Bug Fixes:
- **Fixed Submission Fetching**: Resolved issues with retrieving user submissions
- **Improved Submission Controllers**: Refactored logic for better error handling
- **Enhanced Store Methods**: Added new methods to `useSubmissionStore`
- **UI Improvements**: Updated HomePage and ProblemPage for better submission display

#### Affected Areas:
- Submission retrieval API
- User submission history display
- Problem-specific submission viewing
- Authentication flow in submission context

#### Files Changed: 7 files | +166 additions, -148 deletions

---

### 🔐 Commit 5: Google OAuth Login Implementation
**Author**: Tejas Dherange | **Date**: Nov 29, 2025 (5 weeks ago)

#### Major Features:
- **Google OAuth Integration**: Complete OAuth 2.0 login flow with Passport.js
- **Set Password Modal**: Allow OAuth users to set passwords for traditional login
- **Enhanced Authentication**: Support for both traditional and social login
- **Comprehensive Documentation**: Added setup guides and implementation summaries

#### New Features:
- Google Sign-In button on login page
- Automatic account linking for existing emails
- OAuth profile data synchronization
- Secure session management with Google tokens

#### Backend Implementation:
- **Passport.js Integration**: Google OAuth 2.0 strategy
- **Auth Controllers**: Extended with OAuth endpoints
- **Database Schema**: Added `googleId` and `profilePicture` fields to User model
- **Session Management**: Enhanced cookie and session handling

#### Documentation Added:
- `GOOGLE_OAUTH_SETUP.md` - Complete setup guide (94 lines)
- `IMPLEMENTATION_SUMMARY.md` - Detailed implementation docs (265 lines)
- `GoogleAuth.example.jsx` - Example implementation (256 lines)

#### Dependencies Added:
- `passport`
- `passport-google-oauth20`

#### Files Changed: 23 files | +1,330 additions, -116 deletions

---

## Summary Statistics

### Total Changes Across Last 5 Commits:
- **75+ files changed**
- **+13,000+ additions**
- **-900+ deletions**

### Key Features:
1. ✅ UI/UX Modernization (Pricing, Contests)
2. ✅ Complete Pattern Management System
3. ✅ Google OAuth Social Login
4. ✅ Shadcn/UI Component Library
5. ✅ Skeleton Loading States
6. ✅ Submission System Improvements

### Technologies Used:
- React 19
- Zustand (State Management)
- Prisma ORM
- Passport.js (OAuth)
- Shadcn/UI
- TypeScript
- Framer Motion
- TailwindCSS

---

**Last Updated**: Jan 01, 2026
