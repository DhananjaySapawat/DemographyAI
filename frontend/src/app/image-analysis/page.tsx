import { Image as ImageIcon } from "lucide-react";

import OverviewSection from "@/src/components/ui/OverviewSection";
import ImageUpload from "@/src/components/image-analysis/ImageUpload";

import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Image Face Analysis",
  description:
    "Upload any photo and get AI predictions for every face in it. Detects age, age range, gender, emotion, and ethnicity using custom PyTorch models running server-side.",
  socialDescription:
    "Drop in any photo and see what the AI thinks. Age, gender, emotion, ethnicity — per face, with confidence scores.",
  keywords: [
    "upload photo face analysis",
    "detect age from image AI",
    "emotion recognition from photo",
    "gender detection from image",
    "ethnicity classification image",
    "multiple face detection image",
    "face attribute detection upload",
  ],
  slug: "/image-analysis",
});

export default function ImageAnalysis() { 
    return (
        <main className="flex-1 flex flex-col bg-[var(--bg-secondary)]">
            <OverviewSection 
                badgeText="Image Analysis"
                badgeIcon={<ImageIcon size={20} />}
                title="Upload Your"
                titleHighlight="Image"
                description="Upload any image to detect and analyze faces. Get age, gender, emotion, and ethnicity predictions for every face."
            />
            <ImageUpload />
        </main>
    )
}