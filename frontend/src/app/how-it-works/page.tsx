import Link from "next/link";
import { Cpu, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { SITE_CONFIG } from "@/src/config";
import { hero, modes, serverSteps, browserSteps, models, trainingBlocks, limitations, privacyNote, type PipelineStep } from "@/src/content/how-it-works";
import layoutStyles     from "@/src/styles/footer-pages/how-it-works/layout.module.css";
import modesPipeStyles  from "@/src/styles/footer-pages/how-it-works/modes-pipeline.module.css";
import modelsStyles     from "@/src/styles/footer-pages/how-it-works/models.module.css";
import trainingStyles   from "@/src/styles/footer-pages/how-it-works/training-end.module.css";

export const metadata = buildMetadata({
  title: "How It Works",
  description:
    "Full technical breakdown of the face analysis pipeline. Server-side inference uses YuNet for detection and four TFLite models for predictions. Browser mode runs TensorFlow.js with BlazeFace for 100% private analysis.",
  socialDescription:
    "How the AI face analysis actually works — YuNet detection, four PyTorch-trained TFLite models, and a fully private browser-side mode using TensorFlow.js.",
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

  // Pull the two mode entries for the pipeline column headers
  const serverMode  = modes[0];
  const browserMode = modes[1];

  return (
    <div className={layoutStyles.page}>

      <section className={layoutStyles.pageHero}>
        <div className={layoutStyles.heroGrid} aria-hidden="true" />
        <div className={layoutStyles.heroInner}>
          <div className={layoutStyles.heroBadge}>
            <Cpu size={13} />
            <span>{hero.badge}</span>
          </div>
          <h1 className={layoutStyles.heroTitle}>
            {hero.title}{" "}
            <span className={layoutStyles.heroTitleAccent}>{hero.accent}</span>
          </h1>
          <p className={layoutStyles.heroDescription}>{hero.description}</p>
          <div className={layoutStyles.heroMeta}>
            <span className={layoutStyles.heroMetaDot} aria-hidden="true" />
            <span className={layoutStyles.heroMetaLabel}>Last Updated</span>
            <span className={layoutStyles.heroMetaSep} aria-hidden="true">·</span>
            <span>{SITE_CONFIG.HowItWorksLastUpdated}</span>
          </div>
        </div>
      </section>

      <div className={layoutStyles.content}>

        {/* 01 — Pipelines: server (left) · browser (right) */}
        <SectionHeader num="01" title="The inference pipeline" />
        <div className={modesPipeStyles.pipelineGrid}>

          {/* Server column */}
          <div className={modesPipeStyles.pipelineCol}>
            <div className={modesPipeStyles.pipelineColTop}>
              <div className={modesPipeStyles.pipelineColIconWrap}>
                <serverMode.icon size={20} />
              </div>
              <span className={modesPipeStyles.pipelineColTag}>{serverMode.tag}</span>
            </div>
            <h3 className={modesPipeStyles.pipelineColTitle}>{serverMode.label}</h3>
            <p className={modesPipeStyles.pipelineColIntro}>{serverMode.description}</p>
            <div className={modesPipeStyles.pipelineColDivider} />
            <PipelineSteps steps={serverSteps} />
          </div>

          {/* Browser column */}
          <div className={modesPipeStyles.pipelineCol}>
            <div className={modesPipeStyles.pipelineColTop}>
              <div className={modesPipeStyles.pipelineColIconWrap}>
                <browserMode.icon size={20} />
              </div>
              <span className={modesPipeStyles.pipelineColTag}>{browserMode.tag}</span>
            </div>
            <h3 className={modesPipeStyles.pipelineColTitle}>{browserMode.label}</h3>
            <p className={modesPipeStyles.pipelineColIntro}>{browserMode.description}</p>
            <div className={modesPipeStyles.pipelineColDivider} />
            <PipelineSteps steps={browserSteps} />
          </div>

        </div>

        <Divider />

        {/* 02 — Models */}
        <SectionHeader num="02" title="The models" />
        <p className={layoutStyles.sectionIntro}>
          Four TFLite models run on every detected face. All were
          trained in PyTorch with a MobileNet backbone.
        </p>
        <div className={modelsStyles.modelsGrid}>
          {models.map(({ id, icon: Icon, title, description, versions }) => (
            <div key={id} className={modelsStyles.modelCard}>
              <div className={modelsStyles.modelCardBody}>
                <div className={modelsStyles.modelCardHeader}>
                  <div className={modelsStyles.modelIconWrap}>
                    <Icon size={18} />
                  </div>
                  <div className={modelsStyles.modelTitleRow}>
                    <h4 className={modelsStyles.modelTitle}>{title}</h4>
                  </div>
                </div>
                <p className={modelsStyles.modelBody}>{description}</p>
              </div>
              <div className={modelsStyles.modelCardFooter}>
                {versions.map((version) => (
                  <div key={version.label} className={modelsStyles.modelVersion}>
                    <span className={modelsStyles.modelVersionLabel}>{version.label}</span>
                    <div className={modelsStyles.modelClasses}>
                      {version.outputs.map((output, i) => (
                        <span key={i} className={modelsStyles.modelClassChip}>
                          {output.kind === "labeled"
                            ? `${output.label}: ${output.value}`
                            : output.value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* 03 — Training & export */}
        <SectionHeader num="03" title="Training & export" />
        <div className={trainingStyles.trainingList}>
          {trainingBlocks.map(({ id, icon: Icon, title, body }) => (
            <div key={id} className={trainingStyles.trainingCard}>
              <div className={trainingStyles.trainingIconWrap}>
                <Icon size={22} />
              </div>
              <div>
                <h4 className={trainingStyles.trainingTitle}>{title}</h4>
                <p className={trainingStyles.trainingBody}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* 04 — Limitations */}
        <SectionHeader num="04" title="Known limitations" />
        <p className={layoutStyles.sectionIntro}>
          These models work well in good conditions. Here's where they don't.
        </p>
        <div className={trainingStyles.limitationsGrid}>
          {limitations.map(({ id, icon: Icon, title, body }) => (
            <div key={id} className={trainingStyles.limitationCard}>
              <div className={trainingStyles.limitationIconWrap}>
                <Icon size={18} />
              </div>
              <div>
                <h4 className={trainingStyles.limitationTitle}>{title}</h4>
                <p className={trainingStyles.limitationBody}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Privacy note */}
        <div className={trainingStyles.privacyCard}>
          <div className={trainingStyles.privacyIconWrap}>
            <PrivacyIcon size={20} />
          </div>
          <div className={trainingStyles.privacyBody}>
            <h3 className={trainingStyles.privacyTitle}>{privacyNote.title}</h3>
            <p className={trainingStyles.privacyText}>{privacyNote.body}</p>
            <Link href={privacyNote.linkHref} className={trainingStyles.privacyLink}>
              {privacyNote.linkLabel}
              <ArrowRight size={13} />
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
    <div className={layoutStyles.sectionHeader}>
      <span className={layoutStyles.sectionNum}>{num}</span>
      <h2 className={layoutStyles.sectionTitle}>{title}</h2>
    </div>
  );
}

function Divider() {
  return <div className={layoutStyles.divider} aria-hidden="true" />;
}

function PipelineSteps({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className={modesPipeStyles.pipeline}>
      <div className={modesPipeStyles.pipelineLine} aria-hidden="true" />
      <div className={modesPipeStyles.pipelineSteps}>
        {steps.map(({ id, num, icon: Icon, title, body }) => (
          <div key={id} className={modesPipeStyles.pipelineStep}>
            <div className={modesPipeStyles.pipelineNum}>{num}</div>
            <div className={modesPipeStyles.pipelineStepBody}>
              <h4 className={modesPipeStyles.pipelineStepTitle}>
                <Icon size={18} className={modesPipeStyles.pipelineStepIcon} />
                {title}
              </h4>
              <p className={modesPipeStyles.pipelineStepText}>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}