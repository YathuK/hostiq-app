"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/app/AppShell";

export default function SettingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [form, setForm] = useState({
    enabled: false,
    emailAddress: "",
    appPassword: "",
    imapHost: "imap.gmail.com",
    imapPort: 993,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    responseTone: "friendly",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadSettings();
  }, [status, router]);

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.emailSettings) {
        setForm({
          enabled: data.emailSettings.enabled,
          emailAddress: data.emailSettings.emailAddress,
          appPassword: data.emailSettings.appPassword,
          imapHost: data.emailSettings.imapHost,
          imapPort: data.emailSettings.imapPort,
          smtpHost: data.emailSettings.smtpHost,
          smtpPort: data.emailSettings.smtpPort,
          responseTone: data.emailSettings.responseTone,
        });
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setTestResult({ ok: true, msg: "Settings saved!" });
      setTimeout(() => setTestResult(null), 3000);
    } catch {
      setTestResult({ ok: false, msg: "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      // Save first, then trigger a test check
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const res = await fetch("/api/cron/check-emails");
      const data = await res.json();
      if (data.results?.[0]?.error) {
        setTestResult({ ok: false, msg: `Connection error: ${data.results[0].error}` });
      } else {
        setTestResult({
          ok: true,
          msg: `Connected! ${data.results?.[0]?.processed || 0} messages processed.`,
        });
      }
    } catch (e: any) {
      setTestResult({ ok: false, msg: "Test failed. Check your credentials." });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  return (
    <AppShell>
      <div className="px-6 pt-8 pb-12 lg:px-10 max-w-3xl">
        <h1 className="text-2xl font-bold text-dark mb-2">Auto-Responder Settings</h1>
        <p className="text-slate-500 mb-8">Connect your email to automatically respond to Airbnb guest messages.</p>

        {/* How it works */}
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 mb-8">
          <h3 className="font-semibold text-dark mb-3">How automatic replies work</h3>
          <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
            <li>HostIQ checks your email inbox every 2 minutes</li>
            <li>When a new Airbnb guest message notification arrives, it reads the guest&apos;s message</li>
            <li>AI generates a response using your property details (WiFi, check-in, rules, etc.)</li>
            <li>The reply is sent from your email — Airbnb delivers it to the guest automatically</li>
          </ol>
          <p className="text-xs text-slate-500 mt-3">
            Tip: For Gmail, you need an <strong>App Password</strong> (not your regular password).
            Go to Google Account → Security → 2-Step Verification → App Passwords.
          </p>
        </div>

        {/* Enable toggle */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-dark">Auto-Responder</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {form.enabled ? "Active — checking emails every 2 minutes" : "Disabled — no automatic replies"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>

        {/* Email credentials */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6 space-y-5">
          <h2 className="text-lg font-semibold text-dark">Email Connection</h2>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
            <input
              type="email"
              value={form.emailAddress}
              onChange={(e) => setForm({ ...form, emailAddress: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="your.airbnb.email@gmail.com"
            />
            <p className="text-xs text-slate-400 mt-1">The email where you receive Airbnb notifications</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">App Password</label>
            <input
              type="password"
              value={form.appPassword}
              onChange={(e) => setForm({ ...form, appPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="xxxx xxxx xxxx xxxx"
            />
            <p className="text-xs text-slate-400 mt-1">
              Gmail: Google Account → Security → App Passwords. Not your regular password.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Response Tone</label>
            <select
              value={form.responseTone}
              onChange={(e) => setForm({ ...form, responseTone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="friendly">Friendly & Warm</option>
              <option value="professional">Professional & Concise</option>
              <option value="casual">Casual & Fun</option>
              <option value="luxurious">Luxurious & Premium</option>
            </select>
          </div>

          {/* Advanced IMAP/SMTP settings */}
          <details className="group">
            <summary className="text-sm font-medium text-slate-500 cursor-pointer hover:text-dark">
              Advanced settings (IMAP/SMTP)
            </summary>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">IMAP Host</label>
                <input
                  value={form.imapHost}
                  onChange={(e) => setForm({ ...form, imapHost: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">IMAP Port</label>
                <input
                  type="number"
                  value={form.imapPort}
                  onChange={(e) => setForm({ ...form, imapPort: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">SMTP Host</label>
                <input
                  value={form.smtpHost}
                  onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={form.smtpPort}
                  onChange={(e) => setForm({ ...form, smtpPort: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>
          </details>
        </div>

        {/* Status message */}
        {testResult && (
          <div className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
            testResult.ok
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {testResult.msg}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          <button
            onClick={handleTest}
            disabled={testing || !form.emailAddress || !form.appPassword}
            className="px-8 py-3.5 bg-dark text-white font-semibold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
