"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MessageEntry {
  _id: string;
  guestName: string;
  guestMessage: string;
  aiResponse?: string;
  channel: string;
  createdAt: string;
}

const CHANNEL_STYLES: Record<string, string> = {
  sms: "bg-emerald-50 text-emerald-700",
  manual: "bg-slate-100 text-slate-700",
  airbnb: "bg-rose-50 text-rose-700",
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const secret = sessionStorage.getItem("admin-secret");
    if (!secret) {
      router.push("/admin");
      return;
    }

    fetch("/api/admin/messages", {
      headers: { "x-admin-secret": secret },
    })
      .then((r) => {
        if (!r.ok) {
          sessionStorage.removeItem("admin-secret");
          router.push("/admin");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setMessages(data.messages);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Recent 50 guest messages</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-5 py-3 font-medium text-slate-500">Guest</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Channel</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Message</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">AI Response</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No messages yet
                  </td>
                </tr>
              )}
              {messages.map((msg, i) => (
                <tr
                  key={msg._id}
                  className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                    i % 2 === 1 ? "bg-slate-25" : ""
                  }`}
                >
                  <td className="px-5 py-3 text-slate-900 font-medium whitespace-nowrap">
                    {msg.guestName}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                        CHANNEL_STYLES[msg.channel] || CHANNEL_STYLES.manual
                      }`}
                    >
                      {msg.channel}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                    {msg.guestMessage}
                  </td>
                  <td className="px-5 py-3 text-slate-400 max-w-xs truncate">
                    {msg.aiResponse || "--"}
                  </td>
                  <td className="px-5 py-3 text-slate-400 whitespace-nowrap text-xs">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
