import React, { useState, useRef, useEffect } from "react";
import { LectureNote, AppView, ClinicalDefinition } from "../types";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Stethoscope,
  Layers,
  HelpCircle,
  Bookmark,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Clock,
  ArrowRight,
  Mic,
  Square,
  UploadCloud,
  Volume2,
  Music,
  Trash2,
  Play,
  Pause,
  Info,
  ChevronRight,
  RotateCcw,
  FileDown
} from "lucide-react";
import { exportSummaryToPDF } from "../utils/pdfExport";

interface SummarizerViewProps {
  notes: LectureNote[];
  onSaveNote: (note: LectureNote) => void;
  onNavigate: (view: AppView, contextPayload?: any) => void;
  initialNote?: LectureNote;
}

type InputMode = "transcript" | "audio_upload" | "mic_record";

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  notes,
  onSaveNote,
  onNavigate,
  initialNote
}) => {
  const [inputMode, setInputMode] = useState<InputMode>("transcript");
  const [subject, setSubject] = useState("MID 201: Obstetrics & Midwifery");
  const [context, setContext] = useState<"lecture" | "clinical" | "handover">("lecture");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio file upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>("audio/mp3");
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Active result state
  const [activeSummary, setActiveSummary] = useState<LectureNote["summary"] | null>(
    initialNote ? initialNote.summary : notes[0]?.summary || null
  );
  const [summaryTitle, setSummaryTitle] = useState<string>(
    initialNote ? initialNote.title : notes[0]?.title || "Physiology of Labour & WHO Partograph Plotting Guide"
  );
  const [currentAudioMeta, setCurrentAudioMeta] = useState<LectureNote["audioInfo"] | undefined>(
    initialNote?.audioInfo
  );

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [audioPreviewUrl]);

  // High-yield clinical presets
  const samplePresets = [
    {
      label: "Partograph & Labour Stages",
      subject: "MID 201: Obstetrics & Midwifery",
      text: `Lecture: The Active Phase of First Stage of Labour begins at 5 cm of cervical dilation according to updated WHO guidelines. 
During the active phase, normal progression is expected at a minimum of 1 cm per hour in primigravidae.
The WHO Partograph is the primary monitoring instrument. It consists of the Alert Line (representing 1 cm/hr dilation) and the Action Line (plotted 4 hours to the right of the alert line).
If cervical dilation crosses the action line, it signifies prolonged/obstructed labor requiring emergency obstetrician review, re-evaluation for cephalopelvic disproportion (CPD) or malposition, and possible oxytocin augmentation or caesarean section.
Contractions must be monitored every 30 minutes for 10 full minutes: mild (<20s), moderate (20-40s), strong (>40s). Fetal heart rate is auscultated every 30 minutes for 1 full minute immediately after a contraction. Normal range: 110-160 bpm. Variable and late decelerations denote cord compression or placental insufficiency respectively.`
    },
    {
      label: "Magnesium Sulfate Zuspan Protocol",
      subject: "PHAR 204: Pharmacology for Midwives",
      text: `Clinical Guide: Severe Preeclampsia is characterized by BP >= 160/110 mmHg with proteinuria, severe frontal headache, epigastric pain, or visual disturbances.
The drug of choice for seizure prophylaxis and treatment of Eclampsia is Magnesium Sulfate (MgSO4).
Standard Zuspan regimen: Loading dose of 4g IV as 20% solution over 15-20 minutes, combined with Pritchard regimen 5g IM in each buttock (total 10g IM 50% solution with 1ml 2% lignocaine).
Maintenance dose: 5g IM every 4 hours alternating buttocks, or 1g/hour IV maintenance infusion.
CRITICAL SAFETY RULE: Before each 4-hourly dose, the midwife MUST confirm:
1. Patellar (knee-jerk) reflex is PRESENT (loss of reflex is the earliest sign of toxicity).
2. Respiratory rate is >= 16 breaths per minute.
3. Hourly urine output >= 30 mL/hr over previous 4 hours.
Antidote: Keep 10% Calcium Gluconate (1g IV slow over 5 minutes) immediately at bedside.`
    },
    {
      label: "Postpartum Hemorrhage & 4 Ts",
      subject: "MID 201: Obstetrics & Midwifery",
      text: `Emergency Obstetric Protocol: Postpartum Hemorrhage (PPH) is defined as blood loss >= 500 mL following vaginal delivery or >= 1000 mL following cesarean section.
Immediate algorithmic assessment using the 4 'T's:
1. Tone (Uterine Atony): Accounts for 70% of cases. Fundus is soft and boggy. Immediate action: Vigorous bimanual uterine compression and massage. Administer Oxytocin 10 IU IM or 20-40 IU in 1L crystalloid at 60 drops/min, Ergometrine 0.2mg IM (contraindicated in hypertension/preeclampsia), and Misoprostol 800mcg sublingually or rectally.
2. Trauma (20%): Cervical lacerations, vaginal tears, uterine rupture. Inspect vagina and cervix under adequate illumination and repair with absorbable sutures.
3. Tissue (9%): Retained placental cotyledon, succenturiate lobe, or membranes. Manual exploration and removal under sterile precautions.
4. Thrombin (1%): Coagulopathies and DIC. Order coagulation profile, transfuse fresh frozen plasma and platelets.`
    },
    {
      label: "Neonatal Resuscitation & APGAR",
      subject: "PNT 102: Neonatal Care",
      text: `Immediate Newborn Resuscitation & The Golden Minute:
At delivery, note the exact time and ask 3 rapid questions: Term gestation? Breathing or crying? Good muscle tone?
If yes, place the newborn directly on mother's chest for skin-to-skin contact, dry thoroughly, and cover with dry warm linen.
If no (apneic, gasping or limp): Transfer to radiant warmer under 36.5-37.5 C. Position head in neutral sniffing position and clear airway if meconium or secretions present.
If infant is not breathing or heart rate is < 100 bpm within the first 60 seconds (The Golden Minute): initiate Positive Pressure Ventilation (PPV) with Bag-Valve-Mask at 40-60 breaths/min on room air (21% O2). Avoid 100% O2 in term infants.
Assess APGAR at 1 min and 5 min:
Appearance (Color), Pulse (Heart Rate), Grimace (Reflex Irritability), Activity (Muscle Tone), Respiration (Effort).
Score 7-10 is normal; 4-6 indicates moderate depression requiring PPV; 0-3 indicates severe distress requiring chest compressions (3:1 ratio with ventilation) and epinephrine.`
    }
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setSubject(preset.subject);
    setInputText(preset.text);
    setInputMode("transcript");
    setErrorMessage(null);
  };

  // Convert File to Base64
  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle Audio File Selection (Picker & Drag/Drop)
  const processAudioFile = async (file: File) => {
    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|m4a|ogg|webm|aac|flac)$/i)) {
      setErrorMessage("Please select a valid audio file (.mp3, .wav, .m4a, .ogg, .webm).");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage("File size exceeds 25MB limit. Please provide a shorter lecture clip or transcript.");
      return;
    }

    setErrorMessage(null);
    setAudioFile(file);
    setAudioMimeType(file.type || "audio/mp3");

    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(newPreviewUrl);

    try {
      const base64 = await fileToBase64(file);
      setAudioBase64(base64);
    } catch (e) {
      console.error("Failed to read audio file", e);
      setErrorMessage("Could not read audio file. Please try another file.");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAudioFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAudioFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearAudio = () => {
    setAudioFile(null);
    setAudioBase64(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Microphone Live Recording
  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordedFile = new File([audioBlob], `recorded-lecture-${Date.now()}.webm`, {
          type: "audio/webm"
        });
        await processAudioFile(recordedFile);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access denied or unavailable:", err);
      setErrorMessage("Microphone access was denied. Please allow microphone permissions or upload an audio file instead.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  // Format recording seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  // Send to AI Summarization Backend
  const handleGenerateSummary = async () => {
    const hasText = inputText.trim().length > 0;
    const hasAudio = audioBase64 !== null;

    if (!hasText && !hasAudio) {
      setErrorMessage("Please enter a lecture transcript or upload/record an audio file to summarize.");
      return;
    }

    setIsLoading(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const payload: any = {
        subject,
        context
      };

      if (hasText) {
        payload.text = inputText;
      }

      if (hasAudio) {
        payload.audio = {
          data: audioBase64,
          mimeType: audioMimeType,
          filename: audioFile?.name || "lecture-audio.mp3"
        };
      }

      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate summary from AI");
      }

      const data = await response.json();
      setSummaryTitle(data.title || `Summary: ${subject}`);
      setActiveSummary({
        keyTakeaways: data.keyTakeaways || [],
        definitions: data.definitions || [],
        clinicalPearls: data.clinicalPearls || [],
        nursingInterventions: data.nursingInterventions || [],
        redFlags: data.redFlags || [],
        examMnemonics: data.examMnemonics || [],
        fullSummaryMarkdown: data.fullSummaryMarkdown || ""
      });

      if (hasAudio && audioFile) {
        setCurrentAudioMeta({
          filename: audioFile.name,
          fileSize: `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB`
        });
      } else {
        setCurrentAudioMeta(undefined);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during summarization.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!activeSummary) return;

    const newNote: LectureNote = {
      id: `note-${Date.now()}`,
      title: summaryTitle,
      subject,
      date: new Date().toISOString().split("T")[0],
      originalSnippet: inputText ? inputText.slice(0, 180) + "..." : audioFile?.name || "Audio Recording",
      audioInfo: currentAudioMeta,
      summary: activeSummary,
      tags: [subject.split(":")[0] || "Nursing", "AI Summary", "High-Yield"]
    };

    onSaveNote(newNote);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyMarkdown = () => {
    if (!activeSummary) return;
    const defsText = activeSummary.definitions && activeSummary.definitions.length > 0
      ? `\n\nKey Definitions:\n` + activeSummary.definitions.map(d => `- **${d.term}**: ${d.definition} (Relevance: ${d.clinicalRelevance})`).join("\n")
      : "";

    const textToCopy = `# ${summaryTitle}\n\n## Key Takeaways:\n${activeSummary.keyTakeaways.map(t => `- ${t}`).join("\n")}${defsText}\n\n## Clinical Pearls:\n${activeSummary.clinicalPearls.map(p => `- ${p}`).join("\n")}\n\n## Prioritized Nursing Interventions:\n${activeSummary.nursingInterventions.map(i => `- ${i}`).join("\n")}\n\n## Red Flags:\n${activeSummary.redFlags.map(f => `⚠️ ${f}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!activeSummary) return;
    try {
      setIsExportingPDF(true);
      exportSummaryToPDF({
        title: summaryTitle,
        subject,
        context,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        audioInfo: currentAudioMeta,
        summary: activeSummary
      });
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3000);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setErrorMessage("Unable to export PDF document. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>EdgeAI Multimodal Lecture Intelligence</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              AI-Powered Lecture Summarizer & Note Extractor
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
              Upload audio recordings (.mp3, .wav, .m4a), record live clinical lectures, or paste lecture transcripts. EdgeAI extracts concise summaries highlighting core concepts, clinical definitions, prioritized nursing actions, red flags, and exam mnemonics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Saved Notes:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
              {notes.length} notes
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Audio Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Lecture Input Source</span>
              </h2>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                Gemini 3.8 Flash
              </span>
            </div>

            {/* Input Mode Switcher: Transcripts vs Audio File vs Live Mic */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setInputMode("transcript");
                  setErrorMessage(null);
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMode === "transcript"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Transcript</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode("audio_upload");
                  setErrorMessage(null);
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMode === "audio_upload"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audio File</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode("mic_record");
                  setErrorMessage(null);
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMode === "mic_record"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mic className={`w-3.5 h-3.5 ${isRecording ? "text-rose-600 animate-pulse" : "text-indigo-600"}`} />
                <span>Live Mic</span>
              </button>
            </div>

            {/* Presets Quick Selector (Available in transcript mode) */}
            {inputMode === "transcript" && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  High-Yield Nursing & Midwifery Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 border border-slate-200 transition-all cursor-pointer text-left"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subject / Course input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Subject / Course Code
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. MID 201: Obstetrics & Midwifery"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
              />
            </div>

            {/* Context type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Material Context
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "lecture", label: "Class Lecture" },
                  { id: "clinical", label: "Ward Round" },
                  { id: "handover", label: "Shift Handover" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setContext(item.id as any)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      context === item.id
                        ? "bg-sky-50 border-sky-300 text-sky-800 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MODE 1: Lecture Transcript */}
            {inputMode === "transcript" && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lecture Content or Transcript
                </label>
                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste instructor lecture text, ward rounds notes, or clinical handover transcription here..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans leading-relaxed text-slate-800 resize-none"
                ></textarea>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>{inputText.length} characters</span>
                  <span>Supports markdown & bullet lists</span>
                </div>
              </div>
            )}

            {/* MODE 2: Audio File Upload (Drag & Drop + Click) */}
            {inputMode === "audio_upload" && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac,.flac"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="lecture-audio-input"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-sky-500 bg-sky-50/80 scale-[1.01]"
                      : audioFile
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-slate-300 hover:border-sky-400 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">
                    {audioFile ? "Audio File Loaded" : "Upload Lecture Audio Recording"}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Drag and drop your audio file here, or <span className="text-sky-600 font-bold underline">browse files</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports MP3, WAV, M4A, OGG, WEBM (Max 25MB)
                  </p>
                </div>

                {/* Audio File Preview Bar */}
                {audioFile && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Music className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {audioFile.name}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearAudio();
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove audio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {audioPreviewUrl && (
                      <audio controls src={audioPreviewUrl} className="w-full h-8" />
                    )}
                  </div>
                )}

                {/* Optional transcript accompaniment */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Accompanying Transcript / Key Words (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Add any specific clinical notes, terminology, or lecturer emphasis..."
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans text-slate-800 resize-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* MODE 3: Live Microphone Recording */}
            {inputMode === "mic_record" && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="relative inline-block mb-3">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        isRecording
                          ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-300"
                          : "bg-sky-600 hover:bg-sky-700 text-white hover:scale-105"
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-6 h-6 fill-current" />
                      ) : (
                        <Mic className="w-7 h-7" />
                      )}
                    </button>
                  </div>

                  <div className="font-mono text-xl font-bold text-slate-800">
                    {formatTime(recordingSeconds)}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {isRecording ? "Recording active lecture... Click to stop." : "Click microphone to record instructor lecture or debrief"}
                  </p>
                </div>

                {audioPreviewUrl && !isRecording && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Voice Recording Ready</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearAudio}
                        className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Discard</span>
                      </button>
                    </div>
                    <audio controls src={audioPreviewUrl} className="w-full h-8" />
                  </div>
                )}
              </div>
            )}

            {/* Error Message Callout */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Summarize Action Button */}
            <button
              id="generate-summary-btn"
              onClick={handleGenerateSummary}
              disabled={isLoading || (!inputText.trim() && !audioBase64)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                isLoading || (!inputText.trim() && !audioBase64)
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-600/20 active:scale-98"
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Lecture with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>
                    {audioBase64
                      ? "Transcribe & Summarize Audio Lecture"
                      : "Generate Structured Clinical Summary"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Saved Notes History Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Saved Lecture Notes & Audio Summaries
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSummaryTitle(note.title);
                    setActiveSummary(note.summary);
                    setSubject(note.subject);
                    setCurrentAudioMeta(note.audioInfo);
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded">
                      {note.subject}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {note.audioInfo && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <Volume2 className="w-2.5 h-2.5" />
                          <span>Audio</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportSummaryToPDF({
                            title: note.title,
                            subject: note.subject,
                            date: note.date,
                            audioInfo: note.audioInfo,
                            summary: note.summary
                          });
                        }}
                        title="Download this saved note as PDF"
                        className="p-1 rounded text-slate-400 hover:text-sky-700 hover:bg-sky-100 transition-colors"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="font-bold text-xs text-slate-800 truncate">{note.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>{note.date}</span>
                    <span>{note.summary.keyTakeaways?.length || 0} Core Points</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured AI Clinical Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeSummary ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Summary Header & Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {subject}
                    </span>
                    {currentAudioMeta && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        <span>{currentAudioMeta.filename}</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1.5 font-display">
                    {summaryTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy complete markdown summary"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    id="export-pdf-summary-btn"
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                    title="Download high-resolution PDF for offline reading and clinical review"
                  >
                    {pdfDownloaded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-800">Downloaded PDF!</span>
                      </>
                    ) : isExportingPDF ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 text-sky-600" />
                        <span>Export to PDF</span>
                      </>
                    )}
                  </button>

                  <button
                    id="save-summary-note-btn"
                    onClick={handleSaveToNotes}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{savedSuccess ? "Saved to Notes!" : "Save Note"}</span>
                  </button>
                </div>
              </div>

              {/* 1. Core Key Concepts / Takeaways */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Key Concepts & Physiological Principles</span>
                </h3>
                <div className="space-y-2">
                  {activeSummary.keyTakeaways?.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Crucial Clinical & Medical Definitions (Specifically requested by user) */}
              {activeSummary.definitions && activeSummary.definitions.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>Crucial Clinical & Medical Definitions ({activeSummary.definitions.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeSummary.definitions.map((def, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-200/80 flex flex-col justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-indigo-950 font-display">
                            {def.term}
                          </div>
                          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                            {def.definition}
                          </p>
                        </div>
                        {def.clinicalRelevance && (
                          <div className="mt-2.5 pt-2 border-t border-indigo-200/60 text-[11px] text-indigo-900 font-medium flex items-start gap-1">
                            <span className="font-bold shrink-0">Clinical Impact:</span>
                            <span>{def.clinicalRelevance}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Practical Delivery Suite & Bedside Pearls */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Practical Delivery Suite & Clinical Pearls</span>
                </h3>
                <ul className="space-y-2 text-xs text-amber-950">
                  {activeSummary.clinicalPearls?.map((pearl, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>{pearl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Prioritized Nursing Interventions with Rationale */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Prioritized Nursing & Midwifery Interventions</span>
                </h3>
                <div className="space-y-2">
                  {activeSummary.nursingInterventions?.map((intervention, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-slate-800 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{intervention}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Red Flag Warning Signs */}
              <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Red Flags & Critical Emergency Triggers</span>
                </h3>
                <ul className="space-y-2 text-xs text-rose-950 font-medium">
                  {activeSummary.redFlags?.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">⚠️</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Licensure Exam Mnemonics */}
              {activeSummary.examMnemonics && activeSummary.examMnemonics.length > 0 && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Licensure Board Exam Recall Mnemonics</span>
                  </h3>
                  <div className="space-y-1.5">
                    {activeSummary.examMnemonics.map((mnem, i) => (
                      <div key={i} className="text-xs font-mono font-semibold text-indigo-950">
                        💡 {mnem}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Bridges: Convert to Flashcards or Practice Quiz */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  Reinforce this lecture now:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="export-pdf-bottom-btn"
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <FileDown className="w-4 h-4 text-sky-400" />
                    <span>{pdfDownloaded ? "PDF Downloaded!" : "Export to PDF"}</span>
                  </button>
                  <button
                    onClick={() => onNavigate("flashcards", { topic: summaryTitle })}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Practice Flashcards</span>
                  </button>
                  <button
                    onClick={() => onNavigate("quizzes", { topic: summaryTitle })}
                    className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    <span>Take Practice Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
              <h3 className="font-bold text-base text-slate-700">No Lecture Summary Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Select a high-yield midwifery preset, paste your lecture transcript, or upload an audio recording from your instructor, then click "Generate Structured Clinical Summary".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
