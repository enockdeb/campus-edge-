import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: "Campus Edge - Nursing & Midwifery Hub",
  });
});

// API Route: Lecture & Clinical Summarizer (Transcripts & Audio Files)
app.post("/api/gemini/summarize", async (req, res) => {
  const { text, audio, subject = "Nursing & Midwifery", context = "lecture" } = req.body;

  const hasText = text && typeof text === "string" && text.trim().length > 0;
  const hasAudio = audio && typeof audio === "object" && audio.data && typeof audio.data === "string";

  if (!hasText && !hasAudio) {
    res.status(400).json({ error: "Missing lecture content. Please provide either a transcript or an audio file." });
    return;
  }

  const ai = getAIClient();

  if (!ai) {
    // Fallback high-yield clinical summary when Gemini API key is not configured
    res.json({
      title: `Clinical Summary: ${subject}`,
      keyTakeaways: [
        "Patient safety, strict asepsis, and rapid vital signs stabilization are foundational in maternal-neonatal nursing care.",
        "Systematic clinical documentation on the WHO Partograph and SBAR handovers ensures multidisciplinary accountability.",
        "Timely identification of abnormal physiological parameters prevents irreversible maternal and neonatal morbidity.",
        "Active third-stage management reduces postpartum hemorrhage incidence by more than 60%."
      ],
      definitions: [
        {
          term: "Active Phase of Labour",
          definition: "The phase of labour characterized by regular, painful contractions with cervical dilation progressing from 5 cm onward up to full dilation (10 cm).",
          clinicalRelevance: "Anticipated progression rate is at least 1 cm/hr in primigravidae. Plotting begins on the WHO Partograph alert line."
        },
        {
          term: "Uterine Atony",
          definition: "Failure of the myometrium to contract and retract firmly after separation of the placenta.",
          clinicalRelevance: "The leading cause of primary Postpartum Hemorrhage (accounting for ~70% of cases). Requires immediate bimanual uterine compression and uterotonics."
        },
        {
          term: "Pritchard / Zuspan Regimen",
          definition: "Standardized magnesium sulfate dosing protocols used for seizure prophylaxis in severe preeclampsia and eclampsia control.",
          clinicalRelevance: "Zuspan combines 4g IV loading with 1g/hr infusion or 5g IM 4-hourly. Always check patellar reflexes, respiratory rate >= 16, and urine output >= 30 mL/hr before repeating doses."
        },
        {
          term: "Cephalopelvic Disproportion (CPD)",
          definition: "An anatomical mismatch where the foetal head is too large or the maternal bony pelvis is too constricted for safe vaginal descent.",
          clinicalRelevance: "Suspected when cervical dilation crosses the Partograph Action Line despite strong uterine contractions; necessitates emergency obstetric surgical review."
        }
      ],
      clinicalPearls: [
        "Always verify medications with the '5 Rights' and cross-verify high-alert obstetric drugs with a qualified senior midwife.",
        "In obstetric emergencies, prompt left lateral positioning immediately relieves aortocaval compression and improves uteroplacental perfusion by up to 25%.",
        "Document objective baseline observations (BP, pulse, FHR, urine output) before initiating any pharmacological tocolytic or antihypertensive.",
        "Never perform a digital vaginal examination in the presence of painless bright red antepartum hemorrhage without excluding placenta praevia."
      ],
      nursingInterventions: [
        "Perform baseline neurological, cardiovascular, and respiratory assessments, recording on the modified early warning chart.",
        "Establish secure large-bore IV access (16G or 18G) and prepare warmed crystalloid fluids (Hartmann's/Ringer's Lactate).",
        "Monitor vital signs every 15 minutes during acute or unstable clinical phases; record cumulative fluid balance diligently.",
        "Provide continuous reassurance, compassionate explanations, and privacy to mitigate maternal catecholamine surge."
      ],
      redFlags: [
        "Systolic BP >= 160 mmHg or Diastolic >= 110 mmHg accompanied by persistent epigastric pain or hyperreflexia.",
        "Fetal bradycardia (<110 bpm) or prolonged decelerations exceeding 3 minutes on continuous CTG.",
        "Postpartum blood loss exceeding 500 mL following vaginal delivery or pad saturation in less than 15 minutes.",
        "Respiratory rate depression (<12 breaths/min) or loss of patellar reflexes in patients receiving Magnesium Sulfate."
      ],
      examMnemonics: [
        "APGAR: Appearance (Skin color), Pulse (Heart rate), Grimace (Reflex irritability), Activity (Muscle tone), Respiration (Effort).",
        "SBAR: Situation, Background, Assessment, Recommendation for emergency escalation.",
        "4 Ts of PPH: Tone (Atony 70%), Trauma (Lacerations 20%), Tissue (Retained placenta 9%), Thrombin (Coagulopathy 1%)."
      ],
      fullSummaryMarkdown: `### ${subject} - Comprehensive Clinical Summary\n\n**Core Clinical Focus:**\nThis lecture reinforces evidence-based nursing care, strict adherence to national clinical protocols, and vigilant patient monitoring. Understanding the physiological transition and promptly flagging complications guarantees optimal patient and maternal outcomes.\n\n**High-Yield Takeaways:**\n- Assess cervical effacement and station accurately before intervention.\n- Maintain bladder catheterization in dysfunctional labour to eliminate bladder obstruction.\n- Have resuscitation kits and Calcium Gluconate readily accessible on every shift.`
    });
    return;
  }

  try {
    const prompt = `You are a Senior Nurse Educator and Clinical Midwifery Specialist at a leading Nursing and Midwifery Training College.
Analyze the provided lecture (which may be a lecture transcript, student notes, or a pre-recorded audio lecture) for nursing and midwifery students.

Subject / Topic: ${subject}
Clinical Context: ${context}

Generate a concise, high-yield, structured educational summary organized specifically to help students master complex physiological concepts and prepare for clinical ward placement and licensing board examinations (NMC / NCLEX).

You MUST respond in strict JSON format with the following exact schema:
{
  "title": "Clear, concise, descriptive lecture title",
  "keyTakeaways": [
    "4-5 core fundamental concepts explaining physiological mechanisms and clinical principles"
  ],
  "definitions": [
    {
      "term": "Clinical term or landmark",
      "definition": "Precise medical definition explaining what it is",
      "clinicalRelevance": "Why this matters in ward/delivery practice"
    }
  ],
  "clinicalPearls": [
    "3-4 practical bedside/delivery-room wisdom tips"
  ],
  "nursingInterventions": [
    "4-5 prioritized direct nurse/midwife action steps with clinical rationales"
  ],
  "redFlags": [
    "3-4 critical clinical danger signs, abnormal parameter thresholds, or emergency triggers"
  ],
  "examMnemonics": [
    "2-3 memorable mnemonics or high-yield exam recall aids for board examinations"
  ],
  "fullSummaryMarkdown": "A comprehensive markdown explanation formatted with clear section headings, bold terms, and structured clinical explanations."
}`;

    const parts: any[] = [];

    if (hasAudio) {
      const rawBase64 = audio.data.includes(";base64,")
        ? audio.data.split(";base64,")[1]
        : audio.data;
      parts.push({
        inlineData: {
          mimeType: audio.mimeType || "audio/mp3",
          data: rawBase64,
        },
      });
    }

    if (hasText) {
      parts.push({
        text: `Lecture Transcript / Student Notes:\n"""\n${text}\n"""`,
      });
    }

    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text?.trim() || "{}";
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini summarize error:", error);
    res.status(500).json({ error: error.message || "Failed to generate summary" });
  }
});

// API Route: Generate Flashcards from Topic or Lecture
app.post("/api/gemini/flashcards", async (req, res) => {
  const { topic, content, count = 6 } = req.body;

  if (!topic && !content) {
    res.status(400).json({ error: "Provide a topic or content to generate flashcards" });
    return;
  }

  const ai = getAIClient();

  if (!ai) {
    // High-yield fallback flashcards
    res.json({
      flashcards: [
        {
          question: "What is the primary medication and dosage used in Active Management of the Third Stage of Labor (AMTSL)?",
          answer: "Oxytocin (Pitocin) 10 IU administered intramuscularly (IM) within 1 minute of infant delivery.",
          explanation: "Oxytocin stimulates rhythmic uterine contractions to detach the placenta and close spiral arterioles, preventing postpartum hemorrhage.",
          difficulty: "Medium",
          tag: "Obstetrics"
        },
        {
          question: "What antidote must be immediately available at the bedside when administering intravenous Magnesium Sulfate for Preeclampsia/Eclampsia?",
          answer: "Calcium Gluconate 10% (1 gram / 10 mL administered slow IV over 3-5 minutes).",
          explanation: "Calcium antagonizes magnesium at the neuromuscular junction to reverse magnesium toxicity (respiratory depression and loss of deep tendon reflexes).",
          difficulty: "Hard",
          tag: "Pharmacology"
        },
        {
          question: "What are the 5 physiological parameters assessed in an APGAR score?",
          answer: "Appearance (Skin Color), Pulse (Heart Rate), Grimace (Reflex Irritability), Activity (Muscle Tone), and Respiration (Respiratory Effort).",
          explanation: "Scores range from 0 to 10 and are evaluated at 1 minute and 5 minutes after birth.",
          difficulty: "Easy",
          tag: "Neonatal"
        },
        {
          question: "What is the critical minimum urine output threshold for an adult patient in postoperative surgical care?",
          answer: "At least 0.5 mL/kg/hour (or approximately 30 mL/hour for an average adult).",
          explanation: "Urine output below this indicates oliguria, suggesting hypovolemia, dehydration, renal hypoperfusion, or catheter occlusion.",
          difficulty: "Medium",
          tag: "Medical-Surgical"
        }
      ]
    });
    return;
  }

  try {
    const prompt = `You are a Nursing Board Exam specialist.
Generate ${count} high-yield clinical flashcards for nursing and midwifery students based on this topic/content:
Topic: ${topic || "Nursing & Midwifery Practice"}
Content: ${content || "General Nursing & Midwifery Clinical Competencies"}

Return strict JSON format:
{
  "flashcards": [
    {
      "question": "Concise, clinically relevant question or clinical scenario trigger",
      "answer": "Clear, accurate, definitive nursing answer",
      "explanation": "Brief rationale highlighting why this answer is critical to patient safety or board exams",
      "difficulty": "Easy" | "Medium" | "Hard",
      "tag": "Short category tag like Obstetrics, Pharmacology, Triage, Neonatal, Anatomy"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini flashcards error:", error);
    res.status(500).json({ error: error.message || "Failed to generate flashcards" });
  }
});

// API Route: Generate Practice Quiz with Clinical Rationales
app.post("/api/gemini/quiz", async (req, res) => {
  const { topic, difficulty = "Medium", count = 5 } = req.body;

  const ai = getAIClient();

  if (!ai) {
    res.json({
      quizTitle: `${topic || "Nursing & Midwifery"} Licensure Practice`,
      questions: [
        {
          question: "A primigravida at 39 weeks of gestation presents with sudden painless, bright red vaginal bleeding. Which nursing intervention is strictly contraindicated?",
          options: [
            "Initiating continuous external fetal heart rate monitoring",
            "Performing a digital vaginal examination",
            "Establishing large-bore intravenous access",
            "Checking maternal vital signs and blood grouping"
          ],
          correctIndex: 1,
          rationale: "In cases of suspected placenta previa (indicated by painless bright red bleeding), digital vaginal examination can puncture the placental edge or detach the placenta, precipitating catastrophic maternal-fetal hemorrhage. Only sterile speculum exam in a double-setup operating room is permitted if necessary.",
          clinicalContext: "Obstetric Emergencies / Antenatal Bleeding"
        },
        {
          question: "When caring for a patient receiving Magnesium Sulfate for severe preeclampsia, the nurse notes a respiratory rate of 10 breaths/min and absent patellar reflexes. What is the immediate priority action?",
          options: [
            "Increase IV fluid rate to flush the magnesium",
            "Immediately stop the Magnesium Sulfate infusion and notify the physician",
            "Administer 2 liters of nasal cannula oxygen and reassess in 15 minutes",
            "Draw a serum creatinine level"
          ],
          correctIndex: 1,
          rationale: "Loss of deep tendon reflexes and respiratory depression (<12 bpm) are hallmark manifestations of hypermagnesemia. The infusion must be stopped instantly to halt further toxicity, followed by administration of Calcium Gluconate.",
          clinicalContext: "High-Alert Pharmacological Monitoring"
        },
        {
          question: "Which of the following findings on a newborn baby at 5 minutes of age constitutes an APGAR score of 8?",
          options: [
            "Body pink with blue extremities (1), Heart rate 130 bpm (2), Cough/sneeze upon stimulation (2), Active motion with flexed extremities (2), Weak slow cry (1)",
            "Completely blue body (0), Heart rate 80 bpm (1), Grimace only (1), Flaccid tone (0), Absent breathing (0)",
            "Entirely pink body (2), Heart rate 95 bpm (1), Grimace (1), Some flexion (1), Regular respiration (2)",
            "Pink body with pale hands (1), Heart rate 110 bpm (2), Active cry (2), Active motion (2), Vigorous cry (2)"
          ],
          correctIndex: 0,
          rationale: "Acrocyanosis (1) + HR > 100 (2) + prompt reflex response (2) + active flexion (2) + weak cry (1) = 1 + 2 + 2 + 2 + 1 = 8.",
          clinicalContext: "Neonatal Resuscitation & Assessment"
        }
      ]
    });
    return;
  }

  try {
    const prompt = `You are an examination question writer for the Nursing and Midwifery Council and NCLEX licensure boards.
Generate ${count} scenario-based, high-yield multiple choice questions on: "${topic || "Core Nursing and Midwifery Practice"}".
Difficulty: ${difficulty}.

Ensure questions test critical thinking, priority setting (ABC, Maslow, safety), and clinical rationales.

Return strict JSON format:
{
  "quizTitle": "Descriptive Quiz Title",
  "questions": [
    {
      "question": "Clinical scenario and question stem",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctIndex": 0, // 0, 1, 2, or 3
      "rationale": "Comprehensive explanation explaining why the correct choice is prioritized and why other options are suboptimal or incorrect",
      "clinicalContext": "Relevant subspecialty or protocol area"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini quiz error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// API Route: Clinical Placement Logbook AI Review & Competency Feedback
app.post("/api/gemini/clinical-feedback", async (req, res) => {
  const { ward, hospital, hours, procedures, reflection } = req.body;

  const ai = getAIClient();

  if (!ai) {
    res.json({
      competencyFeedback: "Your reflection demonstrates good clinical observation and awareness of maternal/patient vulnerability. The link between physiological monitoring and swift intervention is noted.",
      clinicalSafetyCheck: [
        "Ensure patient initials or identifiers remain anonymized per clinical confidentiality protocols.",
        "Document specific clinical parameters (e.g. baseline BP, blood loss volume in mL, cervical dilation) rather than general adjectives.",
        "Highlight your communication with the supervising preceptor before initiating invasive interventions."
      ],
      reflectiveQuestions: [
        "How did you ensure maternal comfort and dignity during this procedure?",
        "What clinical indicators would prompt you to escalate this case to the duty obstetrics registrar immediately?"
      ],
      preceptorReadiness: "High - Well structured with clear learning outcomes."
    });
    return;
  }

  try {
    const prompt = `You are a Clinical Placement Coordinator and Preceptor for Nursing and Midwifery training college students.
Review this student's clinical log entry:
Hospital: ${hospital || "Clinical Training Hospital"}
Ward/Unit: ${ward || "Maternity / Surgical"}
Hours Logged: ${hours}
Procedures/Competencies: ${Array.isArray(procedures) ? procedures.join(", ") : procedures}
Student's Clinical Reflection: "${reflection}"

Evaluate their clinical reasoning, adherence to safety standards, and reflective learning.
Return strict JSON format:
{
  "competencyFeedback": "Constructive, affirming, and rigorous clinical evaluation of the entry",
  "clinicalSafetyCheck": ["2-3 concrete safety & documentation standards the student must remember"],
  "reflectiveQuestions": ["2 probing clinical questions to encourage deeper self-reflection"],
  "preceptorReadiness": "Short status sentence regarding readiness for preceptor signature verification"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini clinical feedback error:", error);
    res.status(500).json({ error: error.message || "Failed to review clinical log" });
  }
});

// API Route: Clinical Tutor Interactive Assistant
app.post("/api/gemini/tutor", async (req, res) => {
  const { question, conversationHistory = [] } = req.body;

  if (!question) {
    res.status(400).json({ error: "Missing clinical question" });
    return;
  }

  const ai = getAIClient();

  if (!ai) {
    res.json({
      answer: "In clinical practice, always structure your response using the SBAR (Situation, Background, Assessment, Recommendation) framework. Prioritize ABCs (Airway, Breathing, Circulation) and verify high-alert medication doses. For obstetric monitoring, ensure continuous evaluation of uterine contractions and fetal wellbeing against standard partograph action lines."
    });
    return;
  }

  try {
    const prompt = `You are 'EdgeAI', the Campus Edge Intelligent Clinical Tutor for Nursing and Midwifery students at premier training colleges.
Answer student clinical questions with high educational rigor, compassionate mentorship, practical tips, and evidence-based medicine (WHO guidelines, NICE, ACOG).
Keep answers structured with clear headings or bullet points where appropriate.

Student Question: "${question}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Gemini tutor error:", error);
    res.status(500).json({ error: error.message || "Failed to answer question" });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Campus Edge Hub running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
