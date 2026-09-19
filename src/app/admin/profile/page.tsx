"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ResumeUpload } from "@/components/ui/ResumeUpload";
import { toast } from "sonner";
import { Loader2, Save, UserCheck } from "lucide-react";

interface ProfileData {
  id?: string;
  name: string;
  title?: string;
  tagline?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  resume_url?: string;
  location?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  years_experience?: number;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    title: "",
    tagline: "",
    bio: "",
    avatar_url: "",
    cover_image_url: "",
    resume_url: "",
    location: "",
    email: "",
    phone: "",
    alternate_phone: "",
    years_experience: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ProfileData>("/api/admin/profile");
        if (res) {
          setProfile(res);
        }
      } catch (err) {
        console.error("No existing profile or error loading", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/api/admin/profile", {
        ...profile,
        years_experience: Number(profile.years_experience) || 0,
      });
      toast.success("Profile saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Profile Management
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Update personal information, hero greeting, avatar, and career details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visual Assets Card */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Visual Assets (Avatar & Cover)
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <ImageUpload
              label="Avatar Image"
              folder="avatar"
              value={profile.avatar_url}
              onChange={(url) => setProfile((p) => ({ ...p, avatar_url: url }))}
              onRemove={() => setProfile((p) => ({ ...p, avatar_url: "" }))}
            />

            <ImageUpload
              label="Cover Image"
              folder="cover"
              value={profile.cover_image_url}
              onChange={(url) =>
                setProfile((p) => ({ ...p, cover_image_url: url }))
              }
              onRemove={() => setProfile((p) => ({ ...p, cover_image_url: "" }))}
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Basic Details & Taglines
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="John Doe"
                required
              />
              <Input
                label="Professional Title"
                value={profile.title || ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Full Stack Software Engineer"
              />
            </div>

            <Input
              label="Hero Tagline"
              value={profile.tagline || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, tagline: e.target.value }))
              }
              placeholder="Building scalable web applications and intuitive digital experiences"
            />

            <Textarea
              label="About Me / Bio"
              value={profile.bio || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
              rows={4}
              placeholder="A comprehensive introduction about your expertise, passion, and background..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                value={profile.years_experience || 0}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    years_experience: Number(e.target.value),
                  }))
                }
              />
              <Input
                label="Location"
                value={profile.location || ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="San Francisco, CA (or Remote)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Contact Information
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
            <Input
              label="Primary Email"
              type="email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="you@domain.com"
            />
            <Input
              label="Phone Number"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Alternate Phone"
              value={profile.alternate_phone || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, alternate_phone: e.target.value }))
              }
              placeholder="+1 (555) 111-2222"
            />
          </CardContent>
        </Card>

        {/* Resume / CV Document */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Resume / Curriculum Vitae
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <ResumeUpload
              label="Upload Resume Document (PDF)"
              value={profile.resume_url}
              onChange={(url) => setProfile((p) => ({ ...p, resume_url: url }))}
              onRemove={() => setProfile((p) => ({ ...p, resume_url: "" }))}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={saving}>
            <Save className="w-4 h-4 mr-2" /> Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
