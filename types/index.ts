export type AlumniSystemRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "ALUMNI"
  | "STUDENT"
  | "FACULTY"
  | "EMPLOYER"
  | "CUSTOM";

export interface AlumniCustomRole {
  id: string;
  roleName: string;
  createdByAdminId: string;
  createdAt: string;
}

export interface AlumniUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AlumniSystemRole;
  customRoleId?: string;
  avatar?: string;
  theme: "light" | "dark";
  emailNotificationsEnabled: boolean;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicDetails {
  id: string;
  userId: string;
  department: string;
  degree: string;
  batchYear: number;
  registerNumber: string;
  createdAt: string;
}

export interface ProfessionalDetails {
  id: string;
  userId: string;
  currentJobTitle: string;
  companyName: string;
  industry: string;
  location: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  willingToMentor: boolean;
  willingToOfferInternship: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CareerTimelineEntry {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt: string;
}

export interface AlumniDirectoryFilters {
  department?: string;
  batchYear?: number;
  industry?: string;
  location?: string;
  company?: string;
  skills?: string[];
  search?: string;
}

export type MentorshipStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  studentId: string;
  message?: string;
  scheduledDate?: string;
  meetingMode?: "ONLINE" | "OFFLINE";
  status: MentorshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipReview {
  id: string;
  mentorshipRequestId: string;
  reviewedByStudentId: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
}

export type OpportunityType = "INTERNSHIP" | "FULL_TIME" | "REFERRAL";

export interface Opportunity {
  id: string;
  postedByAlumniId: string;
  type: OpportunityType;
  title: string;
  description: string;
  companyName: string;
  location: string;
  skillsRequired: string[];
  applicationDeadline?: string;
  createdAt: string;
}

export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "SELECTED";

export interface OpportunityApplication {
  id: string;
  opportunityId: string;
  studentId: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type EventType =
  | "ALUMNI_MEET"
  | "WEBINAR"
  | "WORKSHOP"
  | "CAREER_TALK"
  | "FUNDRAISING";

export interface AlumniEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  eventDate: string;
  location: string;
  createdByAdminId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  checkedIn?: boolean;
  createdAt: string;
}

export interface EventFeedback {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  feedbackText?: string;
  createdAt: string;
}

export interface FundraisingCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  createdByAdminId: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  campaignId?: string;
  donatedByAlumniId: string;
  amount: number;
  paymentReferenceId?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRoles?: AlumniSystemRole[];
  targetDepartments?: string[];
  targetBatchYears?: number[];
  createdByAdminId: string;
  createdAt: string;
}

export type AlumniNotificationType =
  | "MENTORSHIP_REQUEST"
  | "MENTORSHIP_UPDATE"
  | "EVENT_REMINDER"
  | "EVENT_UPDATE"
  | "OPPORTUNITY_APPLICATION"
  | "DONATION_CONFIRMATION"
  | "PROFILE_APPROVED"
  | "ANNOUNCEMENT";

export interface AlumniNotification {
  id: string;
  userId: string;
  relatedEntityId?: string;
  type: AlumniNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AlumniDashboardStats {
  mentorshipGiven: number;
  eventsRegistered: number;
  donationsMade: number;
  studentsMentored: number;
}

export interface StudentDashboardStats {
  mentorsConnected: number;
  internshipApplications: number;
  eventsRegistered: number;
}

export interface AdminDashboardStats {
  totalAlumni: number;
  totalStudents: number;
  totalEvents: number;
  totalMentorshipRequests: number;
  totalDonations: number;
}

export interface AlumniTutorialStep {
  id: string;
  pageRoute: string;
  stepTitle: string;
  stepDescription: string;
  stepOrder: number;
}

export type AlumniActivityType =
  | "PROFILE_UPDATED"
  | "MENTORSHIP_REQUESTED"
  | "MENTORSHIP_COMPLETED"
  | "EVENT_REGISTERED"
  | "DONATION_MADE"
  | "OPPORTUNITY_POSTED";

export interface AlumniActivityLog {
  id: string;
  userId: string;
  type: AlumniActivityType;
  message: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}
