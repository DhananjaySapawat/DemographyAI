
import {
  Sparkles,
  Code2,
  Rocket,
} from "lucide-react";

export const stack = [
  "Next.js", "FastAPI", "PyTorch", "TypeScript",
  "Python", "React", "PostgreSQL", "OpenCV",
  "Docker", "Tailwind CSS", "ONNX",
];

export const hero = {
  title: "I'm Dhananjay Sapawat",
  accent: "I build things I wish existed.",
  description:
    "IIT Delhi CSE grad. I spent years learning how computers see faces, then built a website around it because nothing decent existed yet. Full-stack by day, PyTorch by night.",
};

export const storyBlocks = [
  {
    id: "how-it-started",
    icon: Sparkles,
    title: "How it started",
    paragraphs: [
      "I got into IIT Delhi for CS and spent the first couple of years doing what everyone does: DSA grinds, competitive programming, the usual. But somewhere in my last year I discovered computer vision and kind of fell down a rabbit hole I never fully climbed out of.",
      "I started training models on face datasets. Age estimation, emotion detection, ethnicity classification. I was using PyTorch, building custom training pipelines, iterating on architectures. It was honestly the most fun I'd had with code up to that point.",
    ],
  },
  {
    id: "why-i-built-this",
    icon: Code2,
    title: "Why I built this site",
    paragraphs: [
      "Here's the thing that kept bugging me: despite AI making insane progress, there was no single good website where you could just upload a photo and see what a model thinks about the face in it. Everything out there was either a boring research demo, locked behind a paid API, or just genuinely ugly to use.",
      "I had the models. I had the full-stack skills from building side projects throughout college. Next.js frontend, FastAPI backend. The obvious move was to combine them. So I did.",
    ],
  },
  {
    id: "what-im-doing-now",
    icon: Rocket,
    title: "What I'm doing now",
    paragraphs: [
      "After graduating in 2024, I joined as a founding member at The Little Engine, a startup under Altech Solutions. I pretty much do everything there. Product thinking, engineering, figuring out what to build next. It's chaotic in the best way.",
      "This site is a personal project that runs parallel to all of that. The models are mine, the code is mine, and the whole point is to make something that's actually fun to play with. Give it a try and tell me what you think.",
    ],
  },
];

export const cta = {
  text: "Want to talk ML, full-stack, or just say hi?",
  label: "Drop me an email",
};

export const stackSection = {
  title: "Things I work with",
};
