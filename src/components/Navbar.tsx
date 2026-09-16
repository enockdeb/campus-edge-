import React, { useState } from "react";
import {
  AppView,
  StudentProfile,
  FacilitatorProfile,
  AuthUser
} from "../types";
import {
  GraduationCap,
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
  Bot,
  Bell,
  Sun,
  Moon,
  Video,
  UserCheck,
  Stethoscope,
  LogOut
} from "lucide-react";

interface NavbarProps {
  currentView: AppView;
  onSelectView?: (view: AppView) => void;
  onNavigate?: (view: AppView) => void;
  profile?: StudentProfile;
  student?: StudentProfile;
  facilitator?: FacilitatorProfile;
  authUser?: AuthUser | null;
  onSignOut?: () => void;
  onOpenTutor?: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onNavigate,
  profile: propProfile,
  student: propStudent,
  facilitator,
  authUser,
  onSignOut,
  onOpenTutor,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  theme = "light",
  onToggleTheme
}) => {
  const [avatarError, setAvatarError] = useState(false);

  const profile = propProfile || propStudent || {
    id: "std-default",
    name: "Ama Mensah",
    avatar: "/student-avatar.svg",
    college: "Presbyterian Nursing & Midwifery College",
    program: "Diploma in Registered Midwifery (RM)",
    yearOfStudy: "",
    studentId: "NMC/PNTC/24/0912",
    clinicalSite: "Ridge Regional Hospital - Maternity & Delivery Wing",
    clinicalHoursCompleted: 146,
    clinicalHoursRequired: 200,
    streakDays: 14,
    cardsMastered: 84,
    quizzesTaken: 19,
    averageQuizScore: 88,
    forumReputation: 320,
    registeredCourseIds: []
  };

  const registeredCoursesCount = profile.registeredCourseIds?.length || 8;

  const isTutorMode = currentView === "tutor-dashboard";

  const handleSelect = (view: AppView) => {
    if (onSelectView) onSelectView(view);
    else if (onNavigate) onNavigate(view);
  };

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string }[] = isTutorMode
    ? [
        { id: "tutor-dashboard", label: "Tutor & Facilitator Hub", icon: <Stethoscope className="w-4 h-4 text-emerald-500" />, badge: "Active" },
        { id: "curriculum", label: "Curriculum Paths", icon: <BookOpen className="w-4 h-4" /> },
        { id: "quizzes", label: "Question Bank Preview", icon: <HelpCircle className="w-4 h-4" /> },
        { id: "videos", label: "Video Masterclasses", icon: <Video className="w-4 h-4 text-rose-500" /> },
        { id: "dashboard", label: "Student View", icon: <Layers className="w-4 h-4" /> }
      ]
    : [
        { id: "dashboard", label: "Dashboard", icon: <Layers className="w-4 h-4" /> },
        { id: "curriculum", label: "Curriculum Paths", icon: <BookOpen className="w-4 h-4" />, badge: "Milestones" },
        { id: "registration", label: "Course Registration", icon: <GraduationCap className="w-4 h-4 text-emerald-500" />, badge: "Enrollment" },
        { id: "videos", label: "Video Masterclasses", icon: <Video className="w-4 h-4 text-rose-500" />, badge: "Clinicals" },
        { id: "quizzes", label: "Licensure Quizzes", icon: <HelpCircle className="w-4 h-4" /> },
        { id: "summarizer", label: "AI Summarizer", icon: <Sparkles className="w-4 h-4 text-sky-500" /> },
        { id: "flashcards", label: "Flashcards", icon: <Layers className="w-4 h-4" /> },
        { id: "forum", label: "Peer Forum", icon: <MessageSquare className="w-4 h-4" /> },
        { id: "tutor-dashboard", label: "Tutor Dashboard", icon: <Stethoscope className="w-4 h-4 text-indigo-500" />, badge: "Faculty" }
      ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top institution bar */}
      <div className="bg-slate-900 dark:bg-black text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/campus-edge-logo.svg"
              alt="Crest"
              className="w-4 h-4 rounded-sm object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-slate-100">{profile.college}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-amber-300 font-semibold hidden sm:inline">Dual Academy: Nursing (RN) & Midwifery (RM)</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => handleSelect("registration")}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors cursor-pointer text-[11px] font-semibold"
            >
              <GraduationCap className="w-3 h-3 text-emerald-400" />
              <span>Course Registration Open</span>
            </button>
            <div className="flex items-center gap-1 text-amber-300 font-semibold" title="Consecutive daily study streak">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{profile.streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300" title="Active Accredited Courses">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>
                <strong className="text-white">{registeredCoursesCount}</strong> Accredited Courses
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo matching user video: Campus Edge with mountain peak icon */}
          <div
            id="brand-logo-btn"
            onClick={() => handleSelect("dashboard")}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform overflow-hidden border border-sky-400/30">
              <img
                src="/campus-edge-logo.svg"
                alt="Campus Edge College Hub"
                className="w-10 h-10 rounded-xl object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  CAMPUS <span className="text-sky-600 dark:text-sky-400 font-extrabold">EDGE</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 rounded border border-sky-200 dark:border-sky-800">
                  HUB
                </span>
              </div>
              <p className="text-[10px] uppercase font-semibold tracking-widest text-slate-500 dark:text-slate-400 leading-none mt-1">
                Empowering Students • Nursing & Midwifery
              </p>
            </div>
          </div>

          {/* Quick Actions: Theme Toggle, Notifications, AI Clinical Tutor & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Late-Night Study Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="relative p-2 rounded-xl text-slate-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 flex items-center justify-center bg-white dark:bg-slate-800/80 shadow-2xs group"
              title={theme === "dark" ? "Switch to Daylight Mode (Light)" : "Switch to Late-Night Study Mode (Dark)"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 group-hover:text-indigo-600 transition-transform group-hover:-rotate-12" />
              )}
            </button>

            {/* Notification Bell Button */}
            <button
              id="navbar-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 flex items-center justify-center bg-white dark:bg-slate-800/80 shadow-2xs"
              title="View Academic & Licensure Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              id="ai-tutor-quick-btn"
              onClick={onOpenTutor}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-xs shadow-sm hover:shadow-md hover:from-sky-500 hover:to-indigo-500 transition-all cursor-pointer active:scale-95"
            >
              <Bot className="w-4 h-4 animate-bounce text-sky-200" />
              <span className="hidden sm:inline">Ask EdgeAI Tutor</span>
              <span className="sm:hidden">EdgeAI</span>
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-700">
              {isTutorMode ? (
                <button
                  onClick={() => handleSelect("dashboard")}
                  className="flex items-center gap-2.5 group cursor-pointer text-left"
                  title="Switch to Student View"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-950 bg-slate-900 shrink-0 shadow-xs">
                    <img
                      src={facilitator?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"}
                      alt={facilitator?.name || "Facilitator"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-emerald-600 transition-colors">
                      {facilitator?.name || "Dr. Kwesi Appiah"}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span>Faculty Preceptor</span>
                      <span className="text-slate-400">• View Student</span>
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => handleSelect("tutor-dashboard")}
                  className="flex items-center gap-2.5 group cursor-pointer text-left"
                  title="Switch to Facilitator / Tutor Dashboard"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-sky-400/50 ring-2 ring-sky-100 dark:ring-sky-950 bg-sky-950 shrink-0 shadow-xs">
                    <img
                      src={avatarError ? "/student-avatar.svg" : (profile.avatar || "/student-avatar.svg")}
                      alt={profile.name}
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-sky-600 transition-colors">
                      {profile.name}
                    </div>
                    <div className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold flex items-center gap-1">
                      <span>Dual Scholar</span>
                      <span className="text-indigo-500 font-bold">• Tutor Hub</span>
                    </div>
                  </div>
                </button>
              )}

              {onSignOut && (
                <button
                  id="navbar-signout-btn"
                  onClick={onSignOut}
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 flex items-center justify-center bg-white dark:bg-slate-800/80 shadow-2xs"
                  title="Sign Out / Switch Role Portal"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Sub-bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/80 -mx-2 px-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80 shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className={isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-500"}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-200"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
