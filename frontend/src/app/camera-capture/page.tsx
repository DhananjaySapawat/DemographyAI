import { Camera } from "lucide-react";
import OverviewSection from "@/src/components/ui/OverviewSection";
import CameraImageUpload from "@/src/components/camera-capture/CameraImageUpload";

export default function CameraCapture() { 
    return (
        <main className="flex-1 flex flex-col bg-[var(--bg-secondary)]">
            <OverviewSection 
                badgeText="Camera Capture"
                badgeIcon={<Camera size={20} />}
                title="Capture a"
                titleHighlight="Photo"
                description="Use your device camera to take a photo and instantly analyze all detected faces."
            />
            <CameraImageUpload />
        </main>
    )
}