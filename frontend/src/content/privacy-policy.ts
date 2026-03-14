import {
  Camera,
  Cookie,
  Target,
  EyeOff,
  Lock,
  RefreshCw,
  Mail,
  Video,
} from "lucide-react";

export const hero = {
  badge: "Privacy Policy",
  title: "Your data,",
  accent: "handled with care",
  description:
    "We believe in full transparency about what we collect, why we collect it, and how we protect it.",
};

export const sections = [
  {
    id: "what-we-collect",
    num: "01",
    title: "What We Collect",
    items: [
      {
        icon: Camera,
        heading: "Photos & Snapshots",
        body: "We collect photos you upload solely to test our prediction model for age, gender, ethnicity, and emotion detection. These are used only to evaluate system accuracy.",
      },
      {
        icon: Video,
        heading: "Videos",
        body: "We collect videos you upload to run our prediction model on each frame, detecting age, gender, ethnicity, and emotion for all faces present. Uploaded videos are used for model evaluation and are stored permanently.",
      },
      {
        icon: Cookie,
        heading: "Cookies",
        body: "We may use cookies to help the site run smoothly and track basic usage metrics like time spent on pages. You can manage cookies through your browser settings.",
      },
    ],
  },
  {
    id: "how-we-use",
    num: "02",
    title: "How We Use Your Info",
    items: [
      {
        icon: Target,
        heading: "Purpose Only",
        body: "Your uploaded photos and videos are used exclusively to check the accuracy of age, gender, ethnicity, and emotion predictions, and to improve our model for testing purposes only.",
      },
      {
        icon: EyeOff,
        heading: "No Sharing",
        body: "We do not share any of your uploaded photos, videos, or personal information with anyone. They stay strictly private.",
      },
    ],
  },
  {
    id: "security",
    num: "03",
    title: "Security",
    items: [
      {
        icon: Lock,
        heading: "Our Commitment",
        body: "We make every effort to keep your uploaded photos, videos, and any other information safe. However, no online system is 100% secure, so while we do our best, there is always a small risk when sharing information online.",
      },
    ],
  },
  {
    id: "changes",
    num: "04",
    title: "Changes to This Policy",
    items: [
      {
        icon: RefreshCw,
        heading: "Updates",
        body: 'We may update this Privacy Policy from time to time. Any changes will be reflected with an updated "Last Updated" date at the top of this page.',
      },
    ],
  },
];

export const contact = {
  heading: "Got Questions?",
  subHeading: "Reach Out Anytime",
  body: "Questions about how we handle your photos, videos, or anything in this policy? We're happy to help.",
};

export const footer = "By using our service, you agree to this Privacy Policy.";