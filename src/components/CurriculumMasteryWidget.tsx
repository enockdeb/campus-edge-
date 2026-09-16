import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend
} from "recharts";
import {
  CurriculumCourse,
  CurriculumMilestone,
  AppView
} from "../types";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Lock,
  ChevronRight,
  TrendingUp,
  Target,
  ArrowRight,
  Bot,
  Award
} from "lucide-react";

interface CurriculumMasteryWidgetProps {
  courses: CurriculumCourse[];
  onNavigate: (view: AppView, payload?: any) => void;
  onOpenTutorWithTopic?: (topic: string) => void;
}

interface RadarDataPoint {
  subject: string;
  shortName: string;
  fullName: string;
  milestoneNumber?: number;
  weekNumber?: number;
  mastery: number;
  benchmark: number;
  status: "completed" | "in_progress" | "available" | "locked";
  completedSteps: number;
  totalSteps: number;
  competenciesCount: number;
  competencies: string[];
  courseCode: string;
  courseTitle: string;
  courseId: string;
  milestoneId?: string;
}

export const CurriculumMasteryWidget: React.FC<CurriculumMasteryWidgetProps> = ({
  courses,
  onNavigate,
  onOpenTutorWithTopic
}) => {
  // Selection: "all" or specific course id
  const [selectedCourseScope, setSelectedCourseScope] = useState<string>("all");
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Compute radar data points based on selected scope
  const radarData: RadarDataPoint[] = useMemo(() => {
    if (!courses || courses.length === 0) return [];

    if (selectedCourseScope === "all") {
      // Cross-course milestone mastery profile
      // Extract the highest-priority milestones across all active enrolled courses
      const points: RadarDataPoint[] = [];

      courses.forEach((course) => {
        if (!course.milestones || course.milestones.length === 0) return;

        // Group milestones or pick representative milestones for this course
        course.milestones.forEach((m) => {
          let calculatedMastery = 0;
          const totalSteps = m.steps?.length || 1;
          const completedSteps = m.steps?.filter((s) => s.completed).length || 0;

          if (m.status === "completed") {
            calculatedMastery = 100;
          } else if (m.status === "in_progress") {
            calculatedMastery = Math.max(35, Math.round((completedSteps / totalSteps) * 100));
          } else if (m.status === "available") {
            calculatedMastery = completedSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 15;
          } else {
            calculatedMastery = 0;
          }

          // Truncated subject name for the polar axis
          const shortTitle = m.title.length > 22 ? `${m.title.slice(0, 20)}...` : m.title;

          points.push({
            subject: `${course.code}: M${m.milestoneNumber}`,
            shortName: `M${m.milestoneNumber}: ${shortTitle}`,
            fullName: m.title,
            milestoneNumber: m.milestoneNumber,
            weekNumber: m.weekNumber,
            mastery: calculatedMastery,
            benchmark: 80, // NMC Licensure competency threshold
            status: m.status,
            completedSteps,
            totalSteps,
            competenciesCount: m.clinicalCompetencies?.length || 0,
            competencies: m.clinicalCompetencies || [],
            courseCode: course.code,
            courseTitle: course.title,
            courseId: course.id,
            milestoneId: m.id
          });
        });
      });

      // If more than 8 points, pick the most relevant 6-8 (completed + active + next) to keep the radar clear and readable
      if (points.length > 8) {
        const inProgress = points.filter((p) => p.status === "in_progress");
        const completed = points.filter((p) => p.status === "completed").slice(0, 3);
        const available = points.filter((p) => p.status === "available").slice(0, 3);
        const locked = points.filter((p) => p.status === "locked").slice(0, 1);
        const combined = [...completed, ...inProgress, ...available, ...locked];
        return combined.slice(0, 8);
      }

      return points;
    } else {
      // Specific course selected
      const targetCourse = courses.find((c) => c.id === selectedCourseScope) || courses[0];
      if (!targetCourse || !targetCourse.milestones) return [];

      return targetCourse.milestones.map((m) => {
        let calculatedMastery = 0;
        const totalSteps = m.steps?.length || 1;
        const completedSteps = m.steps?.filter((s) => s.completed).length || 0;

        if (m.status === "completed") {
          calculatedMastery = 100;
        } else if (m.status === "in_progress") {
          calculatedMastery = Math.max(35, Math.round((completedSteps / totalSteps) * 100));
        } else if (m.status === "available") {
          calculatedMastery = completedSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 15;
        } else {
          calculatedMastery = 0;
        }

        const shortSubject = m.title.length > 20 ? `${m.title.slice(0, 18)}...` : m.title;

        return {
          subject: `M${m.milestoneNumber}: ${shortSubject}`,
          shortName: `Milestone ${m.milestoneNumber}`,
          fullName: m.title,
          milestoneNumber: m.milestoneNumber,
          weekNumber: m.weekNumber,
          mastery: calculatedMastery,
          benchmark: 80,
          status: m.status,
          completedSteps,
          totalSteps,
          competenciesCount: m.clinicalCompetencies?.length || 0,
          competencies: m.clinicalCompetencies || [],
          courseCode: targetCourse.code,
          courseTitle: targetCourse.title,
          courseId: targetCourse.id,
          milestoneId: m.id
        };
      });
    }
  }, [courses, selectedCourseScope]);

  // Aggregate stats across current radar points
  const stats = useMemo(() => {
    if (radarData.length === 0) {
      return {
        avgMastery: 0,
        completedCount: 0,
        inProgressCount: 0,
        availableCount: 0,
        totalCompetencies: 0,
        highestMilestone: null,
        nextMilestone: null
      };
    }

    const totalMastery = radarData.reduce((sum, p) => sum + p.mastery, 0);
    const avgMastery = Math.round(totalMastery / radarData.length);
    const completedCount = radarData.filter((p) => p.status === "completed").length;
    const inProgressCount = radarData.filter((p) => p.status === "in_progress").length;
    const availableCount = radarData.filter((p) => p.status === "available").length;
    const totalCompetencies = radarData.reduce((sum, p) => sum + p.competenciesCount, 0);

    const highestMilestone = [...radarData].sort((a, b) => b.mastery - a.mastery)[0];
    const nextMilestone =
      radarData.find((p) => p.status === "in_progress") ||
      radarData.find((p) => p.status === "available") ||
      radarData[0];

    return {
      avgMastery,
      completedCount,
      inProgressCount,
      availableCount,
      totalCompetencies,
      highestMilestone,
      nextMilestone
    };
  }, [radarData]);

  // Highlighted point data
  const activeFocusPoint =
    selectedPointIndex !== null && radarData[selectedPointIndex]
      ? radarData[selectedPointIndex]
      : stats.nextMilestone;

  // Custom Tooltip for Radar Chart
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: RadarDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs max-w-xs backdrop-blur-md z-50">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-bold text-sky-400 text-xs">{data.courseCode}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                data.status === "completed"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : data.status === "in_progress"
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {data.status === "completed"
                ? "Completed"
                : data.status === "in_progress"
                ? "In Progress"
                : data.status === "available"
                ? "Available"
                : "Locked"}
            </span>
          </div>

          <div className="font-semibold text-slate-100 text-xs mb-2 leading-tight">
            {data.fullName}
          </div>

          <div className="space-y-1.5 pt-1.5 border-t border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
                Current Mastery:
              </span>
              <strong className="text-white font-mono text-xs">{data.mastery}%</strong>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 inline-block" />
                NMC Licensure Target:
              </span>
              <strong className="text-indigo-300 font-mono text-xs">{data.benchmark}%</strong>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
              <span>Steps Finished:</span>
              <span className="text-slate-200 font-semibold">
                {data.completedSteps} of {data.totalSteps}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Competencies:</span>
              <span className="text-slate-200 font-semibold">{data.competenciesCount} verified skills</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="curriculum-mastery-widget"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 transition-all"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Curriculum Mastery
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              Milestone Radar
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual multi-axis milestone progression, competency retention, and NMC licensure target gap
          </p>
        </div>

        {/* View Scope Filter & Benchmark Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Course Scope Dropdown */}
          <select
            id="curriculum-radar-scope-select"
            value={selectedCourseScope}
            onChange={(e) => {
              setSelectedCourseScope(e.target.value);
              setSelectedPointIndex(null);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-2xs"
          >
            <option value="all">All Enrolled Courses (Composite)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.title}
              </option>
            ))}
          </select>

          {/* Toggle Benchmark */}
          <button
            id="toggle-licensure-benchmark-btn"
            type="button"
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              showBenchmark
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-2xs"
                : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                showBenchmark ? "bg-indigo-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>Target (80%)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Average Mastery
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {stats.avgMastery}%
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              +14% vs wk 1
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Milestones Cleared
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
              {stats.completedCount}
            </span>
            <span className="text-[10px] text-slate-400">
              of {radarData.length} active
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            In Progress
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400 font-mono">
              {stats.inProgressCount}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              active study
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            OSCE Skills Mastered
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">
              {stats.totalCompetencies}
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
              verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart & Milestone Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[330px]">
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="72%"
                data={radarData}
                margin={{ top: 10, right: 25, bottom: 10, left: 25 }}
              >
                <PolarGrid
                  stroke="#cbd5e1"
                  strokeDasharray="3 3"
                  className="dark:stroke-slate-700"
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: "#475569",
                    fontSize: 11,
                    fontWeight: 600
                  }}
                  className="dark:fill-slate-300"
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 10
                  }}
                  tickFormatter={(val) => `${val}%`}
                  axisLine={false}
                />
                <Tooltip content={<CustomRadarTooltip />} />

                {/* Benchmark Polygon */}
                {showBenchmark && (
                  <Radar
                    name="NMC Benchmark (80%)"
                    dataKey="benchmark"
                    stroke="#818cf8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="#6366f1"
                    fillOpacity={0.1}
                  />
                )}

                {/* Student's Live Milestone Progress Polygon */}
                <Radar
                  name="Student Mastery"
                  dataKey="mastery"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fill="#0ea5e9"
                  fillOpacity={0.4}
                  activeDot={{ r: 6, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={32}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                      {value}
                    </span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 text-center mt-1">
            Hover over any vertex to inspect milestone steps & verified competencies
          </div>
        </div>

        {/* Companion Interactive Milestone Explorer (5 cols on large screens) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Milestone Breakdown ({radarData.length})
            </span>
            <button
              onClick={() => onNavigate("curriculum")}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Curriculum Path</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Milestone Cards list */}
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {radarData.map((pt, idx) => {
              const isSelected = selectedPointIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPointIndex(idx)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-sky-50/70 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 shadow-2xs"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100/70 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {pt.courseCode}: {pt.fullName}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        pt.status === "completed"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : pt.status === "in_progress"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {pt.mastery}%
                    </span>
                  </div>

                  {/* Progress Bar for each milestone */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        pt.status === "completed"
                          ? "bg-emerald-500"
                          : pt.status === "in_progress"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`}
                      style={{ width: `${pt.mastery}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>
                      {pt.completedSteps}/{pt.totalSteps} steps completed
                    </span>
                    <span>{pt.competenciesCount} OSCE skills</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action for Active Milestone Focus */}
          {activeFocusPoint && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800/90 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800/80 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-300 tracking-wider">
                  Target Next Step
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activeFocusPoint.fullName}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="radar-open-milestone-btn"
                  onClick={() =>
                    onNavigate("curriculum", {
                      courseId: activeFocusPoint.courseId,
                      milestoneId: activeFocusPoint.milestoneId
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Resume</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                {onOpenTutorWithTopic && (
                  <button
                    id="radar-ask-tutor-btn"
                    onClick={() =>
                      onOpenTutorWithTopic(
                        `How can I master ${activeFocusPoint.fullName} and its clinical competencies for the NMC examination?`
                      )
                    }
                    title="Ask EdgeAI for Milestone Guidance"
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700 transition-colors cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
