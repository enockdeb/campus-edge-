import React, { useState } from "react";
import {
  StudentProfile,
  CurriculumCourse,
  FlashcardDeck,
  Flashcard,
  ForumPost,
  LectureNote,
  AppView,
  AppNotification,
  ModuleProgressStat,
  QuizTrendData
} from "../types";
import {
  initialStudentProfile,
  initialCourses,
  initialFlashcardDecks,
  initialNotifications,
  initialModuleProgressStats,
  initialQuizTrendData
} from "../data/initialData";
import { LearningProgressChart } from "./LearningProgressChart";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  HelpCircle,
  Layers,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  ChevronRight,
  Stethoscope,
  Volume2,
  Baby,
  Calendar,
  Award,
  Hospital,
  GraduationCap,
  CreditCard,
  Bell,
  Check,
  X
} from "lucide-react";

interface DashboardWidgetGridProps {
  profile?: StudentProfile;
  student?: StudentProfile;
  courses?: CurriculumCourse[];
  decks?: FlashcardDeck[];
  cards?: Flashcard[];
  forumPosts?: ForumPost[];
  notes?: LectureNote[];
  notifications?: AppNotification[];
  moduleStats?: ModuleProgressStat[];
  trendData?: QuizTrendData[];
  onNavigate: (view: AppView, contextPayload?: any) => void;
  onOpenTutorWithTopic?: (topic: string) => void;
  onOpenNotifications?: () => void;
  onDismissNotification?: (id: string) => void;
}

export const DashboardWidgetGrid: React.FC<DashboardWidgetGridProps> = ({
  profile: propProfile,
  student: propStudent,
  courses: propCourses,
  decks: propDecks,
  cards,
  forumPosts: propForumPosts,
  notes: propNotes,
  notifications: propNotifications,
  moduleStats: propModuleStats,
  trendData: propTrendData,
  onNavigate,
  onOpenTutorWithTopic,
  onOpenNotifications,
  onDismissNotification
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const profile = propProfile || propStudent || initialStudentProfile;
  const courses = propCourses && propCourses.length > 0 ? propCourses : initialCourses;
  const decks = propDecks && propDecks.length > 0 ? propDecks : initialFlashcardDecks;
  const forumPosts = propForumPosts || [];
  const notes = propNotes || [];
  const notifications = propNotifications && propNotifications.length > 0 ? propNotifications : initialNotifications;
  const moduleStats = propModuleStats && propModuleStats.length > 0 ? propModuleStats : initialModuleProgressStats;
  const trendData = propTrendData && propTrendData.length > 0 ? propTrendData : initialQuizTrendData;

  const urgentNotification = notifications.find((n) => !n.read && n.priority === "urgent");
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Active course and active milestone
  const activeCourse = courses[0] || initialCourses[0];
  const inProgressMilestone =
    activeCourse?.milestones?.find((m) => m.status === "in_progress") ||
    activeCourse?.milestones?.[0];

  // Daily High-Yield Clinical Pearl
  const dailyPearl = {
    title: "Postpartum Hemorrhage: The 4 'T's Rule",
    quote: "When confronted with brisk vaginal bleeding post-delivery, immediately evaluate Tone, Trauma, Tissue, and Thrombin. Uterine atony accounts for 70% of all cases — rub the fundus first!",
    mnemonic: "TONE (70%) • TRAUMA (20%) • TISSUE (9%) • THROMBIN (1%)",
    category: "Obstetric Safety"
  };

  const speakDailyPearl = () => {
    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(`${dailyPearl.title}. ${dailyPearl.quote}. Remember the mnemonic: ${dailyPearl.mnemonic}`);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const totalMilestonesCount = courses.reduce((acc, c) => acc + (c.totalMilestones || 0), 0) || 1;
  const totalCompletedMilestones = courses.reduce((acc, c) => acc + (c.completedMilestones || 0), 0);
  const milestoneCompletionPct = Math.round((totalCompletedMilestones / totalMilestonesCount) * 100);

  const completedHours = profile?.clinicalHoursCompleted ?? 146;
  const requiredHours = profile?.clinicalHoursRequired ?? 200;
  const hoursProgressPct = Math.min(100, Math.round((completedHours / (requiredHours || 1)) * 100));

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner with Current Focus */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {profile.program}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Active Scholar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              Your next milestone in <strong className="text-sky-300">{activeCourse?.title}</strong> is ready. Stay on track for your NMC / Licensure qualification!
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{profile.streakDays} Consecutive Days</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>{profile.quizzesTaken} Quizzes Taken ({profile.averageQuizScore}% Avg)</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <Award className="w-4 h-4" />
                <span>{profile.cardsMastered} Flashcards Mastered</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              id="dash-continue-milestone-btn"
              onClick={() => onNavigate("curriculum")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Milestone</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="dash-quick-register-btn"
              onClick={() => onNavigate("registration")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Register Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Campus & Academic Alert Banner */}
      {urgentNotification && !dismissedBanner && (
        <div
          id="urgent-academic-alert-banner"
          className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white tracking-wide">
                  Urgent Notice
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {urgentNotification.title}
                </span>
              </div>
              <p className="text-slate-600 mt-1 text-xs leading-relaxed max-w-3xl">
                {urgentNotification.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {urgentNotification.targetView && (
              <button
                onClick={() => onNavigate(urgentNotification.targetView!, urgentNotification.targetPayload)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                All ({unreadCount})
              </button>
            )}
            <button
              onClick={() => setDismissedBanner(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-rose-100/50 transition-colors cursor-pointer"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick-Launch Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          id="action-course-registration"
          onClick={() => onNavigate("registration")}
          className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/60 shadow-2xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
              Enrollment
            </span>
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Course Registration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dual RN & RM course sign-up</p>
          </div>
        </div>

        <div
          id="action-summarize-lecture"
          onClick={() => onNavigate("summarizer")}
          className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400">Summarize Lecture</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Extract pearls & red flags</p>
          </div>
        </div>

        <div
          id="action-review-flashcards"
          onClick={() => onNavigate("flashcards")}
          className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
              12 Due
            </span>
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Flashcard Drill</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Spaced repetition review</p>
          </div>
        </div>

        <div
          id="action-licensure-quiz"
          onClick={() => onNavigate("quizzes")}
          className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400">Licensure Quiz</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Scenario questions & rationale</p>
          </div>
        </div>
      </div>

      {/* Dual Platform Specialization Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-indigo-950/40 rounded-2xl border border-sky-200/80 dark:border-sky-800/60 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                  Dual Faculty Academic Structure
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Nursing (RN) & Midwifery (RM)
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Semester Course Registration Open
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                Students can register or drop accredited courses across both faculties, track semester credits, and print official semester registration slips.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate("registration")}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-400 dark:text-white" />
              <span>Register Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Learning Progress & Performance Analytics */}
      <LearningProgressChart
        moduleStats={moduleStats}
        trendData={trendData}
        onNavigate={onNavigate}
      />

      {/* Two Column Layout: Main Widgets & Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Curriculum Roadmap & Recent Summaries */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coursera-Style Milestone Path Highlight Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    Active Curriculum Track
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{activeCourse.code}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeCourse.title}
                </h2>
              </div>
              <button
                onClick={() => onNavigate("curriculum")}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Paths</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Milestone Step Details */}
            {inProgressMilestone && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                    Milestone {inProgressMilestone.milestoneNumber}: Week {inProgressMilestone.weekNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    In Progress
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {inProgressMilestone.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {inProgressMilestone.description}
                </p>

                {/* Milestone Steps checklist */}
                <div className="mt-3 space-y-2">
                  {inProgressMilestone.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            step.completed
                              ? "bg-emerald-500 text-white"
                              : "border border-slate-300 dark:border-slate-700 text-slate-400"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <div>
                          <div className={`font-semibold ${step.completed ? "text-slate-800 dark:text-slate-400 line-through decoration-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                            {step.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {step.contentPreview}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                        {step.estimatedMinutes} mins
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Clinical Competencies Target: <strong className="text-slate-700 dark:text-slate-200">{inProgressMilestone.clinicalCompetencies.length} skills</strong>
                  </div>
                  <button
                    onClick={() => onNavigate("curriculum")}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open Milestone Workspace
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enrolled Courses & Curriculum Tracks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h2 className="font-bold text-base text-slate-900 dark:text-white">Enrolled Training Courses ({courses.length})</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="dash-register-more-btn"
                  onClick={() => onNavigate("registration")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Register Courses</span>
                </button>
                <button
                  id="view-all-curriculum-btn"
                  onClick={() => onNavigate("curriculum")}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Curriculum</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {courses.map((course) => {
                const completionPct = Math.round(
                  ((course.completedMilestones || 0) / (course.totalMilestones || 1)) * 100
                );

                return (
                  <div
                    key={course.id}
                    onClick={() => onNavigate("curriculum", { courseId: course.id })}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 hover:bg-sky-50/20 dark:hover:bg-slate-800/40 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs bg-white dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                            {course.code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            course.department === "midwifery"
                              ? "bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                              : course.department === "nursing"
                              ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                              : "bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          }`}>
                            {course.department === "midwifery" ? "Midwifery RM" : course.department === "nursing" ? "Nursing RN" : "Dual Core"}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {course.credits} Credits
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-2 font-medium">
                        <span>Instructor: <span className="text-slate-800 dark:text-slate-200 font-semibold">{course.instructor}</span></span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{course.semester || "Semester 2"}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {course.completedMilestones} of {course.totalMilestones} Milestones
                        </span>
                        <span className="text-xs font-bold text-sky-700 dark:text-sky-400">{completionPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Lecture Summaries & Clinical Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h2 className="font-bold text-base text-slate-900 dark:text-white">Recent AI Lecture Summaries</h2>
              </div>
              <button
                onClick={() => onNavigate("summarizer")}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <span>New Summary</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onNavigate("summarizer", { note })}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 hover:bg-sky-50/30 dark:hover:bg-slate-800/40 transition-all cursor-pointer group bg-white dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                        {note.subject}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 group-hover:text-sky-700 dark:group-hover:text-sky-400">
                        {note.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">{note.date}</span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {note.summary.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                      <div key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 w-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                        <span className="truncate">{takeaway}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex gap-1">
                      {note.tags.map((t) => (
                        <span key={t} className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold text-xs flex items-center gap-1 group-hover:underline">
                      Review Pearls & Mnemonics <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Academic Progress, Daily Pearl, Peer Community */}
        <div className="space-y-6">
          {/* Notifications & Campus Alerts Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications & Alerts</h3>
              </div>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-extrabold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Up to date
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.targetView) onNavigate(notif.targetView, notif.targetPayload);
                    else if (onOpenNotifications) onOpenNotifications();
                  }}
                  className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                    notif.read
                      ? "bg-slate-50/70 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
                      : "bg-sky-50/50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/70 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                      notif.priority === "urgent" ? "bg-rose-500" : "bg-sky-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {onOpenNotifications && (
              <button
                id="view-all-notifications-dash-btn"
                onClick={onOpenNotifications}
                className="mt-3.5 w-full py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>View All Notifications</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Academic & Licensure Progress Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Academic & Licensure Status</h3>
              </div>
              <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                {profile.averageQuizScore}% Quiz Score
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-indigo-600 h-3 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, profile.averageQuizScore)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-xs mt-2 text-slate-500 dark:text-slate-400 font-medium">
              <span>{profile.cardsMastered} Flashcards Mastered</span>
              <span>{profile.streakDays} Day Streak</span>
            </div>

            {/* Academic Breakdown */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Registered Courses</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{courses.length} Courses Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Dual Program Focus</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">RN & RM Dual Track</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Academic Standing</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Clearance Approved</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Licensure Target</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">NMC Licensure Examination</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate("registration")}
              className="mt-4 w-full py-2 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded-xl transition-colors cursor-pointer text-center"
            >
              View Enrolled Courses & Credits
            </button>
          </div>

          {/* Daily Clinical Pearl & Voice Widget */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900 dark:to-amber-950/20 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Daily Clinical Pearl</span>
              </div>
              <button
                onClick={speakDailyPearl}
                className={`p-1.5 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer ${
                  isPlayingAudio ? "bg-amber-200 dark:bg-amber-800 animate-pulse text-amber-900 dark:text-amber-100" : ""
                }`}
                title="Read aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200 mt-1">
              {dailyPearl.title}
            </h4>
            <p className="text-xs text-amber-900/90 dark:text-amber-300/90 mt-1 leading-relaxed">
              "{dailyPearl.quote}"
            </p>

            <div className="mt-3 p-2 bg-amber-100/60 dark:bg-amber-950/60 rounded-lg border border-amber-200 dark:border-amber-800/80 text-[11px] font-mono font-semibold text-amber-900 dark:text-amber-300">
              {dailyPearl.mnemonic}
            </div>

            <button
              onClick={() => onOpenTutorWithTopic?.("Explain the 4 Ts of Postpartum Hemorrhage and nursing interventions for uterine atony")}
              className="mt-3 w-full text-center text-xs font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 underline underline-offset-2 cursor-pointer"
            >
              Ask EdgeAI to break this down
            </button>
          </div>

          {/* Peer Discussion Forum Pulse */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Campus Forum Pulse</h3>
              </div>
              <button
                onClick={() => onNavigate("forum")}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer"
              >
                View Forum
              </button>
            </div>

            <div className="space-y-3">
              {forumPosts.slice(0, 2).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onNavigate("forum", { postId: post.id })}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-sky-50/30 dark:hover:bg-slate-800/50 hover:border-sky-200 dark:hover:border-sky-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950 px-1.5 py-0.2 rounded border border-sky-200 dark:border-sky-800">
                      {post.category}
                    </span>
                    {post.solved && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded flex items-center gap-0.5 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Solved
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>{post.author.name}</span>
                    <span>{post.replies.length} replies • {post.upvotes} upvotes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
