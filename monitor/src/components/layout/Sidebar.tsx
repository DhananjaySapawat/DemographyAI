"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Users,
  Gauge,
  TriangleAlert,
  Images,
  LogOut,
  Server
} from "lucide-react";
import { WebsiteIcon } from "@/src/assets";
import { logout } from "@/src/api";
import styles from "@/src/styles/layout/sidebar.module.css";

const NAV_ITEMS = [
  { href: "/",              label: "Overview",           Icon: LayoutDashboard },
  { href: "/traffic",       label: "Requests & Traffic", Icon: Activity },
  { href: "/demographics",  label: "Demographics",       Icon: Users },
  { href: "/performance",   label: "Performance",        Icon: Gauge },
  { href: "/errors",        label: "Errors",             Icon: TriangleAlert },
  { href: "/media-gallery", label: "Media Gallery",      Icon: Images },
  { href: "/system",        label: "System",             Icon: Server },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  if (pathname === "/login") return null;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className={styles.sidebar}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.logoBox}>
          <Image src={WebsiteIcon} alt="" className={styles.logoIcon} />
        </div>
        <div>
          <div className={styles.title}>DemographyAI</div>
          <div className={styles.subtitle}>Monitoring</div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={styles.navIcon} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Profile card ── */}
      <div className={styles.profileCard}>
        <div className={styles.profileContent}>
          <div className={styles.avatar}>DS</div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>Dhananjay Sapawat</div>
            <div className={styles.profileRole}>Administrator</div>
          </div>
          <button
            className={styles.logoutBtn}
            aria-label="Sign out"
            onClick={handleLogout}
          >
            <LogOut className={styles.logoutIcon} aria-hidden="true" />
          </button>
        </div>
      </div>

    </aside>
  );
}