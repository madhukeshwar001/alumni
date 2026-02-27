"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Heart, Target, Plus, TrendingUp, Calendar, IndianRupee, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

export default function AdminCampaignsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const campaigns = useAppStore((s) => s.campaigns);
  const donations = useAppStore((s) => s.donations);
  const createCampaign = useAppStore((s) => s.createCampaign);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });

  if (!currentUser) return null;
  const isAdmin = currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN";
  if (!isAdmin) return (
    <div className="p-6 text-center text-muted-foreground">You do not have access to this page.</div>
  );

  const totalRaised = campaigns.reduce((s, c) => s + c.collectedAmount, 0);
  const totalTarget = campaigns.reduce((s, c) => s + c.targetAmount, 0);
  const totalDonors = new Set(donations.map((d) => d.donatedByAlumniId)).size;

  const handleCreate = () => {
    if (!form.title.trim() || !form.description.trim() || !form.targetAmount || !form.startDate) {
      toast.error("Please fill all required fields.");
      return;
    }
    const target = parseInt(form.targetAmount.replace(/,/g, ""), 10);
    if (isNaN(target) || target <= 0) {
      toast.error("Please enter a valid target amount.");
      return;
    }
    createCampaign({
      title: form.title.trim(),
      description: form.description.trim(),
      targetAmount: target,
      createdByAdminId: currentUser.id,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      imageUrl: form.imageUrl || undefined,
    });
    toast.success(`Campaign "${form.title}" created successfully!`);
    setShowCreate(false);
    setForm({ title: "", description: "", targetAmount: "", startDate: "", endDate: "", imageUrl: "" });
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fundraising Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage alumni giving campaigns</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: campaigns.length, icon: Heart, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Total Raised", value: `₹${totalRaised.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
          { label: "Target Amount", value: `₹${totalTarget.toLocaleString("en-IN")}`, icon: Target, color: "text-accent-foreground", bg: "bg-accent/20" },
          { label: "Total Donors", value: totalDonors, icon: Users, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible"
        className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Overall Fundraising Progress</h3>
          </div>
          <span className="text-sm font-bold text-primary">
            {totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0}%
          </span>
        </div>
        <Progress value={totalTarget > 0 ? (totalRaised / totalTarget) * 100 : 0} className="h-3" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>₹{totalRaised.toLocaleString("en-IN")} raised</span>
          <span>₹{totalTarget.toLocaleString("en-IN")} goal</span>
        </div>
      </motion.div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {campaigns.map((campaign, i) => {
            const progress = Math.min(100, Math.round((campaign.collectedAmount / campaign.targetAmount) * 100));
            const campaignDonations = donations.filter((d) => d.campaignId === campaign.id);
            const donorCount = new Set(campaignDonations.map((d) => d.donatedByAlumniId)).size;
            const isActive = !campaign.endDate || new Date(campaign.endDate) >= new Date();

            return (
              <motion.div
                key={campaign.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                layout
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
              >
                {campaign.imageUrl && (
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-foreground text-sm leading-snug">{campaign.title}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] shrink-0",
                        isActive
                          ? "border-green-500/30 text-green-600 dark:text-green-400"
                          : "border-muted text-muted-foreground"
                      )}
                    >
                      {isActive ? "Active" : "Ended"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{campaign.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-primary">₹{campaign.collectedAmount.toLocaleString("en-IN")}</span>
                      <span className="text-muted-foreground">of ₹{campaign.targetAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{progress}%</span>
                      <span>{donorCount} donor{donorCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {format(new Date(campaign.startDate), "dd MMM yyyy")}
                      {campaign.endDate ? ` – ${format(new Date(campaign.endDate), "dd MMM yyyy")}` : " (Ongoing)"}
                    </span>
                  </div>

                  {/* Donation Breakdown */}
                  {campaignDonations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Recent Donations</p>
                      <div className="space-y-1.5">
                        {campaignDonations.slice(0, 3).map((don) => (
                          <div key={don.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground truncate">{don.paymentReferenceId}</span>
                            <span className="font-semibold text-primary shrink-0 ml-2">
                              ₹{don.amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">No campaigns yet</p>
          <p className="text-sm text-muted-foreground">Create your first fundraising campaign</p>
        </div>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Fundraising Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Campaign Title *</Label>
              <Input
                placeholder="e.g. Robotics Lab Setup Fund"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe the purpose of this campaign..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Target Amount (₹) *</Label>
                <Input
                  placeholder="e.g. 500000"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  type="number"
                  min="1"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date (optional)</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Image URL (optional)</Label>
                <Input
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" /> Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
