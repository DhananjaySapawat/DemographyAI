import {
  Upload,
  Server,
  Cpu,
  ChartBar,
  Radio,
  WifiOff,
  ScanFace,
  Layers,
  SmilePlus,
  UsersRound,
  CalendarDays,
  ShieldCheck,
  TriangleAlert,
  Zap,
  Landmark,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export interface Mode {
  id: string;
  icon: LucideIcon;
  label: string;
  tag: string;
  description: string;
}

export interface PipelineStep {
  id: string;
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

type OutputVariant =
  | { kind: "labeled"; label: string; value: string }
  | { kind: "value"; value: string };

interface ModelVersion {
  label: string;
  outputs: OutputVariant[];
}

interface Model {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  versions: ModelVersion[];
}

export interface TrainingBlock {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface Limitation {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

export const hero = {
  badge: "SYSTEM ARCHITECTURE",
  title: "Under the hood,",
  accent: "nothing is magic",
  description:
    "Two separate inference pipelines, four TFLite models, and one honest disclaimer about accuracy. Here's exactly what happens when you upload a photo.",
};

export const modes: Mode[] = [
  {
    id: "server",
    icon: Server,
    label: "Server-side",
    tag: "Default",
    description:
      "Photo or video is sent to the FastAPI backend. Inference runs on the server using TFLite. More accurate, works on any device, and returns results faster than browser-side processing.",
  },
  {
    id: "private",
    icon: WifiOff,
    label: "Private / browser-side",
    tag: "100% private",
    description:
      "Webcam stream never leaves your device. TensorFlow.js runs the BlazeFace detector and models entirely in the browser. Completely private, but needs a decent GPU to run smoothly.",
  },
];

export const serverSteps: PipelineStep[] = [
  {
    id: "upload",
    num: "01",
    icon: Upload,
    title: "Upload",
    body: "You upload a photo or video from the frontend. Videos are processed frame by frame.",
  },
  {
    id: "detect",
    num: "02",
    icon: ScanFace,
    title: "Face detection",
    body: "The FastAPI backend runs YuNet (yunet_n_640_640.onnx via OpenCV) to locate every face in the image and crop each one.",
  },
  {
    id: "inference",
    num: "03",
    icon: Cpu,
    title: "Model inference",
    body: "Each cropped face is passed through all four TFLite models in parallel. Each model returns a label and a confidence score for its prediction.",
  },
  {
    id: "results",
    num: "04",
    icon: ChartBar,
    title: "Results",
    body: "Predictions are bundled per face and returned to the frontend as JSON. The UI renders them overlaid on the original image.",
  },
];

export const browserSteps: PipelineStep[] = [
  {
    id: "stream",
    num: "01",
    icon: Radio,
    title: "Webcam stream",
    body: "The webcam feed is captured directly in the browser using the MediaDevices API. No frames are sent anywhere.",
  },
  {
    id: "blazeface",
    num: "02",
    icon: ScanFace,
    title: "BlazeFace detection",
    body: "TensorFlow.js runs the BlazeFace model in-browser to detect face locations in real time from the webcam stream.",
  },
  {
    id: "tfjs",
    num: "03",
    icon: Zap,
    title: "TensorFlow.js inference",
    body: "Cropped face regions are passed through all four TFLite models via TensorFlow.js. Everything runs on your device's GPU or CPU via WebGL.",
  },
  {
    id: "overlay",
    num: "04",
    icon: ChartBar,
    title: "Live overlay",
    body: "Predictions are drawn directly onto a canvas element over the video feed. Results update in real time as your face moves.",
  },
];

export const models: Model[] = [
  {
    id: "age",
    icon: CalendarDays,
    title: "Age Estimation",
    description:
      "Two parallel models are running simultaneously — one using regression for a single continuous value, the other using classification for age ranges. Both are being monitored to determine which approach is more reliable.",
    versions: [
      {
        label: "Regression (v1)",
        outputs: [{ kind: "value", value: "e.g. 27" }],
      },
      {
        label: "Classification (v2)",
        outputs: [
          "0-9", "10-19", "20-24", "25-29",
          "30-34", "35-39", "40-44", "45-54", "55+",
        ].map((v) => ({ kind: "value" as const, value: v })),
      },
    ],
  },
  {
    id: "emotion",
    icon: SmilePlus,
    title: "Emotion Analysis",
    description:
      "Analyzes facial expression patterns to output the most likely emotional state from a set of universal categories.",
    versions: [
      {
        label: "Default",
        outputs: [
          "Happy", "Sad", "Angry", "Fear",
          "Disgust", "Surprise", "Neutral", "Contempt",
        ].map((v) => ({ kind: "value" as const, value: v })),
      },
    ],
  },
  {
    id: "ethnicity",
    icon: Landmark,
    title: "Ethnicity Analysis",
    description:
      "Analyzes facial features to output coarse ethnicity groups derived from training data distributions.",
    versions: [
      {
        label: "Default",
        outputs: ["Asian", "Black", "Indian", "White", "Other"].map((v) => ({
          kind: "value" as const,
          value: v,
        })),
      },
    ],
  },
  {
    id: "gender",
    icon: UsersRound,
    title: "Gender Analysis",
    description:
      "Analyzes facial structure patterns to output binary gender categories based on model training.",
    versions: [
      {
        label: "Default",
        outputs: [
          { kind: "value", value: "Female" },
          { kind: "value", value: "Male" },
        ],
      },
    ],
  },
];

export const trainingBlocks: TrainingBlock[] = [
  {
    id: "pytorch",
    icon: FlaskConical,
    title: "Trained in PyTorch",
    body: "All four models were trained in PyTorch using MobileNet as the backbone. MobileNet was chosen because it is fast, lightweight, and well-suited for face attribute tasks.",
  },
  {
    id: "export",
    icon: Layers,
    title: "Why PyTorch → TFLite",
    body: "PyTorch is great for training but TFLite is more practical for deployment. The export path was PyTorch → ONNX → TFLite, letting the same architecture run on both server and browser.",
  },
];

export const limitations: Limitation[] = [
  {
    id: "lighting",
    icon: TriangleAlert,
    title: "Poor lighting or blur",
    body: "YuNet and BlazeFace both struggle with very dark, overexposed, or heavily blurred images.",
  },
  {
    id: "profile",
    icon: TriangleAlert,
    title: "Side profiles and extreme angles",
    body: "The models were trained mostly on frontal faces. Side profiles will reduce accuracy significantly.",
  },
  {
    id: "accuracy",
    icon: TriangleAlert,
    title: "Age and emotion accuracy",
    body: "Age estimation can be off by several years. Emotion detection is regularly confused by neutral and contempt.",
  },
  {
    id: "ethnicity-disclaimer",
    icon: ShieldCheck,
    title: "Ethnicity is a rough grouping",
    body: "The ethnicity classifier reflects patterns in the training data, not identity. Treat it as approximate.",
  },
  {
    id: "browser",
    icon: TriangleAlert,
    title: "Browser mode is less accurate",
    body: "TensorFlow.js inference is constrained by the browser environment. Performance depends heavily on the device.",
  },
  {
    id: "occlusion",
    icon: TriangleAlert,
    title: "Occlusions like masks or glasses",
    body: "Face coverings, sunglasses, hands, or objects blocking parts of the face can significantly reduce detection and attribute accuracy.",
  },
];

export const privacyNote = {
  icon: ShieldCheck,
  title: "This is not a surveillance tool",
  body: "This site exists for fun and testing. Uploaded photos are used only to run predictions. Browser-mode frames never leave your device.",
  linkLabel: "Read the privacy policy",
  linkHref: "/privacy-policy",
};