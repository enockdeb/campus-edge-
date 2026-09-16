import React, { useState, useEffect } from "react";
import {
  CurriculumCourse,
  CurriculumMilestone,
  MilestoneStep,
  AppView
} from "../types";
import { initialCourses } from "../data/initialData";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  ClipboardList,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  PlayCircle,
  RotateCcw,
  GraduationCap,
  Stethoscope,
  Baby,
  CreditCard,
  Building2
} from "lucide-react";
import confetti from "canvas-confetti";

interface CurriculumViewProps {
  courses: CurriculumCourse[];
  onUpdateCourses: (courses: CurriculumCourse[]) => void;
  onNavigate: (view: AppView, contextPayload?: any) => void;
  initialCourseId?: string;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  courses,
  onUpdateCourses,
  onNavigate,
  initialCourseId
}) => {
  const validCourses = courses && courses.length > 0 ? courses : initialCourses;
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || validCourses[0]?.id || ""
  );

  useEffect(() => {
    if (initialCourseId && validCourses.some((c) => c.id === initialCourseId)) {
      setSelectedCourseId(initialCourseId);
      const matched = validCourses.find((c) => c.id === initialCourseId);
      if (matched && matched.milestones && matched.milestones[0]) {
        setSelectedMilestoneId(matched.milestones[0].id);
      }
    }
  }, [initialCourseId, validCourses]);

  const selectedCourse = validCourses.find((c) => c.id === selectedCourseId) || validCourses[0];

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    selectedCourse?.milestones?.[0]?.id || ""
  );

  const activeMilestone =
    selectedCourse?.milestones?.find((m) => m.id === selectedMilestoneId) ||
    selectedCourse?.milestones?.[0];

  // Handler to toggle completion of a step
  const handleToggleStep = (stepId: string) => {
    if (!selectedCourse || !activeMilestone) return;

    const updatedMilestones = selectedCourse.milestones.map((m) => {
      if (m.id !== activeMilestone.id) return m;

      const updatedSteps = m.steps.map((s) => {
        if (s.id === stepId) {
          return { ...s, completed: !s.completed };
        }
        return s;
      });

      const allCompleted = updatedSteps.every((s) => s.completed);
      const newStatus = allCompleted ? "completed" : "in_progress";

      return {
        ...m,
        steps: updatedSteps,
        status: newStatus as any
      };
    });

    const completedCount = updatedMilestones.filter((m) => m.status === "completed").length;

    const updatedCourses = courses.map((c) => {
      if (c.id === selectedCourse.id) {
        return {
          ...c,
          milestones: updatedMilestones,
          completedMilestones: completedCount
        };
      }
      return c;
    });

    onUpdateCourses(updatedCourses);

    // If milestone became fully completed, celebrate
    const currentM = updatedMilestones.find((m) => m.id === activeMilestone.id);
    if (currentM && currentM.status === "completed" && activeMilestone.status !== "completed") {
      triggerConfetti();
    }
  };

  const handleCompleteEntireMilestone = () => {
    if (!selectedCourse || !activeMilestone) return;

    const updatedMilestones = selectedCourse.milestones.map((m) => {
      if (m.id !== activeMilestone.id) return m;
      return {
        ...m,
        status: "completed" as const,
        steps: m.steps.map((s) => ({ ...s, completed: true }))
      };
    });

    const completedCount = updatedMilestones.filter((m) => m.status === "completed").length;

    const updatedCourses = courses.map((c) => {
      if (c.id === selectedCourse.id) {
        return {
          ...c,
          milestones: updatedMilestones,
          completedMilestones: completedCount
        };
      }
      return c;
    });

    onUpdateCourses(updatedCourses);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  if (!selectedCourse || !activeMilestone) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <BookOpen className="w-12 h-12 text-sky-500 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">Nursing & Midwifery Curriculum Tracks</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
          Load the official Nursing & Midwifery Council (NMC) curriculum tracks, partograph surveillance protocols, and clinical pharmacology tracks.
        </p>
        <button
          onClick={() => {
            onUpdateCourses(initialCourses);
            setSelectedCourseId(initialCourses[0].id);
            setSelectedMilestoneId(initialCourses[0].milestones[0].id);
          }}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Load Standard Curriculum Modules</span>
        </button>
      </div>
    );
  }

  const courseCompletionPct = Math.round(
    (selectedCourse.completedMilestones / selectedCourse.totalMilestones) * 100
  );

  const completedStepsCount = activeMilestone.steps.filter((s) => s.completed).length;
  const milestoneProgressPct = Math.round(
    (completedStepsCount / activeMilestone.steps.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Course Selection & Coursera Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
                Curriculum Milestone Path
              </span>
              <span className="text-xs font-semibold text-slate-500 font-mono">{selectedCourse.code}</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                selectedCourse.department === "midwifery"
                  ? "bg-sky-50 text-sky-800 border border-sky-200"
                  : selectedCourse.department === "nursing"
                  ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                  : "bg-purple-50 text-purple-800 border border-purple-200"
              }`}>
                {selectedCourse.department === "midwifery" ? (
                  <>
                    <Baby className="w-3.5 h-3.5 text-sky-600" />
                    <span>Faculty of Midwifery (RM)</span>
                  </>
                ) : selectedCourse.department === "nursing" ? (
                  <>
                    <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Faculty of Nursing (RN)</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                    <span>Dual Shared Core</span>
                  </>
                )}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {selectedCourse.credits} Credits
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              {selectedCourse.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {selectedCourse.description}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <div>Course Lead: <strong className="text-slate-800">{selectedCourse.instructor}</strong></div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Site: <strong className="text-slate-700">{selectedCourse.clinicalHospitalSite || "Teaching Hospital"}</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedCourse.schedule || "Mon/Wed 08:30 AM"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700">Course Progress & Registration</div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${courseCompletionPct}%` }}
                ></div>
              </div>
              <span className="text-xs font-extrabold text-sky-700">{courseCompletionPct}%</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span>{selectedCourse.completedMilestones} of {selectedCourse.totalMilestones} Milestones</span>
              <span>•</span>
              <span className="font-semibold text-slate-800">
                {selectedCourse.credits} Credits
              </span>
            </div>

            <button
              onClick={() => onNavigate("registration")}
              className="mt-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Course Registration</span>
            </button>
          </div>
        </div>

        {/* Course Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
          {validCourses.map((course) => {
            const isSelected = course.id === selectedCourse.id;
            return (
              <button
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setSelectedMilestoneId(course.milestones[0]?.id || "");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{course.code}</span>
                <span className="opacity-80 font-normal">| {course.category}</span>
                {course.completedMilestones === course.totalMilestones && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Coursera-style Milestone Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Milestone Pathway Stepper (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
              Course Learning Roadmap
            </h3>

            <div className="space-y-2.5">
              {selectedCourse.milestones.map((milestone, idx) => {
                const isActive = milestone.id === activeMilestone.id;
                const isCompleted = milestone.status === "completed";
                const isLocked = milestone.status === "locked";

                return (
                  <div
                    key={milestone.id}
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedMilestoneId(milestone.id);
                      }
                    }}
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-50 border-sky-300 ring-1 ring-sky-300 shadow-2xs"
                        : isLocked
                        ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isActive
                              ? "bg-sky-600 text-white"
                              : isLocked
                              ? "bg-slate-200 text-slate-500"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isLocked ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            milestone.milestoneNumber
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Week {milestone.weekNumber}
                        </span>
                      </div>

                      {isCompleted && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      )}
                      {milestone.status === "in_progress" && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Active
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs font-bold mt-2 ${
                        isActive ? "text-sky-900" : isLocked ? "text-slate-500" : "text-slate-800"
                      }`}
                    >
                      {milestone.title}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>{milestone.steps.filter((s) => s.completed).length} / {milestone.steps.length} steps</span>
                      <span>{milestone.clinicalCompetencies.length} competencies</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick badge unlock widget */}
          {activeMilestone.badgeUnlocked && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Target Badge
                </div>
                <div className="font-bold text-xs text-amber-950">
                  {activeMilestone.badgeUnlocked}
                </div>
                <div className="text-[11px] text-amber-900/80">
                  Awarded upon completing all steps in Milestone {activeMilestone.milestoneNumber}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Milestone Action Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            {/* Milestone Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    Milestone {activeMilestone.milestoneNumber} • Week {activeMilestone.weekNumber}
                  </span>
                  {activeMilestone.status === "completed" && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Achieved
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {activeMilestone.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeMilestone.description}
                </p>
              </div>

              {activeMilestone.status !== "completed" && (
                <button
                  id="complete-milestone-btn"
                  onClick={handleCompleteEntireMilestone}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Milestone Complete</span>
                </button>
              )}
            </div>

            {/* Clinical Competencies Checklist Box */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-sky-600" />
                <span>NMC / Clinical College Core Competencies for this Milestone:</span>
              </h4>
              <ul className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                {activeMilestone.clinicalCompetencies.map((comp, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Step Modules */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  Milestone Action Steps ({completedStepsCount}/{activeMilestone.steps.length} Completed)
                </h3>
                <div className="text-xs font-semibold text-slate-500">
                  {milestoneProgressPct}% Complete
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${milestoneProgressPct}%` }}
                ></div>
              </div>

              {/* Step Cards */}
              <div className="space-y-3 pt-2">
                {activeMilestone.steps.map((step, idx) => {
                  let stepIcon = <BookOpen className="w-5 h-5 text-sky-600" />;
                  let actionBtnLabel = "View Summary";
                  let actionHandler = () => onNavigate("summarizer");

                  if (step.type === "flashcard_drill") {
                    stepIcon = <Layers className="w-5 h-5 text-emerald-600" />;
                    actionBtnLabel = "Practice Flashcards";
                    actionHandler = () => onNavigate("flashcards");
                  } else if (step.type === "case_quiz") {
                    stepIcon = <HelpCircle className="w-5 h-5 text-indigo-600" />;
                    actionBtnLabel = "Take Milestone Quiz";
                    actionHandler = () => onNavigate("quizzes");
                  } else if (step.type === "clinical_checklist") {
                    stepIcon = <ClipboardList className="w-5 h-5 text-amber-600" />;
                    actionBtnLabel = step.completed ? "Step Completed" : "Mark Step Complete";
                    actionHandler = () => handleToggleStep(step.id);
                  }

                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl border transition-all ${
                        step.completed
                          ? "bg-slate-50/80 border-slate-200"
                          : "bg-white border-slate-200 hover:border-sky-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleStep(step.id)}
                            className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              step.completed
                                ? "bg-emerald-500 text-white shadow-2xs"
                                : "border-2 border-slate-300 hover:border-emerald-500 text-transparent hover:text-emerald-500"
                            }`}
                            title={step.completed ? "Mark as incomplete" : "Mark as completed"}
                          >
                            <CheckCircle2 className="w-4 h-4 fill-current" />
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Step {idx + 1} • {step.type.replace("_", " ")}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                                <Clock className="w-3 h-3" /> {step.estimatedMinutes} mins
                              </span>
                            </div>
                            <h4
                              className={`font-bold text-sm mt-0.5 ${
                                step.completed ? "text-slate-600 line-through decoration-slate-400" : "text-slate-900"
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {step.contentPreview}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={actionHandler}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>{actionBtnLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
