import Link from "next/link";
import { Home, Image as ImageIcon, Camera, Video, Radio } from "lucide-react";

import NavLink from "@/src/components/layout/NavLink";
import styles from "@/src/styles/layout/header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoTextPrimary}>Demography</span>
            <span className={styles.logoTextAccent}>AI</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink href="/" className={styles.navLink} activeClassName={styles.activeNavLink}>
                <Home size={20} strokeWidth={2} />
                <span>Home</span>
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink href="/image-analysis" className={styles.navLink} activeClassName={styles.activeNavLink}>
                <ImageIcon size={20} strokeWidth={2} />
                <span>Image Analysis</span>
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink href="/camera-capture" className={styles.navLink} activeClassName={styles.activeNavLink}>
                <Camera size={20} strokeWidth={2} />
                <span>Camera Capture</span>
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink href="/video-analysis" className={styles.navLink} activeClassName={styles.activeNavLink}>
                <Video size={20} strokeWidth={2} />
                <span>Video Analysis</span>
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink href="/live-webcam" className={styles.navLink} activeClassName={styles.activeNavLink}>
                <Radio size={20} strokeWidth={2} />
                <span>Live Webcam</span>
              </NavLink>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}