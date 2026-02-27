"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changePositive?: boolean;
  color?: "primary" | "accent" | "success" | "destructive" | "chart4";
  delay?: number;
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-accent-foreground",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  destructive: "bg-destructive/10 text-destructive",
  chart4: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export function StatsCard({ title, value, icon: Icon, change, changePositive, color = "primary", delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className={cn("text-xs mt-1 font-medium", changePositive ? "text-green-600 dark:text-green-400" : "text-destructive")}>
              {changePositive ? "+" : ""}{change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl shrink-0", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
