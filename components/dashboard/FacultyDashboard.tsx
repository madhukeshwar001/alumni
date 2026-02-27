"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import { StatsCard } from "./StatsCard";
import { Users, CalendarDays, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const placementData = [
  { year: "2020", rate: 82 },
  { year: "2021", rate: 78 },
  { year: "2022", rate: 85 },
  { year: "2023", rate: 91 },
  { year: "2024", rate: 88 },
];

export function FacultyDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const users = useAppStore((s) => s.users);
  const events = useAppStore((s) => s.events);
  const opportunities = useAppStore((s) => s.opportunities);

  const totalAlumni = users.filter((u) => u.role === "ALUMNI").length;
  const totalStudents = users.filter((u) => u.role === "STUDENT").length;
  const upcomingEvents = events.filter((e) => new Date(e.eventDate) >= new Date()).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome, {currentUser?.name}. Monitor alumni placement and student progress.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Alumni" value={totalAlumni + 2390} icon={Users} color="primary" delay={0} />
        <StatsCard title="Total Students" value={totalStudents + 847} icon={BookOpen} color="accent" delay={0.05} />
        <StatsCard title="Active Jobs" value={opportunities.length + 86} icon={TrendingUp} color="success" delay={0.1} />
        <StatsCard title="Upcoming Events" value={upcomingEvents.length} icon={CalendarDays} color="chart4" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Placement Rate by Year</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={placementData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                formatter={(v) => [`${v}%`, "Placement Rate"]}
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Events</h3>
            <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
              <Link href="/events">View All <ArrowRight className="w-3 h-3" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(event.eventDate), "dd MMM yyyy")}</p>
                  <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
