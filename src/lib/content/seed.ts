import type { SiteContent } from "./types";

/**
 * PLACEHOLDER CONTENT
 * ───────────────────
 * This seed makes the site fully browsable before the database is connected.
 * Every word, image, and link below gets replaced through the admin panel
 * (Phase 4) — nothing here is meant to be final.
 */
export const seed: SiteContent = {
  profile: {
    name: "Ashfaq Riyaldeen",
    roles: ["Full-Stack Developer", "Software Engineer", "AI / ML Enthusiast"],
    tagline:
      "Computer Engineering undergraduate at the University of Ruhuna, building scalable and efficient systems across software engineering, DevOps, and AI/ML.",
    bio: "<p>I'm a Computer Engineering undergraduate at the University of Ruhuna with a strong foundation in software engineering, DevOps, and AI/ML. I aim to build scalable, efficient systems that drive innovation — combining technical expertise with leadership experience to make a meaningful impact in software development and artificial intelligence.</p><p>Beyond academics, I'm an active member of the IESL Ruhuna Engineering Students' Chapter, and as treasurer of the Akurana Undergraduates and Young Graduates Association I managed finances and organised community-service initiatives.</p>",
    quickFacts: [
      { label: "Degree", value: "BSc in Computer Engineering" },
      { label: "University", value: "University of Ruhuna" },
      { label: "Focus", value: "Full-Stack · DevOps · AI/ML" },
      { label: "Status", value: "Open to opportunities" },
    ],
    currentlyLearning: ["Next.js", "TensorFlow", "System Design"],
    avatarUrl: null,
    resumeUrl: null,
    email: "ashfaqriyaldeen@gmail.com",
    location: "Kandy, Sri Lanka",
    socials: [
      { platform: "GitHub", url: "https://github.com/Ashfaq-Riyaldeen" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/ashfaqriyaldeen/" },
    ],
  },

  settings: {
    siteTitle: "Ashfaq Riyaldeen — Full-Stack Developer",
    metaDescription:
      "Portfolio of Ashfaq Riyaldeen — Computer Engineering undergraduate at the University of Ruhuna, full-stack developer, and AI/ML enthusiast.",
    ogImageUrl: null,
    accentColor: "#7c3aed",
  },

  sections: [
    { key: "hero", title: "Home", navLabel: "Home", visible: true, sortOrder: 1 },
    { key: "about", title: "About Me", navLabel: "About", visible: true, sortOrder: 2 },
    { key: "stats", title: "Highlights", navLabel: "Highlights", visible: true, sortOrder: 3 },
    { key: "resume", title: "Resume / CV", navLabel: "Resume", visible: true, sortOrder: 4 },
    { key: "education", title: "Education", navLabel: "Education", visible: true, sortOrder: 5 },
    { key: "skills", title: "Technical Skills", navLabel: "Skills", visible: true, sortOrder: 6 },
    { key: "projects", title: "Projects", navLabel: "Projects", visible: true, sortOrder: 7 },
    { key: "publications", title: "Research & Publications", navLabel: "Research", visible: true, sortOrder: 8 },
    { key: "experience", title: "Experience", navLabel: "Experience", visible: true, sortOrder: 9 },
    { key: "certifications", title: "Certifications", navLabel: "Certifications", visible: true, sortOrder: 10 },
    { key: "achievements", title: "Achievements & Awards", navLabel: "Achievements", visible: true, sortOrder: 11 },
    { key: "coding-profiles", title: "GitHub & Coding Profiles", navLabel: "Profiles", visible: true, sortOrder: 12 },
    { key: "blogs", title: "Technical Blogs", navLabel: "Blog", visible: true, sortOrder: 13 },
    { key: "testimonials", title: "Testimonials", navLabel: "Testimonials", visible: true, sortOrder: 14 },
    { key: "volunteering", title: "Volunteering & Leadership", navLabel: "Volunteering", visible: false, sortOrder: 15 },
    { key: "gallery", title: "Gallery", navLabel: "Gallery", visible: false, sortOrder: 16 },
    { key: "languages", title: "Languages", navLabel: "Languages", visible: false, sortOrder: 17 },
    { key: "services", title: "Services", navLabel: "Services", visible: false, sortOrder: 18 },
    { key: "faq", title: "FAQ", navLabel: "FAQ", visible: false, sortOrder: 19 },
    { key: "contact", title: "Contact", navLabel: "Contact", visible: true, sortOrder: 20 },
  ],

  stats: [
    { label: "GitHub Repos", value: 35, suffix: "" },
    { label: "Certifications", value: 5, suffix: "" },
    { label: "Internships", value: 1, suffix: "" },
    { label: "Languages Spoken", value: 3, suffix: "" },
  ],

  education: [
    {
      institution: "University of Ruhuna",
      degree: "BSc",
      field: "Computer Engineering",
      startDate: "2022-02",
      endDate: null,
      grade: null,
      logoUrl: null,
      highlights: [
        "Faculty of Engineering",
        "Member of the IESL — Ruhuna Engineering Students' Chapter",
      ],
    },
    {
      institution: "Azhar College Akurana",
      degree: "G.C.E. Advanced Level",
      field: "Physical Science",
      startDate: "2018-03",
      endDate: "2020-10",
      grade: null,
      logoUrl: null,
      highlights: ["Student's Prefect — completed two prefect training programmes"],
    },
    {
      institution: "Institute of English, Sri Lanka",
      degree: "Diploma of Education",
      field: "English",
      startDate: "2018-01",
      endDate: "2018-07",
      grade: null,
      logoUrl: null,
      highlights: [],
    },
  ],

  skillCategories: [
    {
      name: "Languages",
      skills: [
        { name: "TypeScript", icon: null, level: 90 },
        { name: "Python", icon: null, level: 85 },
        { name: "Java", icon: null, level: 75 },
        { name: "C++", icon: null, level: 70 },
        { name: "SQL", icon: null, level: 80 },
      ],
    },
    {
      name: "Frontend",
      skills: [
        { name: "React", icon: null, level: 90 },
        { name: "Next.js", icon: null, level: 88 },
        { name: "Tailwind CSS", icon: null, level: 92 },
        { name: "Framer Motion", icon: null, level: 80 },
      ],
    },
    {
      name: "Backend",
      skills: [
        { name: "Node.js", icon: null, level: 85 },
        { name: "Express", icon: null, level: 80 },
        { name: "PostgreSQL", icon: null, level: 78 },
        { name: "Supabase", icon: null, level: 82 },
        { name: "REST APIs", icon: null, level: 88 },
      ],
    },
    {
      name: "AI / ML",
      skills: [
        { name: "TensorFlow", icon: null, level: 65 },
        { name: "scikit-learn", icon: null, level: 72 },
        { name: "Pandas", icon: null, level: 78 },
        { name: "NumPy", icon: null, level: 78 },
      ],
    },
    {
      name: "Tools",
      skills: [
        { name: "Git & GitHub", icon: null, level: 90 },
        { name: "Docker", icon: null, level: 65 },
        { name: "Linux", icon: null, level: 75 },
        { name: "Figma", icon: null, level: 70 },
        { name: "VS Code", icon: null, level: 95 },
      ],
    },
  ],

  projects: [
    {
      slug: "nova-ai-study-assistant",
      title: "Nova — AI Study Assistant",
      summary:
        "An AI-powered study companion that turns lecture notes into flashcards, quizzes, and spaced-repetition schedules.",
      description:
        "<p>Nova ingests lecture notes (PDF or text) and uses an LLM pipeline to generate flashcards, practice quizzes, and a personalised spaced-repetition schedule. Built with a Next.js frontend, a Python FastAPI service for the ML pipeline, and Supabase for auth and storage.</p><p>Highlights include streaming AI responses, offline-first flashcard review, and a study-streak system that kept beta testers coming back daily.</p>",
      coverUrl: null,
      gallery: [],
      tech: ["Next.js", "TypeScript", "FastAPI", "OpenAI", "Supabase"],
      youtubeUrl: null,
      githubUrl: "https://github.com/your-username/nova",
      liveUrl: null,
      featured: true,
      published: true,
    },
    {
      slug: "pulse-realtime-chat",
      title: "Pulse — Realtime Chat",
      summary:
        "A blazing-fast realtime chat app with rooms, typing indicators, and read receipts — WebSockets end to end.",
      description:
        "<p>Pulse is a realtime chat application supporting rooms, presence, typing indicators, and read receipts. The backend is Node.js with Socket.IO and Redis pub/sub for horizontal scaling; the frontend is React with optimistic UI updates.</p><p>Load-tested to 5,000 concurrent connections on a single node.</p>",
      coverUrl: null,
      gallery: [],
      tech: ["React", "Node.js", "Socket.IO", "Redis", "MongoDB"],
      youtubeUrl: null,
      githubUrl: "https://github.com/your-username/pulse",
      liveUrl: null,
      featured: true,
      published: true,
    },
    {
      slug: "trackr-expense-tracker",
      title: "Trackr — Smart Expense Tracker",
      summary:
        "A mobile-first expense tracker with ML-powered category prediction and beautiful spending insights.",
      description:
        "<p>Trackr makes logging expenses effortless: type \"coffee 450\" and the ML model predicts the category. Monthly insights are rendered as animated charts, and budgets send gentle nudges before you overspend.</p>",
      coverUrl: null,
      gallery: [],
      tech: ["React Native", "Expo", "scikit-learn", "Supabase"],
      youtubeUrl: null,
      githubUrl: "https://github.com/your-username/trackr",
      liveUrl: null,
      featured: false,
      published: true,
    },
  ],

  publications: [
    {
      title:
        "A Lightweight CNN Approach to Handwritten Character Recognition on Low-Power Devices",
      authors: ["Ashfaq Riyaldeen", "Co-Author Name"],
      venue: "Undergraduate Research Symposium",
      year: 2026,
      abstract:
        "We present a compact convolutional architecture achieving 97.2% accuracy on handwritten character recognition while running in under 40ms on commodity mobile hardware — a placeholder abstract you can replace from the admin panel.",
      link: null,
      pdfUrl: null,
      type: "conference",
    },
  ],

  experience: [
    {
      company: "paralegal.lk",
      role: "Software Engineer Intern",
      type: "internship",
      location: "Colombo, Sri Lanka",
      startDate: "2025-05",
      endDate: "2025-11",
      bullets: [],
      logoUrl: null,
    },
  ],

  certifications: [
    {
      title: "Python and Machine Learning",
      issuer: "",
      issueDate: "",
      credentialId: null,
      credentialUrl: null,
      fileUrl: null,
      skills: ["Python", "Machine Learning"],
    },
    {
      title: "Data Science Masterclass",
      issuer: "",
      issueDate: "",
      credentialId: null,
      credentialUrl: null,
      fileUrl: null,
      skills: ["Data Science", "Python"],
    },
    {
      title: "Python for Beginners",
      issuer: "",
      issueDate: "",
      credentialId: null,
      credentialUrl: null,
      fileUrl: null,
      skills: ["Python"],
    },
    {
      title: "Git and Github",
      issuer: "",
      issueDate: "",
      credentialId: null,
      credentialUrl: null,
      fileUrl: null,
      skills: ["Git", "GitHub"],
    },
    {
      title: "GIT for Beginners",
      issuer: "",
      issueDate: "",
      credentialId: null,
      credentialUrl: null,
      fileUrl: null,
      skills: ["Git", "Version Control"],
    },
  ],

  achievements: [
    {
      title: "Winner — University Hackathon 2025",
      description:
        "Led a team of four to first place among 42 teams with an accessibility-focused campus navigation app.",
      date: "2025-10",
      issuer: "Your University",
      imageUrl: null,
      category: "hackathon",
    },
    {
      title: "Dean's List",
      description: "Recognised for academic excellence — three consecutive semesters.",
      date: "2025-06",
      issuer: "Faculty of Computing",
      imageUrl: null,
      category: "award",
    },
  ],

  codingProfiles: [
    { platform: "GitHub", username: "Ashfaq-Riyaldeen", url: "https://github.com/Ashfaq-Riyaldeen" },
  ],

  blogPosts: [
    {
      slug: "understanding-react-server-components",
      title: "Understanding React Server Components (Without the Jargon)",
      excerpt:
        "Server components confused me for months — here's the mental model that finally made them click.",
      content:
        "<p>This is a placeholder post. Write your real posts in the admin panel's editor — or link out to Medium/Dev.to instead.</p>",
      externalUrl: null,
      coverUrl: null,
      tags: ["React", "Next.js"],
      published: true,
      publishedAt: "2026-05-14",
    },
    {
      slug: "my-first-ml-model-mistakes",
      title: "5 Mistakes I Made Training My First ML Model",
      excerpt:
        "Overfitting, data leakage, and other rites of passage — what I'd tell myself before starting.",
      content:
        "<p>This is a placeholder post — replace it from the admin panel.</p>",
      externalUrl: null,
      coverUrl: null,
      tags: ["Machine Learning", "Python"],
      published: true,
      publishedAt: "2026-03-02",
    },
  ],

  testimonials: [
    {
      name: "Dr. Jane Perera",
      role: "Senior Lecturer",
      company: "Your University",
      avatarUrl: null,
      quote:
        "Ashfaq consistently goes beyond the brief — he doesn't just complete assignments, he ships polished products. One of the most driven students I've supervised.",
    },
    {
      name: "Kasun Silva",
      role: "Engineering Lead",
      company: "Acme Software",
      avatarUrl: null,
      quote:
        "During his internship, Ashfaq delivered features we'd normally assign to mid-level engineers. His code was clean, tested, and on time — every time.",
    },
  ],

  volunteering: [
    {
      organization: "IESL — Ruhuna Engineering Students' Chapter",
      role: "Student Member",
      startDate: "2024-04",
      endDate: null,
      description:
        "Taking part in technical projects and events run by the Institution of Engineers Sri Lanka student chapter.",
    },
    {
      organization: "Akurana Undergraduates and Young Graduates Association",
      role: "Treasurer",
      startDate: "2022-08",
      endDate: "2025-08",
      description:
        "Managed the association's finances and organised community-service initiatives.",
    },
    {
      organization: "Azhar College Akurana",
      role: "Student's Prefect",
      startDate: "2018-11",
      endDate: "2020-10",
      description:
        "Maintained discipline, supported teachers and students, and organised school events; completed two prefect training programmes.",
    },
  ],

  gallery: [],

  languages: [
    { name: "Tamil", proficiency: "Native / bilingual" },
    { name: "English", proficiency: "Professional working" },
    { name: "Sinhalese", proficiency: "Professional working" },
  ],

  services: [
    {
      title: "Web Development",
      description: "Modern, fast websites and web apps built with Next.js.",
      icon: null,
    },
  ],

  faqs: [
    {
      question: "Are you open to internships?",
      answer:
        "Yes — I'm actively looking for software engineering internships. Reach out via the contact form below.",
    },
  ],
};
