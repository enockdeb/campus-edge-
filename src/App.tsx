import React, { useState, useEffect } from "react";
import {
  AppView,
  StudentProfile,
  CurriculumCourse,
  LectureNote,
  FlashcardDeck,
  Flashcard,
  ForumPost,
  ForumReply,
  AppNotification,
  ModuleProgressStat,
  QuizTrendData,
  FacilitatorProfile,
  VideoLecture,
  QuizQuestion,
  AuthUser
} from "./types";
import {
  initialStudentProfile,
  initialCourses,
  initialNotes,
  initialFlashcardDecks,
  initialFlashcards,
  initialForumPosts,
  initialNotifications,
  initialModuleProgressStats,
  initialQuizTrendData,
  initialFacilitatorProfile,
  initialVideoLectures,
  initialQuizQuestions,
  defaultStudentUser,
  defaultTeacherUser
} from "./data/initialData";
import { Navbar } from "./components/Navbar";
import { LoginView } from "./components/LoginView";
import { DashboardWidgetGrid } from "./components/DashboardWidgetGrid";
import { CurriculumView } from "./components/CurriculumView";
import { SummarizerView } from "./components/SummarizerView";
import { FlashcardsView } from "./components/FlashcardsView";
import { QuizView } from "./components/QuizView";
import { ForumView } from "./components/ForumView";
import { CourseRegistrationView } from "./components/CourseRegistrationView";
import { NotificationCenter } from "./components/NotificationCenter";
import { VideoLecturesView } from "./components/VideoLecturesView";
import { TutorDashboardView } from "./components/TutorDashboardView";
import {
  Bot,
  X,
  Send,
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";

export default function App() {
  // Global Theme: Light vs Late-Night Study Dark Mode
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("campusedge_theme");
      if (saved === "light" || saved === "dark") return saved;
      if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (e) {
      console.warn("Error checking theme preference", e);
    }
    return "light";
  });

  useEffect(() => {
    try {
      localStorage.setItem("campusedge_theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } catch (e) {
      console.warn("Error setting theme class", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Authenticated User & Role Session
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("campusedge_auth_user");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load auth user from localStorage", e);
    }
    return null;
  });

  // Current View
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const savedUser = localStorage.getItem("campusedge_auth_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role === "teacher") return "tutor-dashboard";
        if (parsed?.role === "student") return "dashboard";
      }
    } catch (e) {
      console.warn(e);
    }
    return "login";
  });
  const [navPayload, setNavPayload] = useState<any>(null);

  // Student Profile
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem("campusedge_student");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return {
            ...initialStudentProfile,
            ...parsed,
            yearOfStudy: parsed.yearOfStudy && !parsed.yearOfStudy.includes("Year 2") ? parsed.yearOfStudy : "",
            clinicalHoursCompleted: typeof parsed.clinicalHoursCompleted === "number"
              ? parsed.clinicalHoursCompleted
              : initialStudentProfile.clinicalHoursCompleted,
            clinicalHoursRequired: typeof parsed.clinicalHoursRequired === "number"
              ? parsed.clinicalHoursRequired
              : initialStudentProfile.clinicalHoursRequired
          };
        }
      }
    } catch (e) {
      console.warn("Failed to load student profile from localStorage, using default", e);
    }
    return initialStudentProfile;
  });

  // Curriculum Courses (load fresh defaults if cache contains fewer courses than new initial catalog)
  const [courses, setCourses] = useState<CurriculumCourse[]>(() => {
    try {
      const saved = localStorage.getItem("campusedge_courses");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialCourses.length && parsed[0]?.milestones && parsed[0].milestones.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error loading saved courses, using defaults", e);
    }
    return initialCourses;
  });

  // Lecture Notes
  const [notes, setNotes] = useState<LectureNote[]>(() => {
    try {
      const saved = localStorage.getItem("campusedge_notes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error loading saved notes, using defaults", e);
    }
    return initialNotes;
  });

  // Flashcard Decks & Cards
  const [decks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem("campusedge_decks");
    return saved ? JSON.parse(saved) : initialFlashcardDecks;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem("campusedge_flashcards");
    return saved ? JSON.parse(saved) : initialFlashcards;
  });

  // Forum Posts
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem("campusedge_forum");
    return saved ? JSON.parse(saved) : initialForumPosts;
  });

  // Campus & Academic Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem("campusedge_notifications");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load notifications from localStorage", e);
    }
    return initialNotifications;
  });
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Facilitator Profile
  const [facilitator, setFacilitator] = useState<FacilitatorProfile>(() => {
    try {
      const saved = localStorage.getItem("campusedge_facilitator");
      if (saved) {
        return { ...initialFacilitatorProfile, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load facilitator from localStorage", e);
    }
    return initialFacilitatorProfile;
  });

  // Clinical Video Lectures Catalog
  const [videos, setVideos] = useState<VideoLecture[]>(() => {
    try {
      const saved = localStorage.getItem("campusedge_videos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialVideoLectures.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load videos from localStorage", e);
    }
    return initialVideoLectures;
  });

  // Licensure & Assessment Quiz Questions Bank
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem("campusedge_quiz_questions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialQuizQuestions.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load quiz questions from localStorage", e);
    }
    return initialQuizQuestions;
  });

  // Module Progress and Quiz Trend Data
  const [moduleStats] = useState<ModuleProgressStat[]>(initialModuleProgressStats);
  const [trendData] = useState<QuizTrendData[]>(initialQuizTrendData);

  // Floating AI Clinical Tutor Assistant Drawer / Modal
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [tutorQuery, setTutorQuery] = useState("");
  const [tutorConversation, setTutorConversation] = useState<
    Array<{ sender: "user" | "ai"; text: string; time: string }>
  >([
    {
      sender: "ai",
      text: "Hello Nurse Midwife Trainee! I am your EdgeAI Clinical Tutor. Ask me any pharmacology dosages, partograph questions, emergency management protocols, or licensure exam rationales.",
      time: "Now"
    }
  ]);
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem("campusedge_student", JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem("campusedge_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("campusedge_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("campusedge_flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem("campusedge_forum", JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem("campusedge_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("campusedge_facilitator", JSON.stringify(facilitator));
  }, [facilitator]);

  useEffect(() => {
    localStorage.setItem("campusedge_videos", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem("campusedge_quiz_questions", JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  // Facilitator Course Handlers
  const handleAddCourse = (newCourse: CurriculumCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
    setFacilitator((prev) => ({
      ...prev,
      coursesPublished: prev.coursesPublished + 1
    }));
  };

  const handleUpdateCourse = (courseId: string, updated: Partial<CurriculumCourse>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...updated } : c))
    );
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setFacilitator((prev) => ({
      ...prev,
      coursesPublished: Math.max(0, prev.coursesPublished - 1)
    }));
  };

  // Facilitator Quiz Handlers
  const handleAddQuizQuestion = (newQuestion: QuizQuestion) => {
    setQuizQuestions((prev) => [newQuestion, ...prev]);
    setFacilitator((prev) => ({
      ...prev,
      quizzesCreated: prev.quizzesCreated + 1
    }));
  };

  const handleDeleteQuizQuestion = (questionId: string) => {
    setQuizQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setFacilitator((prev) => ({
      ...prev,
      quizzesCreated: Math.max(0, prev.quizzesCreated - 1)
    }));
  };

  // Facilitator Video Handlers
  const handleAddVideo = (newVideo: VideoLecture) => {
    setVideos((prev) => [newVideo, ...prev]);
    setFacilitator((prev) => ({
      ...prev,
      videosUploaded: prev.videosUploaded + 1
    }));
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    setFacilitator((prev) => ({
      ...prev,
      videosUploaded: Math.max(0, prev.videosUploaded - 1)
    }));
  };

  // Notification action handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Authentication & Dynamic Role Routing Handlers
  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    try {
      localStorage.setItem("campusedge_auth_user", JSON.stringify(user));
    } catch (e) {
      console.warn("Error saving auth user to localStorage", e);
    }

    if (user.role === "teacher") {
      if (user.facilitatorProfile) {
        setFacilitator((prev) => ({
          ...prev,
          ...user.facilitatorProfile!,
          name: user.name,
          email: user.email
        }));
      }
      setCurrentView("tutor-dashboard");
    } else {
      if (user.studentProfile) {
        setStudent((prev) => ({
          ...prev,
          ...user.studentProfile!,
          name: user.name,
          studentId: user.identifier
        }));
      }
      setCurrentView("dashboard");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = () => {
    setAuthUser(null);
    try {
      localStorage.removeItem("campusedge_auth_user");
    } catch (e) {
      console.warn("Error removing auth user from localStorage", e);
    }
    setCurrentView("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // View navigation handler with context
  const handleNavigate = (view: AppView, contextPayload?: any) => {
    if (view === "login") {
      handleSignOut();
      return;
    }
    setCurrentView(view);
    if (contextPayload) {
      setNavPayload(contextPayload);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Note save handler
  const handleSaveNote = (newNote: LectureNote) => {
    setNotes([newNote, ...notes]);
    setStudent((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1
    }));
  };

  // Forum actions
  const handleAddForumPost = (newPost: ForumPost) => {
    setForumPosts([newPost, ...forumPosts]);
  };

  const handleAddForumReply = (postId: string, reply: ForumReply) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [...p.replies, reply]
          };
        }
        return p;
      })
    );
  };

  const handleLikeForumPost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, upvotes: p.upvotes + 1 };
        }
        return p;
      })
    );
  };

  // Course Registration Handlers
  const handleRegisterCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isRegistered: true } : c))
    );
    setStudent((prev) => {
      const existing = prev.registeredCourseIds || [];
      if (!existing.includes(courseId)) {
        return { ...prev, registeredCourseIds: [...existing, courseId] };
      }
      return prev;
    });
  };

  const handleDropCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isRegistered: false } : c))
    );
    setStudent((prev) => ({
      ...prev,
      registeredCourseIds: (prev.registeredCourseIds || []).filter((id) => id !== courseId)
    }));
  };

  const handleUpdateCourseFees = (
    courseId: string,
    fees: { tuitionFee: number; labFee: number; councilExamFee: number }
  ) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, fees } : c))
    );
  };

  // Quick AI Tutor query
  const handleSendTutorQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;

    const userText = tutorQuery;
    setTutorQuery("");
    setTutorConversation((prev) => [
      ...prev,
      { sender: "user", text: userText, time: "Now" }
    ]);
    setIsTutorThinking(true);

    try {
      const response = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userText,
          context: "Nursing & Midwifery Licensure & Ward Practice"
        })
      });

      if (!response.ok) throw new Error("Tutor error");

      const data = await response.json();
      setTutorConversation((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "Review standardized WHO guidelines and prioritize patient safety.",
          time: "Just now"
        }
      ]);
    } catch {
      setTutorConversation((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Standard protocol: Maintain patient airway, verify baseline maternal vitals, check for allergies prior to medication administration, and escalate abnormal findings immediately to the attending in charge.",
          time: "Just now"
        }
      ]);
    } finally {
      setIsTutorThinking(false);
    }
  };

  // If not authenticated or on login view, render the dedicated Authentication View
  if (currentView === "login" || !authUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-200 dark:selection:bg-sky-900 transition-colors duration-200">
        {/* Top Minimal Institutional Header with Theme Switcher */}
        <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 p-1 flex items-center justify-center border border-sky-400/30">
              <img
                src="/campus-edge-logo.svg"
                alt="Campus Edge"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white">
                CAMPUS <span className="text-sky-600 dark:text-sky-400 font-extrabold">EDGE</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                PORTAL
              </span>
            </div>
            <span className="text-slate-400 text-xs hidden md:inline">• Nursing & Midwifery College Gateway</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-amber-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
            title={theme === "dark" ? "Switch to daylight mode" : "Switch to late-night study mode"}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{theme === "dark" ? "Daylight" : "Late-Night"}</span>
          </button>
        </header>

        {/* Dedicated Login View Prompting Role Selection */}
        <main className="flex-1 flex items-center justify-center p-3 sm:p-6">
          <LoginView onLogin={handleLogin} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-200 dark:selection:bg-sky-900 transition-colors duration-200">
      {/* Top Header Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={handleNavigate}
        onNavigate={handleNavigate}
        profile={student}
        student={student}
        facilitator={facilitator}
        authUser={authUser}
        onSignOut={handleSignOut}
        onOpenTutor={() => setShowTutorModal(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === "dashboard" && (
          <DashboardWidgetGrid
            profile={student}
            student={student}
            courses={courses}
            decks={decks}
            cards={flashcards}
            forumPosts={forumPosts}
            notes={notes}
            notifications={notifications}
            moduleStats={moduleStats}
            trendData={trendData}
            onNavigate={handleNavigate}
            onOpenNotifications={() => setIsNotificationCenterOpen(true)}
            onDismissNotification={handleDismissNotification}
            onOpenTutorWithTopic={(topic) => {
              setTutorQuery(`Please explain clinical protocols and evidence for: ${topic}`);
              setShowTutorModal(true);
            }}
          />
        )}

        {currentView === "curriculum" && (
          <CurriculumView
            courses={courses}
            onUpdateCourses={setCourses}
            onNavigate={handleNavigate}
            initialCourseId={navPayload?.courseId}
          />
        )}

        {currentView === "summarizer" && (
          <SummarizerView
            notes={notes}
            onSaveNote={handleSaveNote}
            onNavigate={handleNavigate}
            initialNote={navPayload?.note}
          />
        )}

        {currentView === "flashcards" && (
          <FlashcardsView
            decks={decks}
            cards={flashcards}
            onUpdateCards={setFlashcards}
            initialTopic={navPayload?.topic}
          />
        )}

        {currentView === "quizzes" && (
          <QuizView
            initialTopic={navPayload?.topic}
            questions={quizQuestions}
            onAddQuestion={handleAddQuizQuestion}
            onRecordScore={(score, total) => {
              setStudent((prev) => ({
                ...prev,
                quizzesTaken: prev.quizzesTaken + 1,
                averageQuizScore: Math.round(
                  (prev.averageQuizScore * prev.quizzesTaken + (score / total) * 100) /
                    (prev.quizzesTaken + 1)
                )
              }));
            }}
          />
        )}

        {currentView === "videos" && (
          <VideoLecturesView
            videos={videos}
            onNavigateToCourse={(courseId) => handleNavigate("curriculum", { courseId })}
            onOpenTutor={(topic) => {
              setTutorQuery(`Please explain the clinical procedure and evidence for: ${topic}`);
              setShowTutorModal(true);
            }}
          />
        )}

        {currentView === "tutor-dashboard" && (
          <TutorDashboardView
            facilitator={facilitator}
            courses={courses}
            questions={quizQuestions}
            videos={videos}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddQuestion={handleAddQuizQuestion}
            onDeleteQuestion={handleDeleteQuizQuestion}
            onAddVideo={handleAddVideo}
            onDeleteVideo={handleDeleteVideo}
            onSwitchToStudentView={() => handleNavigate("dashboard")}
            onSignOut={handleSignOut}
          />
        )}

        {currentView === "forum" && (
          <ForumView
            posts={forumPosts}
            onAddPost={handleAddForumPost}
            onAddReply={handleAddForumReply}
            onLikePost={handleLikeForumPost}
          />
        )}

        {currentView === "registration" && (
          <CourseRegistrationView
            courses={courses}
            student={student}
            onRegisterCourse={handleRegisterCourse}
            onDropCourse={handleDropCourse}
            onUpdateCourseFees={handleUpdateCourseFees}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Floating AI Clinical Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-ai-tutor-trigger"
          onClick={() => setShowTutorModal(!showTutorModal)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white font-bold text-xs shadow-lg hover:shadow-sky-600/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <Bot className="w-5 h-5 text-sky-200" />
          <span className="hidden sm:inline">EdgeAI Clinical Tutor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      </div>

      {/* Floating AI Clinical Assistant Chat Drawer */}
      {showTutorModal && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom-5">
          {/* Tutor Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <h4 className="font-bold text-xs">EdgeAI Clinical Tutor</h4>
                <p className="text-[10px] text-sky-300">24/7 Nursing & Midwifery Guide</p>
              </div>
            </div>
            <button
              onClick={() => setShowTutorModal(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/60 text-xs">
            {tutorConversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-2xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 ${
                      msg.sender === "user" ? "text-sky-200" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTutorThinking && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2 shadow-2xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600 dark:text-sky-400" />
                  <span>Consulting clinical protocols...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendTutorQuery}
            className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={tutorQuery}
              onChange={(e) => setTutorQuery(e.target.value)}
              placeholder="Ask dosage, protocol, or exam question..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!tutorQuery.trim() || isTutorThinking}
              className="p-2 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white rounded-xl cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Notification Center Modal / Drawer */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDismiss={handleDismissNotification}
        onNavigate={handleNavigate}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">CampusEdge</span>
            <span>• Integrated Nursing & Midwifery Training College Platform</span>
          </div>
          <div>
            <span>Accredited Curriculum Alignment • NMC / NCLEX Standardized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
