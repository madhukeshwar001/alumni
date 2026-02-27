"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { CalendarDays, MapPin, Clock, Plus, Users, CheckCircle2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { EventType } from "@/types";

const typeColors: Record<string, string> = {
  ALUMNI_MEET: "bg-primary/10 text-primary",
  WEBINAR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  WORKSHOP: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CAREER_TALK: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  FUNDRAISING: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const eventImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
  "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
];

export default function EventsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const events = useAppStore((s) => s.events);
  const eventRegistrations = useAppStore((s) => s.eventRegistrations);
  const registerForEvent = useAppStore((s) => s.registerForEvent);
  const unregisterFromEvent = useAppStore((s) => s.unregisterFromEvent);
  const createEvent = useAppStore((s) => s.createEvent);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "WEBINAR" as EventType, eventDate: "", location: "" });

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  const myRegistrations = eventRegistrations.filter((r) => r.userId === currentUser?.id);
  const myEventIds = myRegistrations.map((r) => r.eventId);

  const upcomingEvents = events.filter((e) => new Date(e.eventDate) >= new Date()).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const pastEvents = events.filter((e) => new Date(e.eventDate) < new Date()).sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  const myEvents = events.filter((e) => myEventIds.includes(e.id));

  const isRegistered = (eventId: string) => myEventIds.includes(eventId);

  const handleRegister = (eventId: string, title: string) => {
    if (!currentUser) return;
    registerForEvent(eventId, currentUser.id);
    toast.success(`Registered for ${title}!`);
  };

  const handleUnregister = (eventId: string, title: string) => {
    if (!currentUser) return;
    unregisterFromEvent(eventId, currentUser.id);
    toast.info(`Unregistered from ${title}.`);
  };

  const handleCreateEvent = () => {
    if (!currentUser || !form.title || !form.eventDate || !form.location) {
      toast.error("Please fill all required fields.");
      return;
    }
    createEvent({
      title: form.title,
      description: form.description,
      type: form.type,
      eventDate: new Date(form.eventDate).toISOString(),
      location: form.location,
      createdByAdminId: currentUser.id,
    });
    toast.success("Event created successfully!");
    setShowCreateDialog(false);
    setForm({ title: "", description: "", type: "WEBINAR", eventDate: "", location: "" });
  };

  const EventCard = ({ event, index }: { event: (typeof events)[0]; index: number }) => {
    const registered = isRegistered(event.id);
    const regCount = eventRegistrations.filter((r) => r.eventId === event.id).length;
    const isPast = new Date(event.eventDate) < new Date();
    const imgSrc = event.imageUrl || eventImages[index % eventImages.length];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all group"
      >
        <div className="h-40 overflow-hidden bg-muted relative">
          <img
            src={imgSrc}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={cn("text-[10px] px-2 py-1 rounded-full font-bold backdrop-blur-sm bg-white/20 text-white border border-white/30")}>
              {event.type.replace("_", " ")}
            </span>
          </div>
          {registered && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold bg-green-500 text-white">
                <CheckCircle2 className="w-3 h-3" /> Registered
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-2">{event.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{event.description}</p>

          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              <span>{format(new Date(event.eventDate), "dd MMM yyyy, hh:mm a")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{regCount + Math.floor(Math.random() * 40 + 10)} registered</span>
            </div>
          </div>

          {!isPast ? (
            registered ? (
              <Button size="sm" variant="outline" className="w-full text-xs text-destructive hover:bg-destructive/10" onClick={() => handleUnregister(event.id, event.title)}>
                Cancel Registration
              </Button>
            ) : (
              <Button size="sm" className="w-full text-xs gap-1.5" onClick={() => handleRegister(event.id, event.title)}>
                <Ticket className="w-3.5 h-3.5" /> Register Now
              </Button>
            )
          ) : (
            <Button size="sm" variant="outline" className="w-full text-xs" disabled>
              Event Ended
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
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground text-sm mt-1">Webinars, alumni meets, workshops, and career talks</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Create Event
          </Button>
        )}
      </motion.div>

      <Tabs defaultValue="upcoming">
        <TabsList className="bg-muted">
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="mine">My Events ({myEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
        </TabsList>

        {[
          { value: "upcoming", data: upcomingEvents },
          { value: "mine", data: myEvents },
          { value: "past", data: pastEvents },
        ].map(({ value, data }) => (
          <TabsContent key={value} value={value} className="mt-4">
            {data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No events here</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Event Title *</Label>
              <Input placeholder="Annual Alumni Meet 2025" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as EventType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEBINAR">Webinar</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="ALUMNI_MEET">Alumni Meet</SelectItem>
                    <SelectItem value="CAREER_TALK">Career Talk</SelectItem>
                    <SelectItem value="FUNDRAISING">Fundraising</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date & Time *</Label>
                <Input type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Location *</Label>
              <Input placeholder="Chennai / Online via Zoom" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Describe the event..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
