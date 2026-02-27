"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = {
  ALUMNI: [
    { title: "Dashboard", description: "Your personal dashboard shows profile completion, mentorship stats, events attended, and donations made. Animated counters keep your progress visible at a glance.", icon: "📊" },
    { title: "Directory", description: "Browse the alumni directory. Filter by department, batch year, industry, location, or skills. Click any profile to see full details and connect.", icon: "👥" },
    { title: "Mentorship", description: "Manage incoming mentorship requests from students. Accept, reject, schedule meetings, and mark sessions as complete. Students will be notified instantly.", icon: "🤝" },
    { title: "Opportunities", description: "Post internships, full-time jobs, or referral openings for students at your company. View applications and update statuses.", icon: "💼" },
    { title: "Events", description: "Register for alumni meets, webinars, workshops, and career talks. Receive reminders and feedback forms after events.", icon: "📅" },
    { title: "Donations", description: "Support active fundraising campaigns for the college. Make donations, track campaign progress, and view your donation history.", icon: "❤️" },
  ],
  STUDENT: [
    { title: "Dashboard", description: "Track your mentors connected, internship applications, and event registrations all from one place.", icon: "📊" },
    { title: "Directory", description: "Explore alumni profiles. Search by skills, industry, or company to find the right mentor or referral contact.", icon: "👥" },
    { title: "Mentorship", description: "Send mentorship requests to alumni. Write a personalized message, track request status, and review mentors after sessions.", icon: "🤝" },
    { title: "Opportunities", description: "Browse internship and job openings posted by alumni. Apply with your resume and track application status in real-time.", icon: "💼" },
    { title: "Events", description: "Register for events, workshops, and career talks. A great way to network with alumni and industry professionals.", icon: "📅" },
  ],
  ADMIN: [
    { title: "Dashboard", description: "Monitor platform-wide stats including total alumni, students, events, mentorships, and donations with visual growth charts.", icon: "📊" },
    { title: "User Management", description: "Approve alumni profiles, change user roles, and assign custom roles like Placement Officer or Coordinator.", icon: "👤" },
    { title: "Event Management", description: "Create, edit, and delete events. Track registrations and participation for each event.", icon: "📅" },
    { title: "Campaigns", description: "Launch fundraising campaigns, set targets, and track donation progress in real-time.", icon: "💰" },
    { title: "Analytics", description: "Deep-dive into alumni distribution by industry, batch-wise stats, mentorship success rates, and donation growth.", icon: "📈" },
    { title: "Departments", description: "Manage the list of departments for the institution. Add, rename, or remove departments as needed.", icon: "🏛️" },
  ],
  EMPLOYER: [
    { title: "Dashboard", description: "Your employer dashboard shows posted jobs and overall engagement metrics.", icon: "📊" },
    { title: "Opportunities", description: "Post job openings and internships. Review applications from students and update their status.", icon: "💼" },
    { title: "Directory", description: "Browse alumni profiles to find potential hires or collaboration opportunities.", icon: "👥" },
  ],
  FACULTY: [
    { title: "Dashboard", description: "View platform activity relevant to your department – student registrations, upcoming events, and mentorship activity.", icon: "📊" },
    { title: "Directory", description: "Browse alumni from your department. Track career progression of past students.", icon: "👥" },
    { title: "Events", description: "Register for academic events, career talks, and alumni meets.", icon: "📅" },
  ],
  SUPER_ADMIN: [
    { title: "Full Platform Access", description: "As Super Admin you have access to all features including user management, analytics, campaigns, departments, and content management.", icon: "🔐" },
    { title: "Analytics", description: "View comprehensive platform analytics covering all roles, activities, and growth metrics.", icon: "📈" },
    { title: "User Management", description: "Manage all users including admins, alumni, students, employers, and faculty.", icon: "👤" },
  ],
  CUSTOM: [
    { title: "Welcome", description: "Explore the platform using the navigation. Your custom role determines which features are available to you.", icon: "👋" },
  ],
};

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const currentUser = useAppStore((s) => s.currentUser);
  const [step, setStep] = useState(0);

  if (!currentUser) return null;

  const steps = tutorialSteps[currentUser.role] || tutorialSteps.CUSTOM;
  const current = steps[step];

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-card rounded-2xl border border-border shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base">AlumNexus Guide</h3>
                <p className="text-xs text-muted-foreground capitalize">{currentUser.role.toLowerCase().replace("_", " ")} walkthrough</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <div className="text-4xl mb-4 text-center">{current.icon}</div>
                <h4 className="text-xl font-bold text-center mb-3">{current.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed text-center">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`rounded-full transition-all ${
                    i === step ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button size="sm" onClick={() => setStep(step + 1)} className="flex-1">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleClose} className="flex-1">
                  Get Started
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
