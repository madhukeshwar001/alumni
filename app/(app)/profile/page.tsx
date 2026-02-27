"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import {
  User, Building2, MapPin, GraduationCap, Briefcase, Plus, Edit2, Trash2,
  Save, X, Linkedin, Globe, ChevronRight, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ProfilePage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const academicDetails = useAppStore((s) => s.academicDetails);
  const professionalDetails = useAppStore((s) => s.professionalDetails);
  const careerTimeline = useAppStore((s) => s.careerTimeline);
  const updateProfessionalDetails = useAppStore((s) => s.updateProfessionalDetails);
  const updateAcademicDetails = useAppStore((s) => s.updateAcademicDetails);
  const addCareerEntry = useAppStore((s) => s.addCareerEntry);
  const updateCareerEntry = useAppStore((s) => s.updateCareerEntry);
  const deleteCareerEntry = useAppStore((s) => s.deleteCareerEntry);
  const updateUser = useAppStore((s) => s.updateUser);

  const [editingPro, setEditingPro] = useState(false);
  const [editingAcad, setEditingAcad] = useState(false);
  const [showCareerDialog, setShowCareerDialog] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");

  if (!currentUser) return null;

  const myAcademic = academicDetails.find((a) => a.userId === currentUser.id);
  const myProfessional = professionalDetails.find((p) => p.userId === currentUser.id);
  const myTimeline = careerTimeline.filter((t) => t.userId === currentUser.id).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const [proForm, setProForm] = useState({
    currentJobTitle: myProfessional?.currentJobTitle || "",
    companyName: myProfessional?.companyName || "",
    industry: myProfessional?.industry || "",
    location: myProfessional?.location || "",
    linkedInUrl: myProfessional?.linkedInUrl || "",
    portfolioUrl: myProfessional?.portfolioUrl || "",
    skills: myProfessional?.skills || [],
    willingToMentor: myProfessional?.willingToMentor || false,
    willingToOfferInternship: myProfessional?.willingToOfferInternship || false,
  });

  const [acadForm, setAcadForm] = useState({
    department: myAcademic?.department || "",
    degree: myAcademic?.degree || "",
    batchYear: myAcademic?.batchYear || 2020,
    registerNumber: myAcademic?.registerNumber || "",
  });

  const [careerForm, setCareerForm] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSavePro = () => {
    updateProfessionalDetails(currentUser.id, proForm);
    setEditingPro(false);
    toast.success("Professional details updated!");
  };

  const handleSaveAcad = () => {
    updateAcademicDetails(currentUser.id, acadForm);
    setEditingAcad(false);
    toast.success("Academic details updated!");
  };

  const handleAddCareer = () => {
    if (!careerForm.jobTitle || !careerForm.companyName || !careerForm.startDate) {
      toast.error("Please fill required fields.");
      return;
    }
    if (editingCareerId) {
      updateCareerEntry(editingCareerId, { ...careerForm, userId: currentUser.id });
      toast.success("Career entry updated!");
    } else {
      addCareerEntry({ ...careerForm, userId: currentUser.id });
      toast.success("Career entry added!");
    }
    setShowCareerDialog(false);
    setEditingCareerId(null);
    setCareerForm({ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" });
  };

  const handleEditCareer = (entry: (typeof careerTimeline)[0]) => {
    setCareerForm({
      jobTitle: entry.jobTitle,
      companyName: entry.companyName,
      startDate: entry.startDate.split("T")[0],
      endDate: entry.endDate?.split("T")[0] || "",
      description: entry.description || "",
    });
    setEditingCareerId(entry.id);
    setShowCareerDialog(true);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      setProForm({ ...proForm, skills: [...proForm.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setProForm({ ...proForm, skills: proForm.skills.filter((s) => s !== skill) });
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-destructive/10 text-destructive",
    ADMIN: "bg-primary/10 text-primary",
    ALUMNI: "bg-accent/20 text-accent-foreground",
    STUDENT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    FACULTY: "bg-purple-100 text-purple-700",
    EMPLOYER: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border overflow-hidden"
      >
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10" />
        <div className="px-6 pb-5 relative">
          <div className="-mt-10 mb-4 flex items-end justify-between flex-wrap gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl border-4 border-card bg-muted"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className={cn("text-xs font-bold px-3 py-1.5 rounded-xl", roleColors[currentUser.role])}>
                {currentUser.role.replace("_", " ")}
              </span>
              {currentUser.isApproved && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-xl">
                  <Award className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">{currentUser.name}</h1>
          {myProfessional && (
            <p className="text-sm text-muted-foreground mt-1">{myProfessional.currentJobTitle} at {myProfessional.companyName}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
            {myProfessional?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{myProfessional.location}</span>}
            {myAcademic && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{myAcademic.department}, Batch {myAcademic.batchYear}</span>}
          </div>
          {myProfessional?.skills && myProfessional.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {myProfessional.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3 mt-4">
            {myProfessional?.linkedInUrl && (
              <a href={myProfessional.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {myProfessional?.portfolioUrl && (
              <a href={myProfessional.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="professional">
        <TabsList className="bg-muted">
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="career">Career Timeline</TabsTrigger>
        </TabsList>

        {/* Professional Details */}
        <TabsContent value="professional" className="mt-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Professional Details</h3>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditingPro(!editingPro)}>
                {editingPro ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
              </Button>
            </div>
            {editingPro ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Job Title</Label>
                    <Input value={proForm.currentJobTitle} onChange={(e) => setProForm({ ...proForm, currentJobTitle: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Company</Label>
                    <Input value={proForm.companyName} onChange={(e) => setProForm({ ...proForm, companyName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Industry</Label>
                    <Input value={proForm.industry} onChange={(e) => setProForm({ ...proForm, industry: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input value={proForm.location} onChange={(e) => setProForm({ ...proForm, location: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>LinkedIn URL</Label>
                    <Input value={proForm.linkedInUrl} onChange={(e) => setProForm({ ...proForm, linkedInUrl: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Portfolio URL</Label>
                    <Input value={proForm.portfolioUrl} onChange={(e) => setProForm({ ...proForm, portfolioUrl: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Skills (press Enter to add)</Label>
                  <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="e.g. React, Python..." />
                  {proForm.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proForm.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="gap-1 text-xs">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                  <Label className="cursor-pointer">Willing to Mentor Students</Label>
                  <Switch checked={proForm.willingToMentor} onCheckedChange={(v) => setProForm({ ...proForm, willingToMentor: v })} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                  <Label className="cursor-pointer">Offer Internship Opportunities</Label>
                  <Switch checked={proForm.willingToOfferInternship} onCheckedChange={(v) => setProForm({ ...proForm, willingToOfferInternship: v })} />
                </div>
                <Button className="w-full gap-1.5" onClick={handleSavePro}>
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Job Title", value: myProfessional?.currentJobTitle, icon: Briefcase },
                  { label: "Company", value: myProfessional?.companyName, icon: Building2 },
                  { label: "Industry", value: myProfessional?.industry, icon: ChevronRight },
                  { label: "Location", value: myProfessional?.location, icon: MapPin },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value || "Not set"}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", myProfessional?.willingToMentor ? "bg-green-500" : "bg-muted-foreground/30")} />
                    <span className="text-xs text-muted-foreground">Open to Mentor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", myProfessional?.willingToOfferInternship ? "bg-green-500" : "bg-muted-foreground/30")} />
                    <span className="text-xs text-muted-foreground">Offers Internships</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Academic Details */}
        <TabsContent value="academic" className="mt-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Academic Details</h3>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditingAcad(!editingAcad)}>
                {editingAcad ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
              </Button>
            </div>
            {editingAcad ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Input value={acadForm.department} onChange={(e) => setAcadForm({ ...acadForm, department: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Degree</Label>
                    <Input value={acadForm.degree} onChange={(e) => setAcadForm({ ...acadForm, degree: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Batch Year</Label>
                    <Input type="number" value={acadForm.batchYear} onChange={(e) => setAcadForm({ ...acadForm, batchYear: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Register Number</Label>
                    <Input value={acadForm.registerNumber} onChange={(e) => setAcadForm({ ...acadForm, registerNumber: e.target.value })} />
                  </div>
                </div>
                <Button className="w-full gap-1.5" onClick={handleSaveAcad}>
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Department", value: myAcademic?.department },
                  { label: "Degree", value: myAcademic?.degree },
                  { label: "Batch Year", value: myAcademic?.batchYear },
                  { label: "Register Number", value: myAcademic?.registerNumber },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value || "Not set"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Career Timeline */}
        <TabsContent value="career" className="mt-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">Career Timeline</h3>
              <Button size="sm" className="gap-1.5" onClick={() => { setEditingCareerId(null); setCareerForm({ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" }); setShowCareerDialog(true); }}>
                <Plus className="w-3.5 h-3.5" /> Add Entry
              </Button>
            </div>
            {myTimeline.length > 0 ? (
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {myTimeline.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative"
                    >
                      <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-foreground">{entry.jobTitle}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> {entry.companyName}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {format(new Date(entry.startDate), "MMM yyyy")} — {entry.endDate ? format(new Date(entry.endDate), "MMM yyyy") : "Present"}
                          </p>
                          {entry.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEditCareer(entry)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:bg-destructive/10" onClick={() => { deleteCareerEntry(entry.id); toast.info("Career entry deleted."); }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No career entries yet</p>
                <Button size="sm" className="mt-3" onClick={() => setShowCareerDialog(true)}>Add Your First Entry</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Career Dialog */}
      <Dialog open={showCareerDialog} onOpenChange={setShowCareerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCareerId ? "Edit" : "Add"} Career Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Job Title *</Label>
                <Input value={careerForm.jobTitle} onChange={(e) => setCareerForm({ ...careerForm, jobTitle: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Company *</Label>
                <Input value={careerForm.companyName} onChange={(e) => setCareerForm({ ...careerForm, companyName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date *</Label>
                <Input type="date" value={careerForm.startDate} onChange={(e) => setCareerForm({ ...careerForm, startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={careerForm.endDate} onChange={(e) => setCareerForm({ ...careerForm, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={2} value={careerForm.description} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCareerDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCareer}>{editingCareerId ? "Update" : "Add"} Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
