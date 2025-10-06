/**
 * Constants and Default Data Models
 *
 * Centralized storage for default state, quiz questions, and other constants
 */

// Default Guide Data Model
export const DEFAULT_GUIDE = {
  // Section 1: Vision & Values
  visionQuiz: {
    answers: {}, // Quiz answers stored as { questionId: selectedOption }
    result: null, // Quiz result/type
  },
  weddingPriorities: [], // Top 5 priorities (array of strings)
  niyyahDua: "", // Personal niyyah and dua text
  brideJournal: "", // Free-form journal notes

  // Section 2: Budget Builder
  totalBudget: 0,
  budgetCategories: {
    venue: { percentage: 0, amount: 0 },
    catering: { percentage: 0, amount: 0 },
    attire: { percentage: 0, amount: 0 },
    photography: { percentage: 0, amount: 0 },
    decor: { percentage: 0, amount: 0 },
    misc: { percentage: 0, amount: 0 },
  },
  vendorQuotes: [], // Array of { vendor, category, quote }

  // Section 3: Vendor Tracker
  vendorList: [], // Array of { name, category, contact, status, notes }

  // Section 4: Timeline & Task Manager
  weddingDate: "", // ISO date string (YYYY-MM-DD)
  taskList: [], // Array of { id, title, category, dueDate, status, priority, notes, createdAt }
  showCompletedTasks: true, // Toggle for showing/hiding completed tasks

  // Section 5: Final Blueprint
  finalChecklist: [], // Master checklist items
  exportReady: false, // Flag for PDF export readiness

  // Legacy MVP checklists (kept for backwards compatibility)
  checklists: [
    {
      id: "prewedding",
      title: "Pre‑wedding Setup",
      items: [
        { id: "budget", text: "Set total budget", done: false },
        { id: "date", text: "Choose wedding date(s)", done: false },
        { id: "families", text: "Meet families (introduction)", done: false },
        { id: "venue", text: "Shortlist venues (city & village)", done: false },
      ],
    },
    {
      id: "kayan-lefe",
      title: "Kayan Lefe & Gifts",
      items: [
        { id: "cloth", text: "Fabrics & accessories", done: false },
        { id: "jewelry", text: "Jewelry & cosmetics", done: false },
        { id: "household", text: "Household items (starter kit)", done: false },
      ],
    },
    {
      id: "vendors",
      title: "Vendors & Bookings",
      items: [
        { id: "photography", text: "Photography / Videography", done: false },
        { id: "catering", text: "Catering", done: false },
        { id: "music", text: "Music (DJ/Live)", done: false },
        { id: "attire", text: "Attire (Bride/Groom)", done: false },
      ],
    },
  ],
  notes: "",
};

// Vision Quiz Questions
export const VISION_QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "What best describes your ideal wedding atmosphere?",
    options: [
      {
        value: "traditional",
        text: "Traditional and cultural - honoring Hausa customs fully",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "modern",
        text: "Modern and contemporary - minimalist with Western touches",
        points: { traditional: 0, modern: 3, fusion: 1 },
      },
      {
        value: "fusion",
        text: "Fusion - blending Hausa traditions with modern elements",
        points: { traditional: 1, modern: 1, fusion: 3 },
      },
      {
        value: "grand",
        text: "Grand and luxurious - opulent celebration regardless of style",
        points: { traditional: 1, modern: 2, fusion: 2 },
      },
    ],
  },
  {
    id: "q2",
    question:
      "How important is the Kayan Lefe (bridal gifts) tradition to you?",
    options: [
      {
        value: "essential",
        text: "Essential - a complete traditional Kayan Lefe is a must",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "important",
        text: "Important but flexible - I'll adapt it to my taste",
        points: { traditional: 1, modern: 1, fusion: 3 },
      },
      {
        value: "symbolic",
        text: "Symbolic only - just the key items to honor tradition",
        points: { traditional: 1, modern: 2, fusion: 2 },
      },
      {
        value: "minimal",
        text: "Minimal - I prefer practical gifts over traditional items",
        points: { traditional: 0, modern: 3, fusion: 1 },
      },
    ],
  },
  {
    id: "q3",
    question: "What's your vision for the wedding attire?",
    options: [
      {
        value: "full-traditional",
        text: "Full traditional Hausa attire for all events",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "mix-match",
        text: "Traditional for main events, modern for reception",
        points: { traditional: 1, modern: 1, fusion: 3 },
      },
      {
        value: "modern-elegant",
        text: "Modern elegant gowns with subtle cultural touches",
        points: { traditional: 0, modern: 3, fusion: 2 },
      },
      {
        value: "multiple-changes",
        text: "Multiple outfit changes showcasing different styles",
        points: { traditional: 1, modern: 2, fusion: 2 },
      },
    ],
  },
  {
    id: "q4",
    question: "How do you want to structure your wedding events?",
    options: [
      {
        value: "all-traditional",
        text: "All traditional events - Fatiha, Kamu, Walima as customary",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "combined",
        text: "Combine some events for convenience and cost",
        points: { traditional: 1, modern: 2, fusion: 3 },
      },
      {
        value: "simplified",
        text: "Simplified - just the essential religious ceremony and reception",
        points: { traditional: 0, modern: 3, fusion: 1 },
      },
      {
        value: "extended",
        text: "Extended celebration with additional modern events (e.g., rehearsal dinner)",
        points: { traditional: 1, modern: 2, fusion: 2 },
      },
    ],
  },
  {
    id: "q5",
    question: "What's your approach to wedding decor and aesthetics?",
    options: [
      {
        value: "cultural-colors",
        text: "Rich cultural colors and traditional Hausa patterns",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "elegant-neutral",
        text: "Elegant neutrals with minimalist modern design",
        points: { traditional: 0, modern: 3, fusion: 1 },
      },
      {
        value: "cultural-modern",
        text: "Cultural elements presented in a modern aesthetic",
        points: { traditional: 1, modern: 1, fusion: 3 },
      },
      {
        value: "luxury-glam",
        text: "Luxurious and glamorous regardless of cultural style",
        points: { traditional: 1, modern: 2, fusion: 2 },
      },
    ],
  },
  {
    id: "q6",
    question: "What role will family traditions play in your planning?",
    options: [
      {
        value: "central",
        text: "Central - family elders guide all major decisions",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "collaborative",
        text: "Collaborative - I balance family input with personal choices",
        points: { traditional: 1, modern: 1, fusion: 3 },
      },
      {
        value: "respectful-independent",
        text: "Respectful but independent - I make final decisions",
        points: { traditional: 0, modern: 3, fusion: 2 },
      },
      {
        value: "selective",
        text: "Selective - honor key traditions, skip others",
        points: { traditional: 1, modern: 2, fusion: 2 },
      },
    ],
  },
  {
    id: "q7",
    question: "How important is it to have traditional Hausa entertainment?",
    options: [
      {
        value: "must-have",
        text: "Must have - traditional music and cultural performances",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "mix-both",
        text: "Mix of traditional and contemporary music/entertainment",
        points: { traditional: 1, modern: 1, fusion: 3 },
      },
      {
        value: "mostly-modern",
        text: "Mostly modern - DJ, band, contemporary performances",
        points: { traditional: 0, modern: 3, fusion: 1 },
      },
      {
        value: "unique",
        text: "Unique fusion - maybe live band playing traditional songs modernly",
        points: { traditional: 1, modern: 2, fusion: 3 },
      },
    ],
  },
  {
    id: "q8",
    question: "What's your priority for the wedding menu?",
    options: [
      {
        value: "all-hausa",
        text: "All traditional Hausa cuisine - Tuwo, Miyan Kuka, etc.",
        points: { traditional: 3, modern: 0, fusion: 1 },
      },
      {
        value: "nigerian-variety",
        text: "Variety of Nigerian cuisines including Hausa favorites",
        points: { traditional: 2, modern: 1, fusion: 3 },
      },
      {
        value: "international",
        text: "International menu with some Nigerian options",
        points: { traditional: 0, modern: 3, fusion: 1 },
      },
      {
        value: "gourmet-fusion",
        text: "Gourmet fusion - traditional dishes with modern presentation",
        points: { traditional: 1, modern: 2, fusion: 3 },
      },
    ],
  },
];

// Budget Category Icons and Labels
export const BUDGET_CATEGORIES = {
  venue: { label: "Venue", icon: "🏛️", defaultPercentage: 30 },
  catering: { label: "Catering", icon: "🍽️", defaultPercentage: 25 },
  attire: { label: "Attire", icon: "👗", defaultPercentage: 15 },
  photography: { label: "Photography", icon: "📸", defaultPercentage: 10 },
  decor: { label: "Decor", icon: "💐", defaultPercentage: 10 },
  misc: { label: "Miscellaneous", icon: "✨", defaultPercentage: 10 },
};

// Vendor Categories
export const VENDOR_CATEGORIES = [
  "Venue",
  "Catering",
  "Photography/Videography",
  "Attire (Bride)",
  "Attire (Groom)",
  "Makeup Artist",
  "Hairstylist",
  "Decor/Event Planner",
  "Music/DJ",
  "Transportation",
  "Invitations",
  "Kayan Lefe Supplier",
  "Other",
];

// Vendor Status Options
export const VENDOR_STATUS = [
  "Researching",
  "Contacted",
  "Quote Received",
  "Booked",
  "Deposit Paid",
  "Confirmed",
];

// Task Categories
export const TASK_CATEGORIES = [
  "Budget & Planning",
  "Venue & Logistics",
  "Vendors & Bookings",
  "Kayan Lefe",
  "Attire & Beauty",
  "Guest List & Invitations",
  "Decor & Details",
  "Day-of Coordination",
  "Post-Wedding",
];

// Task Priority Levels
export const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "gray" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "high", label: "High", color: "orange" },
  { value: "urgent", label: "Urgent", color: "red" },
];

// Task Status Options
export const TASK_STATUS = [
  "Not Started",
  "In Progress",
  "Waiting",
  "Completed",
];
