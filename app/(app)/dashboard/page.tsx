"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import { AlumniDashboard } from "@/components/dashboard/AlumniDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { FacultyDashboard } from "@/components/dashboard/FacultyDashboard";
import { EmployerDashboard } from "@/components/dashboard/EmployerDashboard";

export default function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  if (!currentUser) return null;

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return <AdminDashboard />;
      case "ALUMNI":
        return <AlumniDashboard />;
      case "STUDENT":
        return <StudentDashboard />;
      case "FACULTY":
        return <FacultyDashboard />;
      case "EMPLOYER":
        return <EmployerDashboard />;
      default:
        return <AlumniDashboard />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 lg:p-6 space-y-6"
    >
      {renderDashboard()}
    </motion.div>
  );
}
