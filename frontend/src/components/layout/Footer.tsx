import Link from "next/link";
import { site, contact } from "@/src/config";

import { Instagram, Linkedin, Github } from "lucide-react";
import styles from "@/src/styles/layout/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.topRow}>
          
          <div className={styles.brandBlock}>
            <div className={styles.logo}>
              <span className={styles.logoTextPrimary}>{site.initial}</span>
              <span className={styles.logoTextAccent}>{site.suffix}</span>
            </div>
            <p className={styles.tagline}>
              AI-Powered Facial Analysis Technology
            </p>
          </div>

          <div className={styles.links}>
            <Link href="/privacy-policy" className={styles.link}>
              Privacy Policy 
            </Link>
            <Link href="/how-it-works" className={styles.link}>
              How It Works
            </Link>
            <Link href="/about" className={styles.link}>
              About Me
            </Link>
          </div>

          <div className={styles.socials}>
            <a 
              href={contact.social.instagram}
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a 
              href={contact.social.linkedin}
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href={contact.social.github}
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>

        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © 2026 {site.name}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}