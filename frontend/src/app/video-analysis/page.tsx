import OverviewSection from "@/src/components/ui/OverviewSection";
import { Video } from "lucide-react";

export default function VideoAnalysis() { 
    return (
        <main>
            <OverviewSection 
                badgeText="Video Analysis"
                badgeIcon={<Video size={20} />}
                title="Analyze Your"
                titleHighlight="Video"
                description="Upload a video file to process and receive a labeled output with face data displayed throughout."
            />
        </main>
    )
}