import OverviewSection from "@/src/components/ui/OverviewSection";
import { Video } from "lucide-react";
import VideoUpload from "@/src/components/video-analysis/VideoUpload";

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