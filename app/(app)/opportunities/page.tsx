"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Briefcase, MapPin, Calendar, Plus, Search, X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { OpportunityType } from "@/types";

const typeColors: Record<string, string> = {
  INTERNSHIP: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  FULL_TIME: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REFERRAL: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const appStatusColors: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-amber-100 text-amber-700",
  SELECTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function OpportunitiesPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const opportunities = useAppStore((s) => s.opportunities);
  const opportunityApplications = useAppStore((s) => s.opportunityApplications);
  const applyToOpportunity = useAppStore((s) => s.applyToOpportunity);
  const postOpportunity = useAppStore((s) => s.postOpportunity);
  const updateApplicationStatus = useAppStore((s) => s.updateApplicationStatus);
  const users = useAppStore((s) => s.users);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [form, setForm] = useState({ title: "", companyName: "", description: "", location: "", type: "FULL_TIME" as OpportunityType, skillsRequired: "", applicationDeadline: "" });

  const isAlumni = currentUser?.role === "ALUMNI" || currentUser?.role === "EMPLOYER";
  const isStudent = currentUser?.role === "STUDENT";
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";

  const filteredOpps = opportunities.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.title.toLowerCase().includes(q) || o.companyName.toLowerCase().includes(q) || o.location.toLowerCase().includes(q);
    const matchType = filterType === "all" || o.type === filterType;
    return matchSearch && matchType;
  });

  const myApplications = opportunityApplications.filter((a) => a.studentId === currentUser?.id);
  const myPostings = opportunities.filter((o) => o.postedByAlumniId === currentUser?.id);

  const hasApplied = (oppId: string) => opportunityApplications.some((a) => a.opportunityId === oppId && a.studentId === currentUser?.id);

  const handleApply = (oppId: string, title: string) => {
    if (!currentUser) return;
    applyToOpportunity(oppId, currentUser.id);
    toast.success(`Applied to ${title}!`);
  };

  const handlePost = () => {
    if (!currentUser || !form.title || !form.companyName || !form.description) {
      toast.error("Please fill all required fields.");
      return;
    }
    postOpportunity({
      postedByAlumniId: currentUser.id,
      type: form.type,
      title: form.title,
      description: form.description,
      companyName: form.companyName,
      location: form.location,
      skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
      applicationDeadline: form.applicationDeadline || undefined,
    });
    toast.success("Opportunity posted successfully!");
    setShowPostDialog(false);
    setForm({ title: "", companyName: "", description: "", location: "", type: "FULL_TIME", skillsRequired: "", applicationDeadline: "" });
  };

  const OpportunityCard = ({ opp }: { opp: (typeof opportunities)[0] }) => {
    const poster = users.find((u) => u.id === opp.postedByAlumniId);
    const appCount = opportunityApplications.filter((a) => a.opportunityId === opp.id).length;
    const applied = hasApplied(opp.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-semibold text-foreground">{opp.title}</h3>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", typeColors[opp.type])}>
                {opp.type.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{opp.companyName}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-muted-foreground">
          {opp.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{opp.location}</span>
          )}
          {opp.applicationDeadline && (
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Deadline: {format(new Date(opp.applicationDeadline), "dd MMM yyyy")}</span>
          )}
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{format(new Date(opp.createdAt), "dd MMM yyyy")}</span>
          {(isAlumni || isAdmin) && <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />{appCount} applicants</span>}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{opp.description}</p>

        {opp.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {opp.skillsRequired.slice(0, 4).map((s) => (
              <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0.5">{s}</Badge>
            ))}
            {opp.skillsRequired.length > 4 && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5">+{opp.skillsRequired.length - 4}</Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {poster && (
              <>
                <img src={poster.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${poster.name}`} alt="" className="w-5 h-5 rounded-full bg-muted" />
                <span className="truncate">{poster.name}</span>
              </>
            )}
          </div>
          {isStudent && (
            <Button
              size="sm"
              variant={applied ? "outline" : "default"}
              className="text-xs"
              disabled={applied}
              onClick={() => !applied && handleApply(opp.id, opp.title)}
            >
              {applied ? "Applied" : "Apply Now"}
            </Button>
          )}
          {(isAlumni || isAdmin) && opp.postedByAlumniId === currentUser?.id && (
            <Badge variant="outline" className="text-xs">Your Post</Badge>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground text-sm mt-1">Internships, full-time jobs, and referrals from alumni</p>
        </div>
        {(isAlumni || isAdmin) && (
          <Button onClick={() => setShowPostDialog(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Post Opportunity
          </Button>
        )}
      </motion.div>

      <Tabs defaultValue="browse">
        <TabsList className="bg-muted">
          <TabsTrigger value="browse">Browse ({filteredOpps.length})</TabsTrigger>
          {isStudent && <TabsTrigger value="applications">My Applications ({myApplications.length})</TabsTrigger>}
          {(isAlumni || isAdmin) && <TabsTrigger value="posted">My Postings ({myPostings.length})</TabsTrigger>}
        </TabsList>

        <TabsContent value="browse" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search jobs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="REFERRAL">Referral</SelectItem>
              </SelectContent>
            </Select>
            {(search || filterType !== "all") && (
              <Button variant="ghost" size="icon" onClick={() => { setSearch(""); setFilterType("all"); }}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredOpps.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
            </AnimatePresence>
          </div>

          {filteredOpps.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No opportunities found</p>
            </div>
          )}
        </TabsContent>

        {isStudent && (
          <TabsContent value="applications" className="mt-4">
            {myApplications.length > 0 ? (
              <div className="space-y-3">
                {myApplications.map((app) => {
                  const opp = opportunities.find((o) => o.id === app.opportunityId);
                  return (
                    <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{opp?.title}</p>
                        <p className="text-xs text-muted-foreground">{opp?.companyName} · {format(new Date(app.createdAt), "dd MMM yyyy")}</p>
                      </div>
                      <span className={cn("text-[10px] px-2 py-1 rounded-full font-bold shrink-0", appStatusColors[app.status])}>
                        {app.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No applications yet</p>
                <p className="text-sm">Browse and apply to opportunities</p>
              </div>
            )}
          </TabsContent>
        )}

        {(isAlumni || isAdmin) && (
          <TabsContent value="posted" className="mt-4">
            {myPostings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {myPostings.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No postings yet</p>
                <Button className="mt-3" onClick={() => setShowPostDialog(true)}>Post First Opportunity</Button>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Post a New Opportunity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Job Title *</Label>
                <Input placeholder="e.g. Software Engineer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Company *</Label>
                <Input placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input placeholder="Chennai, TN" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as OpportunityType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="REFERRAL">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Deadline</Label>
                <Input type="date" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Skills Required</Label>
                <Input placeholder="React, Python, AWS (comma-separated)" value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Description *</Label>
                <Textarea placeholder="Describe the role and requirements..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPostDialog(false)}>Cancel</Button>
            <Button onClick={handlePost}>Post Opportunity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
