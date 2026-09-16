import {
  StudentProfile,
  CurriculumCourse,
  FlashcardDeck,
  Flashcard,
  ClinicalPlacementLog,
  ForumPost,
  ClinicalProtocol,
  LectureNote,
  AppNotification,
  ModuleProgressStat,
  QuizTrendData,
  FacilitatorProfile,
  VideoLecture,
  QuizQuestion,
  AuthUser,
  EnrolledStudentItem
} from "../types";

export const initialStudentProfile: StudentProfile = {
  id: "std-2026-084",
  name: "Ama Mensah",
  avatar: "/student-avatar.svg",
  college: "College of Nursing & Midwifery",
  program: "Dual Qualification: Registered Midwifery (RM) & General Nursing (RN)",
  primaryTrack: "dual",
  yearOfStudy: "",
  studentId: "NMC/CNM/24/0912",
  clinicalSite: "Ridge Regional Hospital - Maternity & Surgical Wards",
  clinicalHoursCompleted: 146,
  clinicalHoursRequired: 200,
  streakDays: 14,
  cardsMastered: 84,
  quizzesTaken: 19,
  averageQuizScore: 88,
  forumReputation: 320,
  registeredCourseIds: ["course-mid-201", "course-phar-204", "course-nur-201", "course-mid-204", "course-anat-101", "course-nur-101", "course-mid-205", "course-neo-102"],
  semesterFeePaid: 850
};

export const initialCourses: CurriculumCourse[] = [
  {
    id: "course-mid-201",
    code: "MID 201",
    title: "Normal and Abnormal Labour (Intrapartum)",
    department: "midwifery",
    category: "Obstetrics & Midwifery",
    credits: 4,
    semester: "2026/2027 Academic Session",
    instructor: "Principal Tutor Grace Osei (RM, MPhil)",
    description: "Systematic mastery of normal labour phases, WHO partograph plotting, foetal well-being monitoring, and active third stage management.",
    totalMilestones: 4,
    completedMilestones: 2,
    colorScheme: "sky",
    fees: {
      tuitionFee: 185,
      labFee: 45,
      councilExamFee: 25
    },
    schedule: "Mon & Wed 08:30 - 11:00 AM",
    clinicalHospitalSite: "Ridge Regional Hospital - Maternity Wing",
    prerequisites: ["MID 101", "ANAT 102"],
    capacity: 60,
    enrolledCount: 52,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-101",
        milestoneNumber: 1,
        title: "Physiological Stages of Labour & Admission Assessment",
        description: "Initial vaginal examination, pelvic assessment, amniotic membrane status, and maternal-foetal baseline observations.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "Leopold's Four Maneuvers palpation",
          "Pinard / Doppler foetal heart auscultation",
          "Pelvic inlet & outlet adequacy evaluation"
        ],
        badgeUnlocked: "Labour Room Initiate",
        steps: [
          {
            id: "s-101-1",
            title: "Lecture Summary: Active Phase vs Latent Phase Dynamics",
            type: "lecture_summary",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "Dilation thresholds, contraction frequency (duration > 40 sec), and maternal positioning techniques."
          },
          {
            id: "s-101-2",
            title: "Flashcard Drill: Pelvic Diameters & Presentation Types",
            type: "flashcard_drill",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "12 flashcards covering true conjugate, bispinous diameter, cephalic vs breech presentations."
          },
          {
            id: "s-101-3",
            title: "Clinical Checklist: Initial Maternal Triage & Consent Protocol",
            type: "clinical_checklist",
            estimatedMinutes: 10,
            completed: true,
            contentPreview: "Sterile speculum prep, maternal vital chart, foetal baseline verification."
          }
        ]
      },
      {
        id: "m-102",
        milestoneNumber: 2,
        title: "WHO Partograph Plotting & Alert / Action Line Protocols",
        description: "Graphing cervical dilation against time, recording liquor color, moulding grades, and identifying prolonged labour deviations.",
        weekNumber: 2,
        status: "completed",
        clinicalCompetencies: [
          "Accurate 4-hour alert line cervical plotting",
          "Uterine contraction grading (mild/moderate/strong)",
          "Maternal pulse, BP, and temperature hourly documentation"
        ],
        badgeUnlocked: "Partograph Specialist",
        steps: [
          {
            id: "s-102-1",
            title: "Interactive Lecture Note: The 4-Hour Action Line Standard",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "When the cervical dilation crosses the action line: notification of Obstetrician, oxytocin augmentation criteria."
          },
          {
            id: "s-102-2",
            title: "Case Quiz: Detecting Cephalopelvic Disproportion (CPD)",
            type: "case_quiz",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "5 clinical scenarios evaluating Caput succedaneum +++ and severe skull bone overlap."
          },
          {
            id: "s-102-3",
            title: "Flashcard Mastery: Liquor & Foetal Distress Indicators",
            type: "flashcard_drill",
            estimatedMinutes: 10,
            completed: true,
            contentPreview: "Meconium-stained liquor grading (Grade I, II, III) and sudden deceleration patterns."
          }
        ]
      },
      {
        id: "m-103",
        milestoneNumber: 3,
        title: "Active Management of the Third Stage of Labour (AMTSL)",
        description: "Uterotonic administration within 1 minute, controlled cord traction (Brandt-Andrews), and immediate uterine massage.",
        weekNumber: 3,
        status: "in_progress",
        clinicalCompetencies: [
          "Oxytocin 10 IU IM administration technique",
          "Counter-traction suprapubic placenta delivery",
          "Placental cotyledon & membrane completeness inspection"
        ],
        steps: [
          {
            id: "s-103-1",
            title: "Clinical Core: AMTSL 3-Step Protocol & Hemorrhage Prevention",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Reducing primary postpartum hemorrhage (PPH) risk by 60% through prompt uterotonic delivery."
          },
          {
            id: "s-103-2",
            title: "Flashcards: Second-line Uterotonics (Miso, Ergometrine, Carboprost)",
            type: "flashcard_drill",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Contraindications: Methergine in hypertensive mothers; Misoprostol sublingual 800mcg dosage."
          },
          {
            id: "s-103-3",
            title: "Case Simulation: Primary PPH Triage & Bimanual Compression",
            type: "case_quiz",
            estimatedMinutes: 20,
            completed: false,
            contentPreview: "Clinical decision tree when estimated blood loss exceeds 500 mL in vaginal birth."
          }
        ]
      },
      {
        id: "m-104",
        milestoneNumber: 4,
        title: "Immediate Newborn Care & APGAR Stabilization",
        description: "Thermoregulation (Skin-to-Skin), clearing airway without routine suctioning, cord clamping timing, and 1 & 5 min APGAR score.",
        weekNumber: 4,
        status: "available",
        clinicalCompetencies: [
          "Immediate drying and warmth maintenance",
          "Delayed cord clamping (1-3 minutes)",
          "Initiation of exclusive breastfeeding within 1st hour"
        ],
        steps: [
          {
            id: "s-104-1",
            title: "Lecture: Golden Minute of Neonatal Resuscitation",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Stimulation, positive pressure ventilation with room air (21% O2), heart rate evaluation."
          },
          {
            id: "s-104-2",
            title: "Flashcard Drill: APGAR 10-Point Score Grid",
            type: "flashcard_drill",
            estimatedMinutes: 10,
            completed: false,
            contentPreview: "Differentiating acrocyanosis from central cyanosis, scoring respiratory effort and reflex grimace."
          },
          {
            id: "s-104-3",
            title: "Clinical Placement Checklist: Neonatal Prophylaxis",
            type: "clinical_checklist",
            estimatedMinutes: 10,
            completed: false,
            contentPreview: "Vitamin K 1mg IM, Chlorhexidine 7.1% umbilical gel application, Eye erythromycin ointment."
          }
        ]
      }
    ]
  },
  {
    id: "course-phar-204",
    code: "PHAR 204",
    title: "Pharmacology",
    department: "nursing",
    category: "Pharmacology",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "PharmD Kwabena Boateng (Clinical Pharmacologist)",
    description: "Pharmacokinetics, teratogenicity categories, tocolytics, anti-hypertensives in pregnancy, and neonatal drug dosages.",
    totalMilestones: 3,
    completedMilestones: 1,
    colorScheme: "emerald",
    fees: {
      tuitionFee: 150,
      labFee: 35,
      councilExamFee: 20
    },
    schedule: "Tue & Thu 10:00 - 12:00 PM",
    clinicalHospitalSite: "Central Medical Stores & Maternity Pharmacy",
    prerequisites: ["PHAR 101"],
    capacity: 65,
    enrolledCount: 54,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-201",
        milestoneNumber: 1,
        title: "Hypertensive Crisis & Magnesium Sulfate Protocols",
        description: "Pritchard and Zuspan regimens for Severe Preeclampsia and Eclampsia prophylaxis.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "MgS04 loading dose reconstitution (4g IV + 10g IM)",
          "Deep tendon reflex, urine output (>30ml/hr), and respiratory checks",
          "Calcium Gluconate 10% reversal preparation"
        ],
        badgeUnlocked: "Eclampsia Shield",
        steps: [
          {
            id: "s-201-1",
            title: "Pharmacology Guide: Zuspan vs Pritchard Regimens",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Detailed calculation of loading dose and 4-hourly maintenance dosing."
          },
          {
            id: "s-201-2",
            title: "Flashcards: Toxicity Signs & Emergency Actions",
            type: "flashcard_drill",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "Patellar reflex suppression, flushing, respiratory depression reversal."
          },
          {
            id: "s-201-3",
            title: "Clinical Milestone Quiz: Antihypertensive Selection",
            type: "case_quiz",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Hydralazine, Labetalol, and Nifedipine titration algorithms."
          }
        ]
      },
      {
        id: "m-202",
        milestoneNumber: 2,
        title: "Tocolytics, Corticosteroids & Preterm Labor Management",
        description: "Betamethasone / Dexamethasone for fetal lung maturity; Nifedipine tocolysis guidelines.",
        weekNumber: 2,
        status: "in_progress",
        clinicalCompetencies: [
          "Dexamethasone 6mg IM 12-hourly for 4 doses timing",
          "Maternal blood glucose monitoring during steroid administration",
          "Tocolytic contraindications identification"
        ],
        steps: [
          {
            id: "s-202-1",
            title: "Lecture Note: Surfactant Induction in Gestation 24-34 Weeks",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Accelerating Type II pneumocyte maturation and reducing RDS, IVH, and NEC."
          },
          {
            id: "s-202-2",
            title: "Flashcards: Calcium Channel Blocker Tocolysis",
            type: "flashcard_drill",
            estimatedMinutes: 10,
            completed: false,
            contentPreview: "Nifedipine oral dosing, avoidance of concurrent magnesium hypotension risks."
          }
        ]
      },
      {
        id: "m-203",
        milestoneNumber: 3,
        title: "Antimicrobial Stewardship in Maternal & Neonatal Sepsis",
        description: "Empirical antibiotic regimens in Chorioamnionitis, Puerperal Sepsis, and Early Onset Neonatal Sepsis.",
        weekNumber: 3,
        status: "locked",
        clinicalCompetencies: [
          "Ampicillin + Gentamicin dosing and therapeutic monitoring",
          "Blood culture collection technique prior to antibiotic start"
        ],
        steps: [
          {
            id: "s-203-1",
            title: "Lecture Summary: WHO Sepsis 6 Protocol in Obstetrics",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Oxygen, blood cultures, IV antibiotics, fluid resuscitation, lactate check, hourly urine output."
          }
        ]
      }
    ]
  },
  {
    id: "course-med-210",
    code: "MED 210",
    title: "Clinical Nursing Skills & Aseptic Theatre Practice",
    department: "dual",
    category: "Medical-Surgical",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Senior Nurse Specialist Daniel Mensah (FWACN)",
    description: "Wound care, sterile catheterization, pre/post-operative surgical care, IV fluid balance, and emergency triage.",
    totalMilestones: 3,
    completedMilestones: 1,
    colorScheme: "indigo",
    fees: {
      tuitionFee: 140,
      labFee: 40,
      councilExamFee: 20
    },
    schedule: "Fri 08:30 AM - 12:30 PM",
    clinicalHospitalSite: "Surgical Theatre & Recovery Suite",
    prerequisites: ["NUR 101", "MED 102"],
    capacity: 75,
    enrolledCount: 62,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-301",
        milestoneNumber: 1,
        title: "Aseptic Non-Touch Technique (ANTT) & Surgical Hand Scrub",
        description: "Standard precautions, surgical gloving, open vs closed technique, and instrument count verification.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "5-minute surgical hand scrub sequence",
          "Sterile field maintenance during episiotomy / caesarean setup",
          "Surgical swab and sharps counting protocol"
        ],
        badgeUnlocked: "Sterile Field Master",
        steps: [
          {
            id: "s-301-1",
            title: "Lecture Note: WHO Surgical Safety Checklist",
            type: "lecture_summary",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "Sign-in, Time-out, and Sign-out multidisciplinary communication."
          },
          {
            id: "s-301-2",
            title: "Milestone Quiz: Asepsis & Cross-Infection Control",
            type: "case_quiz",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Evaluating breaches in sterile gowning and contact isolation protocols."
          }
        ]
      },
      {
        id: "m-302",
        milestoneNumber: 2,
        title: "Post-Operative Recovery & Caesarean Section Nursing Care",
        description: "Monitoring surgical site drains, early ambulation, deep vein thrombosis prophylaxis, and analgesia titration.",
        weekNumber: 2,
        status: "in_progress",
        clinicalCompetencies: [
          "Modified Early Warning Score (MEWS) recording",
          "Low Molecular Weight Heparin (LMWH) administration",
          "Assessment of surgical wound incision for wound dehiscence"
        ],
        steps: [
          {
            id: "s-302-1",
            title: "Lecture: Prevention of Postpartum Thromboembolism",
            type: "lecture_summary",
            estimatedMinutes: 14,
            completed: false,
            contentPreview: "Risk stratification (BMI, age, emergency cesarean), mechanical vs pharmacological prophylaxis."
          },
          {
            id: "s-302-2",
            title: "Flashcard Drill: Post-op Vital Signs & Pain Scoring",
            type: "flashcard_drill",
            estimatedMinutes: 10,
            completed: false,
            contentPreview: "Differentiating surgical wound pain from concealed internal bleeding."
          }
        ]
      }
    ]
  },
  {
    id: "course-nur-201",
    code: "NUR 201",
    title: "Medical-Surgical Nursing",
    department: "nursing",
    category: "Medical-Surgical",
    credits: 4,
    semester: "2026/2027 Academic Session",
    instructor: "Nurse Educator Faustina Darko (MSc, RN)",
    description: "Pathophysiology and holistic nursing management of adult disorders: cardiovascular, respiratory failure, diabetes mellitus, and pre/post-operative surgical care.",
    totalMilestones: 4,
    completedMilestones: 2,
    colorScheme: "blue",
    fees: {
      tuitionFee: 180,
      labFee: 40,
      councilExamFee: 25
    },
    schedule: "Tue & Thu 08:00 - 10:30 AM",
    clinicalHospitalSite: "Korle Bu Teaching Hospital - Medical Block 2",
    prerequisites: ["ANAT 101", "PHYS 102"],
    capacity: 80,
    enrolledCount: 68,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-nur201-1",
        milestoneNumber: 1,
        title: "Fluid, Electrolyte & Acid-Base Imbalances",
        description: "Arterial blood gas interpretation (ABG), hyperkalemia triage, and IV infusion rate calculations.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "ABG analysis: respiratory vs metabolic acidosis/alkalosis",
          "ECG changes in hyperkalemia (tall tented T waves)",
          "Micro-drip and macro-drip calculation accuracy"
        ],
        badgeUnlocked: "Electrolyte Master",
        steps: [
          {
            id: "s-nur201-1-1",
            title: "Core Lecture: ROME ABG Interpretation Algorithm",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Respiratory Opposite, Metabolic Equal quick determination table."
          },
          {
            id: "s-nur201-1-2",
            title: "Flashcard Drill: Electrolyte Normal Ranges & Symptoms",
            type: "flashcard_drill",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "Sodium, Potassium, Calcium (Chvostek & Trousseau signs), Magnesium."
          }
        ]
      },
      {
        id: "m-nur201-2",
        milestoneNumber: 2,
        title: "Diabetic Emergencies: DKA & HHS Management Protocol",
        description: "Pathology of insulin deficiency, fluid resuscitation guidelines, regular insulin sliding scale titration, and potassium monitoring.",
        weekNumber: 2,
        status: "completed",
        clinicalCompetencies: [
          "0.9% Normal Saline rehydration sequencing",
          "Subcutaneous vs IV regular insulin administration",
          "Urine ketone monitoring & bedside capillary glucose checking"
        ],
        badgeUnlocked: "Glycemic Sentinel",
        steps: [
          {
            id: "s-nur201-2-1",
            title: "Clinical Protocol: DKA First 4 Hours Fluid & Insulin Protocol",
            type: "clinical_checklist",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "K+ must be > 3.3 mEq/L before starting insulin infusion."
          }
        ]
      }
    ]
  },
  {
    id: "course-nur-205",
    code: "NUR 205",
    title: "Critical Care, Emergency Triage & Trauma Nursing",
    department: "nursing",
    category: "Emergency Triage",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Emergency Care Specialist Major K. Adjei (RN, CCRN)",
    description: "Advanced trauma life support nursing, Manchester Triage System, rapid sequence intubation assistance, cardiac arrest algorithms, and shock resuscitation.",
    totalMilestones: 3,
    completedMilestones: 0,
    colorScheme: "rose",
    fees: {
      tuitionFee: 165,
      labFee: 50,
      councilExamFee: 25
    },
    schedule: "Fri 01:00 - 04:30 PM (Simulation Lab)",
    clinicalHospitalSite: "Ridge Regional Hospital - Emergency Trauma ICU",
    prerequisites: ["NUR 201", "MED 210"],
    capacity: 50,
    enrolledCount: 42,
    isRegistered: false,
    registrationOpen: true,
    milestones: [
      {
        id: "m-nur205-1",
        milestoneNumber: 1,
        title: "Primary Trauma Survey (ABCDE) & Hemorrhagic Shock Triage",
        description: "Airway with cervical spine control, Breathing, Circulation with pelvic binder, Disability (GCS), Exposure.",
        weekNumber: 1,
        status: "available",
        clinicalCompetencies: [
          "Immediate application of direct pressure and CAT tourniquets",
          "Massive transfusion protocol (1:1:1 PRBC, FFP, Platelets)",
          "Rapid GCS assessment"
        ],
        steps: [
          {
            id: "s-nur205-1-1",
            title: "Lecture: Trauma Resuscitation Priorities",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Lethal triad in trauma: hypothermia, acidosis, coagulopathy."
          }
        ]
      }
    ]
  },
  {
    id: "course-ped-203",
    code: "PED 203",
    title: "Pediatric & Child Health Nursing",
    department: "nursing",
    category: "Pediatrics & Neonatal",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Pediatric Nurse Practitioner Joyce Appiah (MSc)",
    description: "Integrated Management of Childhood Illness (IMCI), pediatric dosage calculations, expanded programme on immunization (EPI), and severe malnutrition management.",
    totalMilestones: 3,
    completedMilestones: 0,
    colorScheme: "amber",
    fees: {
      tuitionFee: 155,
      labFee: 35,
      councilExamFee: 20
    },
    schedule: "Wed 01:30 - 04:30 PM",
    clinicalHospitalSite: "Princess Marie Louise Children's Hospital",
    prerequisites: ["NUR 101"],
    capacity: 65,
    enrolledCount: 58,
    isRegistered: false,
    registrationOpen: true,
    milestones: [
      {
        id: "m-ped203-1",
        milestoneNumber: 1,
        title: "IMCI Triage: Danger Signs & Severe Pneumonia",
        description: "Inability to feed, lethargy, stridor in calm child, chest indrawing, and rapid respiratory rates by age group.",
        weekNumber: 1,
        status: "available",
        clinicalCompetencies: [
          "Counting respiratory rate for 60 full seconds in calm child",
          "Pediatric weight-based dose calculations (mg/kg/day)",
          "Mid-Upper Arm Circumference (MUAC) malnutrition staging"
        ],
        steps: [
          {
            id: "s-ped203-1-1",
            title: "Lecture Summary: WHO IMCI Color-Coded Triage",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Pink (urgent referral), Yellow (specific medical treatment), Green (home supportive care)."
          }
        ]
      }
    ]
  },
  {
    id: "course-mid-204",
    code: "MID 204",
    title: "Normal and Abnormal Pregnancy (Antenatal)",
    department: "midwifery",
    category: "Obstetrics & Midwifery",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Senior Midwifery Officer Veronica Mensah (BSc, RM)",
    description: "WHO 8-contact positive pregnancy experience model, screening for gestational diabetes, Rh-incompatibility, fetal growth restriction, and placenta praevia.",
    totalMilestones: 3,
    completedMilestones: 1,
    colorScheme: "teal",
    fees: {
      tuitionFee: 170,
      labFee: 40,
      councilExamFee: 25
    },
    schedule: "Tue 11:00 AM - 02:00 PM",
    clinicalHospitalSite: "Greater Accra Regional Hospital - Antenatal Clinic",
    prerequisites: ["MID 201"],
    capacity: 60,
    enrolledCount: 49,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-mid204-1",
        milestoneNumber: 1,
        title: "First Trimester Screening & Obstetric Risk Profiling",
        description: "Ultrasound dating, hemoglobin screening, IPTp-SP malaria prophylaxis, and iron-folic acid supplementation.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "Symphysio-fundal height (SFH) measurement in cm",
          "Obstetric history taking & gravida/parity calculation",
          "Rhesus D negative anti-D prophylaxis counseling"
        ],
        badgeUnlocked: "Antenatal Guardian",
        steps: [
          {
            id: "s-mid204-1-1",
            title: "Lecture: WHO 8-Contact ANC Schedule",
            type: "lecture_summary",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "Contact timing: 12 weeks, 20, 26, 30, 34, 36, 38, and 40 weeks."
          }
        ]
      }
    ]
  },
  {
    id: "course-neo-102",
    code: "NEO 102",
    title: "Neonatal Care",
    department: "midwifery",
    category: "Pediatrics & Neonatal",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Neonatal Nurse Specialist Sister Beatrice Yeboah (RM, NICU)",
    description: "Kangaroo Mother Care (KMC) for low birth weight infants, neonatal jaundice phototherapy, CPAP maintenance, and neonatal sepsis management.",
    totalMilestones: 3,
    completedMilestones: 0,
    colorScheme: "cyan",
    fees: {
      tuitionFee: 160,
      labFee: 45,
      councilExamFee: 20
    },
    schedule: "Thu 01:30 - 04:30 PM",
    clinicalHospitalSite: "Korle Bu Neonatal Intensive Care Unit",
    prerequisites: ["MID 201"],
    capacity: 45,
    enrolledCount: 38,
    isRegistered: false,
    registrationOpen: true,
    milestones: [
      {
        id: "m-neo102-1",
        milestoneNumber: 1,
        title: "Kangaroo Mother Care (KMC) & Preterm Thermoregulation",
        description: "Continuous skin-to-skin contact, thermal insulation, early exclusive breast milk feeding, and infection prevention in LBW babies < 2.5 kg.",
        weekNumber: 1,
        status: "available",
        clinicalCompetencies: [
          "Correct positioning of neonate in upright frog posture",
          "Cup feeding technique for preterm infants",
          "Axillary temperature stabilization (36.5 - 37.5 C)"
        ],
        steps: [
          {
            id: "s-neo102-1-1",
            title: "Lecture: KMC Evidence & Survival Benefits",
            type: "lecture_summary",
            estimatedMinutes: 14,
            completed: false,
            contentPreview: "Decreasing neonatal hypothermia, sepsis, and hospital stay by over 40%."
          }
        ]
      }
    ]
  },
  {
    id: "course-eth-101",
    code: "ETH 101",
    title: "Nursing & Midwifery Professional Ethics & Medico-Legal Practice",
    department: "dual",
    category: "Foundations & Ethics",
    credits: 2,
    semester: "2026/2027 Academic Session",
    instructor: "Barrister & Nurse Ethicist Dr. Kofi Mensah (Esq., RN)",
    description: "NMC Code of Conduct, patient consent, confidentiality, duty of care, negligence vs malpractice, documentation as legal defence, and conscientious objection in reproductive health.",
    totalMilestones: 2,
    completedMilestones: 1,
    colorScheme: "purple",
    fees: {
      tuitionFee: 110,
      labFee: 15,
      councilExamFee: 20
    },
    schedule: "Mon 02:00 - 04:00 PM",
    clinicalHospitalSite: "Lecture Theatre B / NMC Ethics Board Room",
    prerequisites: [],
    capacity: 120,
    enrolledCount: 94,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-eth101-1",
        milestoneNumber: 1,
        title: "Informed Consent & Medico-Legal Documentation",
        description: "The four principles of bioethics: Autonomy, Beneficence, Non-maleficence, and Justice. Defensible contemporaneous clinical charting.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "Emergency obstetric consent under doctrine of necessity",
          "Error correction protocol in nursing kardex (single strikethrough, date & signature)",
          "Incident reporting and root cause disclosure"
        ],
        badgeUnlocked: "Ethical Advocate",
        steps: [
          {
            id: "s-eth101-1-1",
            title: "Lecture Note: NMC Code of Professional Conduct",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Accountability to the patient, the council, and the multidisciplinary healthcare team."
          }
        ]
      }
    ]
  },
  {
    id: "course-anat-101",
    code: "ANAT 101",
    title: "Anatomy and Physiology",
    department: "nursing",
    category: "Anatomy & Foundations",
    credits: 4,
    semester: "2026/2027 Academic Session",
    instructor: "Senior Anatomist Dr. Emmanuel Baah (MBChB, MSc)",
    description: "Systematic exploration of human macroscopic anatomy and cellular physiology: cardiovascular dynamics, renal-nephron homeostasis, respiratory gas exchange, and neuro-endocrine regulation.",
    totalMilestones: 3,
    completedMilestones: 1,
    colorScheme: "indigo",
    fees: {
      tuitionFee: 175,
      labFee: 45,
      councilExamFee: 25
    },
    schedule: "Mon & Wed 10:00 AM - 12:30 PM",
    clinicalHospitalSite: "Anatomy & Physiology Simulation Cadaver Lab",
    prerequisites: ["BIOL 101"],
    capacity: 70,
    enrolledCount: 65,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-anat-1",
        milestoneNumber: 1,
        title: "Cardiovascular Dynamics, Cardiac Cycle & Blood Pressures",
        description: "Anatomy of the 4 cardiac chambers, coronary circulation, electrical conduction pathway (SA/AV node), and arterial blood pressure mechanics.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "Cardiac auscultation landmarks (Aortic, Pulmonic, Tricuspid, Mitral)",
          "Correlating ECG waveform (P-QRS-T) with mechanical systole and diastole",
          "Calculations of Mean Arterial Pressure (MAP) and Cardiac Output (CO = HR x SV)"
        ],
        badgeUnlocked: "Cardiac Anatomist",
        steps: [
          {
            id: "s-anat-1-1",
            title: "Lecture Note: Cardiac Electrical Conduction & Frank-Starling Law",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Intrinsically generated impulses, depolarisation vectors, and myocardial contractility limits."
          },
          {
            id: "s-anat-1-2",
            title: "Flashcard Drill: Coronary Artery Pathways & Valve Auscultation",
            type: "flashcard_drill",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "Left anterior descending artery supply vs right coronary artery and S1/S2 heart sound generation."
          },
          {
            id: "s-anat-1-3",
            title: "Case Quiz: Hemodynamic Calculation Scenarios",
            type: "case_quiz",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Calculating ejection fraction, vascular resistance indices, and clinical hypovolemia responses."
          }
        ]
      },
      {
        id: "m-anat-2",
        milestoneNumber: 2,
        title: "Renal Mechanics, Nephron Filtration & Fluid-Electrolyte Equilibrium",
        description: "Glomerular filtration rate (GFR), counter-current multiplier system in the loop of Henle, aldosterone/ADH fluid retention, and acid-base buffers.",
        weekNumber: 2,
        status: "in_progress",
        clinicalCompetencies: [
          "Renin-Angiotensin-Aldosterone System (RAAS) clinical cascade",
          "Interpretation of serum Osmolality and Creatinine Clearance",
          "Arterial Blood Gas (ABG) metabolic vs respiratory acidosis differentials"
        ],
        steps: [
          {
            id: "s-anat-2-1",
            title: "Interactive Guide: Nephron Tubule Transport Mechanics",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Proximal convoluted tubule reabsorption of glucose, Na+/K+ ATPase, and loop diuretics action sites."
          },
          {
            id: "s-anat-2-2",
            title: "Clinical Checklist: 24-Hour Fluid Balance & Electrolyte Charting",
            type: "clinical_checklist",
            estimatedMinutes: 10,
            completed: false,
            contentPreview: "Normal urine output (>0.5 mL/kg/hr), specific gravity ranges (1.005-1.030), and insensible losses."
          }
        ]
      },
      {
        id: "m-anat-3",
        milestoneNumber: 3,
        title: "Neuro-Endocrine Feedback Loops & Autonomic Control",
        description: "Sympathetic vs parasympathetic nervous balance, hypothalamic-pituitary axis hormones, and cellular metabolic regulation.",
        weekNumber: 3,
        status: "locked",
        clinicalCompetencies: [
          "Autonomic crisis recognition (tachycardia, diaphoresis, pupil dilation)",
          "Thyroid hormone (T3/T4) and cortisol circadian rhythm evaluation"
        ],
        steps: [
          {
            id: "s-anat-3-1",
            title: "Lecture: The Hypothalamic-Pituitary-Adrenal (HPA) Axis",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Stress response, ACTH release, negative feedback inhibition, and Addisonian crisis prevention."
          }
        ]
      }
    ]
  },
  {
    id: "course-nur-101",
    code: "NUR 101",
    title: "Nursing Fundamentals",
    department: "nursing",
    category: "Foundations & Ethics",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Principal Nursing Tutor Faustina Ofori (RN, FWACN)",
    description: "Foundations of patient-centered nursing care: the 5-step nursing process (ADPIE), vital signs surveillance, clinical Kardex charting, aseptic technique, bed-side safety, and pressure injury prevention.",
    totalMilestones: 3,
    completedMilestones: 2,
    colorScheme: "emerald",
    fees: {
      tuitionFee: 150,
      labFee: 40,
      councilExamFee: 20
    },
    schedule: "Tue & Thu 08:30 - 11:00 AM",
    clinicalHospitalSite: "Clinical Skills Nursing Demonstration Ward",
    prerequisites: [],
    capacity: 80,
    enrolledCount: 74,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-nur101-1",
        milestoneNumber: 1,
        title: "The Nursing Process (ADPIE) & Evidence-Based Kardex Care Plans",
        description: "Assessment, Diagnosis (NANDA-I), Planning (SMART goals), Implementation, and Evaluation with standardized contemporaneous clinical records.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "Formulating NANDA nursing diagnoses with etiology and defining characteristics",
          "Setting measurable patient outcomes within specified shift timeframes",
          "SOAPIE format progress note charting"
        ],
        badgeUnlocked: "Care Plan Architect",
        steps: [
          {
            id: "s-nur101-1-1",
            title: "Lecture Note: Writing Defensible NANDA Nursing Diagnoses",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Problem-focused vs risk diagnoses and avoiding medical diagnosis phrasing."
          },
          {
            id: "s-nur101-1-2",
            title: "Flashcards: ADPIE Sequencing & Clinical Prioritization",
            type: "flashcard_drill",
            estimatedMinutes: 10,
            completed: true,
            contentPreview: "Maslow hierarchy of needs and ABC priority in acute patient assignments."
          }
        ]
      },
      {
        id: "m-nur101-2",
        milestoneNumber: 2,
        title: "Vital Signs Surveillance, Clinical Curves & Early Warning Scores (NEWS2)",
        description: "Continuous monitoring of temperature, pulse volume, respiratory rhythm, blood pressure cuff sizing, and oxygen saturation.",
        weekNumber: 2,
        status: "completed",
        clinicalCompetencies: [
          "Calculating National Early Warning Score (NEWS2) escalation triggers",
          "Orthostatic hypotension measurement (supine to standing BP/pulse)",
          "Manual pulse deficit auscultation with simultaneous radial palpation"
        ],
        badgeUnlocked: "Vitals Guardian",
        steps: [
          {
            id: "s-nur101-2-1",
            title: "Clinical Checklist: NEWS2 Rapid Escalation Protocol",
            type: "clinical_checklist",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "Trigger thresholds: score 5-6 urgent medical review; score 7+ emergency medical team call."
          },
          {
            id: "s-nur101-2-2",
            title: "Case Quiz: Hemodynamic Deterioration Scenarios",
            type: "case_quiz",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Detecting septic shock early signs and compensatory tachycardia."
          }
        ]
      },
      {
        id: "m-nur101-3",
        milestoneNumber: 3,
        title: "Asepsis, Hand Hygiene & Braden Scale Pressure Injury Prevention",
        description: "WHO 5 Moments for Hand Hygiene, sterile dressing changes, patient repositioning schedules (every 2 hours), and staging pressure injuries (Stage 1-4).",
        weekNumber: 3,
        status: "in_progress",
        clinicalCompetencies: [
          "Braden Scale risk assessment scoring (<12 high risk)",
          "Sterile field preparation without border contamination",
          "Waterlow / Braden pressure-relieving mattress selection"
        ],
        steps: [
          {
            id: "s-nur101-3-1",
            title: "Lecture Note: WHO 5 Moments for Hand Hygiene & ANTT Standards",
            type: "lecture_summary",
            estimatedMinutes: 12,
            completed: false,
            contentPreview: "Before patient contact, before aseptic procedure, after body fluid exposure, after patient contact, after surroundings."
          }
        ]
      }
    ]
  },
  {
    id: "course-nur-103",
    code: "NUR 103",
    title: "Health Assessment",
    department: "nursing",
    category: "Clinical Assessment",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Clinical Preceptor Samuel Quaye (MSc, RN)",
    description: "Systematic head-to-toe clinical examination: history taking, inspection, palpation, percussion, auscultation, cranial nerve assessments, and documentation of objective clinical findings.",
    totalMilestones: 3,
    completedMilestones: 1,
    colorScheme: "sky",
    fees: {
      tuitionFee: 160,
      labFee: 45,
      councilExamFee: 20
    },
    schedule: "Wed & Fri 09:00 - 11:30 AM",
    clinicalHospitalSite: "Outpatient Assessment Diagnostic Clinic",
    prerequisites: ["ANAT 101"],
    capacity: 65,
    enrolledCount: 57,
    isRegistered: false,
    registrationOpen: true,
    milestones: [
      {
        id: "m-nur103-1",
        milestoneNumber: 1,
        title: "Cephalocaudal Head-to-Toe Physical Assessment Protocols",
        description: "Comprehensive subjective health history (PQRST pain assessment), general survey, mental status, and systematic physical examination sequence.",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "PQRST pain staging (Provokes, Quality, Radiates, Severity 1-10, Timing)",
          "PERRLA pupillary light reflex and accommodation test",
          "Skin turgor and peripheral capillary refill (< 2 seconds)"
        ],
        badgeUnlocked: "Assessment Clinician",
        steps: [
          {
            id: "s-nur103-1-1",
            title: "Lecture Summary: The 4 Physical Assessment Pillars",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: true,
            contentPreview: "Inspection, Palpation, Percussion, Auscultation (with abdominal exception: inspect, auscultate, percuss, palpate)."
          },
          {
            id: "s-nur103-1-2",
            title: "Flashcards: 12 Cranial Nerves Functional Testing",
            type: "flashcard_drill",
            estimatedMinutes: 12,
            completed: true,
            contentPreview: "CN I through XII rapid bedside bedside screening techniques."
          }
        ]
      },
      {
        id: "m-nur103-2",
        milestoneNumber: 2,
        title: "Thoracic Auscultation: Normal vs Adventitious Breath Sounds",
        description: "Vesicular, bronchial, bronchovesicular breath sounds, fine and coarse crackles, wheezes, pleural friction rubs, and stridor.",
        weekNumber: 2,
        status: "available",
        clinicalCompetencies: [
          "Systematic ladder auscultation pattern across anterior and posterior thorax",
          "Differentiating pulmonary edema crackles from asthmatic wheezing",
          "Vocal resonance and tactile fremitus evaluation"
        ],
        steps: [
          {
            id: "s-nur103-2-1",
            title: "Lecture Note: Adventitious Lung Sounds & Clinical Differentials",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "High-pitched expiratory wheeze in bronchospasm vs bibasilar inspiratory crackles in congestive heart failure."
          }
        ]
      },
      {
        id: "m-nur103-3",
        milestoneNumber: 3,
        title: "Abdominal Staging, Quadrant Palpation & Vascular Auscultation",
        description: "Dividing abdomen into 4 quadrants / 9 regions, bowel sound motility, light vs deep palpation, McBurney's point tenderness, and Murphy's sign.",
        weekNumber: 3,
        status: "locked",
        clinicalCompetencies: [
          "Auscultating aortic, renal, and iliac bruits",
          "Rebound tenderness assessment in suspected peritonitis"
        ],
        steps: [
          {
            id: "s-nur103-3-1",
            title: "Clinical Checklist: Acute Abdomen Nursing Assessment",
            type: "clinical_checklist",
            estimatedMinutes: 12,
            completed: false,
            contentPreview: "Guarding, rigidity, absent bowel sounds for 5 continuous minutes protocol."
          }
        ]
      }
    ]
  },
  {
    id: "course-nur-208",
    code: "NUR 208",
    title: "Mental Health Nursing",
    department: "nursing",
    category: "Mental Health & Behavioral",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Senior Psychiatric Nurse Specialist Kwesi Nyarko (MSc, RMN)",
    description: "Therapeutic communication skills, comprehensive Mental State Examination (MSE), mood and psychotic disorders, substance abuse emergencies, non-violent crisis de-escalation, and psychiatric pharmacotherapy.",
    totalMilestones: 3,
    completedMilestones: 0,
    colorScheme: "purple",
    fees: {
      tuitionFee: 155,
      labFee: 30,
      councilExamFee: 20
    },
    schedule: "Thu 01:00 - 04:00 PM",
    clinicalHospitalSite: "Accra Psychiatric Hospital - Acute Assessment Ward",
    prerequisites: ["NUR 101"],
    capacity: 60,
    enrolledCount: 51,
    isRegistered: false,
    registrationOpen: true,
    milestones: [
      {
        id: "m-nur208-1",
        milestoneNumber: 1,
        title: "Therapeutic Communication & The 10-Point Mental State Examination (MSE)",
        description: "Appearance, behavior, speech, mood/affect, thought form/content, perception, cognition, insight, and judgment.",
        weekNumber: 1,
        status: "available",
        clinicalCompetencies: [
          "Conducting a structured Mental State Examination (MSE)",
          "Therapeutic active listening without premature reassurance",
          "Suicide risk assessment and Columbia-Suicide Severity Rating Scale (C-SSRS)"
        ],
        steps: [
          {
            id: "s-nur208-1-1",
            title: "Lecture Summary: Components of the Clinical MSE",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Differentiating formal thought disorder (flight of ideas, loosening of associations) from normal speech."
          },
          {
            id: "s-nur208-1-2",
            title: "Case Quiz: Suicide Risk Triage & Immediate Safety Measures",
            type: "case_quiz",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Direct inquiry, 1:1 continuous observation nursing care, and environmental safety sweeps."
          }
        ]
      },
      {
        id: "m-nur208-2",
        milestoneNumber: 2,
        title: "Schizophrenia, Bipolar Disorder & Antipsychotic Nursing Management",
        description: "Positive vs negative symptoms, typical vs atypical antipsychotics (Haloperidol, Olanzapine), Extrapyramidal Symptoms (EPS), and Neuroleptic Malignant Syndrome (NMS).",
        weekNumber: 2,
        status: "locked",
        clinicalCompetencies: [
          "Recognizing acute dystonia and administering Benztropine / Promethazine",
          "Detecting Neuroleptic Malignant Syndrome (fever, muscle rigidity, autonomic instability)"
        ],
        steps: [
          {
            id: "s-nur208-2-1",
            title: "Pharmacology Note: Antipsychotic Side Effect Triad",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Akathisia, tardive dyskinesia, metabolic syndrome monitoring, and CBC checks for clozapine agranulocytosis."
          }
        ]
      },
      {
        id: "m-nur208-3",
        milestoneNumber: 3,
        title: "Psychiatric Crisis De-escalation & Mental Health Act Rights",
        description: "Verbal de-escalation hierarchy, least restrictive environment principle, safe restraint guidelines, and patient advocacy under Mental Health legislation.",
        weekNumber: 3,
        status: "locked",
        clinicalCompetencies: [
          "Non-verbal positioning (45-degree angle, maintaining 2 arm lengths)",
          "Debriefing post-incident with patient and clinical team"
        ],
        steps: [
          {
            id: "s-nur208-3-1",
            title: "Clinical Protocol: Verbal De-escalation 10 Domains",
            type: "clinical_checklist",
            estimatedMinutes: 12,
            completed: false,
            contentPreview: "Respecting personal space, establishing verbal contact, identifying wants and feelings, setting clear limits."
          }
        ]
      }
    ]
  },
  {
    id: "course-mid-205",
    code: "MID 205",
    title: "Puerperium (Postpartum Care)",
    department: "midwifery",
    category: "Obstetrics & Midwifery",
    credits: 3,
    semester: "2026/2027 Academic Session",
    instructor: "Senior Midwife Specialist Akosua Dankwah (BSc, RM)",
    description: "Clinical surveillance during the 6-week postnatal period: uterine involution, fundal height descent, lochia staging, secondary PPH, puerperal sepsis, lactation management, and maternal postnatal mental health.",
    totalMilestones: 3,
    completedMilestones: 1,
    colorScheme: "rose",
    fees: {
      tuitionFee: 165,
      labFee: 40,
      councilExamFee: 20
    },
    schedule: "Mon & Thu 02:00 - 04:30 PM",
    clinicalHospitalSite: "Postnatal Ward & Child Welfare Clinic",
    prerequisites: ["MID 201"],
    capacity: 60,
    enrolledCount: 53,
    isRegistered: true,
    registrationOpen: true,
    milestones: [
      {
        id: "m-mid205-1",
        milestoneNumber: 1,
        title: "Physiological Involution & Lochia Staging (Rubra, Serosa, Alba)",
        description: "Fundal descent (1 fingerbreadth per day), uterine tone, lochia color/odor/volume, perineal healing (REEDA scale: Redness, Edema, Ecchymosis, Discharge, Approximation).",
        weekNumber: 1,
        status: "completed",
        clinicalCompetencies: [
          "Palpating fundus to ensure contracted, hard, midline consistency",
          "Differentiating normal lochia odor from foul-smelling lochia in endometritis",
          "REEDA scale evaluation of episiotomy / perineal tear repair"
        ],
        badgeUnlocked: "Postnatal Guardian",
        steps: [
          {
            id: "s-mid205-1-1",
            title: "Lecture Note: Puerperal Involution Timeline & Hormonal Shifts",
            type: "lecture_summary",
            estimatedMinutes: 14,
            completed: true,
            contentPreview: "Oxytocin uterine contractions, prolactin lactation induction, and rapid fall of estrogen/progesterone."
          },
          {
            id: "s-mid205-1-2",
            title: "Clinical Checklist: REEDA Perineal Healing Inspection",
            type: "clinical_checklist",
            estimatedMinutes: 10,
            completed: true,
            contentPreview: "Assessing wound edge approximation, signs of hematoma, and cold pack / sitz bath management."
          }
        ]
      },
      {
        id: "m-mid205-2",
        milestoneNumber: 2,
        title: "Puerperal Sepsis, Secondary PPH & Modified Obstetric Early Warning (MEOWS)",
        description: "Postpartum temperature >= 38 C after first 24 hours, retained placental fragments, subinvolution, broad-spectrum IV antibiotic therapy, and bimanual compression.",
        weekNumber: 2,
        status: "in_progress",
        clinicalCompetencies: [
          "MEOWS chart physiological parameter escalation",
          "Immediate bimanual compression and pelvic ultrasound referral for secondary PPH",
          "High vaginal swab collection and blood culture technique"
        ],
        steps: [
          {
            id: "s-mid205-2-1",
            title: "Lecture: Puerperal Pyrexia & Sepsis 6 Management",
            type: "lecture_summary",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Empirical Ceftriaxone + Metronidazole regimens and aggressive IV fluid resuscitation."
          },
          {
            id: "s-mid205-2-2",
            title: "Case Quiz: Distinguishing Postpartum Blues vs Puerperal Psychosis",
            type: "case_quiz",
            estimatedMinutes: 15,
            completed: false,
            contentPreview: "Day 3-5 transient blues vs acute psychiatric emergency with infant harm delusions."
          }
        ]
      },
      {
        id: "m-mid205-3",
        milestoneNumber: 3,
        title: "Exclusive Breastfeeding, Latch Scoring & Neonatal Nutrition",
        description: "WHO/UNICEF Baby-Friendly Hospital Initiative (BFHI), latch scoring (Latch, Audible swallowing, Type of nipple, Comfort, Hold), mastitis prevention, and Kangaroo Mother Care continuation.",
        weekNumber: 3,
        status: "locked",
        clinicalCompetencies: [
          "Assessment of deep infant latch with asymmetric areola coverage",
          "Differentiating breast engorgement from infectious bacterial mastitis"
        ],
        steps: [
          {
            id: "s-mid205-3-1",
            title: "Interactive Guide: LATCH Breastfeeding Assessment Tool",
            type: "lecture_summary",
            estimatedMinutes: 12,
            completed: false,
            contentPreview: "Score out of 10 determining need for targeted lactation consultant intervention."
          }
        ]
      }
    ]
  }
];

export const initialFlashcardDecks: FlashcardDeck[] = [
  {
    id: "deck-obs-high-yield",
    title: "Obstetrics & High-Yield Midwifery",
    category: "Obstetrics",
    cardCount: 24,
    masteredCount: 18,
    iconName: "Baby",
    description: "Essential partograph plotting, fetal heart patterns, AMTSL steps, and obstetrical emergencies.",
    tags: ["Partograph", "Labour Stages", "AMTSL", "PPH"]
  },
  {
    id: "deck-phar-mid",
    title: "Maternal & Neonatal Pharmacology",
    category: "Pharmacology",
    cardCount: 18,
    masteredCount: 12,
    iconName: "Pill",
    description: "Oxytocin, Ergometrine, Magnesium Sulfate, Hydralazine, and emergency antidote calculations.",
    tags: ["Uterotonics", "Antihypertensives", "Antidotes"]
  },
  {
    id: "deck-neo-resus",
    title: "Neonatal Assessment & Resuscitation",
    category: "Pediatrics",
    cardCount: 16,
    masteredCount: 14,
    iconName: "HeartPulse",
    description: "APGAR scoring, Bag-Valve-Mask ventilation ratios, thermal management, and hypoglycemia checks.",
    tags: ["APGAR", "BVM", "Kangaroo Mother Care"]
  },
  {
    id: "deck-med-surg",
    title: "Surgical Nursing & Emergency Triage",
    category: "Medical-Surgical",
    cardCount: 20,
    masteredCount: 10,
    iconName: "Stethoscope",
    description: "Sterile techniques, SBAR clinical handover, fluid resuscitation formulas, and post-op complications.",
    tags: ["ANTT", "SBAR", "Fluid Balance", "Shock"]
  }
];

export const initialFlashcards: Flashcard[] = [
  {
    id: "fc-1",
    deckId: "deck-obs-high-yield",
    deckTitle: "Obstetrics & High-Yield Midwifery",
    question: "What is the primary medication and exact timing for Active Management of the Third Stage of Labour (AMTSL)?",
    answer: "Oxytocin 10 IU administered intramuscularly (IM) within 1 minute of delivery of the anterior shoulder or full delivery of the baby.",
    explanation: "Prompt oxytocin release stimulates strong uterine contractions that physically shear the placental basal plate, reducing PPH risk by over 60%.",
    difficulty: "Medium",
    tag: "Obstetrics",
    status: "mastered",
    intervalDays: 14,
    timesReviewed: 5
  },
  {
    id: "fc-2",
    deckId: "deck-obs-high-yield",
    deckTitle: "Obstetrics & High-Yield Midwifery",
    question: "On a WHO Partograph, what is the clinical significance when the cervical dilation plot reaches or crosses the Action Line?",
    answer: "It signifies prolonged/obstructed labour requiring urgent decision-making: transfer to an emergency obstetric centre, continuous obstetrician review, or operative delivery.",
    explanation: "The Action Line is drawn parallel and 4 hours to the right of the Alert Line. Crossing it indicates labor has deviated severely from normal expected progression.",
    difficulty: "Hard",
    tag: "Obstetrics",
    status: "learning",
    intervalDays: 3,
    timesReviewed: 3
  },
  {
    id: "fc-3",
    deckId: "deck-obs-high-yield",
    deckTitle: "Obstetrics & High-Yield Midwifery",
    question: "What are the 4 'T's of Postpartum Hemorrhage etiology in order of prevalence?",
    answer: "1. Tone (Uterine Atony - 70%)\n2. Trauma (Genital tract lacerations - 20%)\n3. Tissue (Retained placental fragments/membranes - 9%)\n4. Thrombin (Coagulopathy - 1%)",
    explanation: "Remembering the 4 Ts helps the midwife rapidly diagnose the source of bleeding and initiate focused interventions (e.g. massage/uterotonics for Tone vs speculum inspection for Trauma).",
    difficulty: "Easy",
    tag: "Obstetrics",
    status: "mastered",
    intervalDays: 21,
    timesReviewed: 6
  },
  {
    id: "fc-4",
    deckId: "deck-phar-mid",
    deckTitle: "Maternal & Neonatal Pharmacology",
    question: "Why is Ergometrine (Ergonovine) strictly contraindicated in pregnant or parturient women with elevated blood pressure?",
    answer: "It induces sustained, intense arterial vasoconstriction and peripheral spasm, which can trigger acute hypertensive encephalopathy, intracranial hemorrhage, or maternal stroke.",
    explanation: "In hypertensive disorders of pregnancy, Oxytocin or Misoprostol must be selected instead of Ergometrine.",
    difficulty: "Hard",
    tag: "Pharmacology",
    status: "learning",
    intervalDays: 4,
    timesReviewed: 2
  },
  {
    id: "fc-5",
    deckId: "deck-phar-mid",
    deckTitle: "Maternal & Neonatal Pharmacology",
    question: "What 3 clinical monitoring parameters MUST be confirmed before giving each 4-hourly dose of Magnesium Sulfate?",
    answer: "1. Patellar (knee-jerk) reflex is present.\n2. Respiratory rate is at least 16 breaths per minute.\n3. Urine output has been at least 30 mL/hour (or 100 mL over the preceding 4 hours).",
    explanation: "Magnesium is excreted exclusively by the kidneys. If urine output drops or reflexes disappear, toxic accumulation occurs rapidly.",
    difficulty: "Hard",
    tag: "Pharmacology",
    status: "mastered",
    intervalDays: 14,
    timesReviewed: 4
  },
  {
    id: "fc-6",
    deckId: "deck-neo-resus",
    deckTitle: "Neonatal Assessment & Resuscitation",
    question: "What is the recommended ventilation rate and initial gas mixture for resuscitating a term newborn with apnea?",
    answer: "40 to 60 breaths per minute using Bag-Valve-Mask (BVM) with room air (21% Oxygen).",
    explanation: "100% oxygen is toxic to neonatal pulmonary vasculature and brain tissue; resuscitation starts in term infants with 21% O2 (room air) and is titrated with pulse oximetry.",
    difficulty: "Medium",
    tag: "Pediatrics",
    status: "mastered",
    intervalDays: 12,
    timesReviewed: 4
  },
  {
    id: "fc-7",
    deckId: "deck-med-surg",
    deckTitle: "Surgical Nursing & Emergency Triage",
    question: "What does the SBAR framework stand for during urgent clinical communication and physician escalation?",
    answer: "S: Situation (immediate reason for call)\nB: Background (history, admission diagnosis, pertinent vitals)\nA: Assessment (your clinical judgment of what is wrong)\nR: Recommendation (what you need from the doctor now)",
    explanation: "SBAR minimizes miscommunication errors in acute clinical settings and ensures standardized, concise transfer of critical patient data.",
    difficulty: "Easy",
    tag: "Medical-Surgical",
    status: "mastered",
    intervalDays: 20,
    timesReviewed: 5
  }
];

export const initialClinicalLogs: ClinicalPlacementLog[] = [
  {
    id: "log-001",
    date: "2026-09-12",
    hospital: "Ridge Regional Hospital",
    ward: "Labour & Delivery",
    shiftType: "Morning (07:00 - 14:00)",
    hours: 7,
    preceptorName: "Senior Midwife Beatrice Addo",
    competencies: [
      "Partograph plotting during active first stage",
      "Vaginal examination under sterile precautions",
      "Foetal heart rate monitoring with Pinard stethoscope"
    ],
    patientCaseSummary: "Assisted in monitoring a 26-year-old G2P1 mother admitted at 4cm cervical dilation. Plotted contractions and maternal pulse hourly. Alert line was respected; labor progressed smoothly to full dilation.",
    clinicalReflection: "I recognized how critical quiet reassurance and maternal breathing coaching are during the transition phase (8-10cm). When the patient felt an urge to push prematurely, I successfully guided her into panting breaths to avoid cervical edema until complete rim effacement was verified.",
    status: "Verified by Preceptor",
    aiFeedback: {
      competencyFeedback: "Exemplary documentation. Demonstrates strong understanding of maternal coaching to preserve cervical integrity during transition phase.",
      clinicalSafetyCheck: [
        "Continue noting membrane rupture duration and fluid color in future summaries.",
        "Ensure preceptor counter-signature is captured in the physical logbook as well."
      ],
      reflectiveQuestions: [
        "What physiological cues alerted you that the mother had entered the transition stage before the vaginal exam?",
        "How did you address the mother's pain perception without pharmacological analgesia?"
      ],
      preceptorReadiness: "Verified and commended for clinical vigilance."
    }
  },
  {
    id: "log-002",
    date: "2026-09-14",
    hospital: "Ridge Regional Hospital",
    ward: "Postnatal Ward",
    shiftType: "Afternoon (14:00 - 20:00)",
    hours: 6,
    preceptorName: "Staff Midwife Cynthia Appiah",
    competencies: [
      "Lochia assessment (rubra, serosa, alba)",
      "Uterine involution palpation (fundal height)",
      "Latching and exclusive breastfeeding counseling"
    ],
    patientCaseSummary: "Assessed 8 post-caesarean and normal delivery mothers on Day 1 postpartum. Identified one mother with a boggy fundus and excessive rubra lochia soaking 2 sanitary pads in 30 minutes.",
    clinicalReflection: "Upon discovering the boggy fundus at 2 fingers above the umbilicus, I immediately commenced circular fundal massage and expressed two large blood clots. I checked bladder distension, catheterized 400 mL clear urine, and the uterus firmly contracted to the level of the umbilicus. Prompt recognition averted severe secondary bleeding.",
    status: "Verified by Preceptor",
    aiFeedback: {
      competencyFeedback: "Outstanding clinical intervention. Recognizing a full bladder as the primary cause of uterine displacement and atony prevented maternal compromise.",
      clinicalSafetyCheck: [
        "Remember to record post-void/post-catheterization fundal height explicitly in centimeters or fingerbreadths.",
        "Document estimated blood loss (EBL) volume quantitatively in mL rather than pad count alone."
      ],
      reflectiveQuestions: [
        "What are the pharmacological second-line options if fundal massage and bladder emptying had failed to produce a contracted uterus?"
      ],
      preceptorReadiness: "High competency demonstrated; preceptor verification recommended."
    }
  },
  {
    id: "log-003",
    date: "2026-09-15",
    hospital: "Ridge Regional Hospital",
    ward: "Neonatal Intensive Care (NICU)",
    shiftType: "Morning (07:00 - 14:00)",
    hours: 7,
    preceptorName: "Specialist Pediatric Nurse Eric Owusu",
    competencies: [
      "Kangaroo Mother Care (KMC) position monitoring",
      "Neonatal temperature regulation in incubator",
      "Nasogastric tube (NGT) enteral feed measurement"
    ],
    patientCaseSummary: "Care of a 32-week preterm infant weighing 1.45 kg. Monitored oxygen saturation (target 90-95%), administered 12 mL expressed breast milk via size 5 Fr feeding tube after checking gastric aspirate pH.",
    clinicalReflection: "Working with such tiny infants highlighted the importance of thermal neutrality and micro-environmental care. I learned how gentle handling and minimal auditory stimulation reduce desaturation spells in premature neonates.",
    status: "Pending Review"
  }
];

export const initialForumPosts: ForumPost[] = [
  {
    id: "post-1",
    title: "How to differentiate between early decelerations and late decelerations on the cardiotocograph (CTG)?",
    author: {
      name: "Kofi Asante",
      role: "Year 3 Midwifery Student",
      college: "Pantang Midwifery Training College",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      verifiedStudent: true
    },
    category: "Midwifery Skills",
    content: "During our clinical shift today in the Labour Suite, my preceptor asked me to explain the nadir of deceleration in relation to the contraction peak. Can someone break down the clinical significance and required nursing response for each?",
    timestamp: "3 hours ago",
    upvotes: 18,
    userUpvoted: true,
    tags: ["CTG", "Foetal Heart Rate", "Clinical Skills", "NMC Exams"],
    views: 142,
    solved: true,
    replies: [
      {
        id: "rep-1-1",
        author: {
          name: "Sister Patricia Donkor",
          role: "Clinical Instructor / Staff Midwife",
          college: "Korle-Bu Midwifery College",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
          verifiedStudent: true
        },
        content: "Great clinical question, Kofi!\n\n1. Early Decelerations: The dip in foetal heart rate mirrors the contraction exactly. The nadir (lowest point) coincides with the PEAK of the contraction. Cause: Foetal head compression during descent triggering vagal stimulation. Benign — no intervention needed other than noting descent.\n\n2. Late Decelerations: The deceleration begins AFTER the contraction has peaked, and the nadir occurs well after the contraction peak. Cause: Uteroplacental insufficiency (hypoxia). Ominous! Immediate actions:\n- Turn mother onto Left Lateral position\n- Stop any Oxytocin infusion immediately\n- Administer IV fluid bolus (500ml Hartmann's)\n- Apply face mask oxygen (10L/min)\n- Notify duty obstetrician stat for urgent delivery if persistent!",
        timestamp: "2 hours ago",
        upvotes: 24,
        isVerifiedSolution: true
      },
      {
        id: "rep-1-2",
        author: {
          name: "Ama Mensah",
          role: "Midwifery Student",
          college: "Presbyterian Nursing & Midwifery College",
          avatar: "https://images.unsplash.com/photo-1594824813527-897f259021fb?w=100&auto=format&fit=crop&q=80",
          verifiedStudent: true
        },
        content: "Thank you Sister Patricia! Our tutor taught us the mnemonic 'VEAL CHOP':\nV = Variable -> C = Cord compression\nE = Early -> H = Head compression\nA = Accelerations -> O = Okay!\nL = Late -> P = Placental insufficiency!",
        timestamp: "1 hour ago",
        upvotes: 16
      }
    ]
  },
  {
    id: "post-2",
    title: "OSCE Clinical Exam: Best strategy for catheterization and aseptic technique stations?",
    author: {
      name: "Abena Sarpong",
      role: "Final Year Nursing Student",
      college: "Cape Coast Nursing Training College",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      verifiedStudent: true
    },
    category: "Licensure & Board Exams",
    content: "Our licensure OSCE exam is coming up next month. In mock exams, many candidates lost marks on sterile gloving contamination and forgetting to maintain a sterile field while opening the catheter package. Any tips from those who passed with distinction?",
    timestamp: "Yesterday",
    upvotes: 27,
    tags: ["OSCE", "Licensure", "ANTT", "Catheterization"],
    views: 290,
    solved: false,
    replies: [
      {
        id: "rep-2-1",
        author: {
          name: "Nurse Samuel Osei",
          role: "Registered General Nurse",
          college: "NTC Kumasi",
          avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80",
          verifiedStudent: true
        },
        content: "Top OSCE tip: Speak your actions out loud clearly to the examiner! Example: 'I am performing hand hygiene according to WHO 5 moments', 'I am verifying patient identity and allergy status', 'I am maintaining sterile non-touch technique with my dominant hand'. Examiners have a checklist and if you say it, they tick it immediately!",
        timestamp: "18 hours ago",
        upvotes: 31,
        isVerifiedSolution: true
      }
    ]
  },
  {
    id: "post-3",
    title: "Clinical Ward Experience: Managing patient anxiety during first-time labor",
    author: {
      name: "Derrick Quaye",
      role: "Midwifery Trainee",
      college: "Koforidua Nursing & Midwifery College",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      verifiedStudent: true
    },
    category: "Clinical Placements",
    content: "A 19-year-old mother was in severe panic during latent phase today. How do you balance busy ward documentation with compassionate, continuous labor support when the unit is understaffed?",
    timestamp: "2 days ago",
    upvotes: 14,
    tags: ["Compassionate Care", "Labour Support", "Clinical Ward"],
    views: 188,
    solved: false,
    replies: []
  }
];

export const initialClinicalProtocols: ClinicalProtocol[] = [
  {
    id: "prot-1",
    title: "Postpartum Hemorrhage (PPH) Emergency Protocol (WHO Standards)",
    category: "Obstetrics",
    summary: "Immediate management algorithm for estimated blood loss > 500 mL in vaginal delivery or > 1000 mL in caesarean birth.",
    emergencyAlert: "Call for Senior Midwife and Obstetrician immediately. Do not leave the mother unattended.",
    steps: [
      "1. Shout for help and establish 2 large-bore IV cannulae (16G or 14G).",
      "2. Massage the uterine fundus continuously to expel clots and stimulate contraction.",
      "3. Administer Oxytocin 20-40 IU in 1L Normal Saline running at 60 drops/min.",
      "4. Insert Foley catheter to decompress the bladder and track hourly urine volume.",
      "5. Administer secondary uterotonics: Misoprostol 800 mcg sublingually or Tranexamic Acid 1g IV over 10 minutes.",
      "6. Check the 4 Ts: Tone, Tissue, Trauma, Thrombin. Inspect perineum and cervix with sterile speculum.",
      "7. If atony persists: perform Bimanual Uterine Compression or apply Non-Pneumatic Anti-Shock Garment (NASG)."
    ],
    updatedDate: "August 2026"
  },
  {
    id: "prot-2",
    title: "Severe Preeclampsia & Eclampsia: Magnesium Sulfate Protocol",
    category: "Pharmacology",
    summary: "Standard Zuspan and Pritchard regimens for preventing maternal convulsions and intracranial hemorrhage.",
    emergencyAlert: "High Alert Medication: Always have 10% Calcium Gluconate at bedside before starting infusion.",
    steps: [
      "1. Loading Dose: 4g Magnesium Sulfate IV as 20% solution over 15-20 minutes, followed by 5g IM in each buttock (10g total IM) as 50% solution with 1mL 2% lignocaine.",
      "2. Maintenance Dose: 5g IM every 4 hours alternating buttocks, OR 1g/hour continuous IV infusion.",
      "3. Safety Checks before each dose: Patellar reflex PRESENT, Respiratory rate > 16 bpm, Urine output > 30 mL/hr.",
      "4. Toxicity Management: Stop MgSO4 immediately; give Calcium Gluconate 1g IV slowly over 5 minutes if respiratory rate drops."
    ],
    updatedDate: "July 2026"
  },
  {
    id: "prot-3",
    title: "Neonatal Resuscitation Program (NRP) 60-Second Algorithm",
    category: "Resuscitation",
    summary: "Standard rapid intervention for non-breathing or limp newborns during the golden first minute of life.",
    emergencyAlert: "Avoid routine endotracheal suctioning if infant is vigorous; prioritize warmth and ventilation.",
    steps: [
      "0-30 seconds: Dry baby thoroughly, remove wet linen, maintain warmth on mother's chest or radiant warmer, position airway slightly extended (sniffing position).",
      "30-60 seconds: If infant is gasping or heart rate is < 100 bpm: initiate Positive Pressure Ventilation (PPV) with Bag-Valve-Mask at 40-60 breaths/min on room air (21% O2).",
      "Attach pulse oximeter probe to right wrist (pre-ductal).",
      "After 30 seconds of effective PPV: if HR < 60 bpm, begin chest compressions (3:1 ratio - 90 compressions and 30 breaths per minute) and increase to 100% Oxygen."
    ],
    updatedDate: "September 2026"
  }
];

export const initialNotes: LectureNote[] = [
  {
    id: "note-1",
    title: "Physiology of Labour & WHO Partograph Plotting Guide",
    subject: "MID 201: Obstetrics & Midwifery",
    date: "2026-09-11",
    originalSnippet: "Lecture notes on active phase cervical progression, descent of the foetal head, and differentiating alert line from action line.",
    summary: {
      keyTakeaways: [
        "Active phase of the first stage of labor begins at 5 cm cervical dilation (per updated WHO labour guide).",
        "The Alert Line represents a progression rate of 1 cm per hour in primigravidae.",
        "The Action Line is drawn 4 hours to the right of the Alert Line; crossing it mandates clinical intervention.",
        "Uterine contractions are documented by duration: mild (<20 sec, dots), moderate (20-40 sec, diagonal lines), strong (>40 sec, solid shading)."
      ],
      definitions: [
        {
          term: "Active First Stage of Labour",
          definition: "The period of regular painful contractions accompanied by substantial cervical effacement and cervical dilatation from 5 cm onward until full dilatation (10 cm).",
          clinicalRelevance: "Prior to 5 cm, slow dilation is physiological (latent phase) and must not be misdiagnosed as failure to progress."
        },
        {
          term: "WHO Alert Line vs Action Line",
          definition: "Alert Line denotes a slope of 1 cm/hr from 5 cm. Action Line is plotted parallel and 4 hours to the right.",
          clinicalRelevance: "Crossing the action line triggers obstetrician review, ruling out cephalopelvic disproportion (CPD) and deciding on caesarean or oxytocin."
        },
        {
          term: "Caput Succedaneum",
          definition: "Edematous swelling of the fetal scalp caused by pressure against the dilating cervix, crossing suture lines.",
          clinicalRelevance: "Excessive caput (+++) combined with bone moulding indicates significant mechanical resistance or obstructed labour."
        }
      ],
      clinicalPearls: [
        "Always palpate abdominal contractions for a full 10 minutes rather than guessing.",
        "Never perform a routine vaginal exam more frequently than every 4 hours unless there is maternal distress or urge to push.",
        "Check foetal heart rate immediately following rupture of amniotic membranes to rule out cord prolapse."
      ],
      nursingInterventions: [
        "Encourage upright maternal ambulation and frequent bladder emptying to facilitate fetal descent.",
        "Provide continuous one-on-one emotional presence, hydration with oral fluids, and cool brow cloths.",
        "Record maternal pulse every 30 minutes, BP every 4 hours, and fetal heart rate every 30 minutes for 1 full minute."
      ],
      redFlags: [
        "Thick pea-soup meconium-stained liquor in early labor.",
        "Fetal bradycardia persistent < 110 bpm or loss of baseline variability.",
        "Maternal temperature > 38.0°C indicating intrauterine chorioamnionitis."
      ],
      examMnemonics: [
        "The 4 Ps of Labor: Passage (Pelvis), Passenger (Fetus), Powers (Contractions), Psyche (Maternal state)."
      ],
      fullSummaryMarkdown: "### WHO Partograph & Labour Progress\n\nThe partograph is a critical early-warning tool designed to detect obstructed labor, maternal exhaustion, and fetal compromise before irreparable clinical damage occurs. Modern midwifery practice emphasizes individualized supportive care while adhering strictly to standard referral action thresholds."
    },
    tags: ["Partograph", "Labor Stages", "Clinical Obstetrics"]
  },
  {
    id: "note-2",
    title: "Magnesium Sulfate Toxicity Surveillance & Zuspan Regimen",
    subject: "PHAR 204: Pharmacology for Midwives",
    date: "2026-09-13",
    originalSnippet: "Audio debrief on managing severe preeclampsia, patellar reflex checking, and administering Calcium Gluconate.",
    audioInfo: {
      filename: "Ward-Round-Debrief-MgSO4.mp3",
      fileSize: "6.2 MB",
      duration: "14:10"
    },
    summary: {
      keyTakeaways: [
        "Magnesium Sulfate is the definitive neuroprotective agent against eclamptic convulsions.",
        "Zuspan regimen utilizes a 4g IV loading dose followed by Pritchard 5g IM per buttock or 1g/hr IV infusion.",
        "Therapeutic serum magnesium window is 2.0 to 3.5 mmol/L (4.8 to 8.4 mg/dL)."
      ],
      definitions: [
        {
          term: "Eclamptic Convulsion",
          definition: "New onset of generalized tonic-clonic seizures in a woman with preeclampsia that cannot be attributed to other neurologic causes.",
          clinicalRelevance: "Major cause of maternal cerebral hemorrhage, placental abruption, and anoxic brain injury."
        },
        {
          term: "Hyporeflexia / Areflexia",
          definition: "Absence or depression of deep tendon reflexes (specifically the patellar/knee-jerk reflex).",
          clinicalRelevance: "Earliest clinical sign of magnesium toxicity; always precedes life-threatening respiratory depression."
        }
      ],
      clinicalPearls: [
        "Always keep 10% Calcium Gluconate (10 mL = 1g) kept drawn up or immediately available at bedside.",
        "Assess patellar reflex with patient's knee supported in semi-flexion before every single dose."
      ],
      nursingInterventions: [
        "Check and record maternal respiration (must be >= 16 bpm) prior to administration.",
        "Maintain strict hourly fluid balance via indwelling catheter (urine output must exceed 30 mL/hr).",
        "Place patient in left lateral position with padded side rails."
      ],
      redFlags: [
        "Loss of deep tendon reflexes.",
        "Respiratory rate dropping below 12-14 breaths per minute.",
        "Oliguria < 100 mL over 4 consecutive hours."
      ],
      examMnemonics: [
        "BURP Warning Signs for MgSO4: Blood pressure drop, Urine output < 30ml/hr, Respiratory rate < 16, Patellar reflex absent."
      ],
      fullSummaryMarkdown: "### Magnesium Sulfate Protocol & Bedside Surveillance\n\nMagnesium Sulfate acts centrally to block NMDA receptors and peripherally to produce vasodilation of cerebral vasculature. Constant monitoring of patellar reflexes, respiratory rate, and urine output guarantees safety."
    },
    tags: ["Pharmacology", "MgSO4", "Preeclampsia", "Audio Lecture"]
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: "notif-1",
    title: "NMC Licensure Examination Registration",
    message: "Registration for the November 2026 Nursing & Midwifery Council (NMC) Licensure Examination is open. Verify your biometric data and clearance.",
    timestamp: "10m ago",
    type: "exam",
    read: false,
    priority: "urgent",
    targetView: "quizzes"
  },
  {
    id: "notif-2",
    title: "New AI Lecture Summary Generated",
    message: "Audio lecture 'Magnesium Sulfate Protocol & Bedside Surveillance' has been processed with high-yield exam mnemonics & clinical pearls.",
    timestamp: "1h ago",
    type: "summary",
    read: false,
    priority: "normal",
    targetView: "summarizer"
  },
  {
    id: "notif-3",
    title: "Course Registration Complete",
    message: "Your registration for 6 accredited Nursing & Midwifery courses is approved. Total tuition balance: $0 (Clearance Complete).",
    timestamp: "3h ago",
    type: "fee",
    read: false,
    priority: "normal",
    targetView: "registration"
  },
  {
    id: "notif-4",
    title: "Weekly Quiz Recommendation",
    message: "Target your weaker domain: Review 10 high-yield questions on Obstetric Hemorrhage & Uterine Atony (MID 201).",
    timestamp: "5h ago",
    type: "quiz",
    read: true,
    priority: "normal",
    targetView: "quizzes",
    targetPayload: { topic: "Obstetric Emergencies / Antenatal Bleeding" }
  },
  {
    id: "notif-5",
    title: "Peer Clinical Forum Answer",
    message: "Midwife Beatrice verified a clinical response to your inquiry regarding Leopold's Maneuvers palpation techniques.",
    timestamp: "Yesterday",
    type: "forum",
    read: true,
    priority: "low",
    targetView: "forum"
  },
  {
    id: "notif-6",
    title: "Milestone 2 Unlocked: Antenatal Triage",
    message: "You've successfully unlocked Week 2 Milestone for MID 204: Obstetric Risk Profiling & WHO 8-Contact Model.",
    timestamp: "2 days ago",
    type: "curriculum",
    read: true,
    priority: "normal",
    targetView: "curriculum"
  }
];

export const initialModuleProgressStats: ModuleProgressStat[] = [
  {
    moduleCode: "MID 201",
    name: "Normal and Abnormal Labour (Intrapartum)",
    track: "Midwifery",
    completionRate: 75,
    quizAccuracy: 88,
    quizzesTaken: 12,
    totalQuizzes: 15,
    color: "#0284c7" // sky-600
  },
  {
    moduleCode: "MID 204",
    name: "Normal and Abnormal Pregnancy (Antenatal)",
    track: "Midwifery",
    completionRate: 60,
    quizAccuracy: 92,
    quizzesTaken: 9,
    totalQuizzes: 12,
    color: "#0d9488" // teal-600
  },
  {
    moduleCode: "MID 205",
    name: "Puerperium (Postpartum Care)",
    track: "Midwifery",
    completionRate: 70,
    quizAccuracy: 89,
    quizzesTaken: 11,
    totalQuizzes: 14,
    color: "#f43f5e" // rose-500
  },
  {
    moduleCode: "NEO 102",
    name: "Neonatal Care",
    track: "Midwifery",
    completionRate: 80,
    quizAccuracy: 86,
    quizzesTaken: 10,
    totalQuizzes: 12,
    color: "#0369a1" // sky-700
  },
  {
    moduleCode: "ANAT 101",
    name: "Anatomy and Physiology",
    track: "Nursing",
    completionRate: 72,
    quizAccuracy: 85,
    quizzesTaken: 15,
    totalQuizzes: 18,
    color: "#6366f1" // indigo-500
  },
  {
    moduleCode: "NUR 101",
    name: "Nursing Fundamentals",
    track: "Nursing",
    completionRate: 85,
    quizAccuracy: 90,
    quizzesTaken: 16,
    totalQuizzes: 18,
    color: "#10b981" // emerald-500
  },
  {
    moduleCode: "NUR 103",
    name: "Health Assessment",
    track: "Nursing",
    completionRate: 55,
    quizAccuracy: 83,
    quizzesTaken: 8,
    totalQuizzes: 14,
    color: "#0284c7" // sky-600
  },
  {
    moduleCode: "PHAR 204",
    name: "Pharmacology",
    track: "Nursing",
    completionRate: 90,
    quizAccuracy: 91,
    quizzesTaken: 15,
    totalQuizzes: 16,
    color: "#059669" // emerald-600
  },
  {
    moduleCode: "NUR 201",
    name: "Medical-Surgical Nursing",
    track: "Nursing",
    completionRate: 65,
    quizAccuracy: 82,
    quizzesTaken: 14,
    totalQuizzes: 18,
    color: "#4f46e5" // indigo-600
  },
  {
    moduleCode: "NUR 208",
    name: "Mental Health Nursing",
    track: "Nursing",
    completionRate: 48,
    quizAccuracy: 87,
    quizzesTaken: 7,
    totalQuizzes: 14,
    color: "#a855f7" // purple-500
  }
];

export const initialQuizTrendData: QuizTrendData[] = [
  {
    session: "Wk 1",
    date: "Aug 04",
    score: 68,
    benchmark: 75,
    midwiferyScore: 70,
    nursingScore: 66,
    topic: "Basic Obstetrics & Vital Signs"
  },
  {
    session: "Wk 2",
    date: "Aug 11",
    score: 74,
    benchmark: 75,
    midwiferyScore: 76,
    nursingScore: 72,
    topic: "Fluid Balance & Pelvic Planes"
  },
  {
    session: "Wk 3",
    date: "Aug 18",
    score: 78,
    benchmark: 75,
    midwiferyScore: 82,
    nursingScore: 75,
    topic: "Partograph & Active Phase"
  },
  {
    session: "Wk 4",
    date: "Aug 25",
    score: 83,
    benchmark: 75,
    midwiferyScore: 86,
    nursingScore: 80,
    topic: "Uterotonics & SBAR Handover"
  },
  {
    session: "Wk 5",
    date: "Sep 01",
    score: 81,
    benchmark: 75,
    midwiferyScore: 84,
    nursingScore: 79,
    topic: "Neonatal Resuscitation (NRP)"
  },
  {
    session: "Wk 6",
    date: "Sep 08",
    score: 88,
    benchmark: 75,
    midwiferyScore: 92,
    nursingScore: 85,
    topic: "Preeclampsia MgSO4 Protocol"
  },
  {
    session: "Wk 7",
    date: "Sep 15",
    score: 91,
    benchmark: 75,
    midwiferyScore: 94,
    nursingScore: 88,
    topic: "NMC Licensure Mock Simulation"
  }
];

export const initialFacilitatorProfile: FacilitatorProfile = {
  id: "fac-preceptor-01",
  name: "Dr. Kwesi Appiah",
  title: "FWACN, FWAPCNM • Senior Nursing & Midwifery Clinical Preceptor",
  department: "dual",
  college: "Presbyterian Nursing & Midwifery College / Ridge Regional Hospital",
  avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
  email: "k.appiah@nmc-college.edu.gh",
  coursesPublished: 8,
  quizzesCreated: 24,
  videosUploaded: 12,
  totalStudentsTaught: 340
};

export const initialVideoLectures: VideoLecture[] = [
  {
    id: "vid-partograph-mastery",
    title: "WHO Partograph: Clinical Plotting, Alert Line & Action Line Protocols",
    courseId: "course-mid-201",
    courseTitle: "Normal and Abnormal Labour (Intrapartum)",
    department: "midwifery",
    instructor: "Dr. Kwesi Appiah (FWACN, Senior Preceptor)",
    duration: "22:15",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    description: "Step-by-step masterclass covering cervical dilation plotting from 5 cm onward, descent of fetal head, uterine contraction dynamics, and identifying obstructed labor before crossing the 4-hour action boundary.",
    keyTakeaways: [
      "Active phase plotting commences strictly when cervical dilation reaches 5 cm with regular painful uterine contractions.",
      "The Alert Line slopes at an expected cervical dilation rate of at least 1 cm/hour in primigravidae.",
      "The Action Line is drawn 4 hours parallel and to the right of the Alert Line; crossing it mandates definitive surgical or referral intervention.",
      "Auscultate and record fetal heart rate immediately after a contraction for 60 seconds to detect late decelerations."
    ],
    chapters: [
      { time: "00:00", title: "Introduction & Anatomy of the WHO Partograph" },
      { time: "04:30", title: "Plotting the Cervicograph at 5cm Active Phase" },
      { time: "11:15", title: "Action Line Crossing: Cephalopelvic Disproportion (CPD)" },
      { time: "17:40", title: "Monitoring Contractions, Caput & Moulding" }
    ],
    tags: ["Partograph", "Intrapartum", "Midwifery", "Obstructed Labour", "WHO Guidelines"],
    uploadedAt: "2 days ago",
    viewsCount: 248
  },
  {
    id: "vid-amtsl-demonstration",
    title: "Active Management of the Third Stage of Labour (AMTSL) Hands-on Simulation",
    courseId: "course-mid-204",
    courseTitle: "Obstetric Emergencies & Complications",
    department: "midwifery",
    instructor: "Principal Tutor Grace Osei (RM, MPhil)",
    duration: "16:40",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80",
    description: "Clinical practical demonstration of the 3 evidence-based steps of AMTSL to prevent primary Postpartum Hemorrhage (PPH). Includes prophylactic uterotonics, controlled cord traction, and fundal rub.",
    keyTakeaways: [
      "Administer 10 IU Oxytocin IM within 1 minute of fetal delivery after palpating the abdomen to rule out an undiagnosed second twin.",
      "Perform Controlled Cord Traction (Brandt-Andrews technique) only during uterine contractions with steady suprapubic counter-traction.",
      "Perform immediate bimanual uterine massage and inspect the maternal and fetal surfaces of the placenta for complete cotyledons and membranes.",
      "Check maternal vital signs and fundal firmness every 15 minutes for the first 2 hours postpartum."
    ],
    chapters: [
      { time: "00:00", title: "PPH Prevention & Rationale for AMTSL" },
      { time: "03:10", title: "Excluding Second Twin & Oxytocin Administration" },
      { time: "07:45", title: "Controlled Cord Traction & Counter-traction Technique" },
      { time: "12:30", title: "Placenta & Membrane Inspection Checklist" }
    ],
    tags: ["AMTSL", "Postpartum Hemorrhage", "Oxytocin", "Placental Delivery", "Obstetrics"],
    uploadedAt: "5 days ago",
    viewsCount: 312
  },
  {
    id: "vid-iv-cannulation-antt",
    title: "Aseptic Non-Touch Technique (ANTT) & Peripheral IV Cannulation",
    courseId: "course-nur-101",
    courseTitle: "Fundamentals of Nursing & Patient Care",
    department: "nursing",
    instructor: "Senior Nursing Officer Kofi Boateng (RN, BSc)",
    duration: "18:25",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    description: "Complete clinical tutorial on peripheral venous cannulation adhering to strict ANTT standards. Covers vein selection, cannula gauge matching, aseptic skin prep, flashback recognition, and flush verification.",
    keyTakeaways: [
      "Match cannula gauge to clinical purpose: 16G/18G for rapid blood transfusion/obstetric emergencies, 20G/22G for routine crystalloids.",
      "Allow 2% Chlorhexidine in 70% alcohol to dry completely for at least 30 seconds before needle insertion.",
      "Enter vein at 15 to 30 degree angle, verify primary blood flashback, drop angle slightly, advance cannula over needle.",
      "Flush cannula with 0.9% Normal Saline to confirm patency and document procedure on the clinical peripheral line chart."
    ],
    chapters: [
      { time: "00:00", title: "Equipment Tray Preparation & ANTT Principles" },
      { time: "04:15", title: "Venous Assessment & Tourniquet Application" },
      { time: "09:00", title: "Insertion Angle, Primary & Secondary Flashback" },
      { time: "14:20", title: "Flushing, Dressing & Documentation" }
    ],
    tags: ["Nursing Skills", "IV Cannulation", "Asepsis", "ANTT", "Bedside Procedures"],
    uploadedAt: "1 week ago",
    viewsCount: 405
  },
  {
    id: "vid-neonatal-resuscitation",
    title: "Neonatal Resuscitation Program (NRP): The Golden First Minute",
    courseId: "course-neo-102",
    courseTitle: "Neonatal Care & Resuscitation",
    department: "dual",
    instructor: "Dr. Kwesi Appiah (FWACN, Senior Preceptor)",
    duration: "24:10",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=80",
    description: "Critical algorithm review and manikin simulation for managing the depressed or asphyxiated neonate at birth. Focuses on rapid thermal control, stimulation, and Positive Pressure Ventilation within 60 seconds.",
    keyTakeaways: [
      "Perform the initial 30-second assessment: Term gestation? Tone present? Breathing or crying?",
      "If apneic or gasping, dry thoroughly, clear airway if obstructed, and initiate Positive Pressure Ventilation (PPV) within the Golden Minute.",
      "Ventilation rate: 40 to 60 breaths per minute with room air (21% O2 for term, 21-30% for preterm).",
      "Utilize MR. SOPA (Mask adjust, Reposition airway, Suction, Open mouth, Pressure increase, Alternative airway) if chest is not rising."
    ],
    chapters: [
      { time: "00:00", title: "Rapid Assessment & The Golden Minute Concept" },
      { time: "05:45", title: "Initial Thermal Care & Airway Clearing" },
      { time: "11:20", title: "Executing Effective Bag-and-Mask PPV" },
      { time: "18:00", title: "MR. SOPA Corrective Steps & Heart Rate Auscultation" }
    ],
    tags: ["Neonatal", "NRP", "Resuscitation", "Golden Minute", "Pediatrics"],
    uploadedAt: "2 weeks ago",
    viewsCount: 520
  }
];

export const initialQuizQuestions: QuizQuestion[] = [
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
    clinicalContext: "Obstetric Emergencies / Antenatal Bleeding",
    difficulty: "Advanced",
    author: "Dr. Kwesi Appiah",
    courseId: "course-mid-204",
    courseTitle: "Obstetric Emergencies & Complications",
    timesAttempted: 184,
    timesCorrect: 152
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
    rationale: "Loss of deep tendon reflexes and respiratory depression (< 12-16 breaths/min) are hallmark manifestations of hypermagnesemia (magnesium toxicity). The infusion must be halted immediately to prevent respiratory and cardiac arrest, followed by emergency administration of Calcium Gluconate 10% (1g IV over 10 minutes).",
    clinicalContext: "High-Alert Pharmacological Monitoring",
    difficulty: "Advanced",
    author: "Principal Tutor Grace Osei",
    courseId: "course-phar-204",
    courseTitle: "Pharmacology & Safe Medication Administration",
    timesAttempted: 210,
    timesCorrect: 178
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
    rationale: "The Action Line is set 4 hours to the right of the Alert Line. Crossing the action line signifies that labor progression has failed to meet acceptable physiological velocity (1 cm/hr), indicating prolonged or obstructed labor. Immediate escalation for oxytocin augmentation or cesarean section is mandated.",
    clinicalContext: "Partograph & Intrapartum Surveillance",
    difficulty: "Intermediate",
    author: "Dr. Kwesi Appiah",
    courseId: "course-mid-201",
    courseTitle: "Normal and Abnormal Labour (Intrapartum)",
    timesAttempted: 195,
    timesCorrect: 168
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
    clinicalContext: "Immediate Neonatal Assessment",
    difficulty: "Beginner",
    author: "Dr. Kwesi Appiah",
    courseId: "course-neo-102",
    courseTitle: "Neonatal Care & Resuscitation",
    timesAttempted: 260,
    timesCorrect: 236
  },
  {
    id: "q-5",
    question: "A post-operative patient recovering from abdominal hysterectomy has a blood pressure of 85/50 mmHg, heart rate of 126 bpm, cold clammy extremities, and surgical drain output of 450 mL bright red blood over 45 minutes. What type of shock is the patient experiencing?",
    options: [
      "Septic shock",
      "Hypovolemic shock (hemorrhagic)",
      "Neurogenic shock",
      "Anaphylactic shock"
    ],
    correctIndex: 1,
    rationale: "Tachycardia, hypotension, cool clammy skin, and frank heavy bright red drain output indicate acute hypovolemic (hemorrhagic) shock from internal surgical bleeding. Immediate crystalloid resuscitation, cross-matching, and surgical exploration are urgent.",
    clinicalContext: "Medical-Surgical & Post-Op Triage",
    difficulty: "Intermediate",
    author: "Senior Nursing Officer Kofi Boateng",
    courseId: "course-nur-201",
    courseTitle: "Medical-Surgical Nursing I (Adult Health)",
    timesAttempted: 172,
    timesCorrect: 148
  },
  {
    id: "q-6",
    question: "Which of the following medications is STRICTLY contraindicated for control of postpartum hemorrhage in a patient with chronic hypertension and a blood pressure of 165/105 mmHg?",
    options: [
      "Oxytocin (Pitocin)",
      "Misoprostol (Cytotec)",
      "Methylergonovine / Ergometrine",
      "Tranexamic Acid (TXA)"
    ],
    correctIndex: 2,
    rationale: "Ergometrine and Methylergonovine produce generalized vasoconstriction and intense sustained myometrial spasm, which can precipitate acute hypertensive crisis, cerebral hemorrhage, or myocardial infarction in hypertensive clients.",
    clinicalContext: "Pharmacology & Maternal Safety",
    difficulty: "Intermediate",
    author: "Principal Tutor Grace Osei",
    courseId: "course-phar-204",
    courseTitle: "Pharmacology & Safe Medication Administration",
    timesAttempted: 198,
    timesCorrect: 162
  },
  {
    id: "q-7",
    question: "During antenatal Leopold's maneuvers, the midwife palpates a hard, round, freely ballotable mass in the uterine fundus, while the lower uterine segment feels soft, broad, and irregular. What fetal presentation does this indicate?",
    options: [
      "Cephalic / Vertex presentation",
      "Breech presentation",
      "Transverse lie with shoulder presentation",
      "Face presentation"
    ],
    correctIndex: 1,
    rationale: "A hard, smooth, globular, ballotable mass in the fundus is the fetal head, while a softer, broader, less defined mass at the pelvic inlet represents the fetal buttocks/feet. This confirms a breech presentation.",
    clinicalContext: "Antenatal Assessment & Abdominal Palpation",
    difficulty: "Beginner",
    author: "Dr. Kwesi Appiah",
    courseId: "course-mid-205",
    courseTitle: "Antenatal Care & Fetal Assessment",
    timesAttempted: 224,
    timesCorrect: 194
  },
  {
    id: "q-8",
    question: "When initiating intravenous Vancomycin for severe MRSA infection, the nurse must monitor for 'Red Man Syndrome'. What is the primary preventive clinical measure?",
    options: [
      "Administer the dose as a rapid IV bolus over 2 minutes",
      "Infuse Vancomycin slowly over at least 60 minutes (or rate <= 10 mg/min)",
      "Co-administer high-dose oral potassium chloride",
      "Place patient in reverse Trendelenburg position during infusion"
    ],
    correctIndex: 1,
    rationale: "Red Man Syndrome is an infusion rate-dependent histamine release reaction characterized by flushing, erythema, and pruritus of the face and upper torso. Slow infusion over at least 60 minutes (or 1.5 - 2 hours for doses >= 1g) prevents excessive mast cell degranulation.",
    clinicalContext: "Pharmacology & Safe Medication Administration",
    difficulty: "Advanced",
    author: "Senior Nursing Officer Kofi Boateng",
    courseId: "course-phar-204",
    courseTitle: "Pharmacology & Safe Medication Administration",
    timesAttempted: 145,
    timesCorrect: 118
  }
];

export const initialEnrolledStudents: EnrolledStudentItem[] = [
  {
    id: "std-2026-084",
    name: "Ama Mensah",
    studentId: "NMC/CNM/24/0912",
    program: "Dual Qualification: Midwifery (RM) & Nursing (RN)",
    track: "dual",
    avatar: "/student-avatar.svg",
    attendanceRate: 96,
    averageQuizScore: 88,
    clinicalHoursLogged: 146,
    clinicalHoursRequired: 200,
    status: "Excelling",
    pendingLogSubmissions: 2,
    lastActive: "10 mins ago"
  },
  {
    id: "std-2026-042",
    name: "Kofi Boateng",
    studentId: "NMC/CNM/24/0845",
    program: "Registered General Nursing (RN)",
    track: "nursing",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    attendanceRate: 91,
    averageQuizScore: 82,
    clinicalHoursLogged: 130,
    clinicalHoursRequired: 200,
    status: "Active",
    pendingLogSubmissions: 1,
    lastActive: "1 hour ago"
  },
  {
    id: "std-2026-118",
    name: "Abena Frimpong",
    studentId: "NMC/CNM/24/1102",
    program: "Registered Midwifery (RM)",
    track: "midwifery",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    attendanceRate: 88,
    averageQuizScore: 92,
    clinicalHoursLogged: 165,
    clinicalHoursRequired: 200,
    status: "Excelling",
    pendingLogSubmissions: 3,
    lastActive: "35 mins ago"
  },
  {
    id: "std-2026-029",
    name: "Emmanuel Darko",
    studentId: "NMC/CNM/24/0721",
    program: "Registered General Nursing (RN)",
    track: "nursing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    attendanceRate: 74,
    averageQuizScore: 68,
    clinicalHoursLogged: 82,
    clinicalHoursRequired: 200,
    status: "At Risk",
    pendingLogSubmissions: 0,
    lastActive: "2 days ago"
  },
  {
    id: "std-2026-155",
    name: "Grace Oware",
    studentId: "NMC/CNM/24/1244",
    program: "Registered Midwifery (RM)",
    track: "midwifery",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    attendanceRate: 94,
    averageQuizScore: 85,
    clinicalHoursLogged: 152,
    clinicalHoursRequired: 200,
    status: "Active",
    pendingLogSubmissions: 1,
    lastActive: "3 hours ago"
  },
  {
    id: "std-2026-092",
    name: "Samuel Ansah",
    studentId: "NMC/CNM/24/0988",
    program: "Dual Qualification: Midwifery (RM) & Nursing (RN)",
    track: "dual",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    attendanceRate: 82,
    averageQuizScore: 78,
    clinicalHoursLogged: 114,
    clinicalHoursRequired: 200,
    status: "Active",
    pendingLogSubmissions: 2,
    lastActive: "5 hours ago"
  }
];

export const defaultStudentUser: AuthUser = {
  id: "user-student-01",
  email: "a.mensah@student.nmc.edu.gh",
  role: "student",
  name: "Ama Mensah",
  avatar: "/student-avatar.svg",
  identifier: "NMC/CNM/24/0912",
  college: "Presbyterian Nursing & Midwifery College",
  programOrDept: "Dual RM & RN Candidate",
  studentProfile: initialStudentProfile
};

export const defaultTeacherUser: AuthUser = {
  id: "user-teacher-01",
  email: "k.appiah@faculty.nmc.edu.gh",
  role: "teacher",
  name: "Dr. Kwesi Appiah",
  title: "FWACN, FWAPCNM • Senior Clinical Preceptor",
  avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
  identifier: "STAFF/NMC/FAC-2018",
  college: "Presbyterian Nursing & Midwifery College / Ridge Regional Hospital",
  programOrDept: "Department of Maternal & Child Health / Clinical Preceptorship",
  facilitatorProfile: initialFacilitatorProfile
};

export const demoAccounts: AuthUser[] = [
  defaultStudentUser,
  defaultTeacherUser
];

