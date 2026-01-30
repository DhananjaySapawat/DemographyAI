import styles from "@/src/styles/ui/overview-section.module.css";

export default function OverviewSection({
  badgeText,
  badgeIcon,
  title,
  titleHighlight,
  description,
}: any) {
  return (
    <section className={styles.pageHero}>
      <div className={styles.heroInner}>

        <div className={styles.heroBadge}>
          {badgeIcon}
          <span>{badgeText}</span>
        </div>

        <h1 className={styles.heroTitle}>
          {title}{" "}
          <span className={styles.titleHighlight}>{titleHighlight}</span>
        </h1>

        <p className={styles.heroDescription}>{description}</p>
      </div>
    </section>
  );
}
