"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import { StatsCard } from "./StatsCard";
import {
  Users, Handshake, CalendarDays, Heart, GraduationCap,
  TrendingUp, Clock, CheckCircle2, XCircle, Award
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const deptData = [
  { dept: "CSE", alumni: 480 },
  { dept: "ECE", alumni: 360 },
  { dept: "MECH", alumni: 290 },
  { dept: "CIVIL", alumni: 210 },
  { dept: "EEE", alumni: 180 },
  { dept: "IT", alumni: 320 },
];

const monthlyGrowth = [
  { month: "Sep", registrations: 18 },
  { month: "Oct", registrations: 26 },
  { month: "Nov", registrations: 32 },
  { month: "Dec", registrations: 22 },
  { month: "Jan", registrations: 45 },
  { month: "Feb", registrations: 38 },
];

const roleDist = [
  { name: "Alumni", value: 2400 },
  { name: "Students", value: 850 },
  { name: "Faculty", value: 45 },
  { name: "Employers", value: 120 },
];

export function AdminDashboard() {
  const users = useAppStore((s) => s.users);
  const events = useAppStore((s) => s.events);
  const mentorshipRequests = useAppStore((s) => s.mentorshipRequests);
  const donations = useAppStore((s) => s.donations);
  const campaigns = useAppStore((s) => s.campaigns);
  const opportunities = useAppStore((s) => s.opportunities);
  const currentUser = useAppStore((s) => s.currentUser);

  const totalAlumni = users.filter((u) => u.role === "ALUMNI").length;
  const totalStudents = users.filter((u) => u.role === "STUDENT").length;
  const pendingApprovals = users.filter((u) => !u.isApproved).length;
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const pendingMentorships = mentorshipRequests.filter((r) => r.status === "PENDING").length;

  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {currentUser?.name.split(" ")[0]}. Here's the platform overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Alumni" value={totalAlumni + 2390} icon={GraduationCap} change="12 this month" changePositive color="primary" delay={0} />
        <StatsCard title="Students" value={totalStudents + 847} icon={Users} change="8 this month" changePositive color="accent" delay={0.05} />
        <StatsCard title="Pending Approvals" value={pendingApprovals + 3} icon={Clock} color="chart4" delay={0.1} />
        <StatsCard title="Total Donations" value={`₹${(totalDonations + 485000).toLocaleString("en-IN")}`} icon={Heart} change="₹12,000 today" changePositive color="success" delay={0.15} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Events" value={events.length + 8} icon={CalendarDays} color="primary" delay={0.2} />
        <StatsCard title="Mentorships" value={mentorshipRequests.length + 142} icon={Handshake} change="18 this week" changePositive color="accent" delay={0.25} />
        <StatsCard title="Job Postings" value={opportunities.length + 86} icon={TrendingUp} color="success" delay={0.3} />
        <StatsCard title="Campaigns" value={campaigns.length + 4} icon={Award} color="chart4" delay={0.35} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alumni by Department */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Alumni by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="alumni" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Role Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={roleDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={4}>
                {roleDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {roleDist.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <h3 className="font-semibold text-foreground mb-4">Monthly New Registrations</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
            <Line type="monotone" dataKey="registrations" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--accent))" }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Users + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-9 h-9 rounded-full bg-muted" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(u.createdAt), "dd MMM yyyy")}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {u.role}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Mentorship Overview</h3>
          <div className="space-y-3">
            {[
              { label: "Pending Requests", count: pendingMentorships + 8, icon: Clock, color: "text-amber-600" },
              { label: "Accepted", count: mentorshipRequests.filter(r => r.status === "ACCEPTED").length + 68, icon: CheckCircle2, color: "text-green-600" },
              { label: "Completed", count: mentorshipRequests.filter(r => r.status === "COMPLETED").length + 54, icon: Award, color: "text-primary" },
              { label: "Rejected", count: mentorshipRequests.filter(r => r.status === "REJECTED").length + 12, icon: XCircle, color: "text-destructive" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className={cn("w-4 h-4", item.color)} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
