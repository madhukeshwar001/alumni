"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import {
  Sun, Moon, Bell, BellOff, Shield, Palette, User, KeyRound, LogOut, Save, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

export default function SettingsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const updateUser = useAppStore((s) => s.updateUser);
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [emailNotif, setEmailNotif] = useState(currentUser?.emailNotificationsEnabled ?? true);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  if (!currentUser) return null;

  const handleSaveName = async () => {
    if (!name.trim()) { toast.error("Name cannot be empty."); return; }
    setNameLoading(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser(currentUser.id, { name: name.trim() });
    setNameLoading(false);
    setNameSaved(true);
    toast.success("Profile name updated!");
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleToggleNotif = (val: boolean) => {
    setEmailNotif(val);
    updateUser(currentUser.id, { emailNotificationsEnabled: val });
    toast.success(val ? "Email notifications enabled." : "Email notifications disabled.");
  };

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out.");
    router.push("/login");
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ] as const;

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and appearance</p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
        className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <User className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">Profile Information</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="flex-1"
              />
              <Button
                onClick={handleSaveName}
                disabled={nameLoading || name === currentUser.name}
                size="sm"
                className="gap-1.5 min-w-[80px]"
              >
                {nameSaved ? <Check className="w-4 h-4" /> : nameLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block"
                  />
                ) : (
                  <><Save className="w-4 h-4" /> Save</>
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed in demo mode.</p>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-foreground">Account Role</p>
              <p className="text-xs text-muted-foreground">{currentUser.role.replace("_", " ")}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 text-primary">
              {currentUser.role.replace("_", " ")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
        className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-accent/20 rounded-xl">
            <Palette className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="flex gap-3">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                if (theme !== value) {
                  toggleTheme();
                  toast.success(`Switched to ${label} mode`);
                }
              }}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                theme === value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <Icon className={cn("w-5 h-5", theme === value ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", theme === value ? "text-primary" : "text-muted-foreground")}>
                {label}
              </span>
              {theme === value && (
                <span className="flex items-center gap-1 text-[10px] text-primary font-semibold">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible"
        className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-accent/20 rounded-xl">
            <Bell className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {emailNotif ? (
                <Bell className="w-4 h-4 text-primary" />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive event reminders, mentorship updates, and announcements</p>
              </div>
            </div>
            <Switch checked={emailNotif} onCheckedChange={handleToggleNotif} />
          </div>
          <Separator />
          <div className="flex items-center justify-between opacity-50">
            <div>
              <p className="text-sm font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Browser push notifications (coming soon)</p>
            </div>
            <Switch disabled checked={false} />
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible"
        className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-destructive/10 rounded-xl">
            <Shield className="w-4 h-4 text-destructive" />
          </div>
          <h2 className="font-semibold text-foreground">Security</h2>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => toast.info("Password change is not available in demo mode.")}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Demo only</span>
          </button>
          <Separator />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-destructive/20 hover:bg-destructive/5 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">Sign Out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Version Info */}
      <motion.p custom={4} variants={cardVariants} initial="hidden" animate="visible"
        className="text-center text-xs text-muted-foreground pb-4">
        AlumNexus v1.0.0 — Built for Tamil Nadu Engineering Institutions
      </motion.p>
    </div>
  );
}
