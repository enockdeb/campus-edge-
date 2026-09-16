import React, { useState, useEffect } from "react";
import {
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomAnnouncement,
  ClassroomSubmission,
  ClassroomMember,
  CurriculumCourse,
  UserRole
} from "../types";
import { CampusClassroomService } from "../services/campusClassroom";
import {
  GraduationCap,
  Plus,
  Calendar,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Sparkles,
  FileText,
  Send,
  Copy,
  Check,
  Bot,
  BrainCircuit,
  Award,
  ChevronRight,
  ArrowLeft,
  Paperclip,
  Share2,
  Lightbulb,
  MoreVertical,
  Layers,
  Search,
  ExternalLink
} from "lucide-react";

interface ClassroomViewProps {
  userRole: UserRole;
  localCourses?: CurriculumCourse[];
  onNavigateToCurriculum?: (courseId: string) => void;
  onOpenTutorWithPrompt?: (prompt: string) => void;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({
  userRole,
  onNavigateToCurriculum,
  onOpenTutorWithPrompt
}) => {
  // Course navigation & selection
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>("cls-mid-301");
  const [activeTab, setActiveTab] = useState<"stream" | "classwork" | "people" | "grades">("stream");
  const [searchQuery, setSearchQuery] = useState("");

  // Classroom dynamic content
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [courseWorkList, setCourseWorkList] = useState<ClassroomCourseWork[]>([]);
  const [submissions, setSubmissions] = useState<ClassroomSubmission[]>([]);
  const [members, setMembers] = useState<ClassroomMember[]>([]);

  // Selected Assignment for Detail / Submission Workspace
  const [selectedAssignment, setSelectedAssignment] = useState<ClassroomCourseWork | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  // Student submission form state
  const [submissionContent, setSubmissionContent] = useState("");
  const [attachedLinkInput, setAttachedLinkInput] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Assistant in Assignment state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<any | null>(null);
  const [aiDraftReview, setAiDraftReview] = useState<any | null>(null);
  const [aiRubricEvaluation, setAiRubricEvaluation] = useState<any | null>(null);
  const [showAiPanel, setShowAiPanel] = useState<"guidance" | "review" | "evaluation" | null>(null);

  // Stream announcement composer
  const [isComposingAnnouncement, setIsComposingAnnouncement] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementAttachmentTitle, setAnnouncementAttachmentTitle] = useState("");

  // Comment input per announcement
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Instructor creation modals
  const [showCreateWorkModal, setShowCreateWorkModal] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkTopic, setNewWorkTopic] = useState("Obstetric Emergencies");
  const [newWorkDesc, setNewWorkDesc] = useState("");
  const [newWorkPoints, setNewWorkPoints] = useState(100);
  const [newWorkDueDate, setNewWorkDueDate] = useState("2026-10-15");

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedCourses = CampusClassroomService.getCourses();
    setCourses(loadedCourses);

    if (loadedCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(loadedCourses[0].id);
    }
  }, []);

  // Reload course-specific resources whenever selected course changes
  useEffect(() => {
    if (!selectedCourseId) return;

    const courseAnnouncements = CampusClassroomService.getAnnouncements(selectedCourseId);
    const work = CampusClassroomService.getCourseWork(selectedCourseId);
    const currentSubmissions = CampusClassroomService.getAllSubmissions();
    const courseMembers = CampusClassroomService.getMembers(selectedCourseId);

    setAnnouncements(courseAnnouncements);
    setCourseWorkList(work);
    setSubmissions(currentSubmissions);
    setMembers(courseMembers);
    setSelectedTopic("all");
    setSelectedAssignment(null);
  }, [selectedCourseId]);

  // Load active submission when assignment is opened
  useEffect(() => {
    if (!selectedAssignment) {
      setSubmissionContent("");
      setSubmissionLinks([]);
      setAiGuidance(null);
      setAiDraftReview(null);
      setAiRubricEvaluation(null);
      setShowAiPanel(null);
      return;
    }

    const existingSub = submissions.find(
      s => s.courseWorkId === selectedAssignment.id && s.studentId === "std-001"
    );

    if (existingSub) {
      setSubmissionContent(existingSub.content || "");
      setSubmissionLinks(existingSub.attachedLinks || []);
      if (existingSub.aiReview) {
        setAiDraftReview(existingSub.aiReview);
      }
    } else {
      setSubmissionContent("");
      setSubmissionLinks([]);
    }
  }, [selectedAssignment, submissions]);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(`Class invite code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Turn In / Submit Assignment
  const handleTurnInAssignment = () => {
    if (!selectedAssignment || !activeCourse) return;
    if (!submissionContent.trim()) {
      showToast("Please provide your written clinical response before submitting.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const updated = CampusClassroomService.saveOrUpdateSubmission({
        courseId: activeCourse.id,
        courseWorkId: selectedAssignment.id,
        studentId: "std-001",
        studentName: "Akosua Addo",
        studentEmail: "a.addo@campusedge.edu",
        content: submissionContent,
        attachedLinks: submissionLinks,
        status: "turned_in",
        maxPoints: selectedAssignment.maxPoints,
        aiReview: aiDraftReview || undefined
      });

      setSubmissions(CampusClassroomService.getAllSubmissions());
      setIsSubmitting(false);
      showToast("Assignment turned in successfully! Preceptor notified.");
    }, 400);
  };

  const handleUnsubmitAssignment = () => {
    if (!selectedAssignment || !activeCourse) return;
    const updated = CampusClassroomService.saveOrUpdateSubmission({
      courseId: activeCourse.id,
      courseWorkId: selectedAssignment.id,
      studentId: "std-001",
      status: "assigned"
    });
    setSubmissions(CampusClassroomService.getAllSubmissions());
    showToast("Assignment unsubmitted. You can now make edits and re-turn in.");
  };

  // Post Announcement
  const handlePostAnnouncement = () => {
    if (!announcementText.trim() || !activeCourse) return;

    const newAnn = CampusClassroomService.addAnnouncement({
      courseId: activeCourse.id,
      authorName: userRole === "teacher" ? "Madam Patricia Mensah" : "Akosua Addo",
      authorRole: userRole === "teacher" ? "teacher" : "student",
      text: announcementText,
      pinned: false,
      attachments: announcementAttachmentTitle.trim()
        ? [{ title: announcementAttachmentTitle.trim(), type: "pdf" }]
        : []
    });

    setAnnouncements(CampusClassroomService.getAnnouncements(activeCourse.id));
    setAnnouncementText("");
    setAnnouncementAttachmentTitle("");
    setIsComposingAnnouncement(false);
    showToast("Announcement shared to class stream!");
  };

  // Add Comment to Announcement
  const handleAddComment = (announcementId: string) => {
    const comment = commentInputs[announcementId];
    if (!comment || !comment.trim()) return;

    CampusClassroomService.addCommentToAnnouncement(
      announcementId,
      userRole === "teacher" ? "Madam Patricia Mensah" : "Akosua Addo",
      userRole === "teacher" ? "teacher" : "student",
      comment.trim()
    );

    if (activeCourse) {
      setAnnouncements(CampusClassroomService.getAnnouncements(activeCourse.id));
    }
    setCommentInputs({ ...commentInputs, [announcementId]: "" });
  };

  // AI Assignment Guidance
  const handleGetAiGuidance = async () => {
    if (!selectedAssignment || !activeCourse) return;
    setAiLoading(true);
    setShowAiPanel("guidance");

    try {
      const data = await CampusClassroomService.requestAssignmentGuidance({
        courseTitle: activeCourse.name,
        assignmentTitle: selectedAssignment.title,
        assignmentDescription: selectedAssignment.description
      });
      setAiGuidance(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Draft Reviewer
  const handleReviewDraft = async () => {
    if (!selectedAssignment || !activeCourse) return;
    if (!submissionContent.trim()) {
      showToast("Please write a draft in your work area first so EdgeAI can analyze it.");
      return;
    }

    setAiLoading(true);
    setShowAiPanel("review");

    try {
      const data = await CampusClassroomService.reviewDraftWork({
        courseTitle: activeCourse.name,
        assignmentTitle: selectedAssignment.title,
        assignmentDescription: selectedAssignment.description,
        studentDraft: submissionContent
      });
      setAiDraftReview(data);

      // Save review with draft submission
      CampusClassroomService.saveOrUpdateSubmission({
        courseId: activeCourse.id,
        courseWorkId: selectedAssignment.id,
        studentId: "std-001",
        studentName: "Akosua Addo",
        content: submissionContent,
        status: "assigned",
        aiReview: data
      });
      setSubmissions(CampusClassroomService.getAllSubmissions());
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Formative Evaluation
  const handleGenerateAiRubricEvaluation = async () => {
    if (!selectedAssignment || !activeCourse) return;
    if (!submissionContent.trim()) {
      showToast("Write your response first to generate an instant rubric evaluation.");
      return;
    }

    setAiLoading(true);
    setShowAiPanel("evaluation");

    try {
      const data = await CampusClassroomService.gradeSubmissionAI({
        courseTitle: activeCourse.name,
        assignmentTitle: selectedAssignment.title,
        assignmentDescription: selectedAssignment.description,
        studentSubmission: submissionContent
      });
      setAiRubricEvaluation(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // Create Assignment (for Faculty)
  const handleCreateCourseWork = () => {
    if (!newWorkTitle.trim() || !activeCourse) return;

    CampusClassroomService.addCourseWork({
      courseId: activeCourse.id,
      title: newWorkTitle.trim(),
      topic: newWorkTopic,
      description: newWorkDesc.trim() || "Complete the clinical case study according to college protocols.",
      maxPoints: newWorkPoints,
      dueDate: newWorkDueDate,
      dueTime: "23:59",
      state: "PUBLISHED",
      rubricCriteria: [
        "Clinical Prioritization & Rationale (30 pts)",
        "Adherence to Protocol & Safety Standards (30 pts)",
        "SBAR or Care Plan Clarity (25 pts)",
        "Evidence-Based References (15 pts)"
      ]
    });

    setCourseWorkList(CampusClassroomService.getCourseWork(activeCourse.id));
    setShowCreateWorkModal(false);
    setNewWorkTitle("");
    setNewWorkDesc("");
    showToast("New coursework assignment published to class!");
  };

  // Unique topics
  const topics = Array.from(new Set(courseWorkList.map(cw => cw.topic))).filter(Boolean);
  const filteredWork = courseWorkList.filter(cw => {
    const matchesTopic = selectedTopic === "all" || cw.topic === selectedTopic;
    const matchesSearch = searchQuery === "" ||
      cw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cw.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  // Upcoming items for sidebar
  const upcomingAssignments = courseWorkList.slice(0, 3);

  // Background banner styling based on theme
  const getBannerGradient = (theme: string) => {
    switch (theme) {
      case "sky":
        return "from-sky-700 via-sky-800 to-indigo-900";
      case "indigo":
        return "from-indigo-700 via-indigo-800 to-slate-900";
      case "amber":
        return "from-amber-700 via-amber-800 to-stone-900";
      case "rose":
        return "from-rose-700 via-rose-800 to-slate-900";
      case "teal":
        return "from-teal-700 via-teal-800 to-emerald-950";
      case "emerald":
      default:
        return "from-emerald-700 via-emerald-800 to-teal-950";
    }
  };

  const getTopicColor = (topic: string) => {
    if (topic.includes("Obstetric")) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    if (topic.includes("Surgical")) return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20";
    if (topic.includes("Pharmacology")) return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
    return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20";
  };

  // Check student submission status for an assignment
  const getSubmissionForWork = (workId: string) => {
    return submissions.find(s => s.courseWorkId === workId && s.studentId === "std-001");
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header & Course Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Classroom Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                AI-Supercharged
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Native Google Classroom-style LMS with integrated EdgeAI clinical tutors & draft reviewers
            </p>
          </div>
        </div>

        {/* Course Switcher Pills / Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Classes:</span>
          {courses.map(c => {
            const isSelected = c.id === selectedCourseId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCourseId(c.id);
                  setSelectedAssignment(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                    : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {c.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Course Workspace */}
      {activeCourse && (
        <div className="space-y-6">
          {/* Google Classroom Style Hero Banner */}
          <div
            className={`relative rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-lg bg-gradient-to-r ${getBannerGradient(
              activeCourse.bannerTheme
            )}`}
          >
            {/* Subtle background decoration */}
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
              <GraduationCap className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider">
                    {activeCourse.department}
                  </span>
                  {activeCourse.section && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-[11px]">
                      {activeCourse.section}
                    </span>
                  )}
                  {activeCourse.room && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-[11px]">
                      {activeCourse.room}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {activeCourse.code}: {activeCourse.name}
                </h2>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2">
                  {activeCourse.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/70 pt-1">
                  <span>Instructor: <strong className="text-white">{activeCourse.instructor}</strong></span>
                  {activeCourse.schedule && (
                    <span className="hidden sm:inline">• {activeCourse.schedule}</span>
                  )}
                </div>
              </div>

              {/* Class Code & Actions */}
              <div className="flex flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 flex items-center gap-2.5 text-xs">
                  <div>
                    <div className="text-[10px] text-white/70 uppercase font-semibold">Class Code</div>
                    <div className="font-mono font-bold text-white tracking-wider">{activeCourse.enrollmentCode}</div>
                  </div>
                  <button
                    onClick={() => handleCopyCode(activeCourse.enrollmentCode)}
                    title="Copy Class Invite Code"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {onNavigateToCurriculum && (
                  <button
                    onClick={() => onNavigateToCurriculum("mid-301")}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Curriculum Syllabus</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Google Classroom Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <nav className="flex space-x-2 sm:space-x-8 -mb-px">
              {[
                { id: "stream", label: "Stream", icon: MessageSquare },
                { id: "classwork", label: "Classwork", icon: FileText, count: courseWorkList.length },
                { id: "people", label: "People", icon: Users, count: members.length },
                { id: "grades", label: "Grades & Submissions", icon: Award }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSelectedAssignment(null);
                    }}
                    className={`flex items-center gap-2 py-3 px-2 sm:px-1 border-b-2 font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                      isActive
                        ? "border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Context Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onOpenTutorWithPrompt) {
                    onOpenTutorWithPrompt(
                      `I am studying ${activeCourse.code}: ${activeCourse.name}. What are the highest-yield clinical topics, OSCE competencies, and licensure tips I need to master for this subject?`
                    );
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-medium border border-sky-200 dark:border-sky-800/60 transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Ask EdgeAI for Course Mastery</span>
              </button>
            </div>
          </div>

          {/* ======================= STREAM TAB ======================= */}
          {activeTab === "stream" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar: Upcoming Due Dates */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                      Upcoming Work
                    </h3>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  {upcomingAssignments.length === 0 ? (
                    <p className="text-xs text-slate-500">Woohoo, no work due soon!</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAssignments.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedAssignment(item);
                            setActiveTab("classwork");
                          }}
                          className="group p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
                        >
                          <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                            <span>Due {item.dueDate}</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {item.maxPoints} pts
                            </span>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => setActiveTab("classwork")}
                        className="w-full text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 cursor-pointer"
                      >
                        View all classwork →
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Assistant Quick Clinical Helper */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 border border-indigo-700/40 shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    <h4 className="font-bold text-xs tracking-wide">Campus Edge AI Tutor</h4>
                  </div>
                  <p className="text-[11px] text-indigo-200 leading-relaxed mb-3">
                    Need instant clarification on clinical drug calculations, WHO Partograph rules, or SBAR reporting?
                  </p>
                  <button
                    onClick={() => {
                      if (onOpenTutorWithPrompt) {
                        onOpenTutorWithPrompt(
                          `Please explain the clinical management protocols for the active topics in ${activeCourse.name}`
                        );
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Bot className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Open AI Clinical Tutor</span>
                  </button>
                </div>
              </div>

              {/* Center Feed: Stream Posts */}
              <div className="lg:col-span-3 space-y-5">
                {/* Announcement Composer */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
                  {!isComposingAnnouncement ? (
                    <div
                      onClick={() => setIsComposingAnnouncement(true)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs cursor-pointer transition-colors border border-dashed border-slate-300 dark:border-slate-700"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {userRole === "teacher" ? "PM" : "AA"}
                      </div>
                      <span>Announce something to your class (notices, shift rotas, clinical pearls)...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Post Announcement to {activeCourse.code}
                        </span>
                        <button
                          onClick={() => setIsComposingAnnouncement(false)}
                          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={announcementText}
                        onChange={e => setAnnouncementText(e.target.value)}
                        placeholder="Share instructions, clinical guidelines, or ward simulation reminders..."
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={announcementAttachmentTitle}
                            onChange={e => setAnnouncementAttachmentTitle(e.target.value)}
                            placeholder="Attach material (e.g. Ward-Rota.pdf)"
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white w-full sm:w-64"
                          />
                        </div>

                        <button
                          onClick={handlePostAnnouncement}
                          disabled={!announcementText.trim()}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Post to Class</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Announcement Cards */}
                {announcements.map(ann => (
                  <div
                    key={ann.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          {ann.authorName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {ann.authorName}
                            </span>
                            {ann.authorRole === "teacher" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                Facilitator
                              </span>
                            )}
                            {ann.pinned && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                Pinned
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{ann.timestamp}</p>
                        </div>
                      </div>

                      {/* AI Clarifier Button */}
                      <button
                        onClick={() => {
                          if (onOpenTutorWithPrompt) {
                            onOpenTutorWithPrompt(
                              `In ${activeCourse.code}, the instructor posted this announcement: "${ann.text}". Please provide clinical context, key clinical protocols, and how students should prepare.`
                            );
                          }
                        }}
                        title="Ask EdgeAI to clarify or summarize announcement"
                        className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-[11px] font-semibold border border-sky-200 dark:border-sky-800 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Bot className="w-3 h-3 text-sky-500" />
                        <span className="hidden sm:inline">AI Explain</span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      {ann.title && (
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                          {ann.title}
                        </h4>
                      )}
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {ann.text}
                      </p>
                    </div>

                    {/* Attachments */}
                    {ann.attachments && ann.attachments.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {ann.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="font-medium text-slate-900 dark:text-white truncate">
                                {att.title}
                              </span>
                            </div>
                            {att.url && (
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 shrink-0 ml-2"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comments Thread (Google Classroom Style) */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Class comments ({ann.comments?.length || 0})</span>
                      </div>

                      {ann.comments && ann.comments.length > 0 && (
                        <div className="space-y-2.5 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                          {ann.comments.map(c => (
                            <div key={c.id} className="text-xs space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {c.authorName}
                                </span>
                                {c.authorRole === "teacher" && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                    Teacher
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[ann.id] || ""}
                          onChange={e => setCommentInputs({ ...commentInputs, [ann.id]: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              handleAddComment(ann.id);
                            }
                          }}
                          placeholder="Add class comment..."
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => handleAddComment(ann.id)}
                          disabled={!commentInputs[ann.id]?.trim()}
                          className="p-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white disabled:opacity-40 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= CLASSWORK TAB ======================= */}
          {activeTab === "classwork" && (
            <div className="space-y-6">
              {/* If an assignment is selected, show the full submission & AI workspace! */}
              {selectedAssignment ? (
                <div className="space-y-6">
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to all assignments</span>
                  </button>

                  {/* Assignment Detail & Submission Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Assignment Content */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-6">
                        {/* Title Header */}
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getTopicColor(selectedAssignment.topic)}`}>
                              {selectedAssignment.topic}
                            </span>
                            <div className="text-xs text-slate-400 font-medium">
                              Due: <strong className="text-slate-700 dark:text-slate-300">{selectedAssignment.dueDate} {selectedAssignment.dueTime}</strong>
                            </div>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {selectedAssignment.title}
                          </h2>

                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                            <span>{activeCourse.instructor}</span>
                            <span>•</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {selectedAssignment.maxPoints} points
                            </span>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-3">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                            Clinical Scenario & Assignment Instructions
                          </h4>
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                            {selectedAssignment.description}
                          </div>
                        </div>

                        {/* Rubric Criteria */}
                        {selectedAssignment.rubricCriteria && (
                          <div className="space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                              Grading Rubric Criteria
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedAssignment.rubricCriteria.map((crit, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300 font-medium">{crit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attachments */}
                        {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                              Reference Materials
                            </h4>
                            <div className="space-y-2">
                              {selectedAssignment.attachments.map((att, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-medium text-slate-900 dark:text-white truncate">
                                      {att.title}
                                    </span>
                                  </div>
                                  <span className="text-[10px] uppercase font-bold text-slate-400">
                                    {att.type}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Assistant Output Panel */}
                      {showAiPanel && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500/30 p-6 shadow-md space-y-4 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                  {showAiPanel === "guidance" && "EdgeAI Clinical Assignment Guidance"}
                                  {showAiPanel === "review" && "EdgeAI Pre-Submission Draft Review"}
                                  {showAiPanel === "evaluation" && "EdgeAI Rubric Evaluation"}
                                </h3>
                                <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                                  Grounded in Nursing & Midwifery Council protocols & WHO standards
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowAiPanel(null)}
                              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </div>

                          {aiLoading ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                              <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                              <span>EdgeAI is analyzing clinical protocols & your response...</span>
                            </div>
                          ) : (
                            <>
                              {/* Guidance Output */}
                              {showAiPanel === "guidance" && aiGuidance && (
                                <div className="space-y-3 text-xs">
                                  <p className="font-medium text-slate-700 dark:text-slate-300">
                                    {aiGuidance.summary}
                                  </p>

                                  <div className="space-y-1.5">
                                    <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                                      Recommended Approach Steps:
                                    </h5>
                                    {aiGuidance.approachSteps?.map((step: string, idx: number) => (
                                      <div key={idx} className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200">
                                        {step}
                                      </div>
                                    ))}
                                  </div>

                                  {aiGuidance.clinicalTip && (
                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                                      <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                      <div>
                                        <strong className="font-bold">Bedside Clinical Pearl: </strong>
                                        {aiGuidance.clinicalTip}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Draft Review Output */}
                              {showAiPanel === "review" && aiDraftReview && (
                                <div className="space-y-4 text-xs">
                                  {aiDraftReview.readinessScore !== undefined && (
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                                      <div>
                                        <div className="font-bold text-slate-900 dark:text-white">Submission Readiness Score</div>
                                        <div className="text-[10px] text-slate-400">Based on clinical accuracy and SBAR structure</div>
                                      </div>
                                      <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {aiDraftReview.readinessScore}%
                                      </div>
                                    </div>
                                  )}

                                  {/* Strengths */}
                                  {aiDraftReview.strengths?.length > 0 && (
                                    <div className="space-y-1.5">
                                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-emerald-600">
                                        Clinical Strengths:
                                      </h5>
                                      {aiDraftReview.strengths.map((s: string, idx: number) => (
                                        <div key={idx} className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          <span>{s}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Areas for Improvement */}
                                  {aiDraftReview.improvements?.length > 0 && (
                                    <div className="space-y-1.5">
                                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-amber-600">
                                        Recommended Additions before Turning In:
                                      </h5>
                                      {aiDraftReview.improvements.map((imp: string, idx: number) => (
                                        <div key={idx} className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 flex items-center gap-2">
                                          <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                          <span>{imp}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Safety Checks */}
                                  {aiDraftReview.safetyNotes?.length > 0 && (
                                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 space-y-1">
                                      <div className="font-bold flex items-center gap-1.5 text-[11px]">
                                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                        <span>Critical Patient Safety Alert</span>
                                      </div>
                                      {aiDraftReview.safetyNotes.map((note: string, idx: number) => (
                                        <p key={idx} className="text-[11px]">{note}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Formative Evaluation Output */}
                              {showAiPanel === "evaluation" && aiRubricEvaluation && (
                                <div className="space-y-4 text-xs">
                                  <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                                    <div>
                                      <span className="font-bold text-indigo-950 dark:text-indigo-200">
                                        Estimated Score: {aiRubricEvaluation.estimatedScore} / {aiRubricEvaluation.maxPoints}
                                      </span>
                                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                                        Clinical Proficiency: <strong>{aiRubricEvaluation.clinicalProficiency}</strong>
                                      </p>
                                    </div>
                                    <Award className="w-6 h-6 text-indigo-600" />
                                  </div>

                                  <div className="space-y-2">
                                    {aiRubricEvaluation.rubricBreakdown?.map((rb: any, idx: number) => (
                                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                                          <span>{rb.criterion}</span>
                                          <span className="text-emerald-600">{rb.score}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{rb.comment}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Panel: Student Submission & AI Toolkit */}
                    <div className="space-y-5">
                      {/* Submission Card (Google Classroom "Your Work") */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            Your work
                          </h3>
                          {(() => {
                            const sub = getSubmissionForWork(selectedAssignment.id);
                            if (sub?.status === "turned_in") {
                              return (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                                  Turned In
                                </span>
                              );
                            }
                            if (sub?.status === "graded") {
                              return (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800">
                                  Graded: {sub.grade}/{sub.maxPoints}
                                </span>
                              );
                            }
                            return (
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                Assigned
                              </span>
                            );
                          })()}
                        </div>

                        {/* Facilitator feedback if graded */}
                        {(() => {
                          const sub = getSubmissionForWork(selectedAssignment.id);
                          if (sub?.tutorFeedback) {
                            return (
                              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                                <strong className="text-emerald-800 dark:text-emerald-300 block font-bold mb-1">
                                  Tutor Feedback ({sub.grade}/{sub.maxPoints} pts):
                                </strong>
                                <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                                  {sub.tutorFeedback}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Submission Editor */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Clinical Response / Care Plan / SBAR Handover:
                          </label>
                          <textarea
                            rows={8}
                            value={submissionContent}
                            onChange={e => setSubmissionContent(e.target.value)}
                            disabled={getSubmissionForWork(selectedAssignment.id)?.status === "turned_in"}
                            placeholder="Draft your clinical diagnosis, immediate interventions, SBAR escalation script, or care plan here..."
                            className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono leading-relaxed disabled:opacity-75"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2">
                          {getSubmissionForWork(selectedAssignment.id)?.status === "turned_in" ? (
                            <button
                              onClick={handleUnsubmitAssignment}
                              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                            >
                              Unsubmit
                            </button>
                          ) : (
                            <button
                              onClick={handleTurnInAssignment}
                              disabled={isSubmitting || !submissionContent.trim()}
                              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              <span>Turn In Assignment</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Integrated AI Assistant Toolbar for this Assignment */}
                      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-800/40 p-5 text-white shadow-lg space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs">EdgeAI Assignment Mentors</h4>
                            <p className="text-[10px] text-indigo-300">Assistants integrated directly in hub</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={handleGetAiGuidance}
                            className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Lightbulb className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white text-[11px]">Clinical Guidance & Outline</div>
                                <div className="text-[10px] text-slate-300">How to approach this clinical scenario</div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          <button
                            onClick={handleReviewDraft}
                            className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <BrainCircuit className="w-4 h-4 text-sky-300 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white text-[11px]">Review My Draft Work</div>
                                <div className="text-[10px] text-slate-300">Check SBAR structure & safety before turning in</div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          <button
                            onClick={handleGenerateAiRubricEvaluation}
                            className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Award className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white text-[11px]">Instant Rubric Evaluation</div>
                                <div className="text-[10px] text-slate-300">Simulate tutor grade & formative feedback</div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          <button
                            onClick={() => {
                              if (onOpenTutorWithPrompt) {
                                onOpenTutorWithPrompt(
                                  `I need clinical mentorship on this assignment for ${activeCourse.name}: "${selectedAssignment.title}". Description: ${selectedAssignment.description}`
                                );
                              }
                            }}
                            className="w-full text-left p-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Bot className="w-4 h-4 text-indigo-300 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white text-[11px]">Open 24/7 Clinical Tutor</div>
                                <div className="text-[10px] text-indigo-200">Interactive live dialogue about this case</div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Classwork Overview (Google Classroom Topics & Work List) */
                <div className="space-y-6">
                  {/* Classwork Header with + Create (for tutors) & Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Topic Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      <button
                        onClick={() => setSelectedTopic("all")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                          selectedTopic === "all"
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        All Topics
                      </button>
                      {topics.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTopic(t)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                            selectedTopic === t
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search coursework..."
                          className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44 sm:w-56"
                        />
                      </div>

                      {userRole === "teacher" && (
                        <button
                          onClick={() => setShowCreateWorkModal(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Coursework Cards List grouped by topic */}
                  <div className="space-y-6">
                    {filteredWork.length === 0 ? (
                      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                        <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No assignments found</h4>
                        <p className="text-xs text-slate-400 mt-1">Try changing topic filters or search query.</p>
                      </div>
                    ) : (
                      filteredWork.map(item => {
                        const sub = getSubmissionForWork(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedAssignment(item)}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/40 group-hover:scale-105 transition-transform">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTopicColor(item.topic)}`}>
                                    {item.topic}
                                  </span>
                                  {sub?.status === "turned_in" && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                      Turned In
                                    </span>
                                  )}
                                  {sub?.status === "graded" && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                      Graded: {sub.grade}/{sub.maxPoints}
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-1">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-400 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                              <div className="font-semibold text-slate-700 dark:text-slate-300">
                                Due {item.dueDate}
                              </div>
                              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                                {item.maxPoints} points
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================= PEOPLE TAB ======================= */}
          {activeTab === "people" && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Teachers Section */}
              <div className="space-y-4">
                <div className="border-b-2 border-emerald-600 dark:border-emerald-500 pb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Facilitators & Preceptors
                  </h3>
                  <span className="text-xs text-slate-400">
                    {members.filter(m => m.role === "teacher" || m.role === "co-teacher").length} faculty
                  </span>
                </div>

                <div className="space-y-3">
                  {members
                    .filter(m => m.role === "teacher" || m.role === "co-teacher")
                    .map(teacher => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={teacher.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
                            alt={teacher.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {teacher.name}
                            </h4>
                            <p className="text-[11px] text-slate-400">{teacher.department || "Clinical Faculty"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${teacher.email}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 text-xs font-semibold transition-colors"
                          >
                            Email
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Classmates Section */}
              <div className="space-y-4">
                <div className="border-b-2 border-emerald-600 dark:border-emerald-500 pb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Classmates
                  </h3>
                  <span className="text-xs text-slate-400">
                    {members.filter(m => m.role === "student").length} students enrolled
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {members
                    .filter(m => m.role === "student")
                    .map(student => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                            alt={student.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {student.name}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {student.department} {student.clinicalGroup ? `• ${student.clinicalGroup}` : ""}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-slate-400">{student.email}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================= GRADES TAB ======================= */}
          {activeTab === "grades" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Course Gradebook & Clinical Submissions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluated submissions, formative AI scores, and preceptor marks
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Overall Standing</span>
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      96% (Grade A)
                    </div>
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                        <th className="pb-3">Assignment</th>
                        <th className="pb-3">Due Date</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Grade</th>
                        <th className="pb-3">Feedback</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {courseWorkList.map(cw => {
                        const sub = getSubmissionForWork(cw.id);
                        return (
                          <tr key={cw.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-4 font-bold text-slate-900 dark:text-white pr-4">
                              {cw.title}
                            </td>
                            <td className="py-4 text-slate-500">{cw.dueDate}</td>
                            <td className="py-4">
                              {sub?.status === "turned_in" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                  Turned In
                                </span>
                              )}
                              {sub?.status === "graded" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                  Graded
                                </span>
                              )}
                              {(!sub || sub.status === "assigned") && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                  Assigned
                                </span>
                              )}
                            </td>
                            <td className="py-4 font-bold text-slate-900 dark:text-white">
                              {sub?.grade !== undefined ? (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  {sub.grade} / {cw.maxPoints}
                                </span>
                              ) : (
                                <span className="text-slate-400">— / {cw.maxPoints}</span>
                              )}
                            </td>
                            <td className="py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                              {sub?.tutorFeedback || (sub?.aiReview ? "AI pre-reviewed" : "—")}
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedAssignment(cw);
                                  setActiveTab("classwork");
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-semibold cursor-pointer"
                              >
                                View Work
                              </button>
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
        </div>
      )}

      {/* Modal: Create Coursework Assignment (Facilitators) */}
      {showCreateWorkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Assignment for {activeCourse?.code}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={newWorkTitle}
                  onChange={e => setNewWorkTitle(e.target.value)}
                  placeholder="e.g. Clinical Case Study: Neonatal Hypothermia & Resuscitation"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Topic
                  </label>
                  <select
                    value={newWorkTopic}
                    onChange={e => setNewWorkTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Obstetric Emergencies">Obstetric Emergencies</option>
                    <option value="Surgical Nursing">Surgical Nursing</option>
                    <option value="Maternal Pharmacology">Maternal Pharmacology</option>
                    <option value="Clinical Skills">Clinical Skills</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    value={newWorkPoints}
                    onChange={e => setNewWorkPoints(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newWorkDueDate}
                  onChange={e => setNewWorkDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Instructions & Clinical Scenario
                </label>
                <textarea
                  rows={4}
                  value={newWorkDesc}
                  onChange={e => setNewWorkDesc(e.target.value)}
                  placeholder="Outline the case details, patient observations, and specific questions students must answer..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowCreateWorkModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCourseWork}
                disabled={!newWorkTitle.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50"
              >
                Publish Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
