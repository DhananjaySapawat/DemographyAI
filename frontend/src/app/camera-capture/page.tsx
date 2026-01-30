import OverviewSection from "@/src/components/ui/OverviewSection";
import { Camera } from "lucide-react";

export default function CameraCapture() { 
    return (
        <main>
            <OverviewSection 
                badgeText="Camera Capture"
                badgeIcon={<Camera size={20} />}
                title="Capture a"
                titleHighlight="Photo"
                description="Use your device camera to take a photo and instantly analyze all detected faces."
            />
        </main>
    )
}