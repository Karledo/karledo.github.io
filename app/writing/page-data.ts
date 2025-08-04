export type Page = {
  title: string;
  date: Date;
  slug: string;
};

export const pages: Page[] = [
  {
    title: "The Beauty of Mathematics and Science",
    date: new Date(2025, 1, 5),
    slug: "/the-beauty-of-mathematics-and-science",
  },
  {
    title: "Simulating Electric Fields",
    date: new Date(2025, 1, 10),
    slug: "/simulating-electric-fields",
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
  {
    title: "Quantum Mechanics: Linearity",
    date: new Date(2025, 2, 9),
    slug: "/quantum-mechanics-linearity",
  },
  {
    title: "What Is Vibe Coding?",
    date: new Date(2025, 2, 20),
    slug: "/what-is-vibe-coding",
  },
  {
    title: "Quantum Mechanics: Polarisation",
    date: new Date(2025, 2, 29),
    slug: "/quantum-mechanics-polarisation",
  },
  {
    title: "Diffraction",
    date: new Date(2025, 3, 4),
    slug: "/diffraction",
  },
  {
    title: "The Schrödinger Equation",
    date: new Date(2025, 3, 12),
    slug: "/the-schrodinger-equation",
  },
  {
    title: "Taylor Series",
    date: new Date(2025, 5, 8),
    slug: "/taylor-series",
  },
  {
    title: "Inverse Kinematics",
    date: new Date(2025, 6, 8),
    slug: "/inverse-kinematics",
  },
];
