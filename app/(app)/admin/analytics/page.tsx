"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { TrendingUp, Users, Heart, Handshake, CalendarDays, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const monthlyData = [
  { month: "Sep '24", alumni: 38, students: 22, donations: 48000 },
  { month: "Oct '24", alumni: 45, students: 28, donations: 62000 },
  { month: "Nov '24", alumni: 52, students: 31, donations: 75000 },
  { month: "Dec '24", alumni: 41, students: 18, donations: 55000 },
  { month: "Jan '25", alumni: 67, students: 44, donations: 91000 },
  { month: "Feb '25", alumni: 58, students: 36, donations: 83000 },
];

const deptGrowth = [
  { dept: "CSE", count: 480, placements: 89 },
  { dept: "ECE", count: 360, placements: 82 },
  { dept: "MECH", count: 290, placements: 75 },
  { dept: "CIVIL", count: 210, placements: 68 },
  { dept: "EEE", count: 180, placements: 71 },
  { dept: "IT", count: 320, placements: 85 },
];

const mentorshipTrend = [
  { month: "Sep", requests: 12, completed: 8 },
  { month: "Oct", requests: 18, completed: 14 },
  { month: "Nov", requests: 24, completed: 19 },
  { month: "Dec", requests: 15, completed: 11 },
  { month: "Jan", requests: 31, completed: 25 },
  { month: "Feb", requests: 27, completed: 21 },
];

const industryData = [
  { name: "Technology", value: 42 },
  { name: "Finance", value: 18 },
  { name: "Manufacturing", value: 14 },
  { name: "Consulting", value: 12 },
  { name: "Healthcare", value: 8 },
  { name: "Others", value: 6 },
];

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    fontSize: 12,
  },
};

export default function AnalyticsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const users = useAppStore((s) => s.users);
  const donations = useAppStore((s) => s.donations);
  const mentorshipRequests = useAppStore((s) => s.mentorshipRequests);
  const events = useAppStore((s) => s.events);
  const opportunities = useAppStore((s) => s.opportunities);

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  if (!isAdmin) return <div className="p-6 text-muted-foreground">Access denied.</div>;

  const totalDonations = donations.reduce((s, d) => s + d.amount, 0) + 485000;

  const kpis = [
    { label: "Total Alumni", value: users.filter((u) => u.role === "ALUMNI").length + 2390, icon: Users, change: "+12%", color: "text-primary" },
    { label: "Total Donations", value: `₹${(totalDonations / 100000).toFixed(1)}L`, icon: Heart, change: "+8%", color: "text-pink-500" },
    { label: "Mentorships", value: mentorshipRequests.length + 142, icon: Handshake, change: "+22%", color: "text-amber-500" },
    { label: "Events Hosted", value: events.length + 86, icon: CalendarDays, change: "+5%", color: "text-purple-500" },
    { label: "Jobs Posted", value: opportunities.length + 340, icon: Briefcase, change: "+18%", color: "text-blue-500" },
    { label: "Placement Rate", value: "86.4%", icon: TrendingUp, change: "+3.2%", color: "text-green-500" },
  ];

  const container = "bg-card rounded-2xl border border-border p-5";

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Comprehensive metrics across the AlumNexus platform</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl border border-border p-4 text-center"
          >
            <kpi.icon className={cn("w-5 h-5 mx-auto mb-2", kpi.color)} />
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{kpi.label}</p>
            <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold mt-1">{kpi.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Registration Trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={container}>
        <h3 className="font-semibold text-foreground mb-4">Monthly Registrations & Donations</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="alumni" name="Alumni" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="students" name="Students" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Analytics */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={container}>
          <h3 className="font-semibold text-foreground mb-4">Alumni Count & Placement by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptGrowth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" name="Alumni Count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="placements" name="Placements %" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Industry Distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={container}>
          <h3 className="font-semibold text-foreground mb-4">Alumni Industry Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={industryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {industryData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mentorship Trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={container}>
        <h3 className="font-semibold text-foreground mb-4">Mentorship Activity Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mentorshipTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="requests" name="Requests" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="completed" name="Completed" stroke="hsl(var(--chart-3))" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
