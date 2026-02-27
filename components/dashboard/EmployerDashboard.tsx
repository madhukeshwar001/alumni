"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import { StatsCard } from "./StatsCard";
import { Briefcase, Users, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function EmployerDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const opportunities = useAppStore((s) => s.opportunities);
  const opportunityApplications = useAppStore((s) => s.opportunityApplications);
  const users = useAppStore((s) => s.users);

  const myJobs = opportunities.filter((o) => o.postedByAlumniId === currentUser?.id);
  const totalApplicants = opportunityApplications.filter((a) =>
    myJobs.some((j) => j.id === a.opportunityId)
  ).length;

  const statusColors: Record<string, string> = {
    APPLIED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    SHORTLISTED: "bg-amber-100 text-amber-700",
    SELECTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employer Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your job postings and applications.</p>
        </div>
        <Button asChild>
          <Link href="/opportunities">Post a Job</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Active Postings" value={myJobs.length + 4} icon={Briefcase} color="primary" delay={0} />
        <StatsCard title="Total Applicants" value={totalApplicants + 42} icon={Users} color="accent" delay={0.05} />
        <StatsCard title="Hires Made" value={7} icon={CheckCircle2} color="success" delay={0.1} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Applications</h3>
          <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
            <Link href="/opportunities">Manage Jobs <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>
        {opportunityApplications.slice(0, 6).length > 0 ? (
          <div className="space-y-3">
            {opportunityApplications.slice(0, 6).map((app) => {
              const opp = opportunities.find((o) => o.id === app.opportunityId);
              const student = users.find((u) => u.id === app.studentId);
              return (
                <div key={app.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={student?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.name}`} alt="" className="w-8 h-8 rounded-full bg-muted shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{student?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{opp?.title}</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0", statusColors[app.status])}>
                    {app.status}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No applications yet</p>
        )}
      </motion.div>
    </div>
  );
}
