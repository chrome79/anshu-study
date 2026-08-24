export type Lecture = {
  id: string;
  batchId: string;
  title: string;
  duration: string;
  isFree: boolean;
  streamUrl: string;
  notesUrl?: string;
  dppUrl?: string;
  order: number;
};

export const lectures: Lecture[] = [
  {
    id: "l1",
    batchId: "b1",
    title: "Physics - Kinematics Lecture 1",
    duration: "45 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/kinematics-1",
    notesUrl: "#",
    dppUrl: "#",
    order: 1,
  },
  {
    id: "l2",
    batchId: "b1",
    title: "Physics - Kinematics Lecture 2",
    duration: "52 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/kinematics-2",
    notesUrl: "#",
    dppUrl: "#",
    order: 2,
  },
  {
    id: "l3",
    batchId: "b1",
    title: "Chemistry - Atomic Structure",
    duration: "48 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/atomic-structure",
    notesUrl: "#",
    order: 3,
  },
  {
    id: "l4",
    batchId: "b1",
    title: "Maths - Trigonometry Basics",
    duration: "55 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/trigonometry",
    order: 4,
  },
  {
    id: "l5",
    batchId: "b2",
    title: "Advanced Physics - Rotational Motion",
    duration: "60 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/rotational",
    notesUrl: "#",
    dppUrl: "#",
    order: 1,
  },
  {
    id: "l6",
    batchId: "b2",
    title: "Advanced Chemistry - Electrochemistry",
    duration: "58 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/electrochemistry",
    order: 2,
  },
  {
    id: "l7",
    batchId: "b3",
    title: "Pro - Organic Chemistry Masterclass",
    duration: "75 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/organic-masterclass",
    notesUrl: "#",
    dppUrl: "#",
    order: 1,
  },
  {
    id: "l8",
    batchId: "b4",
    title: "Fastrack - Complete Revision 1",
    duration: "40 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/revision-1",
    order: 1,
  },
  {
    id: "l9",
    batchId: "b4",
    title: "Fastrack - Complete Revision 2",
    duration: "42 min",
    isFree: true,
    streamUrl: "https://vid-stream-marco.example.com/revision-2",
    order: 2,
  },
  {
    id: "l10",
    batchId: "b5",
    title: "Test Series - Full Mock Test 1",
    duration: "180 min",
    isFree: true,
    streamUrl: "#",
    order: 1,
  },
];

export function getLecturesByBatchId(batchId: string): Lecture[] {
  return lectures.filter((l) => l.batchId === batchId).sort((a, b) => a.order - b.order);
}

export function getLectureById(id: string): Lecture | undefined {
  return lectures.find((l) => l.id === id);
}
