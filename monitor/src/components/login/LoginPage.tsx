"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { login } from "@/src/api";
import styles from "@/src/styles/login/login-page.module.css";

export default function LoginPage() {
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
      window.location.href = "/";
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ?? "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const hasInput = username.trim().length > 0 && password.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} aria-hidden="true" />

      <div className={styles.card}>
        {/* ── Header ── */}
        <div className={styles.cardHeader}>
          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.subheading}>
            Sign in to access the monitoring platform.
          </p>
        </div>

        {/* ── Form ── */}
        <div className={styles.cardBody}>
          {error && (
            <div className={styles.errorAlert} role="alert">
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">Username</label>
            <div className={styles.inputWrap}>
              <User size={14} className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${styles.input}${error ? ` ${styles.inputError}` : ""}`}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.inputWrap}>
              <Lock size={14} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${styles.inputHasToggle}${error ? ` ${styles.inputError}` : ""}`}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            className={styles.submitBtn}
            disabled={loading || !hasInput}
            onClick={handleSubmit}
          >
            {loading ? <span className={styles.spinner} /> : "Sign in"}
          </button>
        </div>

        {/* ── Footer ── */}
        <div className={styles.cardFooter}>Monitor · Detect · Respond</div>
      </div>
    </div>
  );
}