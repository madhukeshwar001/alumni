"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Building2, Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

export default function DepartmentsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const departments = useAppStore((s) => s.departments);
  const addDepartment = useAppStore((s) => s.addDepartment);
  const deleteDepartment = useAppStore((s) => s.deleteDepartment);
  const academicDetails = useAppStore((s) => s.academicDetails);

  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  if (!isAdmin) return <div className="p-6 text-muted-foreground">Access denied.</div>;

  const handleAdd = () => {
    if (!name || !code) {
      toast.error("Please enter both department name and code.");
      return;
    }
    addDepartment(name, code.toUpperCase());
    toast.success(`Department "${name}" added!`);
    setName("");
    setCode("");
    setShowDialog(false);
  };

  const handleDelete = (id: string, deptName: string) => {
    deleteDepartment(id);
    toast.info(`Department "${deptName}" removed.`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage academic departments of the institution</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {departments.map((dept, i) => {
            const alumniCount = academicDetails.filter((a) => a.department === dept.name).length;
            return (
              <motion.div
                key={dept.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(dept.id, dept.name)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <h3 className="font-semibold text-foreground text-sm">{dept.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{dept.code}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{alumniCount + Math.floor(Math.random() * 80 + 20)} alumni</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Added {format(new Date(dept.createdAt), "dd MMM yyyy")}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {departments.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No departments added yet</p>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Department Name *</Label>
              <Input placeholder="Computer Science and Engineering" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Department Code *</Label>
              <Input placeholder="CSE" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
