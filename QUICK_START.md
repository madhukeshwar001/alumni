# AlumNexus - Quick Start Guide 🚀

## One-Command Setup

```bash
pnpm install && pnpm dev
```

Open your browser to: **http://localhost:3000**

---

## 👤 Login Credentials (6 Demo Accounts)

Pick any role to explore:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| 🔐 Super Admin | super@alumnexus.in | super123 | Full control, all features |
| 👨‍💼 Admin | admin@alumnexus.in | admin123 | User management, campaigns |
| 🎓 Alumni | arjun.kumar@alumnexus.in | alumni123 | Mentor, post jobs, donate |
| 📚 Student | priya.sharma@alumnexus.in | student123 | Find mentors, apply for jobs |
| 👨‍🏫 Faculty | prof.mohan@alumnexus.in | faculty123 | Track students, host events |
| 🏢 Employer | hr@techcorp.in | employer123 | Post jobs, find talent |

---

## 🎯 What to Try First

### 1️⃣ **Login**
- Go to `/login`
- Click "Use Demo Credentials" button
- Or manually enter any credentials above

### 2️⃣ **Explore Dashboard**
- Each role has unique widgets
- View stats, recent activity, quick actions
- Try clicking cards and buttons

### 3️⃣ **Navigate Features**
- **Directory:** Search alumni by skills, industry, batch
- **Mentorship:** Request mentoring or offer mentoring
- **Opportunities:** Post or apply for jobs
- **Events:** Create events or register for them
- **Donations:** View campaigns and make donations
- **Admin:** Manage users, view analytics (admin only)

### 4️⃣ **Interactive Elements**
- 💫 Smooth page transitions
- 🎨 Beautiful animations on hover
- 📱 Try mobile view (responsive design)
- 🌓 Toggle dark mode in navbar
- 🔔 Check notifications in top-right

### 5️⃣ **Test Features**
- Create new records (events, opportunities)
- Apply/register for things
- Edit your profile
- Upload resume or portfolio links
- View activity logs
- Change theme preferences

---

## 🎨 Theme & Design

### Light Mode (Default)
- Clean, professional aesthetic
- Perfect for office/business use

### Dark Mode
- Click theme icon in navbar
- Easy on the eyes
- Modern dark aesthetic
- All colors optimized

---

## 📱 Responsive Layouts

### Desktop (> 1024px)
- Left sidebar navigation
- Full horizontal layout
- All features visible

### Tablet (640px - 1024px)
- Compact sidebar
- Bottom navigation added
- Adjusted spacing

### Mobile (< 640px)
- **Material Design bottom navigation**
- Stacked layouts
- Touch-friendly buttons
- Full screen content

---

## 🔥 Key Features to Explore

### Alumni Directory
**Location:** `/directory`
- Filter by department, batch year, industry
- Search by name or skills
- View professional profiles
- See mentoring availability

### Mentorship Module
**Location:** `/mentorship`
- Send mentorship requests
- View pending requests
- Manage mentoring relationships
- Schedule meetings

### Job Opportunities
**Location:** `/opportunities`
- Browse job postings
- Apply for internships/full-time roles
- Track application status
- Post opportunities (alumni/employer)

### Events
**Location:** `/events`
- View upcoming events
- Register for events
- Host new events (admin)
- Track attendance

### Fundraising
**Location:** `/donations`
- View active campaigns
- Make donations (any amount)
- Track donation history
- Create campaigns (admin)

### Admin Dashboard
**Location:** `/admin/dashboard`
- Manage users
- View analytics
- Create departments
- Manage campaigns
- (Accessible only to admins)

### User Profile
**Location:** `/profile`
- Edit profile information
- View career timeline
- Update professional details
- Set mentoring preferences

### Settings
**Location:** `/settings`
- Toggle notifications
- Change theme
- Update display preferences
- Manage account

---

## 🎬 What's Animated?

✨ **Page Transitions** - Smooth fade + slide
✨ **Card Hovers** - Subtle lift effect
✨ **Modals** - Pop-in animation
✨ **Lists** - Staggered item animation
✨ **Buttons** - Press feedback
✨ **Loaders** - Smooth spinners

---

## 🌍 Regional Context

The app is tailored for **Tamil Nadu engineering institutions**:
- TN university names
- Chennai-based locations
- Tamil names and references
- Indian currency (₹)
- Indian calendar events
- Relevant job sectors

---

## 🔑 Important Notes

### Data Storage
- All data stored in **browser LocalStorage**
- Persists across page refreshes
- Clears when you clear browser data
- Each browser has separate data

### Limitations
- **Frontend-only** (no backend)
- Demo data only
- No real email/payment processing
- Perfect for demonstrations!

### What Works
✅ User login and roles
✅ Profile creation/editing
✅ Creating events/jobs/campaigns
✅ Applying/registering
✅ Notifications
✅ Theme switching
✅ Responsive design
✅ All UI interactions

### What Doesn't
❌ Real email sending
❌ Real payment processing
❌ File uploads
❌ Real database

---

## 🚀 Advanced Testing

### Test Different Roles
1. Login as **Super Admin** → Manage everything
2. Login as **Alumni** → Create opportunities
3. Login as **Student** → Apply to jobs
4. Switch back to Alumni → See student's application
5. Approve from Admin panel

### Test All Pages
```
Dashboard → Directory → Mentorship → Opportunities → 
Events → Donations → Profile → Settings → 
Admin (Users, Analytics, Departments, Campaigns)
```

### Test Mobile Experience
1. Open DevTools (F12)
2. Click device toolbar (mobile icon)
3. Select iPhone/Android
4. Explore bottom navigation
5. Try portrait/landscape modes

### Test Dark Mode
1. Click theme icon (☀️/🌙) in navbar
2. Notice all colors adjust
3. Try on different pages
4. Persists after refresh

---

## 🎓 User Journey Examples

### Example 1: Alumni Mentoring
```
Super Admin → Admin → Alumni (Arjun)
1. Login as Arjun (alumni)
2. Go to Mentorship
3. Click "Offer Mentorship"
4. Switch to Priya (student)
5. Go to Mentorship
6. Send request to Arjun
7. Switch back to Arjun
8. See and accept request
```

### Example 2: Job Application
```
1. Login as Arjun (alumni)
2. Go to Opportunities
3. Create new opportunity
4. Switch to Priya (student)
5. Go to Opportunities
6. Apply to Arjun's job
7. Go back to Arjun
8. See Priya's application
9. Change status to "Shortlisted"
```

### Example 3: Event Management
```
1. Login as Admin
2. Create new event
3. Go to Events as Alumni
4. Register for event
5. Back to Admin
6. See registration
7. Mark as attended
```

---

## 💡 Tips & Tricks

- **Search everywhere** - Use search bars to filter data
- **Click cards** - Most cards are clickable for details
- **Hover states** - Notice subtle hover effects
- **Form validation** - Required fields are marked
- **Toast messages** - Check top-right for feedback
- **Mobile first** - The bottom nav is mobile-optimized
- **Theme persistent** - Your theme choice is saved
- **Deep links** - Direct links to each page work

---

## 🎉 You're All Set!

Start with the login page and explore. Every interaction has thoughtful feedback, smooth animations, and proper validation.

**Enjoy exploring AlumNexus!** 🚀

---

## 📞 Troubleshooting

### Port 3000 already in use?
```bash
# Use different port
pnpm dev -- -p 3001
```

### Dependencies not installing?
```bash
# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### localStorage cleared?
- Click "Use Demo Credentials" to refill data
- Refresh page with F5

### Animations lagging?
- Close other apps
- Use modern browser (Chrome/Edge recommended)

---

**Happy Exploring!** ✨
