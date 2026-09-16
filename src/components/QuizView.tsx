import React, { useState } from "react";
import { QuizQuestion, QuizResult } from "../types";
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  Award,
  RefreshCw,
  X,
  Stethoscope
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuizViewProps {
  initialTopic?: string;
  onRecordScore?: (score: number, total: number) => void;
  questions?: QuizQuestion[];
  onAddQuestion?: (question: QuizQuestion) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ initialTopic, onRecordScore, questions: externalQuestions, onAddQuestion }) => {
  const defaultQuestions: QuizQuestion[] = [
    {
      id: "q-1",
      question: "A primigravida at 39 weeks of gestation presents with sudden painless, bright red vaginal bleeding. Which nursing intervention is STRICTLY contraindicated?",
      options: [
        "Initiating continuous external fetal heart rate monitoring",
        "Performing a digital vaginal examination",
        "Establishing large-bore intravenous access",
        "Drawing blood for cross-matching and hemoglobin"
      ],
      correctIndex: 1,
      rationale: "In cases of suspected placenta previa (indicated by painless, bright red third-trimester bleeding), a digital vaginal examination can puncture the placental edge or placenta itself, triggering catastrophic maternal-fetal hemorrhage. Only a sterile speculum examination in a prepared operating room ('double setup') is ever permitted if indicated.",
      clinicalContext: "Obstetric Emergencies / Antenatal Bleeding"
    },
    {
      id: "q-2",
      question: "When caring for a patient receiving continuous IV Magnesium Sulfate for severe preeclampsia, the nurse notes a respiratory rate of 10 breaths/min and absent patellar reflexes. What is the immediate priority nursing action?",
      options: [
        "Increase the IV maintenance fluid rate to flush the magnesium",
        "Stop the Magnesium Sulfate infusion immediately and prepare Calcium Gluconate",
        "Administer 2 liters of nasal cannula oxygen and reassess in 15 minutes",
        "Draw a STAT serum creatinine level"
      ],
      correctIndex: 1,
      rationale: "Loss of deep tendon reflexes and respiratory depression (< 12-16 breaths/min) are hallmark manifestations of hypermagnesemia (magnesium toxicity). The infusion must be halted immediately to prevent respiratory and cardiac arrest, followed by emergency administration of Calcium Gluconate 10%.",
      clinicalContext: "High-Alert Pharmacological Monitoring"
    },
    {
      id: "q-3",
      question: "On a WHO Partograph, cervical dilation plotted 4 hours to the right of the Alert Line reaches the Action Line. What does this indicate to the midwife?",
      options: [
        "Labor is progressing rapidly and spontaneous delivery is imminent",
        "Prolonged / obstructed labor has occurred, mandating urgent clinical decision-making or operative referral",
        "The mother requires immediate intramuscular Ergometrine",
        "The patient should be discharged to outpatient antenatal clinic"
      ],
      correctIndex: 1,
      rationale: "The Action Line is set 4 hours to the right of the Alert Line. Crossing the action line signifies that labor progression has failed to meet acceptable physiological velocity, indicating prolonged or obstructed labor. Immediate escalation for oxytocin augmentation or cesarean section is mandated.",
      clinicalContext: "Partograph & Intrapartum Surveillance"
    },
    {
      id: "q-4",
      question: "At 1 minute of life, a term infant has a heart rate of 120 bpm, active cry upon suctioning, pink body with blue hands and feet (acrocyanosis), and vigorous flexion of limbs. What is the correct APGAR score?",
      options: [
        "APGAR 7",
        "APGAR 8",
        "APGAR 9",
        "APGAR 10"
      ],
      correctIndex: 2,
      rationale: "Appearance = 1 (Acrocyanosis), Pulse = 2 (>100 bpm), Grimace = 2 (Prompt cry), Activity = 2 (Active flexion), Respiration = 2 (Good vigorous cry). Total = 1 + 2 + 2 + 2 + 2 = 9. This represents an infant making an excellent physiological transition.",
      clinicalContext: "Immediate Neonatal Assessment"
    }
  ];

  const [questions, setQuestions] = useState<QuizQuestion[]>(externalQuestions && externalQuestions.length > 0 ? externalQuestions : defaultQuestions);

  React.useEffect(() => {
    if (externalQuestions && externalQuestions.length > 0) {
      setQuestions(externalQuestions);
    }
  }, [externalQuestions]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // AI Quiz Generator modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [genTopic, setGenTopic] = useState(initialTopic || "Labour & Delivery Complications");
  const [difficulty, setDifficulty] = useState("Medium");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQ = questions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (showRationale) return; // locked once answered
    setSelectedOption(idx);
    setShowRationale(true);

    const updated = { ...userAnswers, [currentQuestionIndex]: idx };
    setUserAnswers(updated);

    // If correct, trigger subtle celebratory sound or vibration if supported
    if (idx === currentQ.correctIndex && currentQuestionIndex === questions.length - 1) {
      // Last question completed
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const existing = userAnswers[currentQuestionIndex + 1];
      if (existing !== undefined) {
        setSelectedOption(existing);
        setShowRationale(true);
      } else {
        setSelectedOption(null);
        setShowRationale(false);
      }
    } else {
      setIsQuizComplete(true);
      const score = calculateScore();
      if (onRecordScore) {
        onRecordScore(score, questions.length);
      }
      if (score / questions.length >= 0.75) {
        try {
          confetti({ particleCount: 80, spread: 60 });
        } catch {}
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowRationale(false);
    setUserAnswers({});
    setIsQuizComplete(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleGenerateQuiz = async () => {
    if (!genTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: genTopic,
          difficulty,
          count: 5
        })
      });

      if (!response.ok) throw new Error("Failed to generate quiz");

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        const newQs: QuizQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `gen-q-${Date.now()}-${i}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex ?? 0,
          rationale: q.rationale,
          clinicalContext: q.clinicalContext || genTopic
        }));

        setQuestions(newQs);
        handleRestart();
        setShowGenModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>NMC Licensure & NCLEX Practice</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Clinical Scenario Quizzes & Exam Rationales
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Real-world nursing and midwifery vignettes with instant evidence-based rationales for every option. Master high-priority clinical judgments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="ai-generate-quiz-btn"
              onClick={() => setShowGenModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Generate AI Quiz Drill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Area */}
      {!isQuizComplete ? (
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Progress Bar & Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {currentQ.clinicalContext || "Licensure Prep"}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Stem */}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-display mt-2">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-2.5 mt-5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let optionStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-800";

                if (showRationale) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-rose-400 bg-rose-50/80 text-rose-950 line-through decoration-rose-400";
                  } else {
                    optionStyle = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-70";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showRationale}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        showRationale && isCorrect
                          ? "bg-emerald-500 text-white"
                          : showRationale && isSelected && !isCorrect
                          ? "bg-rose-500 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Clinical Rationale Box (Revealed after answering) */}
            {showRationale && (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {selectedOption === currentQ.correctIndex ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct Decision!
                    </span>
                  ) : (
                    <span className="text-rose-700 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Review Rationale
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block mb-1">Clinical Rationale & Evidence:</strong>
                  {currentQ.rationale}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {showRationale && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{currentQuestionIndex < questions.length - 1 ? "Next Clinical Scenario" : "View Exam Score"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Results Screen */
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Drill Completed!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Licensure scenario evaluation results
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-xs mx-auto">
            <div className="text-3xl font-black text-indigo-700">
              {calculateScore()} / {questions.length}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Score: {Math.round((calculateScore() / questions.length) * 100)}%
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            {calculateScore() / questions.length >= 0.75
              ? "Excellent critical thinking! You are consistently prioritizing airway, hemodynamic safety, and standard clinical guidelines."
              : "Good attempt! Review the missed rationales to reinforce your clinical judgment prior to final college examinations."}
          </p>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Drill</span>
            </button>
            <button
              onClick={() => setShowGenModal(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Generate New Topic Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Generate Quiz Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Generate Licensure Quiz
                </h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clinical Subject / Topic
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="e.g. Obstructed Labour, Postpartum Sepsis, Eclampsia"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Easy", "Medium", "Hard"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        difficulty === lvl
                          ? "bg-indigo-50 border-indigo-400 text-indigo-800"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-generate-quiz-btn"
                  type="button"
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating || !genTopic.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Drill...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Create Quiz Drill</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
