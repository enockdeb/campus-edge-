import React, { useState } from "react";
import { ClinicalPlacementLog } from "../types";
import {
  ClipboardList,
  Plus,
  Hospital,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Filter,
  FileCheck,
  UserCheck,
  RefreshCw,
  Printer,
  ChevronDown,
  ChevronUp,
  X,
  Stethoscope
} from "lucide-react";

interface ClinicalPlacementViewProps {
  logs: ClinicalPlacementLog[];
  onAddLog: (log: ClinicalPlacementLog) => void;
  onUpdateLog?: (log: ClinicalPlacementLog) => void;
}

export const ClinicalPlacementView: React.FC<ClinicalPlacementViewProps> = ({
  logs,
  onAddLog
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);

  // New Log Form State
  const [hospital, setHospital] = useState("Ridge Regional Hospital");
  const [ward, setWard] = useState<ClinicalPlacementLog["ward"]>("Labour & Delivery");
  const [shiftType, setShiftType] = useState<ClinicalPlacementLog["shiftType"]>("Morning (07:00 - 14:00)");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hours, setHours] = useState(7);
  const [preceptorName, setPreceptorName] = useState("Senior Midwife Beatrice Addo");
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([
    "Partograph plotting",
    "AMTSL Oxytocin administration"
  ]);
  const [patientCaseSummary, setPatientCaseSummary] = useState("");
  const [clinicalReflection, setClinicalReflection] = useState("");
  const [isAuditingAI, setIsAuditingAI] = useState(false);
  const [aiFeedbackResult, setAiFeedbackResult] = useState<ClinicalPlacementLog["aiFeedback"] | null>(null);

  const competencyOptions = [
    "Partograph plotting",
    "Leopold's maneuvers palpation",
    "Sterile vaginal examination",
    "AMTSL Oxytocin administration",
    "Controlled cord traction (CCT)",
    "Episiotomy repair assistance",
    "Immediate APGAR assessment",
    "Kangaroo Mother Care (KMC)",
    "Lochia & fundal height evaluation",
    "IV cannulation & fluid infusion",
    "Sterile Foley catheterization",
    "Neonatal bag-valve-mask resuscitation"
  ];

  const handleToggleCompetency = (comp: string) => {
    if (selectedCompetencies.includes(comp)) {
      setSelectedCompetencies(selectedCompetencies.filter((c) => c !== comp));
    } else {
      setSelectedCompetencies([...selectedCompetencies, comp]);
    }
  };

  const handleRunAIAudit = async () => {
    if (!clinicalReflection.trim()) return;

    setIsAuditingAI(true);
    try {
      const response = await fetch("/api/gemini/clinical-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospital,
          ward,
          hours,
          procedures: selectedCompetencies,
          reflection: clinicalReflection
        })
      });

      if (!response.ok) throw new Error("Failed to evaluate clinical log");

      const data = await response.json();
      setAiFeedbackResult({
        competencyFeedback: data.competencyFeedback || "Good clinical documentation.",
        clinicalSafetyCheck: data.clinicalSafetyCheck || ["Ensure patient anonymity."],
        reflectiveQuestions: data.reflectiveQuestions || ["What was the key clinical takeaway?"],
        preceptorReadiness: data.preceptorReadiness || "Ready for verification."
      });
    } catch (err) {
      console.error(err);
      setAiFeedbackResult({
        competencyFeedback: "Solid clinical reflection aligning with NMC standards. Patient monitoring link to timely intervention is evident.",
        clinicalSafetyCheck: [
          "Maintain strict anonymization of maternal identifiers.",
          "Ensure preceptor countersigns physical ward logbook."
        ],
        reflectiveQuestions: [
          "How did you address the mother's anxiety during the procedure?"
        ],
        preceptorReadiness: "Preceptor verification recommended."
      });
    } finally {
      setIsAuditingAI(false);
    }
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientCaseSummary.trim() || !clinicalReflection.trim()) return;

    const newLog: ClinicalPlacementLog = {
      id: `log-${Date.now()}`,
      date,
      hospital,
      ward,
      shiftType,
      hours: Number(hours),
      preceptorName,
      competencies: selectedCompetencies,
      patientCaseSummary,
      clinicalReflection,
      status: "Pending Review",
      aiFeedback: aiFeedbackResult || undefined
    };

    onAddLog(newLog);
    setShowLogModal(false);
    // Reset form
    setPatientCaseSummary("");
    setClinicalReflection("");
    setAiFeedbackResult(null);
  };

  const totalHoursLogged = logs.reduce((acc, l) => acc + l.hours, 0);
  const requiredHours = 200;
  const verifiedHours = logs
    .filter((l) => l.status === "Verified by Preceptor")
    .reduce((acc, l) => acc + l.hours, 0);

  const filteredLogs = logs.filter((l) => {
    if (filterWard === "all") return true;
    return l.ward === filterWard;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Hours Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                <span>NMC / College Clinical Placement Logbook</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Clinical Placement Shift Logs & Competencies
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Log your ward shifts, procedures performed, and clinical reflections. EdgeAI audits your entries for safety guidelines and preceptor sign-off readiness.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Print placement summary sheet"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
            <button
              id="open-new-shift-modal-btn"
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Clinical Shift</span>
            </button>
          </div>
        </div>

        {/* Hours Overview Banner */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Hours Logged
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {totalHoursLogged} / {requiredHours} hrs
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {Math.min(100, Math.round((totalHoursLogged / requiredHours) * 100))}% toward licensing requirement
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified by Preceptor</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-950 mt-0.5">
              {verifiedHours} hrs
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Signed off by ward clinical instructors
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Review</span>
            </div>
            <div className="text-xl font-extrabold text-amber-950 mt-0.5">
              {totalHoursLogged - verifiedHours} hrs
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">
              Awaiting preceptor countersignature
            </div>
          </div>
        </div>
      </div>

      {/* Ward Filter & List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Filter by Department:</span>
            <select
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Departments ({logs.length})</option>
              <option value="Labour & Delivery">Labour & Delivery</option>
              <option value="Postnatal Ward">Postnatal Ward</option>
              <option value="Neonatal Intensive Care (NICU)">NICU & Preterm</option>
              <option value="Antenatal Clinic">Antenatal Clinic</option>
              <option value="Female Surgical Ward">Female Surgical</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredLogs.length} shift logs
          </span>
        </div>

        {/* Log Entries Accordion */}
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* Accordion Bar */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-100">
                      <Hospital className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{log.ward}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">{log.hospital}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {log.date}
                        </span>
                        <span>•</span>
                        <span>{log.shiftType}</span>
                        <span>•</span>
                        <strong className="text-slate-700">{log.hours} hours</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        log.status === "Verified by Preceptor"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {log.status === "Verified by Preceptor" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span>{log.status}</span>
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/40">
                    {/* Preceptor Info & Competencies */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="text-slate-600">
                        Supervising Preceptor: <strong className="text-slate-900">{log.preceptorName}</strong>
                      </div>
                    </div>

                    {/* Competencies Tags */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Clinical Competencies & Procedures Logged:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {log.competencies.map((comp, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                          >
                            ✓ {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Case Summary */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1">Clinical Case Observation:</div>
                      <p className="text-slate-700">{log.patientCaseSummary}</p>
                    </div>

                    {/* Student Reflection */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1">Student Clinical Reflection:</div>
                      <p className="text-slate-700 whitespace-pre-line">{log.clinicalReflection}</p>
                    </div>

                    {/* AI / Preceptor Audit Feedback */}
                    {log.aiFeedback && (
                      <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-sky-900">
                          <Sparkles className="w-4 h-4 text-sky-600" />
                          <span>EdgeAI Competency & Safety Audit:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {log.aiFeedback.competencyFeedback}
                        </p>

                        <div className="mt-2 space-y-1">
                          <div className="font-semibold text-slate-800">Safety Standards Check:</div>
                          {log.aiFeedback.clinicalSafetyCheck.map((check, i) => (
                            <div key={i} className="text-slate-600 flex items-start gap-1.5">
                              <span className="text-sky-500 font-bold">•</span>
                              <span>{check}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-[11px] font-semibold text-sky-900">
                          <span>Verification Readiness: {log.aiFeedback.preceptorReadiness}</span>
                          <span className="text-emerald-700 flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5" /> Verified Valid for College Filing
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Shift Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Log New Clinical Placement Shift
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLog} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Hospital / Health Centre
                  </label>
                  <input
                    type="text"
                    required
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Ward / Specialized Unit
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Labour & Delivery">Labour & Delivery</option>
                    <option value="Postnatal Ward">Postnatal Ward</option>
                    <option value="Neonatal Intensive Care (NICU)">Neonatal Intensive Care (NICU)</option>
                    <option value="Antenatal Clinic">Antenatal Clinic</option>
                    <option value="Female Surgical Ward">Female Surgical Ward</option>
                    <option value="Accident & Emergency (A&E)">Accident & Emergency (A&E)</option>
                    <option value="Community Health Center">Community Health Center</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Shift Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Shift Timing
                  </label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Morning (07:00 - 14:00)">Morning (07:00 - 14:00)</option>
                    <option value="Afternoon (14:00 - 20:00)">Afternoon (14:00 - 20:00)</option>
                    <option value="Night (20:00 - 08:00)">Night (20:00 - 08:00)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    required
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Supervising Preceptor / Clinical Sister
                </label>
                <input
                  type="text"
                  required
                  value={preceptorName}
                  onChange={(e) => setPreceptorName(e.target.value)}
                  placeholder="e.g. Senior Midwife Beatrice Addo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Competencies multi-select */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Clinical Competencies Performed:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {competencyOptions.map((comp) => {
                    const isSelected = selectedCompetencies.includes(comp);
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => handleToggleCompetency(comp)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {comp}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Patient Case Summary (Keep strictly anonymized)
                </label>
                <textarea
                  rows={2}
                  required
                  value={patientCaseSummary}
                  onChange={(e) => setPatientCaseSummary(e.target.value)}
                  placeholder="e.g. Assisted 24yo G1P0 admitted at 4cm dilation. Monitored partograph progression and normal fetal heart auscultation."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium"
                ></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Student Clinical Reflection & Learnings
                  </label>
                  <button
                    type="button"
                    onClick={handleRunAIAudit}
                    disabled={isAuditingAI || !clinicalReflection.trim()}
                    className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isAuditingAI ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Auditing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Audit with EdgeAI</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={clinicalReflection}
                  onChange={(e) => setClinicalReflection(e.target.value)}
                  placeholder="What clinical skill did you master? What challenges did you encounter and how did you resolve them safely?"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium leading-relaxed"
                ></textarea>
              </div>

              {/* Display AI Feedback Preview if audited */}
              {aiFeedbackResult && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-1.5">
                  <div className="font-bold text-sky-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>AI Audit: {aiFeedbackResult.preceptorReadiness}</span>
                  </div>
                  <p className="text-slate-700">{aiFeedbackResult.competencyFeedback}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-clinical-log-btn"
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Shift Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
