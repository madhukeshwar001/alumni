"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Heart, Target, TrendingUp, Calendar, CreditCard, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const campaignImages = [
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80",
];

export default function DonationsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const campaigns = useAppStore((s) => s.campaigns);
  const donations = useAppStore((s) => s.donations);
  const makeDonation = useAppStore((s) => s.makeDonation);
  const createCampaign = useAppStore((s) => s.createCampaign);

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState(false);
  const [donating, setDonating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ title: "", description: "", targetAmount: "", startDate: "", endDate: "" });

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  const myDonations = donations.filter((d) => d.donatedByAlumniId === currentUser?.id);
  const totalMyDonations = myDonations.reduce((s, d) => s + d.amount, 0);

  const handleDonate = async () => {
    if (!currentUser || !selectedCampaign || !amount) {
      toast.error("Please select a campaign and enter an amount.");
      return;
    }
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum < 100) {
      toast.error("Minimum donation amount is ₹100.");
      return;
    }
    setDonating(true);
    await new Promise((r) => setTimeout(r, 1500));
    makeDonation(selectedCampaign, currentUser.id, amountNum);
    setDonating(false);
    setSelectedCampaign(null);
    setAmount("");
  };

  const handleCreateCampaign = () => {
    if (!currentUser || !campaignForm.title || !campaignForm.targetAmount) {
      toast.error("Please fill all required fields.");
      return;
    }
    createCampaign({
      title: campaignForm.title,
      description: campaignForm.description,
      targetAmount: parseInt(campaignForm.targetAmount),
      createdByAdminId: currentUser.id,
      startDate: campaignForm.startDate || new Date().toISOString(),
      endDate: campaignForm.endDate || undefined,
    });
    toast.success("Campaign created!");
    setShowCreateDialog(false);
    setCampaignForm({ title: "", description: "", targetAmount: "", startDate: "", endDate: "" });
  };

  const CampaignCard = ({ campaign, index }: { campaign: (typeof campaigns)[0]; index: number }) => {
    const progress = Math.min(100, Math.round((campaign.collectedAmount / campaign.targetAmount) * 100));
    const imgSrc = campaign.imageUrl || campaignImages[index % campaignImages.length];
    const myContribution = donations.filter((d) => d.campaignId === campaign.id && d.donatedByAlumniId === currentUser?.id).reduce((s, d) => s + d.amount, 0);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all"
      >
        <div className="h-44 overflow-hidden bg-muted relative">
          <img src={imgSrc} alt={campaign.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-xs font-semibold">{progress}% funded</span>
              <span className="text-white/70 text-xs">₹{campaign.collectedAmount.toLocaleString("en-IN")} / ₹{campaign.targetAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-1.5 rounded-full bg-accent"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm mb-1">{campaign.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{campaign.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> ₹{campaign.targetAmount.toLocaleString("en-IN")} goal
            </span>
            {campaign.endDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Ends {format(new Date(campaign.endDate), "dd MMM")}
              </span>
            )}
          </div>

          {myContribution > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 mb-3">
              <Check className="w-3.5 h-3.5" />
              <span>You contributed ₹{myContribution.toLocaleString("en-IN")}</span>
            </div>
          )}

          {(currentUser?.role === "ALUMNI" || currentUser?.role === "SUPER_ADMIN") && (
            <Button size="sm" className="w-full gap-1.5" onClick={() => setSelectedCampaign(campaign.id)}>
              <Heart className="w-3.5 h-3.5" /> Donate Now
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fundraising & Donations</h1>
          <p className="text-muted-foreground text-sm mt-1">Give back to your alma mater and support the next generation</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        )}
      </motion.div>

      {/* My Stats */}
      {(currentUser?.role === "ALUMNI" || currentUser?.role === "SUPER_ADMIN") && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Donated", value: `₹${(totalMyDonations + 15000).toLocaleString("en-IN")}`, icon: Heart, color: "text-pink-500" },
            { label: "Campaigns Supported", value: [...new Set(myDonations.map((d) => d.campaignId))].length + 3, icon: Target, color: "text-primary" },
            { label: "Donations Made", value: myDonations.length + 5, icon: TrendingUp, color: "text-green-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4"
            >
              <div className="p-3 bg-muted rounded-xl">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Tabs defaultValue="campaigns">
        <TabsList className="bg-muted">
          <TabsTrigger value="campaigns">Campaigns ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="history">My Donations ({myDonations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign, i) => <CampaignCard key={campaign.id} campaign={campaign} index={i} />)}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {myDonations.length > 0 ? (
            <div className="space-y-3">
              {myDonations.map((donation) => {
                const campaign = campaigns.find((c) => c.id === donation.campaignId);
                return (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl shrink-0">
                        <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{campaign?.title || "General Donation"}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(donation.createdAt), "dd MMM yyyy")}</p>
                        {donation.paymentReferenceId && (
                          <p className="text-[10px] text-muted-foreground font-mono">{donation.paymentReferenceId}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">₹{donation.amount.toLocaleString("en-IN")}</p>
                      <Badge variant="outline" className="text-[10px] text-green-600 border-green-200">Confirmed</Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No donations yet</p>
              <p className="text-sm">Support a campaign to see your history here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Donation Dialog */}
      <AnimatePresence>
        {selectedCampaign && (() => {
          const campaign = campaigns.find((c) => c.id === selectedCampaign);
          return (
            <Dialog open onOpenChange={() => { setSelectedCampaign(null); setAmount(""); }}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Donate to Campaign</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <p className="text-sm text-muted-foreground">{campaign?.title}</p>
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Choose Amount (₹)</Label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {QUICK_AMOUNTS.map((qa) => (
                        <motion.button
                          key={qa}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setAmount(qa.toString()); setCustomAmount(false); }}
                          className={cn(
                            "py-2.5 text-sm font-semibold rounded-xl border transition-all",
                            amount === qa.toString() && !customAmount
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/40 hover:bg-muted"
                          )}
                        >
                          ₹{qa.toLocaleString("en-IN")}
                        </motion.button>
                      ))}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setCustomAmount(true); setAmount(""); }}
                        className={cn(
                          "py-2.5 text-sm font-semibold rounded-xl border transition-all",
                          customAmount ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40 hover:bg-muted"
                        )}
                      >
                        Custom
                      </motion.button>
                    </div>
                    {customAmount && (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                        <Input
                          className="pl-7"
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>This is a demo — no real payment is processed</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setSelectedCampaign(null); setAmount(""); }}>Cancel</Button>
                  <Button onClick={handleDonate} disabled={donating || !amount} className="gap-1.5">
                    {donating ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block" />
                    ) : (
                      <><Heart className="w-4 h-4" /> Donate {amount ? `₹${parseInt(amount).toLocaleString("en-IN")}` : ""}</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })()}
      </AnimatePresence>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Fundraising Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Campaign Title *</Label>
              <Input placeholder="Lab Equipment Fund 2025" value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Target Amount (₹) *</Label>
              <Input type="number" placeholder="500000" value={campaignForm.targetAmount} onChange={(e) => setCampaignForm({ ...campaignForm, targetAmount: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={campaignForm.startDate} onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={campaignForm.endDate} onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="Describe the campaign goal..." value={campaignForm.description} onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
