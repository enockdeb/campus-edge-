import React, { useState } from "react";
import {
  CurriculumCourse,
  QuizQuestion,
  VideoLecture,
  FacilitatorProfile,
  FacultyDepartment,
  AppView,
  CurriculumMilestone,
  EnrolledStudentItem
} from "../types";
import { initialEnrolledStudents } from "../data/initialData";
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Play,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Search,
  Filter,
  Users,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
  Clock,
  Video,
  DollarSign,
  AlertTriangle,
  Stethoscope,
  Eye,
  Check,
  Building,
  TrendingUp,
  FileCheck,
  LogOut,
  UserCheck
} from "lucide-react";

interface TutorDashboardViewProps {
  facilitator: FacilitatorProfile;
  courses: CurriculumCourse[];
  questions: QuizQuestion[];
  videos: VideoLecture[];
  enrolledStudents?: EnrolledStudentItem[];
  initialTab?: "courses" | "quizzes" | "videos" | "analytics" | "roster";
  onAddCourse: (course: CurriculumCourse) => void;
  onUpdateCourse?: (courseId: string, updated: Partial<CurriculumCourse>) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddQuestion: (question: QuizQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  onAddVideo: (video: VideoLecture) => void;
  onDeleteVideo: (videoId: string) => void;
  onSwitchToStudentView?: (view?: AppView) => void;
  onSignOut?: () => void;
  onApproveStudentHours?: (studentId: string, hours: number) => void;
}

export const TutorDashboardView: React.FC<TutorDashboardViewProps> = ({
  facilitator,
  courses,
  questions,
  videos,
  enrolledStudents = initialEnrolledStudents,
  initialTab,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddQuestion,
  onDeleteQuestion,
  onAddVideo,
  onDeleteVideo,
  onSwitchToStudentView,
  onSignOut,
  onApproveStudentHours
}) => {
  const [activeTab, setActiveTab] = useState<"courses" | "quizzes" | "videos" | "analytics" | "roster">(initialTab || "courses");
  const [students, setStudents] = useState<EnrolledStudentItem[]>(enrolledStudents);
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Excelling" | "At Risk">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<"all" | FacultyDepartment>("all");

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoLecture | null>(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState<string | null>(null);

  // Success Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- NEW COURSE FORM STATE ---
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDept, setNewCourseDept] = useState<FacultyDepartment>("midwifery");
  const [newCourseCategory, setNewCourseCategory] = useState<CurriculumCourse["category"]>("Obstetrics & Midwifery");
  const [newCourseCredits, setNewCourseCredits] = useState<number>(3);
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseInstructor, setNewCourseInstructor] = useState(facilitator.name);
  const [newCourseHospital, setNewCourseHospital] = useState("Ridge Regional Hospital - Maternity & Surgical Wards");
  const [newCourseTuition, setNewCourseTuition] = useState<number>(180);
  const [newCourseLab, setNewCourseLab] = useState<number>(45);
  const [newCourseExam, setNewCourseExam] = useState<number>(25);
  const [newCourseCapacity, setNewCourseCapacity] = useState<number>(60);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneCompetencies, setNewMilestoneCompetencies] = useState("");

  // --- NEW QUIZ QUESTION FORM STATE ---
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionContext, setNewQuestionContext] = useState("Obstetric Emergencies");
  const [newQuestionCourseId, setNewQuestionCourseId] = useState(courses[0]?.id || "");
  const [newQuestionDifficulty, setNewQuestionDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);
  const [newQuestionRationale, setNewQuestionRationale] = useState("");

  // --- NEW VIDEO LECTURE FORM STATE ---
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoCourseId, setNewVideoCourseId] = useState(courses[0]?.id || "");
  const [newVideoDept, setNewVideoDept] = useState<FacultyDepartment>("midwifery");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoDuration, setNewVideoDuration] = useState("18:30");
  const [newVideoInstructor, setNewVideoInstructor] = useState(facilitator.name);
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [newVideoTakeaways, setNewVideoTakeaways] = useState(
    "Maintain strict sterile technique.\nAuscultate fetal heart tones for 60 seconds post-contraction.\nEscalate crossing of the Partograph Action line immediately."
  );
  const [newVideoTags, setNewVideoTags] = useState("Partograph, Clinical Skills, Licensure");

  // --- CREATE COURSE SUBMIT HANDLER ---
  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseTitle.trim()) return;

    const initialMilestones: CurriculumMilestone[] = [
      {
        id: `ms-${Date.now()}-1`,
        milestoneNumber: 1,
        title: newMilestoneTitle.trim() || "Foundations & Clinical Orientation",
        description: `Week 1 core competencies in ${newCourseTitle}`,
        weekNumber: 1,
        status: "available",
        clinicalCompetencies: newMilestoneCompetencies.trim()
          ? newMilestoneCompetencies.split(",").map((s) => s.trim())
          : ["Aseptic Preparation", "Patient Triage & Assessment", "Vital Signs Protocol"],
        steps: [
          {
            id: `step-${Date.now()}-1`,
            title: "Lecture Mastery & Protocol Review",
            type: "lecture_summary",
            estimatedMinutes: 25,
            completed: false,
            contentPreview: "Review clinical guidelines and core pharmacological interventions."
          },
          {
            id: `step-${Date.now()}-2`,
            title: "Bedside OSCE Checkup",
            type: "clinical_checklist",
            estimatedMinutes: 20,
            completed: false,
            contentPreview: "Perform step-by-step hands-on simulation with clinical preceptor sign-off."
          }
        ]
      }
    ];

    const newCourse: CurriculumCourse = {
      id: `course-${newCourseCode.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
      code: newCourseCode.trim().toUpperCase(),
      title: newCourseTitle.trim(),
      department: newCourseDept,
      category: newCourseCategory,
      credits: Number(newCourseCredits) || 3,
      semester: "2026/2027 Academic Session",
      instructor: newCourseInstructor.trim() || facilitator.name,
      description: newCourseDesc.trim() || `Comprehensive curriculum module covering ${newCourseTitle}.`,
      totalMilestones: 1,
      completedMilestones: 0,
      colorScheme: newCourseDept === "midwifery" ? "rose" : newCourseDept === "nursing" ? "sky" : "amber",
      fees: {
        tuitionFee: Number(newCourseTuition) || 180,
        labFee: Number(newCourseLab) || 45,
        councilExamFee: Number(newCourseExam) || 25
      },
      schedule: "Mon & Thu 09:00 - 11:30 AM",
      clinicalHospitalSite: newCourseHospital.trim(),
      prerequisites: ["NMC Core Foundations"],
      capacity: Number(newCourseCapacity) || 60,
      enrolledCount: 14,
      isRegistered: false,
      registrationOpen: true,
      milestones: initialMilestones
    };

    onAddCourse(newCourse);
    setShowCourseModal(false);
    triggerToast(`Course "${newCourse.code}: ${newCourse.title}" successfully published to the catalog!`);

    // Reset fields
    setNewCourseCode("");
    setNewCourseTitle("");
    setNewCourseDesc("");
    setNewMilestoneTitle("");
    setNewMilestoneCompetencies("");
  };

  // --- CREATE QUIZ QUESTION SUBMIT HANDLER ---
  const handleCreateQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !optionA.trim() || !optionB.trim()) return;

    const matchedCourse = courses.find((c) => c.id === newQuestionCourseId);

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: newQuestionText.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim() || "None of the above", optionD.trim() || "All of the above"],
      correctIndex: correctOptionIdx,
      rationale: newQuestionRationale.trim() || "Clinical reasoning aligns with national Nursing and Midwifery Council guidelines.",
      clinicalContext: newQuestionContext.trim(),
      difficulty: newQuestionDifficulty,
      author: facilitator.name,
      courseId: newQuestionCourseId,
      courseTitle: matchedCourse?.title || "Core Licensure Module",
      timesAttempted: 0,
      timesCorrect: 0
    };

    onAddQuestion(newQ);
    setShowQuizModal(false);
    triggerToast("New clinical scenario question added to the Licensure Question Bank!");

    // Reset
    setNewQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setNewQuestionRationale("");
  };

  // --- CREATE VIDEO SUBMIT HANDLER ---
  const handleCreateVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;

    const matchedCourse = courses.find((c) => c.id === newVideoCourseId);
    const parsedTakeaways = newVideoTakeaways
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedTags = newVideoTags
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newVid: VideoLecture = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle.trim(),
      courseId: newVideoCourseId,
      courseTitle: matchedCourse?.title || "Clinical Skills Masterclass",
      department: newVideoDept,
      instructor: newVideoInstructor.trim() || facilitator.name,
      duration: newVideoDuration.trim() || "15:00",
      videoUrl: newVideoUrl.trim() || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
      description: newVideoDesc.trim() || "Step-by-step procedural masterclass demonstrating clinical technique and patient safety standards.",
      keyTakeaways: parsedTakeaways.length > 0 ? parsedTakeaways : ["Demonstrate proper hand hygiene and patient dignity.", "Follow national clinical standard protocols."],
      chapters: [
        { time: "00:00", title: "Procedural Overview & Equipment Prep" },
        { time: "05:00", title: "Execution of Clinical Technique" },
        { time: "10:30", title: "Safety Red Flags & Post-Procedure Care" }
      ],
      tags: parsedTags.length > 0 ? parsedTags : ["Clinical", "Skills"],
      uploadedAt: "Just now",
      viewsCount: 1
    };

    onAddVideo(newVid);
    setShowVideoModal(false);
    triggerToast(`Video Lecture "${newVid.title}" published!`);

    // Reset
    setNewVideoTitle("");
    setNewVideoUrl("");
    setNewVideoDesc("");
  };

  // Add Milestone to Existing Course
  const handleAddMilestoneToCourse = (courseId: string) => {
    if (!newMilestoneTitle.trim()) return;
    const course = courses.find((c) => c.id === courseId);
    if (!course || !onUpdateCourse) return;

    const newMs: CurriculumMilestone = {
      id: `ms-${Date.now()}`,
      milestoneNumber: (course.milestones?.length || 0) + 1,
      title: newMilestoneTitle.trim(),
      description: "Additional clinical module added by facilitator.",
      weekNumber: (course.milestones?.length || 0) + 1,
      status: "available",
      clinicalCompetencies: newMilestoneCompetencies.trim()
        ? newMilestoneCompetencies.split(",").map((s) => s.trim())
        : ["Core Bedside Safety", "Asepsis & Documentation"],
      steps: [
        {
          id: `step-${Date.now()}-1`,
          title: "Lecture & Case Review",
          type: "lecture_summary",
          estimatedMinutes: 30,
          completed: false,
          contentPreview: "Review clinical protocols and patient safety checks."
        }
      ]
    };

    const updatedMilestones = [...(course.milestones || []), newMs];
    onUpdateCourse(courseId, {
      milestones: updatedMilestones,
      totalMilestones: updatedMilestones.length
    });

    setShowMilestoneModal(null);
    setNewMilestoneTitle("");
    setNewMilestoneCompetencies("");
    triggerToast(`Added milestone "${newMs.title}" to ${course.code}!`);
  };

  const handleApproveHours = (studentId: string, studentName: string, hoursToAdd: number = 10) => {
    setStudents((prev) =>
      prev.map((std) => {
        if (std.id === studentId) {
          return {
            ...std,
            clinicalHoursLogged: Math.min(std.clinicalHoursRequired, std.clinicalHoursLogged + hoursToAdd),
            pendingLogSubmissions: Math.max(0, std.pendingLogSubmissions - 1)
          };
        }
        return std;
      })
    );
    if (onApproveStudentHours) {
      onApproveStudentHours(studentId, hoursToAdd);
    }
    triggerToast(`Approved +${hoursToAdd} clinical shift hours for ${studentName}! Ward verification logged.`);
  };

  // Calculate cohort metrics
  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const averageAccuracy =
    questions.length > 0
      ? Math.round(
          questions.reduce((acc, q) => {
            if (!q.timesAttempted || q.timesAttempted === 0) return acc + 80;
            return acc + (q.timesCorrect! / q.timesAttempted!) * 100;
          }, 0) / questions.length
        )
      : 84;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 text-xs font-bold border border-emerald-400/30">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Facilitator Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-sky-400/50 shadow-lg shrink-0 bg-slate-800">
              <img
                src={facilitator.avatar}
                alt={facilitator.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" title="Faculty Active"></span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Faculty & Preceptor Workspace
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Course & Content Management
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                {facilitator.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {facilitator.title} • <strong className="text-sky-300">{facilitator.college}</strong>
              </p>
            </div>
          </div>

          {/* Quick Action: Switch to Student View or Sign Out */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onSwitchToStudentView && (
              <button
                onClick={() => onSwitchToStudentView("dashboard")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <Users className="w-4 h-4 text-sky-300" />
                <span>Preview Student Portal</span>
              </button>
            )}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs border border-rose-400/30 transition-all cursor-pointer active:scale-95"
                title="Sign out of Faculty Session"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={() => {
                if (activeTab === "courses") setShowCourseModal(true);
                else if (activeTab === "quizzes") setShowQuizModal(true);
                else if (activeTab === "videos") setShowVideoModal(true);
                else setShowCourseModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-900/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === "courses"
                  ? "Create New Course"
                  : activeTab === "quizzes"
                  ? "Create Quiz Question"
                  : activeTab === "videos"
                  ? "Upload Video Lecture"
                  : "Create New Course"}
              </span>
            </button>
          </div>
        </div>

        {/* Facilitator Metric Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Courses Published</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{courses.length}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Question Bank</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{questions.length}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <Play className="w-3.5 h-3.5 text-rose-400" />
              <span>Video Masterclasses</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{videos.length}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cohort Enrolled</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{totalEnrollments}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>Average Pass Rate</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{averageAccuracy}%</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "courses"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses Studio ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("quizzes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "quizzes"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz & Assessment Bank ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "videos"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Video Masterclasses ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "analytics"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Cohort Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("roster")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "roster"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Student Roster & Logs ({students.length})</span>
          </button>
        </div>

        {/* Department Filter & Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter items..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COURSES STUDIO */}
      {/* ========================================================================= */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Course Catalog & Accreditation Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create new academic modules, define milestone competencies, set fee structures, and manage student enrollments.
              </p>
            </div>

            <button
              onClick={() => setShowCourseModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses
              .filter(
                (c) =>
                  c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((course) => {
                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {course.code}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              course.department === "midwifery"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : course.department === "nursing"
                                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {course.department}
                          </span>

                          <button
                            onClick={() => onDeleteCourse(course.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Credits</span>
                          <strong className="text-slate-800 dark:text-slate-200">{course.credits} Credits</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Semester</span>
                          <strong className="text-slate-800 dark:text-slate-200">{course.semester || "Semester 2"}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Milestones</span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {course.milestones?.length || 0} Modules
                          </strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Enrollment</span>
                          <strong className="text-sky-600 dark:text-sky-400">
                            {course.enrolledCount || 0} / {course.capacity || 60}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setShowMilestoneModal(course.id)}
                        className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Module</span>
                      </button>

                      <button
                        onClick={() => onSwitchToStudentView("curriculum")}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Syllabus</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUIZ & ASSESSMENT BANK */}
      {/* ========================================================================= */}
      {activeTab === "quizzes" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Licensure & Clinical Scenario Question Bank
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Author and manage scenario-based multiple choice items with clinical rationales, difficulty tags, and course mappings.
              </p>
            </div>

            <button
              onClick={() => setShowQuizModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions
              .filter(
                (q) =>
                  q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (q.clinicalContext && q.clinicalContext.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (q.courseTitle && q.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {q.clinicalContext || "Clinical Practice"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          q.difficulty === "Advanced"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : q.difficulty === "Intermediate"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {q.difficulty || "Intermediate"}
                      </span>
                      {q.courseTitle && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                          • {q.courseTitle}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {q.timesAttempted && q.timesAttempted > 0
                          ? `${Math.round((q.timesCorrect! / q.timesAttempted!) * 100)}% Pass (${q.timesAttempted} attempts)`
                          : "New Question"}
                      </span>
                      <button
                        onClick={() => onDeleteQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctIndex;
                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isCorrect
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-semibold"
                              : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-extrabold uppercase bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.rationale && (
                    <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-sky-700 dark:text-sky-400 text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Clinical Rationale / Teacher Explanation:
                      </span>
                      <p className="leading-relaxed text-[11px]">{q.rationale}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VIDEO MASTERCLASSES STUDIO */}
      {/* ========================================================================= */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Video Lectures & Procedural Masterclasses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Publish high-resolution procedural walkthroughs, WHO Partograph tutorials, and OSCE manikin recordings.
              </p>
            </div>

            <button
              onClick={() => setShowVideoModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video Lecture</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos
              .filter(
                (v) =>
                  v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  v.instructor.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((video) => (
                <div
                  key={video.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full bg-slate-900">
                    <img
                      src={video.thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group">
                      <button
                        onClick={() => setPreviewVideo(video)}
                        className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-sky-900/60"
                        title="Play preview"
                      >
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                      {video.duration}
                    </div>

                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-sky-600 text-white">
                        {video.department}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteVideo(video.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:text-rose-400 hover:bg-black/90 transition-colors cursor-pointer"
                      title="Delete video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold">
                        {video.courseTitle || "Accredited Module"}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {video.viewsCount} views
                      </span>
                      <button
                        onClick={() => setPreviewVideo(video)}
                        className="font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Play Video & Takeaways
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COHORT ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Cohort Academic Analytics & Exam Readiness
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance metrics aggregated across Registered Nursing and Registered Midwifery cohorts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Intrapartum & Partograph</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">92%</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">High mastery on Active Phase plotting</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40">
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300">Neonatal Resuscitation (NRP)</span>
                <div className="text-2xl font-black text-sky-700 dark:text-sky-300 mt-1">86%</div>
                <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-1">Strong proficiency in Golden Minute PPV</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Pharmacology & MgSO4 Dosing</span>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">74%</div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Requires targeted clinical drill revision</p>
              </div>
            </div>

            {/* Challenging Questions flagged by AI */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Highest Missed Question Alert (Clinical Revision Recommended)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                "Which of the following medications is STRICTLY contraindicated for control of postpartum hemorrhage in a patient with chronic hypertension?"
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong>Cohort Insight:</strong> 26% of students mistakenly chose Tranexamic Acid instead of Ergometrine/Methylergonovine. Facilitator lecture broadcast advised.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: STUDENT ROSTER & CLINICAL LOGBOOK SIGN-OFFS */}
      {/* ========================================================================= */}
      {activeTab === "roster" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Student Cohort Roster & Clinical Sign-Offs</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supervise hospital ward hours, review pending clinical logbooks, and monitor trainee academic progression.
                </p>
              </div>

              {/* Status and Track Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  {(["all", "Active", "Excelling", "At Risk"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        statusFilter === st
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {st === "all" ? "All Statuses" : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trainee KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Active Cohort Trainees</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{students.length}</div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Under Dr. Appiah's Preceptorship</span>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40">
                <span className="text-xs font-semibold text-sky-800 dark:text-sky-300">Avg Attendance Rate</span>
                <div className="text-2xl font-black text-sky-700 dark:text-sky-300 mt-1">
                  {Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1))}%
                </div>
                <span className="text-[11px] text-sky-600 dark:text-sky-400">Ward rounds & lectures</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40">
                <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">Licensure Quiz Average</span>
                <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
                  {Math.round(students.reduce((acc, s) => acc + s.averageQuizScore, 0) / (students.length || 1))}%
                </div>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Passing benchmark: 75%</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Pending Shift Sign-Offs</span>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
                  {students.reduce((acc, s) => acc + s.pendingLogSubmissions, 0)}
                </div>
                <span className="text-[11px] text-amber-600 dark:text-amber-400">Requires preceptor sign-off</span>
              </div>
            </div>

            {/* Student Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5">Student & Program</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Clinical Hours Logged</th>
                    <th className="p-3.5 text-center">Quiz Avg</th>
                    <th className="p-3.5 text-center">Attendance</th>
                    <th className="p-3.5 text-right">Preceptor Sign-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students
                    .filter((s) => {
                      if (statusFilter !== "all" && s.status !== statusFilter) return false;
                      if (deptFilter !== "all" && s.track !== deptFilter) return false;
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        return (
                          s.name.toLowerCase().includes(q) ||
                          s.studentId.toLowerCase().includes(q) ||
                          s.program.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((std) => {
                      const pct = Math.round((std.clinicalHoursLogged / std.clinicalHoursRequired) * 100);
                      return (
                        <tr key={std.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={std.avatar}
                                  alt={std.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{std.name}</span>
                                  <span className="text-[10px] font-mono text-slate-500">({std.studentId})</span>
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                  {std.program}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                std.status === "Excelling"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : std.status === "Active"
                                  ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                              }`}
                            >
                              {std.status}
                            </span>
                          </td>
                          <td className="p-3.5 min-w-[180px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                <span>{std.clinicalHoursLogged} / {std.clinicalHoursRequired} hrs</span>
                                <span className="font-mono text-sky-600 dark:text-sky-400">{pct}%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-sky-500" : "bg-amber-500"
                                  }`}
                                  style={{ width: `${Math.min(100, pct)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-center font-bold text-slate-900 dark:text-white">
                            <span className={std.averageQuizScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}>
                              {std.averageQuizScore}%
                            </span>
                          </td>
                          <td className="p-3.5 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {std.attendanceRate}%
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              {std.pendingLogSubmissions > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => handleApproveHours(std.id, std.name, 10)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs cursor-pointer transition-all active:scale-95"
                                  title="Approve pending hospital ward placement hours"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  <span>Sign Off (+10h)</span>
                                  <span className="w-4 h-4 rounded-full bg-emerald-800 text-[9px] flex items-center justify-center font-extrabold">
                                    {std.pendingLogSubmissions}
                                  </span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                                  <Check className="w-3 h-3" />
                                  <span>Up to Date</span>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE COURSE */}
      {/* ========================================================================= */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold">Publish New Academic Course</h3>
                  <p className="text-xs text-slate-400">Add to college curriculum & registration catalog</p>
                </div>
              </div>
              <button
                onClick={() => setShowCourseModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. MID 302 or NUR 210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Department Track *
                  </label>
                  <select
                    value={newCourseDept}
                    onChange={(e) => setNewCourseDept(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="midwifery">Midwifery (RM)</option>
                    <option value="nursing">General Nursing (RN)</option>
                    <option value="dual">Dual Core Academy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced Intrapartum Care & Obstetric Surgery"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Subject Category
                  </label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Obstetrics & Midwifery">Obstetrics & Midwifery</option>
                    <option value="Pharmacology">Pharmacology</option>
                    <option value="Medical-Surgical">Medical-Surgical</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Research & Biostatistics">Research & Biostatistics</option>
                    <option value="Pediatrics & Neonatal">Pediatrics & Neonatal</option>
                    <option value="Emergency Triage">Emergency Triage</option>
                    <option value="Foundations & Ethics">Foundations & Ethics</option>
                    <option value="Anatomy & Foundations">Anatomy & Foundations</option>
                    <option value="Clinical Assessment">Clinical Assessment</option>
                    <option value="Mental Health & Behavioral">Mental Health & Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Credit Units
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Course Description & Clinical Objectives
                </label>
                <textarea
                  rows={2}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Summarize course goals, clinical rotations, and outcomes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Initial Milestone */}
              <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 space-y-2">
                <span className="font-bold text-sky-900 dark:text-sky-200 text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  Initial Week 1 Milestone Module
                </span>
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="e.g. Week 1: Normal Physiologic Adaptation & Baseline Assessment"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 text-slate-900 dark:text-white text-xs"
                />
                <input
                  type="text"
                  value={newMilestoneCompetencies}
                  onChange={(e) => setNewMilestoneCompetencies(e.target.value)}
                  placeholder="Competencies (comma separated, e.g. Asepsis, Partograph, Leopold Maneuver)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE QUIZ QUESTION */}
      {/* ========================================================================= */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold">Create Clinical Scenario Question</h3>
                  <p className="text-xs text-slate-400">Add to the shared licensure preparation question bank</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuizSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Subject / Clinical Context *
                  </label>
                  <input
                    type="text"
                    required
                    value={newQuestionContext}
                    onChange={(e) => setNewQuestionContext(e.target.value)}
                    placeholder="e.g. Postpartum Hemorrhage, Neonatal Resuscitation"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={newQuestionDifficulty}
                    onChange={(e) => setNewQuestionDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Ward Simulation)</option>
                    <option value="Advanced">Advanced (Licensure / Board Level)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Clinical Scenario & Question Stem *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Describe patient age, parity, symptoms, vitals, and prompt..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* 4 Options */}
              <div className="space-y-3">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Multiple Choice Options (Select radio for Correct Answer):
                </label>

                {[
                  { label: "Option A", val: optionA, setVal: setOptionA, idx: 0 },
                  { label: "Option B", val: optionB, setVal: setOptionB, idx: 1 },
                  { label: "Option C", val: optionC, setVal: setOptionC, idx: 2 },
                  { label: "Option D", val: optionD, setVal: setOptionD, idx: 3 }
                ].map((opt) => (
                  <div key={opt.idx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOptionIdx === opt.idx}
                      onChange={() => setCorrectOptionIdx(opt.idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      id={`opt-radio-${opt.idx}`}
                    />
                    <label htmlFor={`opt-radio-${opt.idx}`} className="font-bold w-16 text-slate-600 dark:text-slate-400">
                      {opt.label}:
                    </label>
                    <input
                      type="text"
                      required={opt.idx < 2}
                      value={opt.val}
                      onChange={(e) => opt.setVal(e.target.value)}
                      placeholder={`Enter ${opt.label} choice...`}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Clinical Rationale & Explanation (Shown after student answers) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuestionRationale}
                  onChange={(e) => setNewQuestionRationale(e.target.value)}
                  placeholder="Explain why the correct answer is valid and why alternatives are contraindicated..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD / EMBED VIDEO LECTURE */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-rose-400 fill-rose-400" />
                <div>
                  <h3 className="text-base font-bold">Publish Clinical Video Masterclass</h3>
                  <p className="text-xs text-slate-400">Embed procedural simulation or lecture recordings</p>
                </div>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideoSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Video Masterclass Title *
                </label>
                <input
                  type="text"
                  required
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="e.g. WHO Partograph: Clinical Plotting & Action Line Management"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Speciality Department
                  </label>
                  <select
                    value={newVideoDept}
                    onChange={(e) => setNewVideoDept(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="midwifery">Midwifery (RM)</option>
                    <option value="nursing">General Nursing (RN)</option>
                    <option value="dual">Dual Core Skills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Duration (mm:ss)
                  </label>
                  <input
                    type="text"
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(e.target.value)}
                    placeholder="e.g. 21:40"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Video Embed or Stream URL (YouTube, Vimeo, or direct MP4 link)
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=... or embed URL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Detailed Description & Procedure Summary
                </label>
                <textarea
                  rows={2}
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  placeholder="Overview of the clinical technique shown in this video..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Key Clinical Takeaways (One per line)
                </label>
                <textarea
                  rows={3}
                  value={newVideoTakeaways}
                  onChange={(e) => setNewVideoTakeaways(e.target.value)}
                  placeholder="1. Sterile non-touch technique mandatory&#10;2. Plot dilation at 5cm active phase&#10;3. Auscultate FHR for 60 seconds"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-[11px]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Publish Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD MILESTONE TO COURSE */}
      {/* ========================================================================= */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-500" />
                Add Milestone Module
              </h3>
              <button
                onClick={() => setShowMilestoneModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Module Title *
                </label>
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="e.g. Week 3: Postpartum Complications & Uterine Atony"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Clinical Competencies (comma separated)
                </label>
                <input
                  type="text"
                  value={newMilestoneCompetencies}
                  onChange={(e) => setNewMilestoneCompetencies(e.target.value)}
                  placeholder="e.g. Bimanual compression, IV Oxytocin titration, Calibrated drape blood loss"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowMilestoneModal(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddMilestoneToCourse(showMilestoneModal)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW VIDEO */}
      {/* ========================================================================= */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-sky-400 text-sky-400" />
                <h4 className="text-sm font-bold truncate max-w-md">{previewVideo.title}</h4>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={previewVideo.videoUrl}
                title={previewVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs text-slate-800 dark:text-slate-200">
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{previewVideo.title}</h5>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{previewVideo.description}</p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Clinical Pearls Taught:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  {previewVideo.keyTakeaways.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
