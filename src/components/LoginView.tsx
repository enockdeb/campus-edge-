import React, { useState } from "react";
import { AuthUser, UserRole, StudentProfile, FacilitatorProfile } from "../types";
import {
  defaultStudentUser,
  defaultTeacherUser,
  initialStudentProfile,
  initialFacilitatorProfile
} from "../data/initialData";
import {
  GraduationCap,
  Stethoscope,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  KeyRound,
  BookOpen
} from "lucide-react";

interface LoginViewProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState<UserRole>("student");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form Fields
  const [identifier, setIdentifier] = useState(
    activeRole === "student" ? defaultStudentUser.identifier : defaultTeacherUser.identifier
  );
  const [password, setPassword] = useState("clinical2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Registration form fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regId, setRegId] = useState("");
  const [regDepartment, setRegDepartment] = useState<"nursing" | "midwifery" | "dual">("dual");
  const [regCollege, setRegCollege] = useState("Presbyterian Nursing & Midwifery College");

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    setErrorMsg("");
    if (role === "student") {
      setIdentifier(defaultStudentUser.identifier);
      setPassword("clinical2026");
    } else {
      setIdentifier(defaultTeacherUser.identifier);
      setPassword("preceptor2026");
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!identifier.trim()) {
      setErrorMsg(activeRole === "student" ? "Please enter your Student ID or institutional email." : "Please enter your Staff ID or faculty email.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your access password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (activeRole === "student") {
        onLogin({
          ...defaultStudentUser,
          identifier: identifier.trim() || defaultStudentUser.identifier,
          email: identifier.includes("@") ? identifier.trim() : defaultStudentUser.email
        });
      } else {
        onLogin({
          ...defaultTeacherUser,
          identifier: identifier.trim() || defaultTeacherUser.identifier,
          email: identifier.includes("@") ? identifier.trim() : defaultTeacherUser.email
        });
      }
    }, 450);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regId.trim()) {
      setErrorMsg("Please complete all required fields for institutional enrollment.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (activeRole === "student") {
        const newStudentProfile: StudentProfile = {
          ...initialStudentProfile,
          id: `std-${Date.now()}`,
          name: regName.trim(),
          studentId: regId.trim(),
          college: regCollege,
          primaryTrack: regDepartment,
          program: regDepartment === "dual"
            ? "Dual Qualification: Registered Midwifery (RM) & General Nursing (RN)"
            : regDepartment === "midwifery"
            ? "Diploma in Registered Midwifery (RM)"
            : "Diploma in Registered General Nursing (RN)",
          clinicalHoursCompleted: 0,
          clinicalHoursRequired: 200,
          streakDays: 1,
          registeredCourseIds: ["course-mid-201", "course-phar-204"]
        };

        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          email: regEmail.trim(),
          role: "student",
          name: regName.trim(),
          avatar: "/student-avatar.svg",
          identifier: regId.trim(),
          college: regCollege,
          programOrDept: newStudentProfile.program,
          studentProfile: newStudentProfile
        };

        onLogin(newUser);
      } else {
        const newFacilitatorProfile: FacilitatorProfile = {
          ...initialFacilitatorProfile,
          id: `fac-${Date.now()}`,
          name: regName.trim(),
          title: "Clinical Instructor & Faculty Member",
          college: regCollege,
          department: regDepartment,
          email: regEmail.trim(),
          coursesPublished: 1,
          quizzesCreated: 5,
          videosUploaded: 0,
          totalStudentsTaught: 45
        };

        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          email: regEmail.trim(),
          role: "teacher",
          name: regName.trim(),
          title: newFacilitatorProfile.title,
          avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
          identifier: regId.trim(),
          college: regCollege,
          programOrDept: `Department of ${regDepartment.toUpperCase()}`,
          facilitatorProfile: newFacilitatorProfile
        };

        onLogin(newUser);
      }
    }, 500);
  };

  const handleQuickDemoStudent = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(defaultStudentUser);
    }, 250);
  };

  const handleQuickDemoTeacher = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(defaultTeacherUser);
    }, 250);
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Institutional Banner & Role Preview */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow circle */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 border border-white/20 flex items-center justify-center backdrop-blur-xs">
                <img
                  src="/campus-edge-logo.svg"
                  alt="Campus Edge Crest"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-white">Campus Edge</h1>
                <p className="text-[11px] text-sky-300 font-medium">Nursing & Midwifery Hub</p>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>NMC Ghana Accredited Portal</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {activeRole === "student"
                  ? "Student Clinical Learning Portal"
                  : "Faculty & Clinical Preceptor Hub"}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeRole === "student"
                  ? "Access syllabus milestone paths, interactive lecture summaries, licensure examination question drills, flashcard decks, and ward clinical logs."
                  : "Manage accredited curricula, author multi-tier licensure examination quizzes, publish surgical and midwifery procedure videos, and review student cohorts."}
              </p>
            </div>

            {/* Quick Feature Highlights depending on role */}
            <div className="space-y-2.5 pt-2 text-xs text-slate-200">
              {activeRole === "student" ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Personalized student dashboard with streak tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WHO Partograph, OSCE drills & EdgeAI Clinical Tutor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Course registration, clinical hours & licensure prep</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Teacher-only dashboard with cohort performance metrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Course creator, milestone syllabus builder & credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Licensure quiz authoring & clinical video masterclasses</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Institutional footer in sidebar */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Presbyterian N&MC</span>
            </div>
            <span className="text-amber-300/80 font-mono">Session 2026/27</span>
          </div>
        </div>

        {/* Right Side: Login & Registration Form */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            {/* Top Role Selector Tabs */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Portal Role</span>
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("student")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeRole === "student"
                      ? "bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("teacher")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeRole === "teacher"
                      ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Faculty / Tutor</span>
                </button>
              </div>
            </div>

            {/* Form Title */}
            <div className="mb-5">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {isRegisterMode ? (
                  <>
                    <span>Enroll New {activeRole === "student" ? "Student" : "Faculty / Tutor"} Account</span>
                  </>
                ) : (
                  <>
                    <span>{activeRole === "student" ? "Student Sign In" : "Faculty / Tutor Sign In"}</span>
                  </>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRegisterMode
                  ? "Register for institutional access to the dual clinical academy."
                  : activeRole === "student"
                  ? "Enter your Nursing & Midwifery College student credentials to route to your Student Dashboard."
                  : "Enter your faculty staff ID or preceptor credentials to route to your Faculty / Tutor Dashboard."}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Sign In Form */}
            {!isRegisterMode ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {activeRole === "student" ? "Student Index / ID Number or Email" : "Staff ID or Faculty Email"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      {activeRole === "student" ? <User className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={activeRole === "student" ? "e.g., NMC/CNM/24/0912 or student@college.edu.gh" : "e.g., STAFF/NMC/FAC-2018 or faculty@nmc.edu.gh"}
                      className="w-full pl-9.5 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700"
                    />
                    <span>Keep me signed in on this station</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">TLS 1.3</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeRole === "student"
                      ? "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-600/20"
                      : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-600/20"
                  } ${isLoading ? "opacity-75 cursor-not-allowed" : "hover:shadow-lg active:scale-98"}`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In as {activeRole === "student" ? "Student" : "Faculty / Tutor"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={activeRole === "student" ? "e.g., Ama Mensah" : "e.g., Dr. Kwesi Appiah"}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {activeRole === "student" ? "Student ID" : "Staff ID"}
                    </label>
                    <input
                      type="text"
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      placeholder={activeRole === "student" ? "NMC/CNM/24/..." : "STAFF/NMC/..."}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Track
                    </label>
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100"
                    >
                      <option value="dual">Dual (RM & RN)</option>
                      <option value="midwifery">Midwifery (RM)</option>
                      <option value="nursing">General Nursing (RN)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={activeRole === "student" ? "student@college.edu.gh" : "faculty@college.edu.gh"}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete {activeRole === "student" ? "Student" : "Teacher"} Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Toggle between Sign in and Register */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMsg("");
                }}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
              >
                {isRegisterMode
                  ? "Already have an institutional account? Sign In"
                  : "First time here? Register institutional account"}
              </button>
            </div>
          </div>

          {/* Quick Demo Login Cards - One-Click Testing for both roles */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Demo Access</span>
              </span>
              <span className="text-[10px] text-slate-400">One-click test accounts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Student Demo Account */}
              <button
                type="button"
                onClick={handleQuickDemoStudent}
                className="p-2.5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-sky-300 shrink-0 bg-sky-900">
                    <img
                      src="/student-avatar.svg"
                      alt="Ama Mensah"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-sky-950 dark:text-sky-200 group-hover:text-sky-600 transition-colors flex items-center gap-1">
                      <span>Ama Mensah</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200 font-bold">Student</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Dual RM & RN Candidate</div>
                  </div>
                </div>
              </button>

              {/* Teacher Demo Account */}
              <button
                type="button"
                onClick={handleQuickDemoTeacher}
                className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-300 shrink-0 bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                      alt="Dr. Kwesi Appiah"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                      <span>Dr. Kwesi Appiah</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold">Faculty / Tutor</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Senior Clinical Preceptor</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
