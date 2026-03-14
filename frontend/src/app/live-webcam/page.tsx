//import { Radio } from "lucide-react";

//import OverviewSection from "@/src/components/ui/OverviewSection";
//import Webcam from "@/src/components/live-webcam/Webcam";

import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Live Webcam Face Detection",
  description:
    "Stream your webcam for real-time face detection and analysis. Runs entirely in the browser using TensorFlow.js and BlazeFace — no data ever leaves your device.",
  socialDescription:
    "Real-time face analysis from your webcam, 100% private. Everything runs in the browser — no server, no data sent anywhere.",
  keywords: [
    "live webcam face detection",
    "real time face analysis browser",
    "TensorFlow.js face detection",
    "BlazeFace webcam detection",
    "private face analysis no upload",
    "browser side face AI",
    "webcam emotion detection live",
    "real time age detection webcam",
  ],
  slug: "/live-webcam",
});

/* export default function LiveWebcam() { 
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
*/

import Link from "next/link";
import { Wrench, AlertTriangle } from "lucide-react";

export default function WebcamMaintenance() {
  return (
    <main className="flex-1 flex items-center justify-center bg-[var(--bg-secondary)]">
      <div className="max-w-xl w-full text-center border border-gray-200 rounded-2xl p-10 bg-white shadow-sm">

        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
            <Wrench size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Live Webcam Analysis
        </h1>

        <p className="text-gray-500 mb-6">
          This feature is temporarily unavailable while we upgrade the
          real-time AI detection system. It will return shortly.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-8">
          <AlertTriangle size={16} />
          <span>Feature under maintenance</span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/image-analysis"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Image Analysis
          </Link>

          <Link
            href="/video-analysis"
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
          >
            Video Analysis
          </Link>

          <Link
            href="/camera-capture"
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
          >
            Camera Capture
          </Link>
        </div>
      </div>
    </main>
  );
}

