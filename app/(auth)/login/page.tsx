"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store";
import { getLoginCredentials } from "@/mock-data/users";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const demoCredentials = getLoginCredentials();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const success = login(email, password);
    setLoading(false);
    if (success) {
      toast.success("Welcome back to AlumNexus!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials. Try a demo account below.");
    }
  };

  const handleDemoLogin = (cred: { email: string; password: string; name: string }) => {
    setEmail(cred.email);
    setPassword(cred.password);
    toast.info(`Demo credentials filled for ${cred.name}`);
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-primary/10 text-primary",
    ALUMNI: "bg-accent/20 text-accent-foreground",
    STUDENT: "bg-success/10 text-success",
    EMPLOYER: "bg-chart-4/20 text-chart-4",
    FACULTY: "bg-chart-5/20 text-chart-5",
    SUPER_ADMIN: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 bg-sidebar p-12 text-sidebar-foreground"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">AlumNexus</h1>
            <p className="text-xs text-sidebar-foreground/60">Alumni Intelligence Platform</p>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold leading-tight text-balance">
              Connect. Mentor. Grow.
            </h2>
            <p className="mt-4 text-sidebar-foreground/70 leading-relaxed text-lg">
              The centralized alumni engagement platform for Tamil Nadu engineering institutions. Build meaningful connections across generations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Alumni", value: "2,400+" },
              { label: "Students Mentored", value: "850+" },
              { label: "Events Hosted", value: "120+" },
              { label: "Jobs Posted", value: "340+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-sidebar-accent rounded-xl p-4">
                <div className="text-2xl font-bold text-sidebar-primary">{stat.value}</div>
                <div className="text-sm text-sidebar-foreground/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-sm text-sidebar-foreground/40">
          © 2025 AlumNexus. Built for Tamil Nadu engineering institutions.
        </p>
      </motion.div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AlumNexus</h1>
              <p className="text-xs text-muted-foreground">Alumni Intelligence Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your AlumNexus account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block"
                  />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {demoCredentials.map((cred) => (
                <motion.button
                  key={cred.email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoLogin(cred)}
                  className="text-left p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground truncate">{cred.name.split(" ")[0]}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${roleColors[cred.role] || "bg-muted text-muted-foreground"}`}>
                      {cred.role.split("_")[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{cred.email}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
