export type Page = {
  title: string;
  date: Date;
  slug: string;
};

export const pages: Page[] = [
  {
    title: "The Beauty of Mathematics and Science",
    date: new Date(2025, 1, 10),
    slug: "/the-beauty-of-mathematics-and-science",
  },
  {
    title: "A Lesson on Thinking",
    date: new Date(2025, 1, 20),
    slug: "/a-lesson-on-thinking",
  },
  {
    title: "Law of Gravitational Attraction",
    date: new Date(2025, 2, 8),
    slug: "/law-of-universal-gravitation",
  },
  // {
  //   title: "Dealing with High Workload",
  //   date: new Date(2025, 2, 8),
  //   slug: "/dealing-with-high-workload",
  // },
  {
    title: "What Is Vibe Coding?",
    date: new Date(2025, 2, 20),
    slug: "/what-is-vibe-coding",
  },
  {
    title: "Simulating Electric Fields",
    date: new Date(2025, 1, 12),
    slug: "/simulating-electric-fields",
  },
  {
    title: "Quantum Mechanics: Linearity",
    date: new Date(2025, 1, 12),
    slug: "/quantum-mechanics-linearity",
  },
];
