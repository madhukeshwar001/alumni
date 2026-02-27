"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Handshake,
  Briefcase,
  CalendarDays,
  Heart,
  UserCircle,
  Settings,
  BarChart3,
  Building2,
  Shield,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { AlumniSystemRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: AlumniSystemRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
  { label: "Directory", href: "/directory", icon: Users, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
  { label: "Mentorship", href: "/mentorship", icon: Handshake, roles: ["ALUMNI", "STUDENT", "FACULTY"] },
  { label: "Opportunities", href: "/opportunities", icon: Briefcase, roles: ["ALUMNI", "STUDENT", "EMPLOYER", "ADMIN", "SUPER_ADMIN"] },
  { label: "Events", href: "/events", icon: CalendarDays, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
  { label: "Donations", href: "/donations", icon: Heart, roles: ["ALUMNI", "ADMIN", "SUPER_ADMIN"] },
  { label: "Profile", href: "/profile", icon: UserCircle, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
  { label: "Users", href: "/admin/users", icon: Shield, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Departments", href: "/admin/departments", icon: Building2, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Campaigns", href: "/admin/campaigns", icon: BookOpen, roles: ["SUPER_ADMIN", "ADMIN"] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const currentUser = useAppStore((s) => s.currentUser);

  if (!currentUser) return null;

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground h-screen sticky top-0 border-r border-sidebar-border shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-sidebar-foreground leading-tight">AlumNexus</h1>
          <p className="text-[10px] text-sidebar-foreground/50 truncate">Alumni Intelligence Platform</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full bg-sidebar-accent"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wide">{currentUser.role.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground/70"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <Link href="/settings">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            pathname === "/settings"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
