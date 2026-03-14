import Link from "next/link";
import { Cpu } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { SITE_CONFIG } from "@/src/config";
import { hero, modes, serverSteps, browserSteps, models, trainingBlocks, limitations, privacyNote, type PipelineStep} from "@/src/content/how-it-works";
import styles from "@/src/styles/footer-pages/how-it-works.module.css";

export const metadata = buildMetadata({
  title: "How It Works",
  description:
    "Full technical breakdown of the face analysis pipeline. Server-side inference uses YuNet for detection and five TFLite models for predictions. Browser mode runs TensorFlow.js with BlazeFace for 100% private analysis.",
  socialDescription:
    "How the AI face analysis actually works — YuNet detection, five PyTorch-trained TFLite models, and a fully private browser-side mode using TensorFlow.js.",
  keywords: [
    "face analysis pipeline explained",
    "YuNet face detection ONNX",
    "TFLite face attribute models",
    "PyTorch to TFLite export",
    "BlazeFace TensorFlow.js browser",
    "MobileNet face classification",
    "age gender ethnicity emotion model",
    "server side face inference FastAPI",
  ],
  slug: "/how-it-works",
});

export default function HowItWorksPage() {
  const PrivacyIcon = privacyNote.icon;

  return (
    <div className={styles.page}>
      
      <section className={styles.pageHero}>
        <div className={styles.heroGrid} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <Cpu size={13} />
            <span>{hero.badge}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {hero.title}{" "}
            <span className={styles.heroTitleAccent}>{hero.accent}</span>
          </h1>

          <p className={styles.heroDescription}>{hero.description}</p>

          <div className={styles.heroMeta}>
            <span className={styles.heroMetaDot} aria-hidden="true" />
            <span className={styles.heroMetaLabel}>Last Updated</span>
            <span className={styles.heroMetaSep} aria-hidden="true">·</span>
            <span>{SITE_CONFIG.HowItWorksLastUpdated}</span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────── */}
      <div className={styles.content}>

        {/* 01 — Two modes */}
        <SectionHeader num="01" title="Two inference modes" />
        <div className={styles.modesGrid}>
          {modes.map(({ id, icon: Icon, label, tag, description }) => (
            <div key={id} className={styles.modeCard}>
              <div className={styles.modeCardTop}>
                <div className={styles.modeCardIconWrap}>
                  <Icon size={20} />
                </div>
                <span className={styles.modeTag}>{tag}</span>
              </div>
              <h3 className={styles.modeTitle}>{label}</h3>
              <p className={styles.modeBody}>{description}</p>
            </div>
          ))}
        </div>

        <Divider />

        {/* 02 — Server pipeline */}
        <SectionHeader num="02" title="The server pipeline" />
        <PipelineSteps steps={serverSteps} />

        <Divider />

        {/* 03 — Browser pipeline */}
        <SectionHeader num="03" title="The browser pipeline" />
        <p className={styles.sectionIntro}>
          In private mode, the webcam stream is processed entirely on your
          device using TensorFlow.js and BlazeFace. Nothing is ever sent to a
          server. Keep in mind this needs a decent GPU to run properly —
          around an RTX 4060 or equivalent. On weaker hardware expect lag.
        </p>
        <PipelineSteps steps={browserSteps} />

        <Divider />

        {/* 04 — Models */}
        <SectionHeader num="04" title="The models" />
        <p className={styles.sectionIntro}>
          Five separate TFLite models run on every detected face. All were
          trained in PyTorch with a MobileNet backbone.
        </p>
        <div className={styles.modelsGrid}>
          {models.map(({ id, icon: Icon, title, output, confidence, body, architecture }) => (
            <div key={id} className={styles.modelCard}>
              <div className={styles.modelCardBody}>
                <div className={styles.modelCardHeader}>
                  <div className={styles.modelIconWrap}>
                    <Icon size={18} />
                  </div>
                  <div className={styles.modelTitleRow}>
                    <h4 className={styles.modelTitle}>{title}</h4>
                    {confidence && (
                      <span className={styles.confidenceBadge}>+ confidence</span>
                    )}
                  </div>
                </div>
                <p className={styles.modelBody}>{body}</p>
              </div>
              <div className={styles.modelCardFooter}>
                <div className={styles.modelMeta}>
                  <span className={styles.modelMetaLabel}>Output</span>
                  <span className={styles.modelMetaValue}>{output}</span>
                </div>
                <div className={styles.modelMeta}>
                  <span className={styles.modelMetaLabel}>Arch</span>
                  <span className={styles.modelMetaValue}>{architecture}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* 05 — Training & export */}
        <SectionHeader num="05" title="Training & export" />
        <div className={styles.trainingList}>
          {trainingBlocks.map(({ id, icon: Icon, title, body }) => (
            <div key={id} className={styles.trainingCard}>
              <div className={styles.trainingIconWrap}>
                <Icon size={22} />
              </div>
              <div>
                <h4 className={styles.trainingTitle}>{title}</h4>
                <p className={styles.trainingBody}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* 06 — Limitations */}
        <SectionHeader num="06" title="Known limitations" />
        <p className={styles.sectionIntro}>
          These models work well in good conditions. Here's where they don't.
        </p>
        <div className={styles.limitationsGrid}>
          {limitations.map(({ id, icon: Icon, title, body }) => (
            <div key={id} className={styles.limitationCard}>
              <div className={styles.limitationIconWrap}>
                <Icon size={18} />
              </div>
              <div>
                <h4 className={styles.limitationTitle}>{title}</h4>
                <p className={styles.limitationBody}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Privacy note */}
        <div className={styles.privacyCard}>
          <div className={styles.privacyIconWrap}>
            <PrivacyIcon size={28} />
          </div>
          <div className={styles.privacyBody}>
            <h3 className={styles.privacyTitle}>{privacyNote.title}</h3>
            <p className={styles.privacyText}>{privacyNote.body}</p>
            <Link href={privacyNote.linkHref} className={styles.privacyLink}>
              {privacyNote.linkLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionNum}>{num}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  );
}

function Divider() {
  return <div className={styles.divider} aria-hidden="true" />;
}

function PipelineSteps({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className={styles.pipeline}>
      <div className={styles.pipelineLine} aria-hidden="true" />
      <div className={styles.pipelineSteps}>
        {steps.map(({ id, num, icon: Icon, title, body }) => (
          <div key={id} className={styles.pipelineStep}>
            <div className={styles.pipelineNum}>{num}</div>
            <div className={styles.pipelineStepBody}>
              <h4 className={styles.pipelineStepTitle}>
                <Icon size={18} className={styles.pipelineStepIcon} />
                {title}
              </h4>
              <p className={styles.pipelineStepText}>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}