import { Radio } from "lucide-react";

import OverviewSection from "@/src/components/ui/OverviewSection";
import Webcam from "@/src/components/live-webcam/Webcam";

export default function LiveWebcam() { 
    return (
        <main className="flex-1 flex flex-col bg-[var(--bg-secondary)]">
            <OverviewSection 
                badgeText="Live Webcam"
                badgeIcon={<Radio size={20} />}
                title="Real-Time"
                titleHighlight="Detection"
                description="Stream your webcam for live face detection with real-time age, gender, emotion, and ethnicity analysis."
            />
            <Webcam />
        </main>
    )
}

