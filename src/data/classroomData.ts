import {
  ClassroomCourse,
  ClassroomAnnouncement,
  ClassroomCourseWork,
  ClassroomSubmission,
  ClassroomMember
} from "../types";

export const initialClassroomCourses: ClassroomCourse[] = [
  {
    id: "cls-mid-301",
    code: "MID-301",
    name: "Advanced Labour Ward & Obstetric Emergencies",
    department: "Midwifery Studies",
    section: "Section B - Group 3",
    room: "Delivery Suite Simulation Lab 2",
    instructor: "Madam Patricia Mensah, Senior Midwife Specialist",
    instructorTitle: "Lead Midwifery Preceptor",
    instructorEmail: "p.mensah@campusedge.edu",
    enrollmentCode: "MID301-LAB",
    bannerTheme: "emerald",
    description: "Clinical mastery of physiological labour, Partograph charting, cephalopelvic disproportion, shoulder dystocia management, and AMTSL protocols.",
    schedule: "Tuesdays & Thursdays • 08:00 - 11:30 AM",
    activeTerm: "First Semester 2026/2027"
  },
  {
    id: "cls-nur-201",
    code: "NUR-201",
    name: "Medical-Surgical Nursing I & Triage",
    department: "General Nursing",
    section: "Section A - Morning",
    room: "Clinical Skills Ward 4",
    instructor: "Dr. Kwesi Amankwah, FWACN",
    instructorTitle: "Senior Lecturer & Surgical Clinical Lead",
    instructorEmail: "k.amankwah@campusedge.edu",
    enrollmentCode: "MEDSURG-201",
    bannerTheme: "sky",
    description: "Foundational pathophysiology, perioperative asepsis, fluid resuscitation, surgical handovers using SBAR, and acute wound care management.",
    schedule: "Mondays & Wednesdays • 09:00 - 12:00 PM",
    activeTerm: "First Semester 2026/2027"
  },
  {
    id: "cls-phm-204",
    code: "PHM-204",
    name: "Clinical Pharmacology & IV Titration",
    department: "Pharmacology & Therapeutics",
    section: "Lecture Stream 1",
    room: "Auditorium C",
    instructor: "Pharm. Irene Adjei",
    instructorTitle: "Hospital Pharmacist & Clinical Tutor",
    instructorEmail: "i.adjei@campusedge.edu",
    enrollmentCode: "PHARM-204",
    bannerTheme: "indigo",
    description: "High-alert obstetric and critical care drug calculations, Magnesium Sulfate infusion safety, uterotonics, and antimicrobial stewardship.",
    schedule: "Fridays • 10:00 AM - 01:00 PM",
    activeTerm: "First Semester 2026/2027"
  },
  {
    id: "cls-ped-205",
    code: "PED-205",
    name: "Neonatal Resuscitation & Pediatric Nursing",
    department: "Pediatrics & Child Health",
    section: "Section C",
    room: "NICU Skills Annex",
    instructor: "Nurse Specialist Diana Osei",
    instructorTitle: "Neonatal Intensive Care Specialist",
    instructorEmail: "d.osei@campusedge.edu",
    enrollmentCode: "NEO-205",
    bannerTheme: "amber",
    description: "Immediate newborn care, Helping Babies Breathe (HBB) algorithm, APGAR scoring, incubator management, and kangaroo mother care (KMC).",
    schedule: "Wednesdays • 01:30 - 04:30 PM",
    activeTerm: "First Semester 2026/2027"
  },
  {
    id: "cls-med-201",
    code: "MED-201",
    name: "Medicine",
    department: "Internal Medicine",
    section: "Medical Stream A",
    room: "Medical Block Lecture Hall 1",
    instructor: "Dr. Francisca Darko, MD, FWACP",
    instructorTitle: "Consultant Physician & Clinical Director",
    instructorEmail: "f.darko@campusedge.edu",
    enrollmentCode: "MED-201-HUB",
    bannerTheme: "sky",
    description: "Clinical internal medicine: acute coronary syndromes, hypertension, pneumonia severity stratification (CURB-65), DKA emergency protocols, and tropical infectious disease triage.",
    schedule: "Tuesdays & Thursdays • 08:00 - 10:30 AM",
    activeTerm: "First Semester 2026/2027"
  },
  {
    id: "cls-surg-201",
    code: "SURG-201",
    name: "Surgery",
    department: "General & Perioperative Surgery",
    section: "Surgical Group 2",
    room: "Surgical Skills Pavilion",
    instructor: "Prof. Samuel Antwi-Boasiako, FWACS",
    instructorTitle: "Consultant General Surgeon",
    instructorEmail: "s.antwi@campusedge.edu",
    enrollmentCode: "SURG-201-HUB",
    bannerTheme: "indigo",
    description: "Perioperative surgery: WHO surgical safety checklist, sterile theatre zoning, acute abdomen diagnosis, wound healing, surgical drain management, and post-op shock response.",
    schedule: "Mondays & Fridays • 08:30 - 11:30 AM",
    activeTerm: "First Semester 2026/2027"
  },
  {
    id: "cls-phys-101",
    code: "PHYS-101",
    name: "Physiology",
    department: "Medical Physiology",
    section: "Pre-Clinical Stream B",
    room: "Physiology Lab A",
    instructor: "Dr. Cynthia Agyemang, PhD",
    instructorTitle: "Senior Medical Physiologist",
    instructorEmail: "c.agyemang@campusedge.edu",
    enrollmentCode: "PHYS-101-HUB",
    bannerTheme: "emerald",
    description: "Systematic medical physiology: cellular membrane transport, cardiac cycle mechanics, Wiggers diagram, oxyhemoglobin dissociation, and renal acid-base buffering.",
    schedule: "Wednesdays & Fridays • 10:00 AM - 12:30 PM",
    activeTerm: "First Semester 2026/2027"
  },
  {
    id: "cls-res-301",
    code: "RES-301",
    name: "Research Methods",
    department: "Health Research & Biostatistics",
    section: "Academic Research Cohort",
    room: "Health Informatics Lab",
    instructor: "Prof. Eric Osei-Tutu, PhD, MPH",
    instructorTitle: "Director of Health Research",
    instructorEmail: "e.oseitutu@campusedge.edu",
    enrollmentCode: "RES-301-HUB",
    bannerTheme: "teal",
    description: "Clinical research methodology: PICO question formulation, epidemiological study designs (RCT, cohort, case-control), sampling techniques, questionnaire validation, IRB ethics, and biostatistics.",
    schedule: "Tuesdays • 02:00 - 05:00 PM",
    activeTerm: "First Semester 2026/2027"
  }
];

export const initialClassroomAnnouncements: ClassroomAnnouncement[] = [
  {
    id: "ann-1",
    courseId: "cls-mid-301",
    authorName: "Madam Patricia Mensah",
    authorRole: "teacher",
    title: "Labour Ward Simulation Rota & Partograph Case Studies Released",
    text: "Good morning class, please review the revised WHO Labour Care Guide (LCG) guidelines uploaded in the class materials. Tomorrow's practical station will focus on recognizing when cervical dilation crosses the Alert Line, with particular attention to assessing maternal hydration and fetal heart auscultation intervals. Come with your clinical stethoscopes and scrub tunics.",
    timestamp: "Yesterday at 08:30 AM",
    pinned: true,
    attachments: [
      {
        title: "WHO-Labour-Care-Guide-Clinical-Manual-2026.pdf",
        type: "pdf",
        url: "https://www.who.int/publications/i/item/9789240017566"
      },
      {
        title: "Partograph Alert Line Escalation Protocol",
        type: "link"
      }
    ],
    comments: [
      {
        id: "c-1",
        authorName: "Emmanuel Boateng",
        authorRole: "student",
        content: "Thank you Madam Patricia. Will the Pinard stethoscope also be tested or electronic Doppler?",
        timestamp: "Yesterday at 09:15 AM"
      },
      {
        id: "c-2",
        authorName: "Madam Patricia Mensah",
        authorRole: "teacher",
        content: "Both Pinard and Doppler will be required at the OSCE station, Emmanuel. Be prepared for both.",
        timestamp: "Yesterday at 09:40 AM"
      }
    ]
  },
  {
    id: "ann-2",
    courseId: "cls-mid-301",
    authorName: "Madam Patricia Mensah",
    authorRole: "teacher",
    title: "Clinical Reminder: Active Management of Third Stage (AMTSL)",
    text: "Reminder that Oxytocin 10 IU IM must be administered within 1 minute of infant delivery following the exclusion of a second twin. Controlled cord traction must only be performed when the uterus is contracted firmly. Use the EdgeAI Tutor in your hub if you need to review the 4 Ts of PPH.",
    timestamp: "Sep 14, 2026, 02:15 PM",
    pinned: false,
    attachments: [
      {
        title: "AMTSL-Checklist-QuickRef.pdf",
        type: "pdf"
      }
    ],
    comments: []
  },
  {
    id: "ann-3",
    courseId: "cls-nur-201",
    authorName: "Dr. Kwesi Amankwah",
    authorRole: "teacher",
    title: "Pre-Operative Checklist & Surgical SBAR Handover Assignment",
    text: "Colleagues, the clinical case study assignment on Post-Operative Wound Dehiscence and SBAR Escalation has been published. Use the AI Clinical Assistant in your assignment panel to check your draft care plan before submission.",
    timestamp: "Sep 12, 2026, 11:00 AM",
    pinned: true,
    attachments: [
      {
        title: "WHO Surgical Safety Checklist - Ward Edition",
        type: "pdf"
      }
    ],
    comments: []
  }
];

export const initialClassroomCourseWork: ClassroomCourseWork[] = [
  {
    id: "cw-mid-1",
    courseId: "cls-mid-301",
    title: "Clinical Case Study: Obstructed Labour & Cephalopelvic Disproportion (CPD)",
    topic: "Obstetric Emergencies",
    maxPoints: 100,
    dueDate: "2026-09-24",
    dueTime: "23:59",
    state: "PUBLISHED",
    description: `A 24-year-old primigravida at 40 weeks gestation was admitted in active labour at 04:00 with cervical dilation of 5 cm. By 09:00 (5 hours later), repeat examination reveals:
• Cervical dilation unchanged at 5 cm (crossed the Action Line by 1 hour).
• Strong contractions 4 in 10 minutes, each lasting 50 seconds.
• Caput succedaneum +++ and severe 3+ parietal moulding.
• Maternal pulse 108 bpm, BP 135/88 mmHg, temperature 37.8°C.
• Bandl's physiological ring visible as an oblique abdominal groove.

Task Requirements:
1. Formulate your primary diagnosis with specific clinical justifications.
2. Outline your immediate emergency midwifery care plan using the SBAR framework.
3. List 4 critical nursing priorities before transfer to the obstetric theatre for emergency caesarean section.
4. Highlight 2 severe maternal and fetal complications that could occur if surgery is delayed.`,
    rubricCriteria: [
      "Clinical Accuracy of Diagnosis & Justification (25 pts)",
      "SBAR Handover Quality & Escalation Protocol (25 pts)",
      "Pre-operative Midwifery Care Plan & Hydration/Asepsis (25 pts)",
      "Complication Anticipation (Ruptured Uterus, Fistula, Asphyxia) (25 pts)"
    ],
    clinicalScenario: "Labour Ward Emergency Admission • Bed 4",
    attachments: [
      {
        title: "WHO Partograph Case Study Chart.pdf",
        type: "pdf"
      },
      {
        title: "Emergency Obstetric Transfer Guidelines",
        type: "link"
      }
    ]
  },
  {
    id: "cw-mid-2",
    courseId: "cls-mid-301",
    title: "Postpartum Hemorrhage (PPH) Management Plan & Uterotonic Protocol",
    topic: "Obstetric Emergencies",
    maxPoints: 100,
    dueDate: "2026-10-02",
    dueTime: "17:00",
    state: "PUBLISHED",
    description: `Following an unassisted vaginal delivery of a 4.1 kg infant, the mother develops persistent vaginal trickle that rapidly escalates to pooling blood (>750 mL). The uterus feels soft, boggy, and palpates above the umbilicus.

Detail the step-by-step emergency intervention protocol:
1. Immediate bimanual compression technique.
2. Sequential uterotonic medication administration (Oxytocin, Ergometrine/Syntometrine, Misoprostol, Tranexamic Acid) with contraindication checks.
3. Fluid resuscitation calculation (crystalloid vs blood products).
4. SBAR escalation call script to the Obstetrician on call.`,
    rubricCriteria: [
      "Immediate Assessment & Bimanual Compression (25 pts)",
      "Pharmacological Cascade & Contraindications (30 pts)",
      "Resuscitation & Volume Replacement (25 pts)",
      "Documentation & Multidisciplinary Communication (20 pts)"
    ],
    attachments: [
      {
        title: "PPH Emergency Bundle Checklist",
        type: "pdf"
      }
    ]
  },
  {
    id: "cw-mid-3",
    courseId: "cls-mid-301",
    title: "Pre-Eclampsia & Magnesium Sulfate (Pritchard Regimen) Safety Audit",
    topic: "Maternal Pharmacology",
    maxPoints: 50,
    dueDate: "2026-10-10",
    dueTime: "23:59",
    state: "PUBLISHED",
    description: `Write a critical bedside protocol for monitoring a patient receiving Magnesium Sulfate IV/IM. Include:
• Pre-administration clinical safety checklist (patellar reflex, respiratory rate threshold, hourly urine output).
• Preparation and slow IV administration of Calcium Gluconate 10% in case of toxicity.
• Patient education and supportive nursing care during magnesium infusion flushes.`,
    rubricCriteria: [
      "Safety Thresholds & Toxicity Criteria (20 pts)",
      "Antidote Protocol & Administration (15 pts)",
      "Patient Communication & Comfort (15 pts)"
    ]
  },
  {
    id: "cw-nur-1",
    courseId: "cls-nur-201",
    title: "Post-Operative Hypovolemic Shock & SBAR Escalation Report",
    topic: "Surgical Nursing",
    maxPoints: 100,
    dueDate: "2026-09-28",
    dueTime: "23:59",
    state: "PUBLISHED",
    description: `Develop a comprehensive SBAR escalation handover for a patient 4 hours post-laparotomy displaying tachycardia (HR 124), hypotension (BP 82/50), oliguria (15 mL/hr), and pale clammy extremities. Formulate the nursing priority interventions and fluid resuscitation plan.`,
    rubricCriteria: [
      "Vital Sign Trend Interpretation (25 pts)",
      "SBAR Handover Precision (25 pts)",
      "IV Fluid Challenge & Blood Sampling (30 pts)",
      "Surgical Wound & Drain Inspection (20 pts)"
    ]
  }
];

export const initialClassroomSubmissions: ClassroomSubmission[] = [
  {
    id: "sub-1",
    courseId: "cls-mid-301",
    courseWorkId: "cw-mid-1",
    studentId: "std-001",
    studentName: "Akosua Addo",
    studentEmail: "a.addo@campusedge.edu",
    submittedAt: "2026-09-15 14:22",
    status: "turned_in",
    content: `PATIENT CLINICAL CASE STUDY RESPONSE
Course: MID-301 Advanced Labour Ward
Student: Akosua Addo (Student ID: CE-2026-MID-042)

1. PRIMARY DIAGNOSIS & CLINICAL JUSTIFICATION:
Primary Diagnosis: Obstructed Labour secondary to Cephalopelvic Disproportion (CPD) in active phase of first stage of labour, complicated by maternal dehydration and threatened uterine rupture (Bandl's Ring present).

Clinical Justification:
• Prolonged Active Phase: Cervical dilation stalled at 5 cm over 5 consecutive hours despite frequent, strong uterine contractions (4 in 10 mins lasting 50s). Plotting crossed the Action Line by 1 hour.
• Severe Mechanical Obstructive Signs: High grade 3+ parietal moulding and extensive caput succedaneum (+++) indicating the fetal skull is forcefully compressed against unyielding maternal pelvic bones.
• Impending Rupture: Presence of Bandl's pathological retraction ring (visible abdominal oblique furrow) and maternal tachycardia (108 bpm) with pyrexia (37.8°C).

2. SBAR ESCALATION HANDOVER:
S - Situation: "I am Akosua Addo, midwife intern on Labour Ward Bed 4. I am calling regarding Mrs. K, 24yo primigravida at 40 weeks with obstructed labour and threatened uterine rupture."
B - Background: "Admitted at 04:00 at 5 cm dilation. Now 09:00, no cervical progress for 5 hours despite adequate contractions (4/10, 50s)."
A - Assessment: "Fetal head not descending, caput +++, moulding 3+, Bandl's ring palpable, maternal pulse 108, BP 135/88, temp 37.8°C. Partograph has crossed the Action Line."
R - Recommendation: "Immediate obstetric evaluation at bedside for emergency Caesarean Section. Theatre team and pediatric team need urgent activation."

3. IMMEDIATE PRE-OPERATIVE MIDWIFERY PRIORITIES:
• Discontinue any uterotonic infusions immediately to prevent catastrophic uterine rupture.
• Establish dual large-bore IV cannulae (16G) and infuse warmed Ringer's Lactate/Hartmann's solution for fluid resuscitation.
• Insert an indwelling Foley catheter to decompress the bladder (minimizes bladder injury during lower uterine segment caesarean section) and monitor hourly urine output.
• Cross-match 2 units of packed red blood cells, administer IV broad-spectrum prophylactic antibiotics per college protocol, and obtain informed surgical consent while providing calm reassurance.

4. SEVERE COMPLICATIONS IF SURGERY IS DELAYED:
• Maternal: Complete uterine rupture leading to massive intra-abdominal hemorrhage, hypovolemic shock, maternal mortality, or subsequent obstetric fistula (vesicovaginal or rectovaginal fistula from ischemic tissue necrosis).
• Fetal: Severe intrapartum asphyxia, intracranial hemorrhage, meconium aspiration syndrome, and stillbirth.`,
    grade: 96,
    maxPoints: 100,
    tutorFeedback: "Outstanding clinical reasoning, Akosua. Your SBAR handover is precise, urgent, and appropriately highlights Bandl's ring as an impending rupture sign. Well done on prioritizing bladder decompression.",
    aiReview: {
      readinessScore: 95,
      estimatedScore: 96,
      strengths: [
        "Identified Bandl's ring promptly and accurately classified the emergency as threatened uterine rupture.",
        "SBAR script is concise, structured, and clinically actionable.",
        "Comprehensive pre-op care plan correctly prioritized stopping uterotonics and catheterizing the bladder."
      ],
      improvements: [
        "Explicitly specify left lateral tilt during maternal transfer to avoid supine aortocaval compression.",
        "Mention continuous fetal heart rate monitoring with Doppler or ultrasound while waiting for the surgical team."
      ],
      safetyNotes: [
        "Strictly avoid any fundal pressure or further digital vaginal examinations when Bandl's ring is recognized."
      ],
      rubricBreakdown: [
        { criterion: "Diagnosis & Justification", score: "25/25", comment: "Flawless correlation of physical findings with CPD criteria." },
        { criterion: "SBAR Escalation", score: "24/25", comment: "Excellent urgency and clarity in communication." },
        { criterion: "Pre-Operative Care Plan", score: "24/25", comment: "Included dual 16G cannulae and Foley bladder decompression." },
        { criterion: "Complication Anticipation", score: "23/25", comment: "Properly identified obstetric fistula risk and intrapartum asphyxia." }
      ],
      formativeFeedback: "Exemplary clinical submission matching Council examination standards."
    }
  }
];

export const initialClassroomMembers: ClassroomMember[] = [
  {
    id: "mem-1",
    courseId: "cls-mid-301",
    name: "Madam Patricia Mensah",
    email: "p.mensah@campusedge.edu",
    role: "teacher",
    department: "Midwifery Studies",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mem-2",
    courseId: "cls-mid-301",
    name: "Dr. Kwesi Amankwah",
    email: "k.amankwah@campusedge.edu",
    role: "co-teacher",
    department: "Obstetrics & Gynecology",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mem-3",
    courseId: "cls-mid-301",
    name: "Akosua Addo (You)",
    email: "a.addo@campusedge.edu",
    role: "student",
    department: "Midwifery Year 3",
    clinicalGroup: "Ward Group 3A",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mem-4",
    courseId: "cls-mid-301",
    name: "Emmanuel Boateng",
    email: "e.boateng@campusedge.edu",
    role: "student",
    department: "Nursing & Midwifery Year 3",
    clinicalGroup: "Ward Group 3A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mem-5",
    courseId: "cls-mid-301",
    name: "Abena Serwaa",
    email: "a.serwaa@campusedge.edu",
    role: "student",
    department: "Midwifery Year 3",
    clinicalGroup: "Ward Group 3B",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mem-6",
    courseId: "cls-mid-301",
    name: "Kofi Frimpong",
    email: "k.frimpong@campusedge.edu",
    role: "student",
    department: "General Nursing Year 3",
    clinicalGroup: "Ward Group 3B",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mem-7",
    courseId: "cls-mid-301",
    name: "Priscilla Ofori",
    email: "p.ofori@campusedge.edu",
    role: "student",
    department: "Midwifery Year 3",
    clinicalGroup: "Ward Group 3A",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  }
];
