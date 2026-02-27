"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Search, Filter, MapPin, Building2, GraduationCap, Briefcase, Handshake, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DirectoryPage() {
  const users = useAppStore((s) => s.users);
  const professionalDetails = useAppStore((s) => s.professionalDetails);
  const academicDetails = useAppStore((s) => s.academicDetails);
  const currentUser = useAppStore((s) => s.currentUser);
  const sendMentorshipRequest = useAppStore((s) => s.sendMentorshipRequest);
  const mentorshipRequests = useAppStore((s) => s.mentorshipRequests);

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterMentor, setFilterMentor] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const alumni = users.filter((u) => u.role === "ALUMNI" && u.isApproved);

  const enrichedAlumni = useMemo(() => {
    return alumni.map((u) => ({
      ...u,
      professional: professionalDetails.find((p) => p.userId === u.id),
      academic: academicDetails.find((a) => a.userId === u.id),
    }));
  }, [alumni, professionalDetails, academicDetails]);

  const filtered = useMemo(() => {
    return enrichedAlumni.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.professional?.companyName?.toLowerCase().includes(q) ||
        u.professional?.currentJobTitle?.toLowerCase().includes(q) ||
        u.professional?.location?.toLowerCase().includes(q) ||
        u.professional?.skills?.some((s) => s.toLowerCase().includes(q));
      const matchDept = filterDept === "all" || u.academic?.department === filterDept;
      const matchIndustry = filterIndustry === "all" || u.professional?.industry === filterIndustry;
      const matchMentor = !filterMentor || u.professional?.willingToMentor;
      return matchSearch && matchDept && matchIndustry && matchMentor;
    });
  }, [enrichedAlumni, search, filterDept, filterIndustry, filterMentor]);

  const departments = [...new Set(academicDetails.map((a) => a.department))];
  const industries = [...new Set(professionalDetails.map((p) => p.industry).filter(Boolean))];

  const hasSentRequest = (alumniId: string) =>
    mentorshipRequests.some(
      (r) => r.mentorId === alumniId && r.studentId === currentUser?.id && r.status === "PENDING"
    );

  const handleRequestMentor = (alumniId: string, name: string) => {
    if (!currentUser) return;
    if (currentUser.role !== "STUDENT") {
      toast.error("Only students can send mentorship requests.");
      return;
    }
    if (hasSentRequest(alumniId)) {
      toast.info("You already sent a request to this mentor.");
      return;
    }
    sendMentorshipRequest({
      mentorId: alumniId,
      studentId: currentUser.id,
      message: "Hi, I would love to get your guidance on my career path.",
      status: "PENDING",
      meetingMode: "ONLINE",
    });
    toast.success(`Mentorship request sent to ${name}!`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alumni Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} alumni found</p>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, skills, location..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-primary/10 border-primary/30")}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="w-44 h-9 text-sm">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger className="w-44 h-9 text-sm">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button
                variant={filterMentor ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMentor(!filterMentor)}
                className="h-9 gap-1.5"
              >
                <Handshake className="w-3.5 h-3.5" />
                Mentors Only
              </Button>
              {(search || filterDept !== "all" || filterIndustry !== "all" || filterMentor) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-1.5 text-muted-foreground"
                  onClick={() => { setSearch(""); setFilterDept("all"); setFilterIndustry("all"); setFilterMentor(false); }}
                >
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((alumni, i) => (
            <motion.div
              key={alumni.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all group"
            >
              {/* Avatar + Name */}
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <img
                    src={alumni.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alumni.name}`}
                    alt={alumni.name}
                    className="w-12 h-12 rounded-full bg-muted"
                  />
                  {alumni.professional?.willingToMentor && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-card">
                      <Handshake className="w-2.5 h-2.5 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground leading-tight truncate">{alumni.name}</p>
                  {alumni.professional?.currentJobTitle && (
                    <p className="text-xs text-muted-foreground truncate">{alumni.professional.currentJobTitle}</p>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-4">
                {alumni.professional?.companyName && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{alumni.professional.companyName}</span>
                  </div>
                )}
                {alumni.professional?.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{alumni.professional.location}</span>
                  </div>
                )}
                {alumni.academic?.department && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{alumni.academic.department} · {alumni.academic.batchYear}</span>
                  </div>
                )}
                {alumni.professional?.industry && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{alumni.professional.industry}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              {alumni.professional?.skills && alumni.professional.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {alumni.professional.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                  {alumni.professional.skills.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      +{alumni.professional.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              {currentUser?.role === "STUDENT" && alumni.professional?.willingToMentor && (
                <Button
                  size="sm"
                  variant={hasSentRequest(alumni.id) ? "outline" : "default"}
                  className="w-full text-xs gap-1.5"
                  disabled={hasSentRequest(alumni.id)}
                  onClick={() => handleRequestMentor(alumni.id, alumni.name)}
                >
                  <Handshake className="w-3.5 h-3.5" />
                  {hasSentRequest(alumni.id) ? "Request Sent" : "Request Mentorship"}
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-muted-foreground"
        >
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No alumni found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </motion.div>
      )}
    </div>
  );
}
