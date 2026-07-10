"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  LogOut,
  Power,
  Save,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

interface BotConfig {
  phoneNumberId: string | null;
  accessToken: string | null;
  verifyToken: string | null;
  whatsappNumber: string | null;
  welcomeMessage: string | null;
  isActive: boolean;
}

interface UserData {
  username: string;
  email: string;
  isApproved: boolean;
  paymentStatus: string;
  botConfig: BotConfig | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [form, setForm] = useState({
    phoneNumberId: "",
    accessToken: "",
    verifyToken: "",
    whatsappNumber: "",
    welcomeMessage: "",
  });

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/login");
          return;
        }
        setUser(data);
        if (data.botConfig) {
          setForm({
            phoneNumberId: data.botConfig.phoneNumberId || "",
            accessToken: data.botConfig.accessToken || "",
            verifyToken: data.botConfig.verifyToken || "",
            whatsappNumber: data.botConfig.whatsappNumber || "",
            welcomeMessage: data.botConfig.welcomeMessage || "",
          });
        }
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch("/api/user/bot-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setSaveMsg(data.error || "Failed to save");
    } else {
      setSaveMsg("Saved successfully!");
      setUser((prev) => (prev ? { ...prev, botConfig: data.botConfig } : prev));
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const toggleBot = async () => {
    if (!user?.botConfig) return;
    const newState = !user.botConfig.isActive;
    const res = await fetch("/api/user/bot-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: newState }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser((prev) =>
        prev ? { ...prev, botConfig: data.botConfig } : prev
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) return null;

  const isApproved = user.isApproved;

  return (
    <main className="min-h-screen bg-darker">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <MessageCircle size={18} className="text-black" />
          </div>
          <span className="font-bold">BotVerse</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60 hidden sm:block">
            {user.username}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome, {user.username} 👋
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Manage your WhatsApp bot from here
        </p>

        {/* Payment / Approval Status */}
        {!isApproved && (
          <div className="glass rounded-2xl p-6 mb-6 border-yellow-500/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">
                  {user.paymentStatus === "rejected"
                    ? "Payment Rejected"
                    : "Waiting for Payment Approval"}
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  {user.paymentStatus === "rejected"
                    ? "Your payment was not approved. Please contact support or try again."
                    : "Complete your payment and our team will activate your bot access within a short time."}
                </p>
                <div className="glass rounded-xl p-4 text-sm space-y-1">
                  <p className="text-white/70">
                    📱 Contact us on WhatsApp to complete payment:
                  </p>
                  <p className="font-bold text-primary">
                    +94 XX XXX XXXX (Update this number)
                  </p>
                  <p className="text-white/50 text-xs mt-2">
                    Once payment is confirmed, admin will approve your account
                    and you'll get full dashboard access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 border-primary/30">
            <CheckCircle2 size={20} className="text-primary" />
            <p className="text-sm">
              Your account is <span className="text-primary font-semibold">approved</span>. 
              You have full access to bot settings below.
            </p>
          </div>
        )}

        {/* Bot Status Toggle */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <Power size={18} className="text-primary" /> Bot Status
              </h3>
              <p className="text-sm text-white/50 mt-1">
                Turn your bot on or off anytime
              </p>
            </div>
            <button
              disabled={!isApproved}
              onClick={toggleBot}
              className={`relative w-16 h-8 rounded-full transition ${
                user.botConfig?.isActive ? "bg-primary" : "bg-white/15"
              } ${!isApproved ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <span
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  user.botConfig?.isActive
                    ? "translate-x-9"
                    : "translate-x-1"
                }`}
              ></span>
            </button>
          </div>
          <p className="text-xs mt-3 text-white/40">
            Status:{" "}
            <span
              className={
                user.botConfig?.isActive ? "text-primary" : "text-white/50"
              }
            >
              {user.botConfig?.isActive ? "Active" : "Inactive"}
            </span>
          </p>
        </div>

        {/* WhatsApp Connection Form */}
        <div className={`glass rounded-2xl p-6 mb-6 ${!isApproved ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="font-bold mb-1">WhatsApp Business Connection</h3>
          <p className="text-sm text-white/50 mb-5">
            Enter your Meta WhatsApp Cloud API credentials
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 block mb-1.5">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) =>
                  setForm({ ...form, whatsappNumber: e.target.value })
                }
                placeholder="+94712345678"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1.5">
                Phone Number ID
              </label>
              <input
                type="text"
                value={form.phoneNumberId}
                onChange={(e) =>
                  setForm({ ...form, phoneNumberId: e.target.value })
                }
                placeholder="From Meta Developer Console"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1.5">
                Access Token
              </label>
              <input
                type="password"
                value={form.accessToken}
                onChange={(e) =>
                  setForm({ ...form, accessToken: e.target.value })
                }
                placeholder="Your permanent access token"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1.5">
                Verify Token
              </label>
              <input
                type="text"
                value={form.verifyToken}
                onChange={(e) =>
                  setForm({ ...form, verifyToken: e.target.value })
                }
                placeholder="Create your own verify token (e.g. mybot123)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition"
              />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className={`glass rounded-2xl p-6 mb-6 ${!isApproved ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="font-bold mb-1">Welcome Message</h3>
          <p className="text-sm text-white/50 mb-4">
            This message is sent automatically when someone messages your
            business for the first time
          </p>
          <textarea
            value={form.welcomeMessage}
            onChange={(e) =>
              setForm({ ...form, welcomeMessage: e.target.value })
            }
            rows={5}
            placeholder="Hi! Thanks for messaging us. We're here to help with your order..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={!isApproved || saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-btn text-black font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Settings
          </button>
          {saveMsg && (
            <span className="text-sm text-primary flex items-center gap-1">
              <CheckCircle2 size={16} /> {saveMsg}
            </span>
          )}
        </div>

        {/* Webhook Info */}
        {isApproved && (
          <div className="glass rounded-2xl p-6 mt-8">
            <h3 className="font-bold mb-2">📌 Webhook Setup (Important)</h3>
            <p className="text-sm text-white/50 mb-3">
              Add this Webhook URL in your Meta Developer Console under
              WhatsApp → Configuration:
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-xs font-mono text-primary break-all">
              https://YOUR-DOMAIN.vercel.app/api/webhook/whatsapp
            </div>
            <p className="text-sm text-white/50 mt-3">
              Use the same <span className="text-white">Verify Token</span>{" "}
              you entered above.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
