import OverviewSection from "@/src/components/homepage/OverviewSection";
import AnalyzeSection from "@/src/components/homepage/AnalyzeSection";
import FeatureSection from "@/src/components/homepage/FeatureSection";

import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "AI Face Analysis Platform",
  description:
    "Upload a photo, use your camera, or stream your webcam to get instant AI predictions on age, gender, emotion, and ethnicity. Built with PyTorch models trained on large face datasets.",
  socialDescription:
    "Free AI face analysis tool. Drop in a photo and get age, gender, emotion, and ethnicity predictions in seconds. No signup, no nonsense.",
  keywords: [
    "AI face analysis",
    "face detection AI",
    "age estimation from photo",
    "emotion detection AI",
    "gender detection AI",
    "ethnicity detection AI",
    "free face analysis tool",
    "facial attribute recognition",
  ],
  slug: "/",
});

export default function Home() {
  return (
    <main>
      <OverviewSection />
      <AnalyzeSection />
      <FeatureSection />
    </main>
  );
}
