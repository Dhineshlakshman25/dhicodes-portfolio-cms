"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      {/* Top Bar Switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeSwitcher align="right" />
        <Link
          href="/"
          className="text-xs font-semibold px-3 py-2 rounded-xl border transition"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
            color: "var(--theme-text)",
          }}
        >
          View Portfolio
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div
            className="p-4 rounded-2xl mb-3 shadow-md"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
              color: "var(--theme-primary)",
              border: "1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent)",
            }}
          >
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin CMS Portal
          </h1>
          <p className="text-xs opacity-70 mt-1">
            Sign in to manage your portfolio content, projects, and inquiries
          </p>
        </div>

        {/* Login Card */}
        <div
          className="backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-all"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold opacity-80" style={{ color: "var(--theme-text)" }}>
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 opacity-50 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dhineshlakshman2552@gmail.com"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border outline-none transition"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                    color: "var(--theme-text)",
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold opacity-80" style={{ color: "var(--theme-text)" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 opacity-50 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border outline-none transition"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                    color: "var(--theme-text)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 p-0.5 rounded-lg opacity-60 hover:opacity-100 transition cursor-pointer"
                  style={{ color: "var(--theme-text)" }}
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
            >
              Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div
            className="mt-6 pt-6 border-t text-center"
            style={{ borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)" }}
          >
            <Link
              href="/"
              className="text-xs font-medium opacity-75 hover:opacity-100 transition"
              style={{ color: "var(--theme-primary)" }}
            >
              ← Back to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
