"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Mail,
  BellOff,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NotificationDrawer } from "./NotificationDrawer";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AppNavbar() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const updateUser = useAppStore((s) => s.updateUser);
  const logout = useAppStore((s) => s.logout);
  const [search, setSearch] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out.");
    router.push("/login");
  };

  const handleToggleNotifications = () => {
    const newVal = !currentUser.emailNotificationsEnabled;
    updateUser(currentUser.id, { emailNotificationsEnabled: newVal });
    toast.success(newVal ? "Email notifications enabled" : "Email notifications disabled");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/directory?search=${encodeURIComponent(search)}`);
    }
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-destructive/10 text-destructive",
    ADMIN: "bg-primary/10 text-primary",
    ALUMNI: "bg-accent/20 text-accent-foreground",
    STUDENT: "bg-success/10 text-success",
    FACULTY: "bg-chart-5/20 text-chart-5",
    EMPLOYER: "bg-chart-4/20 text-chart-4",
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 h-16 bg-background/90 backdrop-blur-md border-b border-border">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alumni, events, opportunities..."
              className="pl-9 h-9 text-sm bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
            />
          </div>
        </form>

        <div className="flex-1 sm:hidden" />

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Tutorial */}
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Tutorial"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Toggle theme"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </button>

          {/* Notifications */}
          <NotificationDrawer />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-muted transition-colors">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full bg-muted"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-tight max-w-[120px] truncate">{currentUser.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{currentUser.role.replace("_", " ")}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 py-1">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full bg-muted"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block", roleColors[currentUser.role])}>
                      {currentUser.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <><Sun className="w-4 h-4 mr-2" /> Light Mode</>
                  ) : (
                    <><Moon className="w-4 h-4 mr-2" /> Dark Mode</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleNotifications}>
                  {currentUser.emailNotificationsEnabled ? (
                    <><BellOff className="w-4 h-4 mr-2" /> Disable Email Alerts</>
                  ) : (
                    <><Mail className="w-4 h-4 mr-2" /> Enable Email Alerts</>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </>
  );
}
