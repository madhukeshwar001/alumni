"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import { StatsCard } from "./StatsCard";
import { Handshake, CalendarDays, Heart, Briefcase, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const radarData = [
  { subject: "Mentoring", A: 85 },
  { subject: "Networking", A: 72 },
  { subject: "Events", A: 60 },
  { subject: "Donations", A: 45 },
  { subject: "Referrals", A: 78 },
  { subject: "Profile", A: 92 },
];

export function AlumniDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const mentorshipRequests = useAppStore((s) => s.mentorshipRequests);
  const eventRegistrations = useAppStore((s) => s.eventRegistrations);
  const donations = useAppStore((s) => s.donations);
  const opportunities = useAppStore((s) => s.opportunities);
  const events = useAppStore((s) => s.events);
  const activityLogs = useAppStore((s) => s.activityLogs);

  if (!currentUser) return null;

  const myMentorships = mentorshipRequests.filter((r) => r.mentorId === currentUser.id);
  const myEvents = eventRegistrations.filter((r) => r.userId === currentUser.id);
  const myDonations = donations.filter((d) => d.donatedByAlumniId === currentUser.id);
  const myOpportunities = opportunities.filter((o) => o.postedByAlumniId === currentUser.id);
  const myActivity = activityLogs.filter((l) => l.userId === currentUser.id).slice(0, 5);

  const pendingRequests = myMentorships.filter((r) => r.status === "PENDING");
  const upcomingEvents = events
    .filter((e) => myEvents.some((r) => r.eventId === e.id))
    .filter((e) => new Date(e.eventDate) >= new Date())
    .slice(0, 3);

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ACCEPTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    COMPLETED: "bg-primary/10 text-primary",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {currentUser.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground text-sm mt-1">Your alumni dashboard — stay connected, mentor, and give back.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button asChild size="sm">
            <Link href="/mentorship">Manage Mentorship</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/opportunities">Post a Job</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Mentorships Given" value={myMentorships.length + 8} icon={Handshake} color="primary" delay={0} />
        <StatsCard title="Events Attended" value={myEvents.length + 5} icon={CalendarDays} color="accent" delay={0.05} />
        <StatsCard title="Donations Made" value={`₹${(myDonations.reduce((s, d) => s + d.amount, 0) + 15000).toLocaleString("en-IN")}`} icon={Heart} color="success" delay={0.1} />
        <StatsCard title="Jobs Posted" value={myOpportunities.length + 3} icon={Briefcase} color="chart4" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engagement Radar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-2">Engagement Score</h3>
          <p className="text-xs text-muted-foreground mb-4">Your alumni engagement profile</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pending Mentorship Requests */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Mentorship Requests</h3>
            {pendingRequests.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                {pendingRequests.length} pending
              </span>
            )}
          </div>
          {myMentorships.slice(0, 4).length > 0 ? (
            <div className="space-y-3">
              {myMentorships.slice(0, 4).map((req) => (
                <div key={req.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {req.status === "PENDING" ? <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                    <span className="text-xs text-muted-foreground truncate">{format(new Date(req.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0", statusColors[req.status])}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No mentorship requests yet</p>
          )}
          <Button asChild size="sm" variant="ghost" className="w-full mt-4 text-xs gap-1">
            <Link href="/mentorship">View All <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Events</h3>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="bg-primary/10 rounded-xl p-2 shrink-0">
                    <CalendarDays className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(event.eventDate), "dd MMM, hh:mm a")}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No upcoming events registered</p>
          )}
          <Button asChild size="sm" variant="ghost" className="w-full mt-4 text-xs gap-1">
            <Link href="/events">Browse Events <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        {myActivity.length > 0 ? (
          <div className="space-y-3">
            {myActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{log.message}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>
        )}
      </motion.div>
    </div>
  );
}
