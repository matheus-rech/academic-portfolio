
import { Education, Experience, Publication, Skill } from './types';

export const CV_DATA = {
  name: "Matheus Machado Rech, M.D.",
  location: "Lagoa Vermelha, RS, Brazil",
  address: "2217 Benjamin Constant Ave, Apt 1, Lagoa Vermelha, RS 95300-000, Brazil",
  contact: {
    email: "mmrech.md@gmail.com",
    phone: "+55 54 99692-1904",
    linkedin: "linkedin.com/in/mmrech",
    orcid: "0000-0002-2961-9443",
    license: "CRM-RS 57267"
  },
  education: [
    {
      degree: "Doctor of Medicine (M.D.)",
      institution: "University of Caxias do Sul (UCS)",
      location: "Caxias do Sul, RS, Brazil",
      period: "Jan 2024",
      details: ["Class Speaker (elected by peers), Graduation Ceremony (2024)."]
    }
  ] as Education[],
  training: [
    {
      degree: "Principles and Practice of Clinical Research (PPCR)",
      institution: "Harvard T.H. Chan School of Public Health",
      location: "Hybrid / Boston, MA",
      period: "2024",
      details: [
        "9-month postgraduate-level certificate program (Director: Felipe Fregni, MD, PhD).",
        "PPCR 5-Day Immersion Course - intensive in-person module in clinical research methodology.",
        "PPCR 3-Day Advanced Statistical Workshop (July 29–31, 2024) - advanced biostatistical methods for clinical research.",
        "PPCR Research Manuscript Writing Workshop - scientific writing and manuscript preparation for peer reviewed publication."
      ]
    },
    {
      degree: "National Surgical, Obstetric and Anaesthesia Planning: Linking Health Policy to Action",
      institution: "UNITAR | Global Surgery Foundation | Harvard PGSSC",
      location: "Online",
      period: "2020 – 2021",
      details: ["Special online educational series comprising 7 core events from Sept 28, 2020, to Jan 13, 2021."]
    },
    {
      degree: "From Draft to Paper: Theory and Practice for Scientific Writing Development",
      institution: "University of São Paulo (USP), Medical School",
      location: "São Paulo, Brazil",
      period: "2022",
      details: ["40-hour University Extension Course focused on scientific communication and publication strategy (Sept – Nov 2022)."]
    },
    {
      degree: "Applied Biostatistics Course 2021-2022",
      institution: "Harvard Catalyst | Harvard Medical School",
      location: "Boston, MA (Remote)",
      period: "2021 – 2022",
      details: ["Completed via the Program in Global Surgery and Social Change (PGSSC)."]
    },
    {
      degree: "Continuing Education Program in Research (100-hour workload)",
      institution: "University of Caxias do Sul (UCS) + AO Spine Latin America",
      location: "Online",
      period: "Aug – Nov 2019",
      details: [
        "Course Coordinator: Asdrubal Falavigna, MD, PhD.",
        "Modules: Search in Database (Nelson Astur Neto), Interpreting Evidence (José María Jimenez), and Manuscript Writing (Asdrubal Falavigna)."
      ]
    }
  ] as Education[],
  certifications: [
    { name: "Advanced Cardiovascular Life Support (ACLS)", issuer: "American Heart Association", period: "2024 – 2026", details: ["Certified Provider (Porto Alegre, RS, Brazil)."] }
  ],
  research: [
    {
      role: "Undergraduate Research Fellow (PIBIC/CNPq Program)",
      organization: "University of Caxias do Sul (UCS), Dept of Biomedical Engineering - Lab of AI/ML Applied to Healthcare",
      location: "Caxias do Sul, RS, Brazil",
      period: "Apr 2020 - Mar 2023",
      points: [
        "Advisor: Leandro Luis Corso, PhD.",
        "Project: OTIMIZAQUANT - Reliability-Based Global Optimization for Biomedical Engineering Design and Application.",
        "Applied reliability-based global optimization algorithms to improve robustness of computational models for biomedical device design.",
        "Developed Python and MATLAB pipelines to simulate uncertainty and evaluate performance in healthcare-related engineering systems."
      ]
    }
  ] as Experience[],
  publications: [
    { 
      title: "Development and prospective validation of a machine learning model to predict mortality in cirrhosis with esophageal variceal bleeding", 
      authors: "Rech MM, Corso LL, Dal Bó EF, Ferraza AD, Tomé F, Terres AZ, Balbinot RS, Balbinot RA, Balbinot SS, Soldera J", 
      journal: "World Journal of Hepatology", 
      year: 2025, 
      type: "Accepted",
      significance: "Successfully validated an AI model for real-world clinical use, enhancing prognostic precision in hepatology.",
      selected: true
    },
    { 
      title: "Bibliometric analysis of the most cited articles in BRICS research", 
      authors: "Rech MM, Almeida GL", 
      journal: "BRICS Journal of Economics", 
      year: 2020, 
      type: "Peer-Reviewed",
      doi: "10.38050/2712-7508-2020-1-4-9",
      significance: "Identified key research trends and leading institutions within the BRICS nations to inform policy-oriented scholarly dialogue.",
      selected: true
    },
    { 
      title: "The persistence of “Caucasian” as a descriptor in research and clinical practice in Australia: a commentary with focus on mental health", 
      authors: "Rech MM, Viscardi LH, Zubaran C", 
      journal: "Monash Bioethics Review", 
      year: 2025, 
      type: "Peer-Reviewed",
      doi: "10.1007/s40592-025-00270-1",
      significance: "Critically examined the scientific validity of racial descriptors in psychiatric research to promote precision in clinical communication.",
      selected: true
    },
    { 
      title: "The effects of reverse Trendelenburg position during intracranial neurosurgery on brain hydrodynamics and hemodynamics: a systematic review and meta-analysis", 
      authors: "Ramos MB, Britz JPE, Rech MM, Nascimento VPA, et al", 
      journal: "Neurosurgical Review", 
      year: 2025, 
      type: "Peer-Reviewed",
      doi: "10.1007/s10143-025-03655-2",
      significance: "Established evidence-based positioning protocols to manage intracranial pressure during neurosurgical procedures.",
      selected: true
    },
    { 
      title: "Impact of Music Therapy on Cognitive Function in Elderly Patients with Mild Cognitive Impairment and Early Dementia: A Systematic Review", 
      authors: "Liriano A, Bencosme AI, Furzan A, Rech MM, et al", 
      journal: "Principles and Practice of Clinical Research Journal (PPCRJ)", 
      year: 2025, 
      type: "Peer-Reviewed",
      doi: "10.21801/ppcrj.2024.104.9",
      significance: "Quantified the impact of non-pharmacological interventions on geriatric cognitive preservation."
    },
    { 
      title: "The impact of neuroendoscopic drainage in intraventricular hemorrhage: an updated meta-analysis", 
      authors: "de Lima Gibbon F, Lindner RJ, Rech M, et al", 
      journal: "Neurosurgical Review", 
      year: 2025, 
      type: "Peer-Reviewed",
      doi: "10.1007/s10143-025-03471-8",
      significance: "Updated the evidence base for minimally invasive neurosurgical techniques in managing acute hemorrhagic stroke."
    },
    { 
      title: "Pembrolizumab in gestational trophoblastic neoplasia: systematic review and meta-analysis with sub-group analysis of potential prognostic factors", 
      authors: "Barcellos M, Braga A, Rech MM, et al", 
      journal: "Clinics", 
      year: 2025, 
      type: "Peer-Reviewed",
      doi: "10.1016/j.clinsp.2025.100583",
      significance: "Evaluated novel immunotherapy pathways for chemoresistant gynecologic cancers.",
      selected: true
    },
    { 
      title: "Response to commentary on “Pembrolizumab in gestational trophoblastic neoplasia: systematic review and meta-analysis with sub-group analysis of potential prognostic factors”", 
      authors: "Barcellos M, Braga A, Rech MM, et al", 
      journal: "Clinics", 
      year: 2025, 
      type: "Peer-Reviewed",
      doi: "10.1016/j.clinsp.2025.100713"
    },
    { 
      title: "Predicting major adverse cardiovascular events after orthotopic liver transplantation using a supervised machine learning model: A cohort study", 
      authors: "Soldera J, Corso LL, Rech MM, et al", 
      journal: "World Journal of Hepatology", 
      year: 2024, 
      type: "Peer-Reviewed",
      doi: "10.4254/wjh.v16.i2.193",
      significance: "Developed a predictive framework to mitigate cardiovascular risks in the post-transplant recovery phase.",
      selected: true
    },
    { 
      title: "Publication trends of research on intrathecal baclofen therapy: a bibliometric analysis of the literature", 
      authors: "Rech MM, Ramos MB, Piva FE, et al", 
      journal: "World Neurosurgery", 
      year: 2024, 
      type: "Peer-Reviewed",
      doi: "10.1016/j.wneu.2023.08.006",
      significance: "Mapped two decades of global research to identify leading institutions and future frontiers in spasticity management."
    },
    { 
      title: "Repercussions of the Emergency neurological life support on scientific literature: a bibliometric study", 
      authors: "Ramos MB, Rech MM, Telles JPM, Moraes WM, Teixeira MJ, Figueiredo EG", 
      journal: "Archives of Neuro-Psychiatry", 
      year: 2024, 
      type: "Peer-Reviewed",
      doi: "10.1055/s-0043-1777110"
    },
    { 
      title: "Machine learning models to forecast outcomes of pituitary surgery: a systematic review in quality of reporting and current evidence", 
      authors: "Rech MM, de Macedo Filho L, White AJ, et al", 
      journal: "Brain Sciences", 
      year: 2023, 
      type: "Peer-Reviewed",
      doi: "10.3390/brainsci13030495",
      significance: "Highlighted key reporting deficiencies in neurosurgical AI models to drive standardization and clinical trust.",
      selected: true
    },
    { 
      title: "A shared decision-making tool to support the decision of patients with Lumbar Disc Herniation on whether to undergo surgery: a pilot study", 
      authors: "Corso LL, Biasuz R, Falavigna A, Rech MM, Berteli GO", 
      journal: "Research, Society and Development", 
      year: 2023, 
      type: "Peer-Reviewed",
      doi: "10.33448/rsd-v12i3.40722"
    },
    { 
      title: "Immunotherapy in the treatment of chemoresistant gestational trophoblastic neoplasia - systematic review with a presentation of the first 4 Brazilian cases", 
      authors: "Braga A, Balthar E, Souza LCS, et al", 
      journal: "Clinics", 
      year: 2023, 
      type: "Peer-Reviewed",
      doi: "10.1016/j.clinsp.2023.100260"
    },
    { 
      title: "The Author Impact Factor as a Metric to Evaluate the Impact of Neurosurgical Researchers", 
      authors: "Ramos MB, Rech MM, Dagostini CM, Britz JPE, Teixeira MJ, Figueiredo EG", 
      journal: "World Neurosurgery", 
      year: 2022, 
      type: "Peer-Reviewed",
      doi: "10.1016/j.wneu.2022.05.100"
    },
    { 
      title: "Knowledge, attitudes, and behaviors regarding the use of clinical practice guidelines among spine surgeons in Latin America", 
      authors: "Rech MM, De Assuncao Bicca Y, Ramos MB, Gionedis MC, Aguzzoli A, Falavigna A", 
      journal: "Surgical Neurology International", 
      year: 2022, 
      type: "Peer-Reviewed",
      doi: "10.25259/SNI_220_2022"
    },
    { 
      title: "Demoralization, depression and anxiety in postpartum women of culturally and linguistic diverse backgrounds in Australia", 
      authors: "Arshad A, Foresti K, Rech m, Brakoulias V, Zubaran C", 
      journal: "European Journal of Midwifery", 
      year: 2021, 
      type: "Peer-Reviewed",
      doi: "10.18332/ejm/140791"
    },
    { 
      title: "Surgical Management of Refractory Idiopathic Intracranial Hypertension", 
      authors: "Macedo Filho L, White AJ, Rech MM, Nicholson P, Radovanovic I, Gentili F, Almeida JP", 
      journal: "In: Cerebrospinal Fluid Rhinorrhea: Comprehensive Guide to Evaluation and Management. Elsevier", 
      year: 2022, 
      type: "Book Chapter"
    },
    { 
      title: "Jean-Etienne Esquirol: The Life and Battle of the Alienist Against the Status Quo of Madness", 
      authors: "Rech MM", 
      journal: "In: Curiosities from the History of Medicine. Oikos", 
      year: 2019, 
      type: "Book Chapter"
    },
    { 
      title: "Acute Arterial Occlusion", 
      authors: "Rech MM, Dutra BV, Condah AM, Dutra CF, Lain VV", 
      journal: "In: Fundamentals in Vascular and Endovascular Surgery. University of Caxias do Sul Press (EDUCS)", 
      year: 2022, 
      type: "Book Chapter"
    },
    { 
      title: "Aerospace medicine: its history and prominence in contemporaneity", 
      authors: "Irigonhe FG, Rech MM, Lopes MHI, Russomano T", 
      journal: "In: Facts from the History of Medicine. Oikos", 
      year: 2021, 
      type: "Book Chapter"
    },
    { 
      title: "Nausea and Vomiting in the Recovery Room", 
      authors: "Rech MM, Bossardi A, Burtet CT, Ribeiro FE, Tonatto Filho AJ", 
      journal: "In: Practical Guide to Anesthesiology. University of Caxias do Sul Press (EDUCS)", 
      year: 2021, 
      type: "Book Chapter"
    },
    { 
      title: "A Shared Decision-Making Tool to Support the Decision of Patients with Lumbar Disc Herniation on Whether to Undergo Surgery", 
      authors: "Rech MM", 
      journal: "XXXIV Brazilian Congress of Neurosurgery, Sao Paulo", 
      year: 2023, 
      type: "Abstract"
    },
    { 
      title: "Knowledge, Attitudes and Behaviors Regarding the Use of Clinical Practice Guidelines Among Spine Surgeons", 
      authors: "Rech MM", 
      journal: "XXXIII Brazilian Congress of Neurosurgery, Joao Pessoa", 
      year: 2022, 
      type: "Abstract"
    },
    { 
      title: "Interpretable Machine Learning Algorithms Applied to Outcome Prediction in Spine Surgery", 
      authors: "Rech MM, Falavigna A, Corso LL", 
      journal: "XXXI Young Researchers Meeting, Caxias do Sul", 
      year: 2023, 
      type: "Abstract"
    },
    { 
      title: "Use of a Machine Learning Algorithm to Predict Rebleeding and Mortality for Esophageal Variceal Bleeding", 
      authors: "Rech MM, Soldera J, Tome F, et al", 
      journal: "XXIX Young Researchers Meeting, Caxias do Sul", 
      year: 2021, 
      type: "Abstract"
    },
    { 
      title: "Aerospace Medicine: History and Contemporary Relevance", 
      authors: "Rech MM, Irigonhe FG, Itaqui Lopes MH, Russomano T", 
      journal: "VII Rio Grande do Sul Meeting on History of Medicine", 
      year: 2020, 
      type: "Abstract"
    },
    { 
      title: "Prospective Validation of a Neural Network Model for the Prediction of 1-Year Mortality in Cirrhotic Patients with Acute Esophageal Variceal Bleeding", 
      authors: "Rech MM, Corso LL, Dal Bo EF, et al", 
      journal: "Gastroenterology. 2023;164(6 Suppl):S1341. DDW Chicago", 
      year: 2023, 
      type: "Abstract"
    },
    { 
      title: "Predicting Post-Liver Transplantation Major Adverse Cardiovascular Events Using a Machine Learning Algorithm", 
      authors: "Soldera J, Corso LL, Rech MM, et al", 
      journal: "Gastroenterology. 2023;164(6 Suppl):S1387. DDW Chicago", 
      year: 2023, 
      type: "Abstract"
    },
    { 
      title: "Innovation in the Academic Path: Medical Students' Scientific Initiation in AI Projects", 
      authors: "Rech MM, Ferrazza AD, Corso LL", 
      journal: "58th Brazilian Congress of Medical Education (COBEM)", 
      year: 2020, 
      type: "Abstract"
    }
  ] as Publication[],
  clinicalExperience: [
    {
      role: "Observership in Neurosurgery",
      organization: "Mayo Clinic, Department of Neurologic Surgery",
      location: "Jacksonville, FL, USA",
      period: "Feb 2023 - Mar 2023",
      points: [
        "Observed complex cranial procedures and participated in daily ward rounds and multidisciplinary case discussion conferences.",
        "Attended daily Skull Base Lab activities (Supervisor: Joao Paulo Almeida, MD)."
      ]
    },
    {
      role: "Internship, Department of Neurosurgery",
      organization: "Hospital Sao Jose - Santa Casa de Misericordia de Porto Alegre",
      location: "Porto Alegre, RS, Brazil",
      period: "Jan 2021; Jul 2021",
      points: [
        "Participated in inpatient and outpatient clinical activities, daily rounds, and surgical case discussions.",
        "Observed neurosurgical procedures and engaged in the department's academic routine."
      ]
    }
  ],
  teaching: [
    { role: "Teaching Assistant, Neuroanatomy", organization: "University of Caxias do Sul (UCS)", period: "2019 – 2020", location: "Brazil", points: ["Delivered supplemental lectures and supported junior medical and health-sciences students (Supervisor: Asdrubal Falavigna)."] },
    { role: "Teaching Assistant, Neurophysiology", organization: "University of Caxias do Sul (UCS)", period: "2019", location: "Brazil", points: ["30 contact hours. Supplemental lectures and student support (Supervisor: Asdrubal Falavigna)."] },
    { role: "Teaching Assistant, Biophysiology", organization: "University of Caxias do Sul (UCS)", period: "2020", location: "Brazil", points: ["30 contact hours. Supplemental lectures and student support (Supervisor: Rafael Colombo)."] },
    { role: "Teaching Assistant, Human Anatomy (Morphology)", organization: "University of Caxias do Sul (UCS)", period: "2020", location: "Brazil", points: ["60 contact hours. Supplemental lectures (Supervisor: Fabio Pasqualoto)."] },
    { role: "Teaching Assistant, Surgical Technique & Anesthesia", organization: "University of Caxias do Sul (UCS)", period: "2020", location: "Brazil", points: ["60 contact hours. Skills-focused teaching (Supervisor: Marcos Dalponte)."] },
    { role: "Teaching Assistant, Neurology / Neuropsychiatry", organization: "University of Caxias do Sul (UCS)", period: "2022", location: "Brazil", points: ["60 contact hours. Supplemental lectures (Supervisor: Marcelo Mattana)."] }
  ],
  leadership: [
    { 
      role: "Scientific Director (2019-20), Vice President (2020-21), President (2021-22)", 
      organization: "Virvi Ramos Medical Student Union, UCS", 
      period: "2019 – 2022", 
      location: "Brazil", 
      points: [
        "Elected by peers. Represented medical students and collaborated with administration on institutional initiatives.",
        "Coordinated academic and research programming as Scientific Director.",
        "Led institutional reforms including the Meti Awards and the Hippocratic Plane Tree Project."
      ] 
    },
    { 
      role: "Founding President (elected)", 
      organization: "Association of Medical Students of Rio Grande do Sul (AEMED-RS)", 
      period: "2021 – 2022", 
      location: "Brazil", 
      points: ["Coordinated statewide student representation, academic activities, and institutional partnerships."] 
    },
    { 
      role: "Director of Medical Education Affairs (180-hour workload)", 
      organization: "Brazilian Medical Students Association (AEMED-BR)", 
      period: "2022 – 2023", 
      location: "Sao Paulo, Brazil", 
      points: [
        "Liaised between medical schools and the Brazilian Ministry of Education.",
        "Coordinated cross-state academic input for national training assessments.",
        "Aligned positions with the Federal Council of Medicine during policy changes."
      ] 
    },
    { 
      role: "Community Builder, Campus Director, Global Accelerator Intern", 
      organization: "Hult Prize Foundation", 
      period: "2020 – 2023", 
      location: "Global", 
      points: [
        "Built a grassroots national operation in Brazil under zero HQ funding, engaging 41 universities.",
        "Mobilized volunteer teams, cultivated partners, and secured resources to scale student social-entrepreneurship initiatives."
      ] 
    }
  ],
  committeeService: [
    { role: "Representative (Elected)", organization: "Medical School Board (Colegiado), University of Caxias do Sul (UCS)", period: "2023", location: "Brazil" },
    { role: "Member (Fiscal Council)", organization: "Rio Grande do Sul Association for the History of Medicine (AGHM)", period: "2020 – 2024", location: "Porto Alegre, Brazil" },
    { role: "Student Delegate (Elected)", organization: "National Assembly, Brazilian Association of Medical Education (ABEM)", period: "2020", location: "Brazil" }
  ],
  editorialActivities: [
    { role: "Regional Editor (AEMED-RS representative)", organization: "Journal of the Brazilian Medical Association - Junior Doctors", period: "2020 – present", location: "Brazil" }
  ],
  honors: [
    { title: "Class Speaker (elected by peers)", year: 2024, organization: "University of Caxias do Sul" },
    { title: "Second Place, Carlos da Silva Lacaz Prize", year: 2019, organization: "Brazilian Society for the History of Medicine (SBHM)" },
    { title: "Special Prize (Honorable Mention)", year: 2020, organization: "BRICS International School | Russian National Committee on BRICS Research, Moscow" },
    { title: "First Place, 'Systematic Review: Gynecology'", year: 2025, organization: "62nd Brazilian Congress of Gynecology and Obstetrics (CBGO)" },
    { title: "Honorable Mention (ML for Esophageal Variceal Bleeding)", year: 2021, organization: "XXIX Young Researchers Meeting & XI Academic Show" },
    { title: "Honorable Mention (Administration in Clinical Studies)", year: 2020, organization: "58th Brazilian Congress of Medical Education" }
  ],
  voluntaryWork: [
    {
      role: "Volunteer Medical Student",
      organization: "Vine Trust - Medical Program 'Esperanza Amazonica del Peru'",
      location: "Loreto Region, Peru",
      period: "Jan 12 – Feb 1, 2023",
      points: [
        "Amazon Hope medical ship deployment.",
        "Provided primary health-care triage and health education to approximately 1,000 patients across 12 Amazonian river communities (Supervisor: Ronald Ramirez Gonzales, MD)."
      ]
    }
  ],
  skills: [
    { category: "Technical", items: ["Python", "MATLAB", "Machine Learning (Supervised Models)", "Optimization under Uncertainty", "Biostatistics", "Epidemiology", "Clinical Trial Design (PPCR)"] },
    { category: "Languages", items: ["English (9.0/10)", "Spanish (10/10)", "Portuguese (Native)"] }
  ] as Skill[]
};
