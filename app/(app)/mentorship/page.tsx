"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Handshake, Clock, CheckCircle2, XCircle, Award, Star, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  COMPLETED: { label: "Completed", color: "bg-primary/10 text-primary", icon: Award },
  CANCELLED: { label: "Cancelled", color: "bg-muted text-muted-foreground", icon: XCircle },
};

export default function MentorshipPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const mentorshipRequests = useAppStore((s) => s.mentorshipRequests);
  const updateMentorshipStatus = useAppStore((s) => s.updateMentorshipStatus);
  const users = useAppStore((s) => s.users);
  const professionalDetails = useAppStore((s) => s.professionalDetails);

  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  if (!currentUser) return null;

  const isAlumni = currentUser.role === "ALUMNI" || currentUser.role === "FACULTY";
  const isStudent = currentUser.role === "STUDENT";
  const isAdmin = currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN";

  const myRequests = isAlumni
    ? mentorshipRequests.filter((r) => r.mentorId === currentUser.id)
    : isStudent
    ? mentorshipRequests.filter((r) => r.studentId === currentUser.id)
    : mentorshipRequests;

  const pendingRequests = myRequests.filter((r) => r.status === "PENDING");
  const activeRequests = myRequests.filter((r) => r.status === "ACCEPTED");
  const completedRequests = myRequests.filter((r) => r.status === "COMPLETED");
  const allRequests = myRequests;

  const getUserForRequest = (req: (typeof mentorshipRequests)[0]) => {
    if (isAlumni) return users.find((u) => u.id === req.studentId);
    return users.find((u) => u.id === req.mentorId);
  };

  const handleAccept = (id: string, name: string) => {
    updateMentorshipStatus(id, "ACCEPTED");
    toast.success(`Mentorship request from ${name} accepted!`);
  };

  const handleReject = (id: string, name: string) => {
    updateMentorshipStatus(id, "REJECTED");
    toast.info(`Mentorship request from ${name} rejected.`);
  };

  const handleComplete = (id: string) => {
    updateMentorshipStatus(id, "COMPLETED");
    toast.success("Mentorship marked as completed!");
    setSelectedReq(null);
  };

  const MentorshipCard = ({ req }: { req: (typeof mentorshipRequests)[0] }) => {
    const otherUser = getUserForRequest(req);
    const pd = professionalDetails.find((p) => p.userId === otherUser?.id);
    const status = statusConfig[req.status];
    const StatusIcon = status.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-start gap-3 mb-3">
          <img
            src={otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name}`}
            alt={otherUser?.name}
            className="w-11 h-11 rounded-full bg-muted shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{otherUser?.name || "Unknown"}</p>
            {pd && <p className="text-xs text-muted-foreground">{pd.currentJobTitle} at {pd.companyName}</p>}
            <p className="text-xs text-muted-foreground">{format(new Date(req.createdAt), "dd MMM yyyy")}</p>
          </div>
          <span className={cn("text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1 shrink-0", status.color)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </div>

        {req.message && (
          <div className="bg-muted/40 rounded-xl p-3 mb-3">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground italic">"{req.message}"</p>
            </div>
          </div>
        )}

        {req.meetingMode && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{req.meetingMode === "ONLINE" ? "Online Session" : "In-person Meeting"}</span>
          </div>
        )}

        {/* Actions for Alumni */}
        {isAlumni && req.status === "PENDING" && (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 text-xs" onClick={() => handleAccept(req.id, otherUser?.name || "")}>
              Accept
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs text-destructive hover:bg-destructive/10"
              onClick={() => handleReject(req.id, otherUser?.name || "")}>
              Decline
            </Button>
          </div>
        )}
        {isAlumni && req.status === "ACCEPTED" && (
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleComplete(req.id)}>
            Mark as Completed
          </Button>
        )}

        {/* Review for Student */}
        {isStudent && req.status === "COMPLETED" && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
        )}

        {/* Admin actions */}
        {isAdmin && req.status === "PENDING" && (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 text-xs" onClick={() => handleAccept(req.id, otherUser?.name || "")}>Accept</Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs text-destructive" onClick={() => handleReject(req.id, otherUser?.name || "")}>Reject</Button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Mentorship</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isAlumni ? "Manage mentorship requests from students" : isStudent ? "Track your mentorship connections" : "All mentorship activity across the platform"}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", count: allRequests.length, color: "text-foreground" },
          { label: "Pending", count: pendingRequests.length, color: "text-amber-600" },
          { label: "Active", count: activeRequests.length, color: "text-green-600" },
          { label: "Completed", count: completedRequests.length, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All ({allRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeRequests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
        </TabsList>

        {(["all", "pending", "active", "completed"] as const).map((tab) => {
          const tabData = tab === "all" ? allRequests : tab === "pending" ? pendingRequests : tab === "active" ? activeRequests : completedRequests;
          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              {tabData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tabData.map((req) => <MentorshipCard key={req.id} req={req} />)}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Handshake className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-medium">No {tab} mentorships</p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
