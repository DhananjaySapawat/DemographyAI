import { Github, Linkedin, Instagram, Mail, Brain} from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";

import { contact } from "@/src/config";
import { hero, storyBlocks, stackSection, stack, cta } from "@/src/content/about";
import styles from "@/src/styles/footer-pages/about.module.css";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Built by Dhananjay Sapawat, an IIT Delhi CSE 2024 grad. Trained five face analysis models in PyTorch, deployed them via FastAPI, and wrapped it in a Next.js frontend — because nothing decent existed yet.",
  socialDescription:
    "The story behind the site — IIT Delhi grad, five custom PyTorch models, and frustration that no good face analysis tool existed.",
  keywords: [
    "Dhananjay Sapawat",
    "IIT Delhi CSE 2024",
    "PyTorch face model developer",
    "Next.js FastAPI full stack",
    "face analysis open source",
    "ML engineer India",
    "computer vision developer IIT",
  ],
  slug: "/about",
});
 

// ── Pure Server Component ─────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col bg-[var(--bg-primary)]">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.pageHero}>
        <div className={styles.heroGrid} aria-hidden="true" />

        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            {hero.title}<br />
            <span className={styles.heroTitleAccent}>{hero.accent}</span>
          </h1>

          <p className={styles.heroDescription}>{hero.description}</p>

          <div className={styles.heroSocials}>
            <a
              href={contact.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <Github size={16} strokeWidth={1.75} />
              <span>GitHub</span>
            </a>
            <a
              href={contact.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <Linkedin size={16} strokeWidth={1.75} />
              <span>LinkedIn</span>
            </a>
            <a
              href={contact.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <Instagram size={16} strokeWidth={1.75} />
              <span>Instagram</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className={`${styles.socialLink} ${styles.socialLinkEmail}`}
              aria-label="Email"
            >
              <Mail size={16} strokeWidth={1.75} />
              <span>{contact.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────── */}
      <div className={styles.content}>

        {/* ── STORY ────────────────────────────────────── */}
        <section className={styles.storySection}>
          <div className={styles.storySectionInner}>
            {storyBlocks.map(({ id, icon: Icon, title, paragraphs }) => (
              <div key={id} className={styles.storyBlock}>
                <div className={styles.storyBlockIcon}>
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className={styles.storyBlockTitle}>{title}</h2>
                  {paragraphs.map((p, i) => (
                    <p key={i} className={styles.storyText}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STACK ────────────────────────────────────── */}
        <section className={styles.stackSection}>
          <div className={styles.stackInner}>
            <div className={styles.stackHeader}>
              <Brain size={15} strokeWidth={1.75} className={styles.stackIcon} />
              <h2 className={styles.stackTitle}>{stackSection.title}</h2>
            </div>
            <div className={styles.stackCloud}>
              {stack.map((tech) => (
                <span key={tech} className={styles.stackTag}>{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className={styles.connectSection}>
          <div className={styles.connectInner}>
            <p className={styles.connectText}>{cta.text}</p>
            <a href={`mailto:${contact.email}`} className={styles.connectBtn}>
              <Mail size={15} strokeWidth={1.75} />
              {cta.label}
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}