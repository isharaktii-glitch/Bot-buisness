"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MessageCircle, Zap, Shield, Clock, CheckCircle2 } from "lucide-react";

const RobotScene = dynamic(() => import("@/components/RobotScene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-darker overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center">
            <MessageCircle size={20} className="text-black" />
          </div>
          <span className="text-xl font-bold">BotVerse</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm rounded-lg border border-white/15 hover:bg-white/5 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm rounded-lg gradient-btn text-black font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-6 pb-16 grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI-Powered Business Automation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Never Miss a{" "}
            <span className="glow-text text-primary">Customer Order</span>{" "}
            Again
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-md">
            Connect your WhatsApp or Facebook business account and let your
            smart bot reply to every customer instantly — 24/7.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl gradient-btn text-black font-bold hover:opacity-90 transition"
            >
              Start Free Setup
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl border border-white/15 hover:bg-white/5 transition font-semibold"
            >
              I have an account
            </Link>
          </div>

          <div className="flex gap-6 mt-10">
            <div>
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-xs text-white/50">Auto Replies</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-white/50">Missed Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">2 min</p>
              <p className="text-xs text-white/50">Setup Time</p>
            </div>
          </div>
        </div>

        {/* 3D Robot */}
        <div className="relative h-[420px] md:h-[550px]">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"></div>
          <RobotScene />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">
          Everything Your Business Needs
        </h2>
        <p className="text-white/50 text-center mb-12">
          Simple setup, powerful automation
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap size={22} className="text-primary" />,
              title: "Instant Replies",
              desc: "Your bot responds to customers the moment they message — day or night.",
            },
            {
              icon: <Shield size={22} className="text-primary" />,
              title: "Secure Dashboard",
              desc: "Manage your bot, API keys and messages from one safe place.",
            },
            {
              icon: <Clock size={22} className="text-primary" />,
              title: "Turn On/Off Anytime",
              desc: "Pause or activate your bot whenever you want — full control.",
            },
            {
              icon: <MessageCircle size={22} className="text-primary" />,
              title: "Custom Welcome Message",
              desc: "Set your own first message customers see when they text you.",
            },
            {
              icon: <CheckCircle2 size={22} className="text-primary" />,
              title: "WhatsApp & Facebook",
              desc: "Connect your business number and page in a few clicks.",
            },
            {
              icon: <Shield size={22} className="text-primary" />,
              title: "No Missed Orders",
              desc: "Every customer message gets tracked and answered automatically.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 hover:border-primary/40 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20 text-center">
        <div className="glass max-w-2xl mx-auto rounded-3xl p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to automate your business?
          </h2>
          <p className="text-white/50 mb-6">
            Create your account and connect your bot in minutes.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-xl gradient-btn text-black font-bold hover:opacity-90 transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-white/30 text-sm">
        © 2026 BotVerse. All rights reserved.
      </footer>
    </main>
  );
}
