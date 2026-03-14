import { Shield, Mail } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { SITE_CONFIG, contact as contactConfig } from "@/src/config";
import styles from "@/src/styles/footer-pages/privacy-policy.module.css";
import { hero, sections, contact, footer } from "@/src/content/privacy-policy";

const navItems = [
  ...sections.map((s : any) => ({ id: s.id, num: s.num, label: s.title })),
  { id: "contact", num: "05", label: "Contact" },
];

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "We collect uploaded photos and videos only to run face analysis predictions. Nothing is shared with third parties. Browser-mode webcam frames never leave your device.",
  socialDescription:
    "Simple privacy policy — your photos run through the model and that's it. Browser-mode analysis never leaves your device.",
  keywords: [
    "face analysis privacy policy",
    "AI tool data privacy",
    "photo upload privacy",
    "no data sharing face AI",
    "browser face analysis private",
  ],
  slug: "/privacy-policy",
});
 


export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 flex flex-col bg-[var(--bg-primary)]">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.pageHero}>
        <div className={styles.heroGrid} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <Shield size={13} />
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
            <span>{SITE_CONFIG.privacyPolicyLastUpdated}</span>
          </div>
        </div>
      </section>

      {/* ── DOCUMENT ─────────────────────────────────── */}
      <div className={styles.documentWrapper}>

        <aside className={styles.sidebar}>
          {navItems.map(({ id, num, label }) => (
            <a key={id} href={`#${id}`} className={styles.sidebarItem}>
              <span className={styles.sidebarNum}>{num}</span>
              <span className={styles.sidebarLabel}>{label}</span>
            </a>
          ))}
        </aside>

        <section className={styles.document}>
          {sections.map((sec, si) => (
            <div key={sec.num} id={sec.id} className={styles.anchorTarget}>
              <section className={styles.section}>
                <header className={styles.sectionHeader}>
                  <span className={styles.num}>{sec.num}</span>
                  <h2 className={styles.sectionHeading}>{sec.title}</h2>
                </header>

                <div className={styles.itemList}>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.heading} className={styles.item}>
                        <div className={styles.itemIcon} aria-hidden="true">
                          <Icon size={15} strokeWidth={1.75} />
                        </div>
                        <div className={styles.itemBody}>
                          <h3 className={styles.subHeading}>{item.heading}</h3>
                          <p className={styles.body}>{item.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {si < sections.length - 1 && (
                <div className={styles.divider} aria-hidden="true" />
              )}
            </div>
          ))}

          <div className={styles.divider} aria-hidden="true" />

          {/* 05 — Contact */}
          <div id="contact" className={styles.anchorTarget}>
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                <span className={styles.num}>05</span>
                <h2 className={styles.sectionHeading}>{contact.heading}</h2>
              </header>

              <div className={styles.contactCard}>
                <div className={styles.contactCardLeft}>
                  <div className={styles.contactIconWrap} aria-hidden="true">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className={styles.subHeading}>{contact.subHeading}</h3>
                    <p className={styles.body}>{contact.body}</p>
                  </div>
                </div>
                <a
                  href={`mailto:${contactConfig.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.emailLink}
                >
                  <Mail size={13} aria-hidden="true" />
                  {contactConfig.email}
                </a>
              </div>
            </section>
          </div>

          <footer className={styles.docFooter}>
            <Shield size={13} className={styles.footerIcon} aria-hidden="true" />
            <span>{footer}</span>
          </footer>
        </section>
      </div>
    </main>
  );
}