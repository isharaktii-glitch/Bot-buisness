"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  LogOut,
  Power,
  Save,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  Facebook,
  Instagram,
} from "lucide-react";

// (Interface definitions remain the same)
interface BotConfig {
  waPhoneNumberId: string | null;
  waAccessToken: string | null;
  waVerifyToken: string | null;
  waNumber: string | null;
  waActive: boolean;
  fbPageId: string | null;
  fbAccessToken: string | null;
  fbVerifyToken: string | null;
  fbActive: boolean;
  igAccountId: string | null;
  igAccessToken: string | null;
  igActive: boolean;
  isActive: boolean;
  aiEnabled: boolean;
  businessContext: string | null;
  welcomeMessage: string | null;
}

interface UserData {
  username: string;
  email: string;
  isApproved: boolean;
  paymentStatus: string;
  botConfig: BotConfig | null;
}

type TabType = "whatsapp" | "facebook" | "instagram";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("whatsapp");

  const [form, setForm] = useState({
    waPhoneNumberId: "", waAccessToken: "", waVerifyToken: "", waNumber: "",
    fbPageId: "", fbAccessToken: "", fbVerifyToken: "",
    igAccountId: "", igAccessToken: "",
    welcomeMessage: "", businessContext: "",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (res.status === 401) { router.push("/login"); return; }
        const data = await res.json();
        setUser(data);
        setForm({
          waPhoneNumberId: data.botConfig?.waPhoneNumberId || "",
          waAccessToken: data.botConfig?.waAccessToken || "",
          waVerifyToken: data.botConfig?.waVerifyToken || "",
          waNumber: data.botConfig?.waNumber || "",
          fbPageId: data.botConfig?.fbPageId || "",
          fbAccessToken: data.botConfig?.fbAccessToken || "",
          fbVerifyToken: data.botConfig?.fbVerifyToken || "",
          igAccountId: data.botConfig?.igAccountId || "",
          igAccessToken: data.botConfig?.igAccessToken || "",
          welcomeMessage: data.botConfig?.welcomeMessage || "",
          businessContext: data.botConfig?.businessContext || "",
        });
        setLoading(false);
      } catch { setErrorMsg("Failed to load account."); setLoading(false); }
    }
    loadUser();
  }, [router]);

  const toggleField = async (field: keyof BotConfig, currentValue: boolean) => {
    setToggling(field);
    try {
      const res = await fetch("/api/user/bot-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      const data = await res.json();
      if (res.ok && data.botConfig) {
        setUser(prev => prev ? { ...prev, botConfig: { ...prev.botConfig, ...data.botConfig } as BotConfig } : prev);
      } else {
        alert("Toggle failed: " + (data.error || "unknown error"));
      }
    } catch { alert("Network error."); }
    setToggling(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/bot-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMsg("Saved successfully!");
        setUser(prev => prev ? { ...prev, botConfig: { ...prev.botConfig, ...data.botConfig } } : prev);
      } else {
        setSaveMsg(data.error || "Failed");
      }
    } catch { setSaveMsg("Error."); }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  if (loading) return <div className="min-h-screen bg-darker flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-darker text-white p-6">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">BotVerse</h1>
        <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/login"))}>Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user.username}</h1>

        {/* Master Switches */}
        <div className="glass p-6 rounded-2xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <span>Bot Status</span>
            <input type="checkbox" checked={user.botConfig?.isActive || false} onChange={() => toggleField("isActive", user.botConfig?.isActive || false)} className="w-6 h-6" />
          </div>
          <div className="flex justify-between items-center">
            <span>AI Smart Replies</span>
            <input type="checkbox" checked={user.botConfig?.aiEnabled || false} onChange={() => toggleField("aiEnabled", user.botConfig?.aiEnabled || false)} className="w-6 h-6" />
          </div>
        </div>

        {/* Platforms (Always active now, removed pointer-events-none) */}
        <div className="glass p-6 rounded-2xl">
           <h3 className="mb-4 font-bold">Platform Settings</h3>
           <div className="flex gap-4 mb-4">
             <button onClick={() => setActiveTab("whatsapp")}>WhatsApp</button>
             <button onClick={() => setActiveTab("facebook")}>Facebook</button>
             <button onClick={() => setActiveTab("instagram")}>Instagram</button>
           </div>
           
           {/* WhatsApp Toggle Example */}
           {activeTab === "whatsapp" && (
             <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
               <span>WhatsApp Active</span>
               {toggling === "waActive" ? <Loader2 className="animate-spin" /> : 
               <input type="checkbox" checked={user.botConfig?.waActive || false} onChange={() => toggleField("waActive", user.botConfig?.waActive || false)} />}
             </div>
           )}
           {/* (Add similar logic for facebook and instagram) */}
        </div>
      </div>
    </main>
  );
}
