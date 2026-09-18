"use client";

import React, { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Award, Plus, Edit2, Trash2, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import dayjs from "dayjs";

interface Certification {
  id: number;
  title: string;
  issuer?: string | null;
  issue_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  certificate_image?: string | null;
}

export default function AdminCertificationsPage() {
  const [list, setList] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Certification>>({
    title: "",
    issuer: "",
    issue_date: "",
    credential_id: "",
    credential_url: "",
    certificate_image: "",
  });

  const loadList = async () => {
    try {
      setLoading(true);
      const res = await api.get<Certification[]>("/api/admin/certifications");
      setList(res || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load certifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      title: "",
      issuer: "",
      issue_date: new Date().toISOString().split("T")[0],
      credential_id: "",
      credential_url: "",
      certificate_image: "",
    });
    setModalOpen(true);
  };

  const openEdit = (cert: Certification) => {
    setEditing(cert);
    setFormData({
      ...cert,
      issue_date: cert.issue_date
        ? new Date(cert.issue_date).toISOString().split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Certification title is required");
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        await api.put("/api/admin/certifications", {
          id: editing.id,
          ...formData,
        });
        toast.success("Certification updated");
      } else {
        await api.post("/api/admin/certifications", formData);
        toast.success("Certification added");
      }
      setModalOpen(false);
      loadList();
    } catch (err: any) {
      toast.error(err.message || "Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await api.delete(`/api/admin/certifications/${id}`);
      toast.success("Certification deleted");
      setList((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Licenses & Certifications
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Display professional certifications from AWS, Google Cloud, Meta, etc.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Certificate
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : list.length === 0 ? (
        <Card className="p-12 text-center">
          <Award className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No certifications added yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Upload your professional credentials to showcase verified skills.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((cert) => (
            <Card
              key={cert.id}
              className="p-5 flex flex-col justify-between hover:border-blue-500/40 transition group"
            >
              <div className="space-y-3">
                {cert.certificate_image && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <SafeImage
                      src={cert.certificate_image}
                      alt={cert.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-1">
                    {cert.title}
                  </h3>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    {cert.issuer || "Issuing Organization"}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  {cert.issue_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued {dayjs(cert.issue_date).format("MMM YYYY")}
                    </span>
                  )}
                  {cert.credential_id && (
                    <span className="truncate max-w-[120px]">
                      ID: {cert.credential_id}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600"
                  >
                    Verify Credential <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cert)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cert.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Certification" : "Add Certification"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUpload
            label="Certificate Badge / Document Preview"
            folder="certifications"
            value={formData.certificate_image || ""}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, certificate_image: url }))
            }
            onRemove={() =>
              setFormData((prev) => ({ ...prev, certificate_image: "" }))
            }
          />

          <Input
            label="Certification Name *"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="AWS Certified Solutions Architect"
            required
          />

          <Input
            label="Issuing Organization"
            value={formData.issuer || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, issuer: e.target.value }))
            }
            placeholder="Amazon Web Services / Google Cloud"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Issue Date"
              type="date"
              value={formData.issue_date || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, issue_date: e.target.value }))
              }
            />
            <Input
              label="Credential ID"
              value={formData.credential_id || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  credential_id: e.target.value,
                }))
              }
              placeholder="ABC-12345"
            />
          </div>

          <Input
            label="Credential Verification URL"
            value={formData.credential_url || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                credential_url: e.target.value,
              }))
            }
            placeholder="https://www.credly.com/badges/..."
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editing ? "Update Certificate" : "Add Certificate"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
