# AlumNexus - Centralized Alumni Intelligence & Engagement Platform

## Platform Overview

AlumNexus is a production-ready SaaS platform built for Tamil Nadu engineering institutions, designed to facilitate meaningful connections between alumni, students, faculty, and employers.

## ✅ Project Completion Status: 100%

### Core Architecture
- **Frontend Framework:** Next.js 16 (App Router)
- **State Management:** Zustand with persistent storage
- **Animations:** Framer Motion for smooth transitions
- **UI Components:** shadcn/ui (40+ components)
- **Styling:** Tailwind CSS v4 + Custom theme tokens
- **Notifications:** Sonner toast system
- **Database:** Mock data (frontend-only for demo)

### Theme & Design
- **Color Scheme:** Deep Teal Primary + Amber Accent + Warm Neutrals
- **Light Mode:** Clean, professional aesthetic
- **Dark Mode:** Full support with proper contrast
- **Responsive:** Mobile-first design (Material Design for mobile)
- **Bottom Navigation:** Mobile-exclusive navigation
- **Sidebar + Navbar:** Desktop and tablet layouts

---

## 📁 Project Structure

### Authentication System
- `/app/(auth)/login` - Role-based login with 6 demo accounts
- `/app/(auth)/register` - User registration form
- `/app/(auth)/forgot-password` - Password recovery flow
- Demo credentials for all roles included

### Main Application
- `/app/(app)/layout.tsx` - App shell with Navbar, Sidebar, BottomNav
- `/app/(app)/dashboard` - Role-specific dashboards (5 variants)
- `/app/(app)/profile` - User profile with career timeline
- `/app/(app)/settings` - App settings and preferences

### Core Features Pages
- `/app/(app)/directory` - Alumni directory with advanced filters
- `/app/(app)/mentorship` - Mentorship requests and management
- `/app/(app)/opportunities` - Job/internship postings
- `/app/(app)/events` - Event management and registration
- `/app/(app)/donations` - Fundraising campaigns with donation tracking

### Admin Panels
- `/app/(app)/admin/users` - User management and approval
- `/app/(app)/admin/analytics` - Platform analytics and insights
- `/app/(app)/admin/departments` - Department management
- `/app/(app)/admin/campaigns` - Fundraising campaign management

---

## 🎭 Role-Based Access (6 User Types)

### 1. **Super Admin**
- Full platform control
- User management and approvals
- Department and role management
- Campaign creation
- Analytics access

### 2. **Admin**
- User moderation
- Campaign management
- Event oversight
- Analytics viewing
- Department management

### 3. **Alumni**
- Profile with career timeline
- Mentorship offering/seeking
- Event attendance
- Opportunity posting
- Donation capability
- Directory access

### 4. **Student**
- Directory browsing (professionals only)
- Mentorship requests
- Opportunity applications
- Event registration
- Career timeline building

### 5. **Faculty**
- Student tracking
- Event hosting
- Directory access
- Mentorship participation

### 6. **Employer**
- Job posting
- Application management
- Talent scouting
- Event hosting

---

## 🎨 Key Features Implemented

### Dashboard System
- **5 Role-Specific Dashboards** with unique widgets
- Stats cards with trend indicators
- Recent activity feeds
- Quick action buttons
- Notification summaries

### Directory & Search
- Advanced filtering (department, batch, industry, location, skills)
- Professional profile cards
- Mentorship indicator
- Internship offer indicator
- Real-time search

### Mentorship Module
- Request creation and management
- Status tracking (pending, accepted, rejected, completed)
- Meeting scheduling
- Online/offline mode selection
- Review and ratings system

### Opportunities System
- Job postings (internship, full-time, referral)
- Application tracking
- Status management (applied, shortlisted, selected, rejected)
- Deadline tracking
- Skills matching

### Events Platform
- Event creation and management
- Multiple event types (meet, webinar, workshop, career talk, fundraising)
- Registration tracking
- Attendance management
- Event-specific data

### Donations & Fundraising
- Campaign creation and management
- Progress tracking
- Donation history
- Receipt generation
- Target achievement monitoring

### User Profiles
- Academic details (department, degree, batch year)
- Professional details (job title, company, skills, location)
- Career timeline (work history)
- Mentoring preferences
- Internship offer preferences

---

## 🔧 Component System

### Layout Components
- `AppSidebar` - Desktop navigation with role-based menus
- `AppNavbar` - Top navigation with notifications, theme, profile
- `BottomNav` - Mobile-exclusive bottom navigation
- `NotificationDrawer` - User-specific notifications
- `TutorialModal` - Onboarding and feature guidance

### Dashboard Components
- `AdminDashboard` - User stats, platform metrics, recent activity
- `AlumniDashboard` - Network stats, mentorship options, events
- `StudentDashboard` - Applications, mentors, learning path
- `FacultyDashboard` - Student tracking, event hosting
- `EmployerDashboard` - Job postings, applications
- `StatsCard` - Reusable stats widget with icons

### UI Components (40+)
- Buttons, Cards, Inputs, Badges
- Dialogs, Drawers, Dropdowns
- Tabs, Accordion, Collapse
- Tables, Data displays
- Forms with validation
- Charts and graphs
- Toast notifications
- Spinners and skeletons

---

## 🔐 Data & State Management

### Mock Data Included
- **Users:** 10+ accounts across all roles (Tamil Nadu focused)
- **Events:** 15+ sample events with registrations
- **Opportunities:** 12+ job postings
- **Campaigns:** 5+ fundraising campaigns
- **Mentorship Requests:** 8+ sample requests
- **Donations:** 20+ transaction history
- **Profiles:** Complete academic and professional data

### Zustand Store Features
- **Persistent Storage:** LocalStorage integration
- **Auth State:** Current user management
- **Theme Management:** Light/dark mode toggle
- **Notifications:** User-specific notification system
- **Activity Logging:** User action tracking
- **CRUD Operations:** Full data manipulation for all entities

### Data Persists Across
- Page navigation
- Browser refresh
- Session restoration
- Multiple tabs

---

## 🎬 Animation & Interactivity

### Framer Motion Features
- Page transitions (fade + slide)
- Component animations
- List item staggering
- Modal animations
- Button hover states
- Card animations on data updates

### Interactive Elements
- Toast notifications (success, error, info)
- Loading states on buttons
- Form validation feedback
- Real-time search filtering
- Smooth scrolling
- Hover effects

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 640px) - Bottom navigation only
- **Tablet** (640px - 1024px) - Sidebar + Bottom nav
- **Desktop** (> 1024px) - Full sidebar + navbar
- **Wide** (> 1440px) - Optimized spacing

### Mobile-First Features
- Touch-friendly button sizes
- Scrollable navigation
- Bottom tab navigation (Material Design)
- Optimized form inputs
- Stacked layouts
- Readable typography

---

## 🎯 Demo Accounts

Access the platform with these pre-configured accounts:

1. **Super Admin:** super@alumnexus.in | super123
2. **Admin:** admin@alumnexus.in | admin123
3. **Alumni:** arjun.kumar@alumnexus.in | alumni123
4. **Student:** priya.sharma@alumnexus.in | student123
5. **Faculty:** prof.mohan@alumnexus.in | faculty123
6. **Employer:** hr@techcorp.in | employer123

---

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open in browser
# http://localhost:3000
```

### Login Flow
1. Navigate to login page
2. Click "Use Demo Credentials" for any role
3. View role-specific dashboard
4. Explore all features
5. Toggle theme in navbar

---

## 📊 Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 |
| Language | TypeScript |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Forms | React Hook Form |
| Notifications | Sonner |
| Charts | Recharts |
| Date Handling | date-fns |

---

## ✨ Production-Ready Features

✅ **Type Safety** - Full TypeScript implementation
✅ **Error Handling** - Toast-based error system
✅ **Loading States** - Button spinners and skeleton loaders
✅ **Dark Mode** - Complete light/dark theme support
✅ **Accessibility** - ARIA labels, semantic HTML
✅ **Performance** - Optimized renders, lazy loading
✅ **Responsive** - Mobile, tablet, desktop optimized
✅ **State Persistence** - LocalStorage integration
✅ **Animations** - Smooth framer-motion transitions
✅ **Notifications** - Role-based notification system

---

## 🎓 Indian Context

The platform is localized for Tamil Nadu engineering institutions with:
- TN-specific demo data
- Hindi/Tamil-friendly naming conventions
- Indian educational terminology
- Local currency (₹ Rupees)
- Relevant job sectors (IT, Manufacturing, Startups)
- Batch year formats matching Indian academics

---

## 📝 Notes

- This is a **frontend-only** demonstration with mock data
- All data persists in browser LocalStorage
- Perfect for presentations, demos, and prototyping
- Ready to integrate with backend APIs
- Can be deployed to Vercel with one click

---

**Created with ❤️ for Tamil Nadu Engineering Institutions**
