export type Batch = {
  id: string;
  slug: string;
  title: string;
  category: "regular" | "infinity" | "infinity-pro" | "fastrack" | "test-series";
  description: string;
  totalLectures: number;
  durationWeeks: number;
  image?: string;
  tags: string[];
  price: string;
};

export const BATCH_CATEGORIES = [
  { id: "all", label: "All Batches" },
  { id: "regular", label: "Regular" },
  { id: "infinity", label: "Infinity" },
  { id: "infinity-pro", label: "Infinity Pro" },
  { id: "fastrack", label: "Fastrack" },
  { id: "test-series", label: "Test Series" },
] as const;

export const batches: Batch[] = [
  {
    id: "b1",
    slug: "regular-batch-2026",
    title: "Regular Batch 2026",
    category: "regular",
    description: "Complete foundation course with live classes, recorded lectures, DPP and notes.",
    totalLectures: 120,
    durationWeeks: 24,
    tags: ["Live Classes", "Recorded"],
    price: "FREE",
  },
  {
    id: "b2",
    slug: "infinity-batch-2026",
    title: "Infinity Batch 2026",
    category: "infinity",
    description: "Advanced batch with extra practice sheets, weekly tests and doubt sessions.",
    totalLectures: 150,
    durationWeeks: 30,
    tags: ["Doubt Sessions", "Tests"],
    price: "FREE",
  },
  {
    id: "b3",
    slug: "infinity-pro-2026",
    title: "Infinity Pro 2026",
    category: "infinity-pro",
    description: "Premium batch with one-to-one mentorship and exclusive study material.",
    totalLectures: 180,
    durationWeeks: 36,
    tags: ["Mentorship", "Exclusive"],
    price: "FREE",
  },
  {
    id: "b4",
    slug: "fastrack-crash-course",
    title: "Fastrack Crash Course",
    category: "fastrack",
    description: "Rapid revision batch for quick syllabus coverage before exams.",
    totalLectures: 60,
    durationWeeks: 8,
    tags: ["Revision", "Quick"],
    price: "FREE",
  },
  {
    id: "b5",
    slug: "test-series-batch",
    title: "Full Test Series",
    category: "test-series",
    description: "All India test series with detailed solutions and rank analysis.",
    totalLectures: 0,
    durationWeeks: 12,
    tags: ["Tests", "Analysis"],
    price: "FREE",
  },
  {
    id: "b6",
    slug: "regular-batch-2025",
    title: "Regular Batch 2025",
    category: "regular",
    description: "Previous year regular batch archive with full recorded content.",
    totalLectures: 110,
    durationWeeks: 24,
    tags: ["Archive", "Recorded"],
    price: "FREE",
  },
];

export function getBatchById(id: string): Batch | undefined {
  return batches.find((b) => b.id === id);
}

export function getBatchBySlug(slug: string): Batch | undefined {
  return batches.find((b) => b.slug === slug);
}
