"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AlumniUser,
  AlumniNotification,
  MentorshipRequest,
  EventRegistration,
  OpportunityApplication,
  Donation,
  FundraisingCampaign,
  AlumniEvent,
  Opportunity,
  AlumniActivityLog,
  AcademicDetails,
  ProfessionalDetails,
  CareerTimelineEntry,
  Department,
  AlumniActivityType,
  AlumniNotificationType,
} from "@/types";
import { mockUsers } from "@/mock-data/users";
import {
  mockNotifications,
  mockMentorshipRequests,
  mockEventRegistrations,
  mockOpportunityApplications,
  mockDonations,
  mockCampaigns,
  mockEvents,
  mockOpportunities,
  mockActivityLogs,
  mockDepartments,
} from "@/mock-data/events";
import { mockAcademicDetails, mockProfessionalDetails, mockCareerTimeline } from "@/mock-data/profiles";

interface AppState {
  // Auth
  currentUser: AlumniUser | null;
  users: AlumniUser[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (userId: string, updates: Partial<AlumniUser>) => void;
  registerUser: (data: Omit<AlumniUser, "id" | "createdAt" | "updatedAt">) => void;
  approveUser: (userId: string) => void;
  changeUserRole: (userId: string, role: AlumniUser["role"]) => void;

  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  // Notifications
  notifications: AlumniNotification[];
  addNotification: (notification: Omit<AlumniNotification, "id" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  clearAllNotifications: (userId: string) => void;
  getUnreadCount: (userId: string) => number;

  // Mentorship
  mentorshipRequests: MentorshipRequest[];
  sendMentorshipRequest: (req: Omit<MentorshipRequest, "id" | "createdAt" | "updatedAt">) => void;
  updateMentorshipStatus: (id: string, status: MentorshipRequest["status"]) => void;

  // Events
  events: AlumniEvent[];
  eventRegistrations: EventRegistration[];
  registerForEvent: (eventId: string, userId: string) => void;
  unregisterFromEvent: (eventId: string, userId: string) => void;
  createEvent: (event: Omit<AlumniEvent, "id" | "createdAt" | "updatedAt">) => void;
  updateEvent: (id: string, updates: Partial<AlumniEvent>) => void;
  deleteEvent: (id: string) => void;

  // Opportunities
  opportunities: Opportunity[];
  opportunityApplications: OpportunityApplication[];
  applyToOpportunity: (opportunityId: string, studentId: string) => void;
  postOpportunity: (opp: Omit<Opportunity, "id" | "createdAt">) => void;
  updateApplicationStatus: (id: string, status: OpportunityApplication["status"]) => void;

  // Donations
  donations: Donation[];
  campaigns: FundraisingCampaign[];
  makeDonation: (campaignId: string, alumniId: string, amount: number) => void;
  createCampaign: (campaign: Omit<FundraisingCampaign, "id" | "createdAt" | "collectedAmount">) => void;

  // Profiles
  academicDetails: AcademicDetails[];
  professionalDetails: ProfessionalDetails[];
  careerTimeline: CareerTimelineEntry[];
  updateAcademicDetails: (userId: string, data: Partial<AcademicDetails>) => void;
  updateProfessionalDetails: (userId: string, data: Partial<ProfessionalDetails>) => void;
  addCareerEntry: (entry: Omit<CareerTimelineEntry, "id" | "createdAt">) => void;
  updateCareerEntry: (id: string, data: Partial<CareerTimelineEntry>) => void;
  deleteCareerEntry: (id: string) => void;

  // Activity
  activityLogs: AlumniActivityLog[];
  addActivityLog: (userId: string, type: AlumniActivityType, message: string) => void;

  // Departments
  departments: Department[];
  addDepartment: (name: string, code: string) => void;
  deleteDepartment: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      users: mockUsers,
      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (user) {
          set({ currentUser: user, theme: user.theme });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      updateUser: (userId, updates) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, ...updates, updatedAt: now() } : u)),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, ...updates, updatedAt: now() }
            : state.currentUser,
        }));
      },
      registerUser: (data) => {
        const newUser: AlumniUser = {
          ...data,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
      approveUser: (userId) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, isApproved: true, updatedAt: now() } : u)),
        }));
        const user = get().users.find((u) => u.id === userId);
        if (user) {
          get().addNotification({
            userId,
            type: "PROFILE_APPROVED",
            title: "Profile Approved",
            message: "Your alumni profile has been approved by the admin!",
            isRead: false,
          });
        }
      },
      changeUserRole: (userId, role) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, role, updatedAt: now() } : u)),
        }));
      },

      // Theme
      theme: "light",
      setTheme: (theme) => {
        set({ theme });
        if (get().currentUser) {
          get().updateUser(get().currentUser!.id, { theme });
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },

      // Notifications
      notifications: mockNotifications,
      addNotification: (notification) => {
        const newNotif: AlumniNotification = {
          ...notification,
          id: generateId(),
          createdAt: now(),
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        }));
      },
      markAllNotificationsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, isRead: true } : n
          ),
        }));
      },
      clearAllNotifications: (userId) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.userId !== userId),
        }));
      },
      getUnreadCount: (userId) => {
        return get().notifications.filter((n) => n.userId === userId && !n.isRead).length;
      },

      // Mentorship
      mentorshipRequests: mockMentorshipRequests,
      sendMentorshipRequest: (req) => {
        const newReq: MentorshipRequest = {
          ...req,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({ mentorshipRequests: [newReq, ...state.mentorshipRequests] }));
        // Notify mentor
        const mentor = get().users.find((u) => u.id === req.mentorId);
        const student = get().users.find((u) => u.id === req.studentId);
        if (mentor && student) {
          get().addNotification({
            userId: req.mentorId,
            relatedEntityId: newReq.id,
            type: "MENTORSHIP_REQUEST",
            title: "New Mentorship Request",
            message: `${student.name} has sent you a mentorship request.`,
            isRead: false,
          });
          get().addActivityLog(req.studentId, "MENTORSHIP_REQUESTED", `You sent a mentorship request to ${mentor.name}`);
        }
      },
      updateMentorshipStatus: (id, status) => {
        const req = get().mentorshipRequests.find((r) => r.id === id);
        set((state) => ({
          mentorshipRequests: state.mentorshipRequests.map((r) =>
            r.id === id ? { ...r, status, updatedAt: now() } : r
          ),
        }));
        if (req) {
          const mentor = get().users.find((u) => u.id === req.mentorId);
          const student = get().users.find((u) => u.id === req.studentId);
          if (status === "ACCEPTED" && student && mentor) {
            get().addNotification({
              userId: req.studentId,
              relatedEntityId: id,
              type: "MENTORSHIP_UPDATE",
              title: "Mentorship Request Accepted",
              message: `${mentor.name} has accepted your mentorship request!`,
              isRead: false,
            });
          }
          if (status === "COMPLETED" && student) {
            get().addNotification({
              userId: req.studentId,
              relatedEntityId: id,
              type: "MENTORSHIP_UPDATE",
              title: "Mentorship Completed",
              message: "Your mentorship session has been marked as completed.",
              isRead: false,
            });
          }
        }
      },

      // Events
      events: mockEvents,
      eventRegistrations: mockEventRegistrations,
      registerForEvent: (eventId, userId) => {
        const existing = get().eventRegistrations.find(
          (r) => r.eventId === eventId && r.userId === userId
        );
        if (existing) return;
        const newReg: EventRegistration = {
          id: generateId(),
          eventId,
          userId,
          checkedIn: false,
          createdAt: now(),
        };
        set((state) => ({ eventRegistrations: [...state.eventRegistrations, newReg] }));
        const event = get().events.find((e) => e.id === eventId);
        if (event) {
          get().addNotification({
            userId,
            relatedEntityId: eventId,
            type: "EVENT_REMINDER",
            title: "Event Registration Confirmed",
            message: `You are registered for ${event.title}.`,
            isRead: false,
          });
          get().addActivityLog(userId, "EVENT_REGISTERED", `You registered for ${event.title}`);
        }
      },
      unregisterFromEvent: (eventId, userId) => {
        set((state) => ({
          eventRegistrations: state.eventRegistrations.filter(
            (r) => !(r.eventId === eventId && r.userId === userId)
          ),
        }));
      },
      createEvent: (event) => {
        const newEvent: AlumniEvent = {
          ...event,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({ events: [newEvent, ...state.events] }));
      },
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: now() } : e)),
        }));
      },
      deleteEvent: (id) => {
        set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
      },

      // Opportunities
      opportunities: mockOpportunities,
      opportunityApplications: mockOpportunityApplications,
      applyToOpportunity: (opportunityId, studentId) => {
        const existing = get().opportunityApplications.find(
          (a) => a.opportunityId === opportunityId && a.studentId === studentId
        );
        if (existing) return;
        const newApp: OpportunityApplication = {
          id: generateId(),
          opportunityId,
          studentId,
          status: "APPLIED",
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({ opportunityApplications: [...state.opportunityApplications, newApp] }));
        const opp = get().opportunities.find((o) => o.id === opportunityId);
        if (opp) {
          get().addNotification({
            userId: studentId,
            relatedEntityId: opportunityId,
            type: "OPPORTUNITY_APPLICATION",
            title: "Application Submitted",
            message: `Your application for ${opp.title} at ${opp.companyName} has been submitted.`,
            isRead: false,
          });
        }
      },
      postOpportunity: (opp) => {
        const newOpp: Opportunity = {
          ...opp,
          id: generateId(),
          createdAt: now(),
        };
        set((state) => ({ opportunities: [newOpp, ...state.opportunities] }));
        get().addActivityLog(opp.postedByAlumniId, "OPPORTUNITY_POSTED", `You posted ${opp.title} at ${opp.companyName}`);
      },
      updateApplicationStatus: (id, status) => {
        const app = get().opportunityApplications.find((a) => a.id === id);
        set((state) => ({
          opportunityApplications: state.opportunityApplications.map((a) =>
            a.id === id ? { ...a, status, updatedAt: now() } : a
          ),
        }));
        if (app) {
          const opp = get().opportunities.find((o) => o.id === app.opportunityId);
          if (opp) {
            get().addNotification({
              userId: app.studentId,
              relatedEntityId: app.opportunityId,
              type: "OPPORTUNITY_APPLICATION",
              title: `Application ${status.charAt(0) + status.slice(1).toLowerCase()}`,
              message: `Your application for ${opp.title} has been updated to ${status}.`,
              isRead: false,
            });
          }
        }
      },

      // Donations
      donations: mockDonations,
      campaigns: mockCampaigns,
      makeDonation: (campaignId, alumniId, amount) => {
        const newDonation: Donation = {
          id: generateId(),
          campaignId,
          donatedByAlumniId: alumniId,
          amount,
          paymentReferenceId: `PAY_${generateId().toUpperCase()}`,
          createdAt: now(),
        };
        set((state) => ({
          donations: [newDonation, ...state.donations],
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? { ...c, collectedAmount: c.collectedAmount + amount } : c
          ),
        }));
        const campaign = get().campaigns.find((c) => c.id === campaignId);
        if (campaign) {
          get().addNotification({
            userId: alumniId,
            relatedEntityId: campaignId,
            type: "DONATION_CONFIRMATION",
            title: "Donation Confirmed",
            message: `Your donation of ₹${amount.toLocaleString("en-IN")} to ${campaign.title} is confirmed. Thank you!`,
            isRead: false,
          });
          get().addActivityLog(alumniId, "DONATION_MADE", `You donated ₹${amount.toLocaleString("en-IN")} to ${campaign.title}`);
        }
      },
      createCampaign: (campaign) => {
        const newCampaign: FundraisingCampaign = {
          ...campaign,
          id: generateId(),
          collectedAmount: 0,
          createdAt: now(),
        };
        set((state) => ({ campaigns: [newCampaign, ...state.campaigns] }));
      },

      // Profiles
      academicDetails: mockAcademicDetails,
      professionalDetails: mockProfessionalDetails,
      careerTimeline: mockCareerTimeline,
      updateAcademicDetails: (userId, data) => {
        set((state) => ({
          academicDetails: state.academicDetails.map((a) =>
            a.userId === userId ? { ...a, ...data } : a
          ),
        }));
      },
      updateProfessionalDetails: (userId, data) => {
        set((state) => {
          const existing = state.professionalDetails.find((p) => p.userId === userId);
          if (existing) {
            return {
              professionalDetails: state.professionalDetails.map((p) =>
                p.userId === userId ? { ...p, ...data, updatedAt: now() } : p
              ),
            };
          } else {
            const newPD = {
              id: generateId(),
              userId,
              currentJobTitle: "",
              companyName: "",
              industry: "",
              location: "",
              skills: [],
              willingToMentor: false,
              willingToOfferInternship: false,
              createdAt: now(),
              updatedAt: now(),
              ...data,
            };
            return { professionalDetails: [...state.professionalDetails, newPD] };
          }
        });
        get().addActivityLog(userId, "PROFILE_UPDATED", "You updated your professional details");
      },
      addCareerEntry: (entry) => {
        const newEntry: CareerTimelineEntry = {
          ...entry,
          id: generateId(),
          createdAt: now(),
        };
        set((state) => ({ careerTimeline: [...state.careerTimeline, newEntry] }));
      },
      updateCareerEntry: (id, data) => {
        set((state) => ({
          careerTimeline: state.careerTimeline.map((e) => (e.id === id ? { ...e, ...data } : e)),
        }));
      },
      deleteCareerEntry: (id) => {
        set((state) => ({ careerTimeline: state.careerTimeline.filter((e) => e.id !== id) }));
      },

      // Activity
      activityLogs: mockActivityLogs,
      addActivityLog: (userId, type, message) => {
        const newLog: AlumniActivityLog = {
          id: generateId(),
          userId,
          type,
          message,
          createdAt: now(),
        };
        set((state) => ({ activityLogs: [newLog, ...state.activityLogs] }));
      },

      // Departments
      departments: mockDepartments,
      addDepartment: (name, code) => {
        const newDep: Department = {
          id: generateId(),
          name,
          code,
          createdAt: now(),
        };
        set((state) => ({ departments: [...state.departments, newDep] }));
      },
      deleteDepartment: (id) => {
        set((state) => ({ departments: state.departments.filter((d) => d.id !== id) }));
      },
    }),
    {
      name: "alumnexus-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
        theme: state.theme,
        notifications: state.notifications,
        mentorshipRequests: state.mentorshipRequests,
        eventRegistrations: state.eventRegistrations,
        opportunityApplications: state.opportunityApplications,
        donations: state.donations,
        campaigns: state.campaigns,
        events: state.events,
        opportunities: state.opportunities,
        activityLogs: state.activityLogs,
        users: state.users,
        academicDetails: state.academicDetails,
        professionalDetails: state.professionalDetails,
        careerTimeline: state.careerTimeline,
        departments: state.departments,
      }),
    }
  )
);
