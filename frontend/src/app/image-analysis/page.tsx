import { Image as ImageIcon } from "lucide-react";

import OverviewSection from "@/src/components/ui/OverviewSection";
import ImageUpload from "@/src/components/image-analysis/ImageUpload";

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