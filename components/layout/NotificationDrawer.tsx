"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Handshake,
  CalendarDays,
  Briefcase,
  Heart,
  UserCheck,
  Megaphone,
  CheckCheck,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { AlumniNotificationType } from "@/types";

const typeConfig: Record<AlumniNotificationType, { icon: React.ElementType; color: string }> = {
  MENTORSHIP_REQUEST: { icon: Handshake, color: "text-primary bg-primary/10" },
  MENTORSHIP_UPDATE: { icon: Handshake, color: "text-accent-foreground bg-accent/20" },
  EVENT_REMINDER: { icon: CalendarDays, color: "text-chart-3 bg-chart-3/10" },
  EVENT_UPDATE: { icon: CalendarDays, color: "text-chart-3 bg-chart-3/10" },
  OPPORTUNITY_APPLICATION: { icon: Briefcase, color: "text-chart-4 bg-chart-4/10" },
  DONATION_CONFIRMATION: { icon: Heart, color: "text-destructive bg-destructive/10" },
  PROFILE_APPROVED: { icon: UserCheck, color: "text-success bg-success/10" },
  ANNOUNCEMENT: { icon: Megaphone, color: "text-warning-foreground bg-warning/20" },
};

export function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useAppStore((s) => s.currentUser);
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);
  const clearAllNotifications = useAppStore((s) => s.clearAllNotifications);
  const getUnreadCount = useAppStore((s) => s.getUnreadCount);

  if (!currentUser) return null;

  const userNotifications = notifications
    .filter((n) => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = getUnreadCount(currentUser.id);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl hover:bg-accent/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="font-bold text-lg">Notifications</h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAllNotificationsRead(currentUser.id)}
                      className="text-xs h-8"
                    >
                      <CheckCheck className="w-3 h-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  {userNotifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => clearAllNotifications(currentUser.id)}
                      className="w-8 h-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1">
                {userNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                    <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground font-medium">All caught up!</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">No notifications yet.</p>
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    <AnimatePresence>
                      {userNotifications.map((notif) => {
                        const config = typeConfig[notif.type];
                        const Icon = config.icon;
                        return (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => markNotificationRead(notif.id)}
                            className={cn(
                              "flex gap-3 p-3.5 rounded-xl cursor-pointer transition-all",
                              notif.isRead
                                ? "bg-transparent hover:bg-muted/50"
                                : "bg-primary/5 hover:bg-primary/8 border border-primary/10"
                            )}
                          >
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", config.color)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={cn("text-sm font-medium leading-tight", notif.isRead ? "text-foreground" : "text-foreground")}>
                                  {notif.title}
                                </p>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
