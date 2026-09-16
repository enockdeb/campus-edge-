export type UserRole = "student" | "teacher";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar: string;
  title?: string;
  identifier: string; // Student ID (NMC/...) or Staff ID
  college: string;
  programOrDept: string;
  studentProfile?: StudentProfile;
  facilitatorProfile?: FacilitatorProfile;
}

export interface EnrolledStudentItem {
  id: string;
  name: string;
  studentId: string;
  program: string;
  track: FacultyDepartment;
  avatar: string;
  attendanceRate: number;
  averageQuizScore: number;
  clinicalHoursLogged: number;
  clinicalHoursRequired: number;
  status: "Active" | "At Risk" | "Excelling";
  pendingLogSubmissions: number;
  lastActive: string;
}

export type AppView =
  | "login"
  | "dashboard"
  | "curriculum"
  | "registration"
  | "summarizer"
  | "flashcards"
  | "quizzes"
  | "videos"
  | "clinical-logs"
  | "forum"
  | "protocols"
  | "tutor-dashboard"
  | "teacher-roster";

export type FacultyDepartment = "nursing" | "midwifery" | "dual";

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  college: string;
  program: string;
  primaryTrack: FacultyDepartment;
  yearOfStudy: string;
  studentId: string;
  clinicalSite: string;
  clinicalHoursCompleted: number;
  clinicalHoursRequired: number;
  streakDays: number;
  cardsMastered: number;
  quizzesTaken: number;
  averageQuizScore: number;
  forumReputation: number;
  registeredCourseIds?: string[];
  semesterFeePaid?: number;
}

export interface MilestoneStep {
  id: string;
  title: string;
  type: "lecture_summary" | "flashcard_drill" | "clinical_checklist" | "case_quiz";
  estimatedMinutes: number;
  completed: boolean;
  contentPreview: string;
  actionPayload?: any;
}

export interface CurriculumMilestone {
  id: string;
  milestoneNumber: number;
  title: string;
  description: string;
  weekNumber: number;
  status: "locked" | "available" | "in_progress" | "completed";
  clinicalCompetencies: string[];
  steps: MilestoneStep[];
  badgeUnlocked?: string;
}

export interface CourseFeeBreakdown {
  tuitionFee: number;
  labFee: number;
  councilExamFee: number;
}

export interface CurriculumCourse {
  id: string;
  code: string;
  title: string;
  department: FacultyDepartment;
  category:
    | "Obstetrics & Midwifery"
    | "Pharmacology"
    | "Medical-Surgical"
    | "Pediatrics & Neonatal"
    | "Emergency Triage"
    | "Foundations & Ethics"
    | "Anatomy & Foundations"
    | "Clinical Assessment"
    | "Mental Health & Behavioral";
  credits: number;
  semester: string;
  instructor: string;
  description: string;
  totalMilestones: number;
  completedMilestones: number;
  colorScheme: string;
  fees: CourseFeeBreakdown;
  schedule?: string;
  clinicalHospitalSite?: string;
  prerequisites?: string[];
  capacity?: number;
  enrolledCount?: number;
  isRegistered?: boolean;
  registrationOpen?: boolean;
  milestones: CurriculumMilestone[];
}

export interface Flashcard {
  id: string;
  deckId: string;
  deckTitle?: string;
  question: string;
  answer: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tag: string;
  intervalDays?: number;
  nextReviewDate?: string;
  status: "new" | "learning" | "mastered";
  timesReviewed?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  category: string;
  cardCount: number;
  masteredCount: number;
  iconName: string;
  description: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  clinicalContext?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  author?: string;
  courseId?: string;
  courseTitle?: string;
  timesAttempted?: number;
  timesCorrect?: number;
}

export interface VideoLecture {
  id: string;
  title: string;
  courseId?: string;
  courseTitle?: string;
  department: FacultyDepartment;
  instructor: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl?: string;
  description: string;
  keyTakeaways: string[];
  chapters?: { time: string; title: string }[];
  tags: string[];
  uploadedAt: string;
  viewsCount: number;
}

export interface FacilitatorProfile {
  id: string;
  name: string;
  title: string;
  department: FacultyDepartment;
  college: string;
  avatar: string;
  email: string;
  coursesPublished: number;
  quizzesCreated: number;
  videosUploaded: number;
  totalStudentsTaught: number;
}

export interface QuizResult {
  id: string;
  quizTitle: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
  category: string;
}

export interface ClinicalPlacementLog {
  id: string;
  date: string;
  hospital: string;
  ward: "Labour & Delivery" | "Antenatal Clinic" | "Postnatal Ward" | "Neonatal Intensive Care (NICU)" | "Female Surgical Ward" | "Accident & Emergency (A&E)" | "Community Health Center";
  shiftType: "Morning (07:00 - 14:00)" | "Afternoon (14:00 - 20:00)" | "Night (20:00 - 08:00)";
  hours: number;
  preceptorName: string;
  competencies: string[];
  patientCaseSummary: string;
  clinicalReflection: string;
  status: "Draft" | "Pending Review" | "Verified by Preceptor";
  aiFeedback?: {
    competencyFeedback: string;
    clinicalSafetyCheck: string[];
    reflectiveQuestions: string[];
    preceptorReadiness: string;
  };
}

export interface ClinicalDefinition {
  term: string;
  definition: string;
  clinicalRelevance?: string;
}

export interface LectureNote {
  id: string;
  title: string;
  subject: string;
  date: string;
  originalSnippet: string;
  audioInfo?: {
    filename: string;
    duration?: string;
    fileSize?: string;
  };
  summary: {
    keyTakeaways: string[];
    definitions?: ClinicalDefinition[];
    clinicalPearls: string[];
    nursingInterventions: string[];
    redFlags: string[];
    examMnemonics: string[];
    fullSummaryMarkdown: string;
  };
  tags: string[];
}

export interface ForumReply {
  id: string;
  author: {
    name: string;
    role: string;
    college: string;
    avatar: string;
    verifiedStudent: boolean;
  };
  content: string;
  timestamp: string;
  upvotes: number;
  isVerifiedSolution?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  author: {
    name: string;
    role: string;
    college: string;
    avatar: string;
    verifiedStudent: boolean;
  };
  category: "Clinical Placements" | "Licensure & Board Exams" | "Midwifery Skills" | "Case Discussions" | "Study Groups";
  content: string;
  timestamp: string;
  upvotes: number;
  userUpvoted?: boolean;
  tags: string[];
  replies: ForumReply[];
  solved: boolean;
  views: number;
}

export interface ClinicalProtocol {
  id: string;
  title: string;
  category: "Obstetrics" | "Resuscitation" | "Pharmacology" | "Infection Control";
  summary: string;
  steps: string[];
  emergencyAlert?: string;
  updatedDate: string;
}

export type NotificationType = "quiz" | "summary" | "fee" | "exam" | "forum" | "curriculum";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
  priority?: "urgent" | "normal" | "low";
  targetView?: AppView;
  targetPayload?: any;
}

export interface ModuleProgressStat {
  moduleCode: string;
  name: string;
  track: "Midwifery" | "Nursing" | "Dual Core";
  completionRate: number; // 0 - 100
  quizAccuracy: number; // 0 - 100
  quizzesTaken: number;
  totalQuizzes: number;
  color: string;
}

export interface QuizTrendData {
  session: string;
  date: string;
  score: number;
  benchmark: number; // e.g. 75% passing mark
  midwiferyScore: number;
  nursingScore: number;
  topic: string;
}

