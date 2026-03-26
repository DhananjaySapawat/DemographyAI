"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon, Camera, Video, Radio, Menu, X } from "lucide-react";
import { site } from "@/src/config";
import ThemeToggle from "@/src/components/layout/ThemeToggle";
import styles from "@/src/styles/layout/mobile-header.module.css";

const navItems = [
  { href: "/", icon: <Home size={20} strokeWidth={2} />, label: "Home" },
  { href: "/image-analysis", icon: <ImageIcon size={20} strokeWidth={2} />, label: "Image Analysis" },
  { href: "/camera-capture", icon: <Camera size={20} strokeWidth={2} />, label: "Camera Capture" },
  { href: "/video-analysis", icon: <Video size={20} strokeWidth={2} />, label: "Video Analysis" },
  { href: "/live-webcam", icon: <Radio size={20} strokeWidth={2} />, label: "Live Webcam" },
];

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoTextPrimary}>{site.initial}</span>
            <span className={styles.logoTextAccent}>{site.suffix}</span>
          </Link>
        </div>

        <div className={styles.rightControls}>
          <ThemeToggle />

          <button
          className={styles.menuButton}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      {isOpen && (
        <nav className={styles.drawer}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${pathname === item.href ? styles.activeNavLink : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}