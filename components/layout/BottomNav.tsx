"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Handshake,
  CalendarDays,
  UserCircle,
  Briefcase,
  Heart,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { AlumniSystemRole } from "@/types";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: AlumniSystemRole[];
}

const mobileNavItems: MobileNavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
  { label: "Directory", href: "/directory", icon: Users, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
  { label: "Mentor", href: "/mentorship", icon: Handshake, roles: ["ALUMNI", "STUDENT", "FACULTY"] },
  { label: "Jobs", href: "/opportunities", icon: Briefcase, roles: ["ALUMNI", "STUDENT", "EMPLOYER", "ADMIN", "SUPER_ADMIN"] },
  { label: "Events", href: "/events", icon: CalendarDays, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
  { label: "Donate", href: "/donations", icon: Heart, roles: ["ALUMNI", "ADMIN", "SUPER_ADMIN"] },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Profile", href: "/profile", icon: UserCircle, roles: ["SUPER_ADMIN", "ADMIN", "ALUMNI", "STUDENT", "FACULTY", "EMPLOYER"] },
];

export function BottomNav() {
  const pathname = usePathname();
  const currentUser = useAppStore((s) => s.currentUser);

  if (!currentUser) return null;

  const items = mobileNavItems
    .filter((item) => item.roles.includes(currentUser.role))
    .slice(0, 5); // Max 5 for bottom nav

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-1 h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center gap-0.5 py-1 relative">
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute inset-x-2 -top-1 h-0.5 bg-primary rounded-full"
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    "p-1.5 rounded-xl transition-colors",
                    isActive ? "bg-primary/10" : ""
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
