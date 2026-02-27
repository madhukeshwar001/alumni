"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Search, ShieldCheck, UserX, Clock, CheckCircle2, MoreVertical, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { AlumniSystemRole } from "@/types";

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-destructive/10 text-destructive",
  ADMIN: "bg-primary/10 text-primary",
  ALUMNI: "bg-accent/20 text-accent-foreground",
  STUDENT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  FACULTY: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  EMPLOYER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function AdminUsersPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const users = useAppStore((s) => s.users);
  const approveUser = useAppStore((s) => s.approveUser);
  const changeUserRole = useAppStore((s) => s.changeUserRole);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterApproval, setFilterApproval] = useState("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<AlumniSystemRole>("ALUMNI");

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  if (!isAdmin) return <div className="p-6 text-muted-foreground">Access denied.</div>;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchApproval = filterApproval === "all" || (filterApproval === "approved" ? u.isApproved : !u.isApproved);
    return matchSearch && matchRole && matchApproval;
  });

  const pendingUsers = users.filter((u) => !u.isApproved);
  const alumniUsers = users.filter((u) => u.role === "ALUMNI");
  const studentUsers = users.filter((u) => u.role === "STUDENT");

  const handleApprove = (userId: string, name: string) => {
    approveUser(userId);
    toast.success(`${name} has been approved!`);
  };

  const handleChangeRole = () => {
    if (!selectedUser) return;
    const user = users.find((u) => u.id === selectedUser);
    changeUserRole(selectedUser, newRole);
    toast.success(`${user?.name}'s role changed to ${newRole}`);
    setSelectedUser(null);
  };

  const UserRow = ({ user }: { user: (typeof users)[0] }) => (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full bg-muted shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate max-w-[160px]">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[160px]">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className={cn("text-[10px] px-2 py-1 rounded-full font-bold", roleColors[user.role])}>
          {user.role.replace("_", " ")}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className={cn(
          "flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold w-fit",
          user.isApproved ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700"
        )}>
          {user.isApproved ? <><CheckCircle2 className="w-3 h-3" /> Approved</> : <><Clock className="w-3 h-3" /> Pending</>}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
        {format(new Date(user.createdAt), "dd MMM yyyy")}
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs">{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!user.isApproved && (
              <DropdownMenuItem onClick={() => handleApprove(user.id, user.name)}>
                <ShieldCheck className="w-4 h-4 mr-2 text-green-600" /> Approve User
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => { setSelectedUser(user.id); setNewRole(user.role); }}>
              <UserCog className="w-4 h-4 mr-2" /> Change Role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  );

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage all platform users, approvals, and roles</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", count: users.length, color: "text-foreground" },
          { label: "Alumni", count: alumniUsers.length, color: "text-primary" },
          { label: "Students", count: studentUsers.length, color: "text-green-600" },
          { label: "Pending Approval", count: pendingUsers.length, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={cn("text-2xl font-bold", s.color)}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="ALUMNI">Alumni</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="FACULTY">Faculty</SelectItem>
                <SelectItem value="EMPLOYER">Employer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterApproval} onValueChange={setFilterApproval}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground hidden lg:table-cell">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((user) => <UserRow key={user.id} user={user} />)}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserX className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {pendingUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingUsers.map((user) => (
                <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full bg-muted" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", roleColors[user.role])}>
                      {user.role}
                    </span>
                    <Button size="sm" className="text-xs gap-1" onClick={() => handleApprove(user.id, user.name)}>
                      <ShieldCheck className="w-3.5 h-3.5" /> Approve
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-60" />
              <p className="font-medium">All users are approved!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Change Role Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <label>Select New Role</label>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as AlumniSystemRole)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALUMNI">Alumni</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="FACULTY">Faculty</SelectItem>
                <SelectItem value="EMPLOYER">Employer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
            <Button onClick={handleChangeRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
