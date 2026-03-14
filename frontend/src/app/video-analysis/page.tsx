import OverviewSection from "@/src/components/ui/OverviewSection";
import { Video } from "lucide-react";
import VideoUpload from "@/src/components/video-analysis/VideoUpload";

import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Video Face Analysis",
  description:
    "Upload a video and run AI face analysis on every frame. Detects all faces across the clip and returns age, gender, emotion, and ethnicity predictions with confidence scores.",
  socialDescription:
    "AI face analysis across every frame of your video. Upload a clip and get per-face predictions for age, gender, emotion, and ethnicity.",
  keywords: [
    "video face analysis AI",
    "frame by frame face detection",
    "AI emotion detection video",
    "age detection from video",
    "gender detection video upload",
    "multi face video analysis",
    "facial attribute recognition video",
  ],
  slug: "/video-analysis",
});


export default function VideoAnalysis() { 
    return (
        <main className="flex-1 flex flex-col bg-[var(--bg-secondary)]">
            <OverviewSection 
                badgeText="Video Analysis"
                badgeIcon={<Video size={20} />}
                title="Analyze Your"
                titleHighlight="Video"
                description="Upload a video file to process and receive a labeled output with face data displayed throughout."
            />
            <VideoUpload />
        </main>
    )
}