import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  Filter,
  BarChart3,
  Calendar
} from "lucide-react";
import { ModuleProgressStat, QuizTrendData, AppView } from "../types";
import { initialModuleProgressStats, initialQuizTrendData } from "../data/initialData";

interface LearningProgressChartProps {
  moduleStats?: ModuleProgressStat[];
  trendData?: QuizTrendData[];
  onNavigate?: (view: AppView, payload?: any) => void;
}

export const LearningProgressChart: React.FC<LearningProgressChartProps> = ({
  moduleStats = initialModuleProgressStats,
  trendData = initialQuizTrendData,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<"modules" | "trends">("modules");
  const [filterTrack, setFilterTrack] = useState<"all" | "midwifery" | "nursing" | "dual">("all");

  // Filtered module data
  const filteredModules = useMemo(() => {
    if (filterTrack === "all") return moduleStats;
    if (filterTrack === "midwifery") return moduleStats.filter((m) => m.track === "Midwifery");
    if (filterTrack === "nursing") return moduleStats.filter((m) => m.track === "Nursing");
    if (filterTrack === "dual") return moduleStats.filter((m) => m.track === "Dual Core");
    return moduleStats;
  }, [moduleStats, filterTrack]);

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    const avgAccuracy = Math.round(
      moduleStats.reduce((sum, m) => sum + m.quizAccuracy, 0) / (moduleStats.length || 1)
    );
    const avgCompletion = Math.round(
      moduleStats.reduce((sum, m) => sum + m.completionRate, 0) / (moduleStats.length || 1)
    );
    const latestScore = trendData[trendData.length - 1]?.score || 0;
    const initialScore = trendData[0]?.score || 0;
    const growth = latestScore - initialScore;

    // Top module
    const topModule = [...moduleStats].sort((a, b) => b.quizAccuracy - a.quizAccuracy)[0];

    return {
      avgAccuracy,
      avgCompletion,
      latestScore,
      growth,
      topModule
    };
  }, [moduleStats, trendData]);

  // Custom Tooltip for Module Bar Chart
  const CustomModuleTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: ModuleProgressStat = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs max-w-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-bold text-sky-400 text-sm">{data.moduleCode}</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {data.track}
            </span>
          </div>
          <div className="font-semibold text-slate-200 text-xs mb-2 leading-tight">{data.name}</div>
          <div className="space-y-1.5 pt-1.5 border-t border-slate-700/60">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
                Completion Rate:
              </span>
              <strong className="text-white font-mono text-xs">{data.completionRate}%</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                Quiz Accuracy:
              </span>
              <strong className="text-emerald-400 font-mono text-xs">{data.quizAccuracy}%</strong>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1">
              <span>Drills Completed:</span>
              <span className="font-mono text-slate-200">
                {data.quizzesTaken} / {data.totalQuizzes} quizzes
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Trend Line/Area Chart
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: QuizTrendData = payload[0].payload;
      const benchmarkDiff = data.score - data.benchmark;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs max-w-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-sky-300 text-sm">
              {data.session} • {data.date}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                benchmarkDiff >= 0
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {benchmarkDiff >= 0 ? `+${benchmarkDiff}% Above Pass` : `${benchmarkDiff}% Below`}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 mb-2 font-medium">{data.topic}</div>
          <div className="space-y-1.5 pt-1.5 border-t border-slate-700/60">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                Overall Score:
              </span>
              <strong className="text-white font-mono text-sm">{data.score}%</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
                Midwifery Domain:
              </span>
              <strong className="text-teal-300 font-mono">{data.midwiferyScore}%</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                Nursing Domain:
              </span>
              <strong className="text-indigo-300 font-mono">{data.nursingScore}%</strong>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1">
              <span>NMC Licensure Cutoff:</span>
              <span className="font-mono text-amber-300 font-semibold">{data.benchmark}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Learning Progress & Performance Analytics</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  NMC Licensure Target
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Visualizing quiz mastery trends and course completion rates across Nursing & Midwifery modules
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              id="btn-chart-modules"
              onClick={() => setActiveTab("modules")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "modules"
                  ? "bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Module Completion & Accuracy</span>
            </button>
            <button
              id="btn-chart-trends"
              onClick={() => setActiveTab("trends")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "trends"
                  ? "bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Quiz Score Trends</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Performance Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Average Quiz Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {aggregateStats.avgAccuracy}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{aggregateStats.growth}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Across all accredited subjects</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Syllabus Completion</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-sky-700 dark:text-sky-400 font-mono">
              {aggregateStats.avgCompletion}%
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">On Track</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Milestone step progress</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Latest Simulation Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">
              {aggregateStats.latestScore}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Passed</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">NMC Cutoff: 75% required</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Top Specialization</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 truncate">
              {aggregateStats.topModule?.moduleCode}
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
              ({aggregateStats.topModule?.quizAccuracy}%)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block truncate">
            {aggregateStats.topModule?.name}
          </span>
        </div>
      </div>

      {/* Sub-Filters for Modules view */}
      {activeTab === "modules" && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 dark:text-slate-400">Department Filter:</span>
            <div className="flex items-center gap-1">
              <button
                id="filter-track-all"
                onClick={() => setFilterTrack("all")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTrack === "all"
                    ? "bg-slate-800 dark:bg-slate-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All ({moduleStats.length})
              </button>
              <button
                id="filter-track-mid"
                onClick={() => setFilterTrack("midwifery")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTrack === "midwifery"
                    ? "bg-sky-700 text-white"
                    : "bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60"
                }`}
              >
                Midwifery RM
              </button>
              <button
                id="filter-track-nur"
                onClick={() => setFilterTrack("nursing")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTrack === "nursing"
                    ? "bg-indigo-700 text-white"
                    : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                }`}
              >
                Nursing RN
              </button>
              <button
                id="filter-track-dual"
                onClick={() => setFilterTrack("dual")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTrack === "dual"
                    ? "bg-purple-700 text-white"
                    : "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60"
                }`}
              >
                Dual Core
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-600 inline-block" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Completion Rate (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Quiz Accuracy (%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Header for Trend View */}
      {activeTab === "trends" && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pt-1 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Weekly Licensure Mock Assessments (Aug 2026 – Sep 2026)</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-sky-600 rounded-full inline-block" />
              <span className="text-slate-600 font-medium">Composite Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-teal-500 rounded-full inline-block" />
              <span className="text-slate-600 font-medium">Midwifery Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-indigo-500 rounded-full inline-block" />
              <span className="text-slate-600 font-medium">Nursing Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-rose-500 inline-block" />
              <span className="text-rose-600 font-bold">NMC Cutoff (75%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div className="w-full h-72 sm:h-80 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "modules" ? (
            <BarChart
              data={filteredModules}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="moduleCode"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomModuleTooltip />} />
              <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="3 3" strokeWidth={1.5} />
              <Bar
                dataKey="completionRate"
                name="Completion Rate"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="quizAccuracy"
                name="Quiz Accuracy"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="session"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                domain={[50, 100]}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <ReferenceLine
                y={75}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "NMC Passing Passmark (75%)",
                  position: "top",
                  fill: "#e11d48",
                  fontSize: 10,
                  fontWeight: "bold"
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Composite Score"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGrad)"
              />
              <Line
                type="monotone"
                dataKey="midwiferyScore"
                name="Midwifery Questions"
                stroke="#0d9488"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0d9488" }}
              />
              <Line
                type="monotone"
                dataKey="nursingScore"
                name="Nursing Questions"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 3, fill: "#6366f1" }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bottom Insights Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Current Readiness: <strong className="text-slate-900 dark:text-white">Licensure Ready</strong> (Consistent scores above 75% threshold in obstetric and medical-surgical domains).
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigate && (
            <>
              <button
                id="chart-take-quiz-btn"
                onClick={() => onNavigate("quizzes")}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Take Practice Quiz</span>
              </button>
              <button
                id="chart-view-curriculum-btn"
                onClick={() => onNavigate("curriculum")}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                <span>Curriculum Modules</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
