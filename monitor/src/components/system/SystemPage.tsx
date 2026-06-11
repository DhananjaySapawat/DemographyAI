"use client";

import { useEffect, useState, useCallback } from "react";
import { Cpu, Layers, HardDrive, Activity, Server } from "lucide-react";
import {
  getSystemStats,
  getProcessStats,
  getSystemInfo
} from "@/src/api";
import styles from "@/src/styles/system/system-page.module.css";

// ── Constants ─────────────────────────────────────────────────────────────────

const POLL_MS    = 3000;
const MAX_POINTS = 40;

// ── Helpers ───────────────────────────────────────────────────────────────────

const toGB = (bytes: number) => (bytes / 1024 ** 3).toFixed(1);

function formatUptime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
}

function valueClass(p: number) {
  if (p < 60) return styles.green;
  if (p < 85) return styles.amber;
  return styles.red;
}

function barClass(p: number) {
  if (p < 60) return styles.barGreen;
  if (p < 85) return styles.barAmber;
  return styles.barRed;
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

const W = 300, H = 52;

function Sparkline({ data, stroke, uid }: { data: number[]; stroke: string; uid: string }) {
  if (data.length < 2) return <div className={styles.sparkSvg} />;

  const max  = Math.max(...data, 100);
  const pts  = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - (v / max) * (H - 6),
  ]);
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.sparkSvg} preserveAspectRatio="none">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${uid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SystemPage() {
  const [system,      setSystem]      = useState<any>(null);
  const [process,     setProcess]     = useState<any>(null);
  const [info,        setInfo]        = useState<any>(null);
  const [cpuHistory,  setCpuHistory]  = useState<number[]>([]);
  const [ramHistory,  setRamHistory]  = useState<number[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [updatedAt,   setUpdatedAt]   = useState<Date | null>(null);

  const fetchLive = useCallback(async () => {
    try {
      const [sysRes, procRes] : any = await Promise.all([
        getSystemStats(),
        getProcessStats(),
      ]);
      setSystem(sysRes.data);
      setProcess(procRes.data);
      setCpuHistory(prev => [...prev.slice(-(MAX_POINTS - 1)), sysRes.data.cpu.percent]);
      setRamHistory(prev => [...prev.slice(-(MAX_POINTS - 1)), sysRes.data.ram.percent]);
      setUpdatedAt(new Date());
      setLoading(false);
      setError(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // System info — fetch once (static data)
    getSystemInfo()
      .then(res => setInfo(res.data))
      .catch(() => {});

    // Live stats — fetch immediately then poll
    fetchLive();
    const interval = setInterval(fetchLive, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchLive]);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>System</h1>
            <p className={styles.pageSubtitle}>VM resource usage · FastAPI process</p>
          </div>
        </div>
        <div className={styles.statsRow}>
          {[0, 1, 2].map(i => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error && !system) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <p>Could not reach the backend. Make sure FastAPI is running.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>System</h1>
          <p className={styles.pageSubtitle}>VM resource usage · FastAPI process</p>
        </div>
        <div className={styles.headerRight}>
          {updatedAt && (
            <span className={styles.updatedAt}>
              Updated {updatedAt.toLocaleTimeString()}
            </span>
          )}
          <div className={styles.liveBadge}>
            <span className={styles.liveDot} aria-hidden="true" />
            Live
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {system && (
        <div className={styles.statsRow}>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <Cpu size={13} className={styles.statIcon} aria-hidden="true" />
              <span className={styles.statLabel}>CPU Usage</span>
            </div>
            <div className={`${styles.statValue} ${valueClass(system.cpu.percent)}`}>
              {system.cpu.percent.toFixed(1)}%
            </div>
            <div className={styles.bar}>
              <div
                className={`${styles.barFill} ${barClass(system.cpu.percent)}`}
                style={{ width: `${system.cpu.percent}%` }}
              />
            </div>
            <div className={styles.statMeta}>{system.cpu.cores} cores</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <Layers size={13} className={styles.statIcon} aria-hidden="true" />
              <span className={styles.statLabel}>Memory</span>
            </div>
            <div className={`${styles.statValue} ${valueClass(system.ram.percent)}`}>
              {system.ram.percent.toFixed(1)}%
            </div>
            <div className={styles.bar}>
              <div
                className={`${styles.barFill} ${barClass(system.ram.percent)}`}
                style={{ width: `${system.ram.percent}%` }}
              />
            </div>
            <div className={styles.statMeta}>
              {toGB(system.ram.used)} GB / {toGB(system.ram.total)} GB
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <HardDrive size={13} className={styles.statIcon} aria-hidden="true" />
              <span className={styles.statLabel}>Disk</span>
            </div>
            <div className={`${styles.statValue} ${valueClass(system.disk.percent)}`}>
              {system.disk.percent.toFixed(1)}%
            </div>
            <div className={styles.bar}>
              <div
                className={`${styles.barFill} ${barClass(system.disk.percent)}`}
                style={{ width: `${system.disk.percent}%` }}
              />
            </div>
            <div className={styles.statMeta}>
              {toGB(system.disk.used)} GB / {toGB(system.disk.total)} GB
            </div>
          </div>

        </div>
      )}

      {/* ── Charts ── */}
      {system && (
        <div className={styles.chartsRow}>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <span className={styles.chartLabel}>CPU %</span>
              <span className={`${styles.chartCurrent} ${valueClass(system.cpu.percent)}`}>
                {system.cpu.percent.toFixed(1)}%
              </span>
            </div>
            <Sparkline data={cpuHistory} stroke="#2563eb" uid="grad-cpu" />
            <div className={styles.chartFooter}>
              <span>Last ~2 min</span>
              <span>Every 3s</span>
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <span className={styles.chartLabel}>Memory %</span>
              <span className={`${styles.chartCurrent} ${valueClass(system.ram.percent)}`}>
                {system.ram.percent.toFixed(1)}%
              </span>
            </div>
            <Sparkline data={ramHistory} stroke="#10b981" uid="grad-ram" />
            <div className={styles.chartFooter}>
              <span>Last ~2 min</span>
              <span>Every 3s</span>
            </div>
          </div>

        </div>
      )}

      {/* ── Detail panels ── */}
      <div className={styles.panelsRow}>

        {process && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <Activity size={13} className={styles.panelIcon} aria-hidden="true" />
              <span className={styles.panelTitle}>FastAPI Process</span>
              <span className={styles.pidChip}>PID {process.pid}</span>
            </div>
            <div className={styles.panelRows}>
              {([
                ["CPU",     `${process.cpu_percent.toFixed(1)}%`],
                ["Memory",  `${process.ram_mb.toFixed(1)} MB`],
                ["Threads", process.threads],
                ["Uptime",  formatUptime(process.uptime_sec)],
              ] as [string, string | number][]).map(([label, value]) => (
                <div key={label} className={styles.panelRow}>
                  <span className={styles.panelLabel}>{label}</span>
                  <span className={styles.panelValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {info && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <Server size={13} className={styles.panelIcon} aria-hidden="true" />
              <span className={styles.panelTitle}>System Info</span>
            </div>
            <div className={styles.panelRows}>
              {([
                ["Hostname",   info.hostname],
                ["OS",         info.os],
                ["Python",     info.python_version],
                ["CPU Cores",  `${info.cpu_cores} physical · ${info.cpu_threads} logical`],
                ["Total RAM",  `${info.ram_total_gb} GB`],
                ["Total Disk", `${info.disk_total_gb} GB`],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className={styles.panelRow}>
                  <span className={styles.panelLabel}>{label}</span>
                  <span className={styles.panelValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}