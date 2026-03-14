import {
  Upload,
  Server,
  Cpu,
  BarChart2,
  Wifi,
  WifiOff,
  ScanFace,
  Brain,
  Layers,
  Smile,
  Users,
  Calendar,
  ShieldCheck,
  AlertTriangle,
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

export interface Model {
  id: string;
  icon: LucideIcon;
  title: string;
  output: string;
  confidence: boolean;
  body: string;
  architecture: string;
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
    "Two separate inference pipelines, five TFLite models, and one honest disclaimer about accuracy. Here's exactly what happens when you upload a photo.",
};

export const modes: Mode[] = [
  {
    id: "server",
    icon: Wifi,
    label: "Server-side",
    tag: "Default",
    description:
      "Photo or video is sent to the FastAPI backend. Inference runs on the server using TFLite. More accurate, works on any device.",
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
    body: "Each cropped face is passed through all five TFLite models in parallel. Each model returns a label and a confidence score.",
  },
  {
    id: "results",
    num: "04",
    icon: BarChart2,
    title: "Results",
    body: "Predictions are bundled per face and returned to the frontend as JSON. The UI renders them overlaid on the original image.",
  },
];

export const browserSteps: PipelineStep[] = [
  {
    id: "stream",
    num: "01",
    icon: Server,
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
    icon: Cpu,
    title: "TensorFlow.js inference",
    body: "Cropped face regions are passed through the TensorFlow.js versions of the models. Everything runs on your device's GPU or CPU via WebGL.",
  },
  {
    id: "overlay",
    num: "04",
    icon: BarChart2,
    title: "Live overlay",
    body: "Predictions are drawn directly onto a canvas element over the video feed. Results update in real time as your face moves.",
  },
];

export const models: Model[] = [
  {
    id: "age",
    icon: Calendar,
    title: "Age estimation",
    output: "Single integer (e.g. 27)",
    confidence: false,
    body: "Regression model that outputs a single age value directly. No softmax, no classes — just a number.",
    architecture: "MobileNet backbone, regression head",
  },
  {
    id: "age-range",
    icon: Layers,
    title: "Age range",
    output: "9 buckets: 0-9 … 55+",
    confidence: true,
    body: "Classification model with 9 age buckets. Uses softmax over logits to produce a probability distribution.",
    architecture: "MobileNet backbone, classification head",
  },
  {
    id: "emotion",
    icon: Smile,
    title: "Emotion detection",
    output: "8 classes incl. Happy, Neutral, Surprise",
    confidence: true,
    body: "8-class classifier trained on emotion-labelled face datasets. Softmax over logits gives a probability per class.",
    architecture: "MobileNet backbone, 8-class softmax",
  },
  {
    id: "ethnicity",
    icon: Users,
    title: "Ethnicity classification",
    output: "Asian, Black, Indian, Others, White",
    confidence: true,
    body: "5-class classifier. A coarse grouping based on visual features in the training data — not a definitive classification.",
    architecture: "MobileNet backbone, 5-class softmax",
  },
  {
    id: "gender",
    icon: Brain,
    title: "Gender prediction",
    output: "Female, Male",
    confidence: true,
    body: "Binary classifier using sigmoid activation. Confidence is the distance from 0.5.",
    architecture: "MobileNet backbone, sigmoid output",
  },
];

export const trainingBlocks: TrainingBlock[] = [
  {
    id: "pytorch",
    icon: Brain,
    title: "Trained in PyTorch",
    body: "All five models were trained in PyTorch using MobileNet as the backbone. MobileNet was chosen because it is fast, lightweight, and well-suited for face attribute tasks.",
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
    icon: AlertTriangle,
    title: "Poor lighting or blur",
    body: "YuNet and BlazeFace both struggle with very dark, overexposed, or heavily blurred images.",
  },
  {
    id: "profile",
    icon: AlertTriangle,
    title: "Side profiles and extreme angles",
    body: "The models were trained mostly on frontal faces. Side profiles will reduce accuracy significantly.",
  },
  {
    id: "accuracy",
    icon: AlertTriangle,
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
    icon: AlertTriangle,
    title: "Browser mode is less accurate",
    body: "TensorFlow.js inference is constrained by the browser environment. Performance depends heavily on the device.",
  },
];

export const privacyNote = {
  icon: ShieldCheck,
  title: "This is not a surveillance tool",
  body: "This site exists for fun and testing. Uploaded photos are used only to run predictions. Browser-mode frames never leave your device.",
  linkLabel: "Read the privacy policy",
  linkHref: "/privacy-policy",
};
