import Link from "next/link";
import { Instagram, Linkedin, Github } from "lucide-react";
import styles from "@/src/styles/layout/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.topRow}>
          
          <div className={styles.brandBlock}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoTextPrimary}>Demography</span>
              <span className={styles.logoTextAccent}>AI</span>
            </Link>
            <p className={styles.tagline}>
              AI-Powered Facial Analysis Technology
            </p>
          </div>

          <div className={styles.links}>
            <Link href="/privacy-policy" className={styles.link}>
              Privacy Policy
            </Link>
            <Link href="/about-me" className={styles.link}>
              About Me
            </Link>
            <Link href="/contact-me" className={styles.link}>
              Contact Me
            </Link>
          </div>

          <div className={styles.socials}>
            <a 
              href="https://instagram.com/yourprofile" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a 
              href="https://linkedin.com/in/yourprofile" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://github.com/yourprofile" 
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
            © 2025 DemographyAI. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}