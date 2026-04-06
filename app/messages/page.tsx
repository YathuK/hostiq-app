"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Property {
  _id: string;
  name: string;
}

interface MessageItem {
  _id: string;
  guestName: string;
  guestMessage: string;
  aiResponse: string;
  channel: string;
  phone: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<MessageItem[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  async function loadData() {
    const [propRes, msgRes] = await Promise.all([
      fetch("/api/properties"),
      fetch("/api/messages"),
    ]);
    const propData = await propRes.json();
    const msgData = await msgRes.json();
    setProperties(propData.properties || []);
    setHistory(msgData.messages || []);
    if (propData.properties?.length > 0) {
      setSelectedProperty(propData.properties[0]._id);
    }
  }

  async function generateResponse() {
    if (!guestMessage.trim()) return;
    setGenerating(true);
    setAiResponse("");
    setCopied(false);
    try {
      const res = await fetch("/api/guest-respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedProperty || undefined,
          guestMessage,
          guestName: guestName || "Guest",
        }),
      });
      const data = await res.json();
      setAiResponse(data.response || "Failed to generate response.");
      loadData(); // refresh history
    } catch {
      setAiResponse("Something went wrong. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  function copyResponse() {
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold text-primary">HostIQ</Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-600">Guest Messages</span>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-dark">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Main panel - Message assistant */}
          <div>
            <h1 className="text-2xl font-bold text-dark mb-6">AI Message Assistant</h1>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
              {/* Property selector */}
              {properties.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Property</label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    {properties.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Guest name */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Guest Name (optional)</label>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Sarah"
                />
              </div>

              {/* Guest message */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Guest Message</label>
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Paste the guest's message here..."
                />
              </div>

              <button
                onClick={generateResponse}
                disabled={generating || !guestMessage.trim()}
                className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Generate AI Response
                  </>
                )}
              </button>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div className="mt-6 bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-dark">AI Response</span>
                  </div>
                  <button
                    onClick={copyResponse}
                    className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>

          {/* Sidebar - History */}
          <div>
            <h2 className="text-lg font-bold text-dark mb-4">Recent Messages</h2>
            {history.length === 0 ? (
              <p className="text-sm text-slate-400">No messages yet.</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {history.map((msg) => (
                  <div key={msg._id} className="bg-white rounded-xl p-4 border border-slate-100 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-dark">{msg.guestName || "Guest"}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        msg.channel === "sms" ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-500"
                      }`}>
                        {msg.channel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-500 line-clamp-2 mb-1.5">&ldquo;{msg.guestMessage}&rdquo;</p>
                    <p className="text-slate-700 line-clamp-2">{msg.aiResponse}</p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
