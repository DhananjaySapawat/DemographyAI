import Link from "next/link";
import { Home, Image as ImageIcon, Camera, Video, Radio } from "lucide-react";
import { site } from "@/src/config";
import ThemeToggle from "@/src/components/layout/ThemeToggle";
import MobileHeader from "@/src/components/layout/MobileHeader";
import NavLink from "@/src/components/layout/NavLink";
import styles from "@/src/styles/layout/header.module.css";

const navItems = [
  { href: "/", icon: <Home size={20} strokeWidth={2} />, label: "Home" },
  { href: "/image-analysis", icon: <ImageIcon size={20} strokeWidth={2} />, label: "Image Analysis" },
  { href: "/camera-capture", icon: <Camera size={20} strokeWidth={2} />, label: "Camera Capture" },
  { href: "/video-analysis", icon: <Video size={20} strokeWidth={2} />, label: "Video Analysis" },
  { href: "/live-webcam", icon: <Radio size={20} strokeWidth={2} />, label: "Live Webcam" },
];

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logoWrapper}>
            <Link href="/" className={styles.logoLink}>
              <span className={styles.logoTextPrimary}>{site.initial}</span>
              <span className={styles.logoTextAccent}>{site.suffix}</span>
            </Link>
          </div>

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map(({ href, icon, label }) => (
                <li key={href} className={styles.navItem}>
                  <NavLink href={href} className={styles.navLink} activeClassName={styles.activeNavLink}>
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.rightControls}>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Header — shown only on small screens */}
      <div className={styles.mobileOnly}>
        <MobileHeader />
      </div>
    </>
  );
}