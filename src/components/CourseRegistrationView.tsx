import React, { useState } from "react";
import {
  CurriculumCourse,
  StudentProfile,
  FacultyDepartment,
  AppView
} from "../types";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Baby,
  ShieldCheck,
  Search,
  Printer,
  Trash2,
  Plus,
  Clock,
  Building2,
  FileText,
  ChevronRight,
  Info,
  Check
} from "lucide-react";

interface CourseRegistrationViewProps {
  courses: CurriculumCourse[];
  student: StudentProfile;
  onRegisterCourse: (courseId: string) => void;
  onDropCourse: (courseId: string) => void;
  onUpdateCourseFees?: (courseId: string, fees: { tuitionFee: number; labFee: number; councilExamFee: number }) => void;
  onNavigate: (view: AppView, payload?: any) => void;
}

export const CourseRegistrationView: React.FC<CourseRegistrationViewProps> = ({
  courses,
  student,
  onRegisterCourse,
  onDropCourse,
  onNavigate
}) => {
  // Filters & State
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyDepartment | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "registered" | "available">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    // Faculty filter
    if (selectedFaculty !== "all" && c.department !== selectedFaculty && c.department !== "dual") {
      return false;
    }
    // Status filter
    if (statusFilter === "registered" && !c.isRegistered) return false;
    if (statusFilter === "available" && c.isRegistered) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCode = c.code.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      const matchInstructor = c.instructor.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchCategory && !matchInstructor) return false;
    }
    return true;
  });

  // Calculate registered totals
  const registeredCourses = courses.filter((c) => c.isRegistered);
  const totalRegisteredCredits = registeredCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const minCreditsRequired = 12;
  const maxCreditsAllowed = 24;

  const registeredMidwiferyCredits = registeredCourses
    .filter((c) => c.department === "midwifery" || c.department === "dual")
    .reduce((sum, c) => sum + (c.credits || 0), 0);
  const registeredNursingCredits = registeredCourses
    .filter((c) => c.department === "nursing" || c.department === "dual")
    .reduce((sum, c) => sum + (c.credits || 0), 0);

  // Nursing vs Midwifery breakdown
  const nursingCourses = courses.filter((c) => c.department === "nursing");
  const midwiferyCourses = courses.filter((c) => c.department === "midwifery");
  const dualCourses = courses.filter((c) => c.department === "dual");

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Dual Platform Accreditation & Registration */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                NMC Dual-Accredited Academy
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Registration Active • Academic Year 2026/2027
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white flex items-center gap-3">
              <span>Academic Course Registration</span>
            </h1>

            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Register courses across the <strong className="text-sky-300">Registered Midwifery (RM)</strong> and{" "}
              <strong className="text-indigo-300">Registered General Nursing (RN)</strong> faculties. Select accredited modules, verify clinical prerequisites, and generate your official registration records.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>{student.college}</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span>Student ID: <strong className="text-white font-mono">{student.studentId}</strong></span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span>Enrolled Track: <strong className="text-sky-300">{student.program}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Credit Load Gauge */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-slate-700/80 shrink-0 min-w-[260px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Semester Credit Load</span>
              <span className="font-bold text-white font-mono">{totalRegisteredCredits} / {maxCreditsAllowed} Credits</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden mb-3 border border-slate-700">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  totalRegisteredCredits < minCreditsRequired
                    ? "bg-amber-400"
                    : totalRegisteredCredits > maxCreditsAllowed
                    ? "bg-rose-500"
                    : "bg-gradient-to-r from-sky-400 to-emerald-400"
                }`}
                style={{ width: `${Math.min(100, (totalRegisteredCredits / maxCreditsAllowed) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-slate-400">Min: {minCreditsRequired} Credits</span>
              <span className={`font-semibold ${totalRegisteredCredits >= minCreditsRequired ? "text-emerald-400" : "text-amber-400"}`}>
                {totalRegisteredCredits >= minCreditsRequired ? "Full-Time Status ✓" : `Needs ${minCreditsRequired - totalRegisteredCredits} more`}
              </span>
            </div>

            <div className="pt-2.5 border-t border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Enrolled Courses</span>
                <span className="text-base font-extrabold text-white font-mono">{registeredCourses.length} Registered</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Clinical Status</span>
                <span className="text-xs font-bold text-emerald-400">Validated Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Faculty Tabs & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Midwifery Track Tab Card */}
        <button
          onClick={() => setSelectedFaculty(selectedFaculty === "midwifery" ? "all" : "midwifery")}
          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
            selectedFaculty === "midwifery"
              ? "bg-sky-50/80 border-sky-400 ring-2 ring-sky-300 dark:bg-sky-950/30 dark:border-sky-500"
              : "bg-white hover:bg-slate-50 border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              {midwiferyCourses.length} Courses
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Midwifery Faculty (RM)</h3>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
            Obstetrics, Labour Management, Partograph & Antenatal Care
          </p>
        </button>

        {/* Nursing Track Tab Card */}
        <button
          onClick={() => setSelectedFaculty(selectedFaculty === "nursing" ? "all" : "nursing")}
          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
            selectedFaculty === "nursing"
              ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-300 dark:bg-indigo-950/30 dark:border-indigo-500"
              : "bg-white hover:bg-slate-50 border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {nursingCourses.length} Courses
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Nursing Faculty (RN)</h3>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
            Med-Surg, Emergency Triage, Critical Care & Pediatrics
          </p>
        </button>

        {/* Dual Core Foundation Tab Card */}
        <button
          onClick={() => setSelectedFaculty(selectedFaculty === "dual" ? "all" : "dual")}
          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
            selectedFaculty === "dual"
              ? "bg-purple-50/80 border-purple-400 ring-2 ring-purple-300 dark:bg-purple-950/30 dark:border-purple-500"
              : "bg-white hover:bg-slate-50 border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              {dualCourses.length} Shared Core
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Dual Core Foundations</h3>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
            Clinical Asepsis, Theatre ANTT, Professional NMC Ethics
          </p>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              statusFilter === "all"
                ? "bg-slate-900 text-white font-semibold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setStatusFilter("registered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
              statusFilter === "registered"
                ? "bg-emerald-600 text-white font-semibold"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Registered ({registeredCourses.length})
          </button>
          <button
            onClick={() => setStatusFilter("available")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
              statusFilter === "available"
                ? "bg-sky-600 text-white font-semibold"
                : "bg-sky-50 text-sky-800 hover:bg-sky-100"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Available to Register ({courses.length - registeredCourses.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, title, instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Course Cards + Registration Slip Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Catalog Grid (2 cols on large) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Available Semester Courses</span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} shown)
              </span>
            </h2>

            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-500" />
              <span>Select accredited courses to add to your semester load</span>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800">No courses match your filter</h3>
              <p className="text-xs text-slate-500 mt-1">Try selecting "All Faculties" or clearing your search term.</p>
              <button
                onClick={() => {
                  setSelectedFaculty("all");
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
                className="mt-3 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredCourses.map((course) => {
                const getDeptBadge = (dept: FacultyDepartment) => {
                  switch (dept) {
                    case "midwifery":
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          <Baby className="w-3 h-3 text-sky-600" />
                          Midwifery (RM)
                        </span>
                      );
                    case "nursing":
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          <Stethoscope className="w-3 h-3 text-indigo-600" />
                          Nursing (RN)
                        </span>
                      );
                    case "dual":
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          <ShieldCheck className="w-3 h-3 text-purple-600" />
                          Dual Core (RN & RM)
                        </span>
                      );
                  }
                };

                return (
                  <div
                    key={course.id}
                    id={`course-reg-card-${course.id}`}
                    className={`bg-white rounded-xl border transition-all p-5 shadow-xs ${
                      course.isRegistered
                        ? "border-emerald-300 ring-1 ring-emerald-200/60"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                            {course.code}
                          </span>
                          {getDeptBadge(course.department)}
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {course.credits} Credits
                          </span>
                          <span className="text-xs text-slate-500">
                            {course.semester}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                          {course.description}
                        </p>
                      </div>

                      {/* Registration Status Pill */}
                      <div className="shrink-0 flex items-center gap-2">
                        {course.isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Enrolled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            Available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Logistics metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{course.schedule || "Mon/Wed 08:30 AM"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate" title={course.clinicalHospitalSite}>{course.clinicalHospitalSite || "Teaching Hospital"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate" title={course.instructor}>{course.instructor}</span>
                      </div>
                    </div>

                    {/* Course Academic Footer & Action Bar */}
                    <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">Category:</span>
                          <strong className="text-slate-800">{course.category}</strong>
                        </div>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">Milestones:</span>
                          <strong className="text-slate-800">{course.totalMilestones} Units</strong>
                        </div>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">Clinical Site:</span>
                          <strong className="text-slate-800 truncate max-w-[150px]">{course.clinicalHospitalSite || "Ridge Hospital"}</strong>
                        </div>
                      </div>

                      {/* Course Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {course.isRegistered ? (
                          <button
                            onClick={() => onDropCourse(course.id)}
                            className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Drop Course</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onRegisterCourse(course.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Register Course</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Student Registration Slip Summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-20">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-sm">Official Registration Slip</h3>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                  SEMESTER 2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Presbyterian Nursing & Midwifery Council Registry
              </p>
            </div>

            {/* Student Profile Recap */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <strong className="text-slate-900">{student.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student ID:</span>
                <strong className="font-mono text-slate-900">{student.studentId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Faculty Qualification:</span>
                <strong className="text-sky-700 text-right">{student.program}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Standing:</span>
                <span className="text-emerald-700 font-semibold">Good Standing (GPA 3.62)</span>
              </div>
            </div>

            {/* Registered Courses Itemized List */}
            <div className="p-4 max-h-72 overflow-y-auto space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200">
                <span>Enrolled Courses</span>
                <span>Credits</span>
              </div>

              {registeredCourses.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No courses registered yet. Select courses from the catalog to register.
                </p>
              ) : (
                registeredCourses.map((c) => {
                  return (
                    <div key={c.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-slate-900">{c.code}</strong>
                          <span className="text-[10px] text-slate-500 font-medium">{c.credits} Cr</span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate max-w-[180px]">{c.title}</p>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => onDropCourse(c.id)}
                          className="px-2 py-0.5 rounded text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer transition-colors"
                        >
                          Drop
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Academic Load & Accreditation Summary */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Enrolled Credits:</span>
                <span className="font-mono font-bold text-slate-900">{totalRegisteredCredits} Credits</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Midwifery (RM) Credits:</span>
                <span className="font-mono text-slate-900">{registeredMidwiferyCredits} Credits</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nursing (RN) Credits:</span>
                <span className="font-mono text-slate-900">{registeredNursingCredits} Credits</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Semester Course Load:</span>
                <span className="font-mono text-slate-900">{registeredCourses.length} Approved Courses</span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between text-xs font-bold text-slate-900">
                <span>Institutional Status:</span>
                <span className="text-emerald-700 font-extrabold">Active Academic Enrollee</span>
              </div>

              {/* Clearance status */}
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 mt-2">
                <div className="flex items-center justify-between text-emerald-900 font-semibold text-xs">
                  <span>Academic Registry Clearance:</span>
                  <span>Approved ✓</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Preceptor roster and clinical hospital rotation admission authorized.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2 bg-white">
              <button
                onClick={handlePrintSlip}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span>Print Official Registration Slip</span>
              </button>

              <button
                onClick={() => onNavigate("curriculum")}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Go to Curriculum Roadmaps</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
