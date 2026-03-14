import { Camera } from "lucide-react";
import OverviewSection from "@/src/components/ui/OverviewSection";
import CameraImageUpload from "@/src/components/camera-capture/CameraImageUpload";

import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Camera Face Capture",
  description:
    "Use your device camera to take a photo and instantly run AI face analysis. Predictions for age, gender, emotion, and ethnicity are processed server-side for maximum accuracy.",
  socialDescription:
    "Point your camera, take a photo, get instant AI face predictions. No upload needed, works right in the browser.",
  keywords: [
    "camera face analysis AI",
    "take photo face detection",
    "capture photo age detection",
    "browser camera face AI",
    "instant face analysis camera",
    "webcam photo face attributes",
  ],
  slug: "/camera-capture",
});


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