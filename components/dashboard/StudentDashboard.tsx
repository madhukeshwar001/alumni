"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import { StatsCard } from "./StatsCard";
import { Handshake, CalendarDays, Briefcase, ArrowRight, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function StudentDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const mentorshipRequests = useAppStore((s) => s.mentorshipRequests);
  const eventRegistrations = useAppStore((s) => s.eventRegistrations);
  const opportunityApplications = useAppStore((s) => s.opportunityApplications);
  const events = useAppStore((s) => s.events);
  const opportunities = useAppStore((s) => s.opportunities);
  const users = useAppStore((s) => s.users);
  const professionalDetails = useAppStore((s) => s.professionalDetails);

  if (!currentUser) return null;

  const myMentorships = mentorshipRequests.filter((r) => r.studentId === currentUser.id);
  const myEventRegs = eventRegistrations.filter((r) => r.userId === currentUser.id);
  const myApplications = opportunityApplications.filter((a) => a.studentId === currentUser.id);

  const upcomingEvents = events
    .filter((e) => myEventRegs.some((r) => r.eventId === e.id) && new Date(e.eventDate) >= new Date())
    .slice(0, 3);

  const availableMentors = users
    .filter((u) => u.role === "ALUMNI" && professionalDetails.find((p) => p.userId === u.id && p.willingToMentor))
    .slice(0, 4);

  const applicationStatusColor: Record<string, string> = {
    APPLIED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    SHORTLISTED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    SELECTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Hello {currentUser.name.split(" ")[0]}, your career journey starts here.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Mentor Requests" value={myMentorships.length} icon={Handshake} color="primary" delay={0} />
        <StatsCard title="Events Registered" value={myEventRegs.length} icon={CalendarDays} color="accent" delay={0.05} />
        <StatsCard title="Job Applications" value={myApplications.length} icon={Briefcase} color="success" delay={0.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Available Mentors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Available Mentors</h3>
            <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
              <Link href="/mentorship">Find More <ArrowRight className="w-3 h-3" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {availableMentors.map((mentor) => {
              const pd = professionalDetails.find((p) => p.userId === mentor.id);
              return (
                <div key={mentor.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                  <img src={mentor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`} alt={mentor.name} className="w-9 h-9 rounded-full bg-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{mentor.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{pd?.currentJobTitle} at {pd?.companyName}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium">4.{Math.floor(Math.random() * 3) + 7}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* My Applications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">My Applications</h3>
            <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
              <Link href="/opportunities">Browse Jobs <ArrowRight className="w-3 h-3" /></Link>
            </Button>
          </div>
          {myApplications.length > 0 ? (
            <div className="space-y-3">
              {myApplications.slice(0, 4).map((app) => {
                const opp = opportunities.find((o) => o.id === app.opportunityId);
                return (
                  <div key={app.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{opp?.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{opp?.companyName}</p>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0", applicationStatusColor[app.status])}>
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No applications yet. Browse opportunities!
            </p>
          )}
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Upcoming Events</h3>
          <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
            <Link href="/events">All Events <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                  <Badge variant="outline" className="text-[10px]">{event.type.replace("_", " ")}</Badge>
                </div>
                <p className="text-sm font-semibold text-foreground leading-tight">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(event.eventDate), "dd MMM, yyyy")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">No upcoming events. Register for some!</p>
        )}
      </motion.div>
    </div>
  );
}
