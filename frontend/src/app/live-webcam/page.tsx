import OverviewSection from "@/src/components/ui/OverviewSection";
import { Radio } from "lucide-react";

export default function LiveWebcam() { 
    return (
        <main>
            <OverviewSection 
                badgeText="Live Webcam"
                badgeIcon={<Radio size={20} />}
                title="Real-Time"
                titleHighlight="Detection"
                description="Stream your webcam for live face detection with real-time age, gender, emotion, and ethnicity analysis."
            />
        </main>
    )
}