"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Calendar,
  Reply,
  Loader2,
  Briefcase,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import dayjs from "dayjs";

interface ContactMessage {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  is_read?: boolean | null;
  created_at?: string | null;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get<ContactMessage[]>("/api/admin/contact-messages");
      setMessages(res || []);
      window.dispatchEvent(new CustomEvent("messages-updated"));
    } catch (err: any) {
      toast.error(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkAsRead = async (msg: ContactMessage) => {
    try {
      await api.put("/api/admin/contact-messages", {
        id: msg.id,
        is_read: !msg.is_read,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage((prev) =>
          prev ? { ...prev, is_read: !prev.is_read } : null
        );
      }
      window.dispatchEvent(new CustomEvent("messages-updated"));
      toast.success(msg.is_read ? "Marked as unread" : "Marked as read");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/api/admin/contact-messages/${id}`);
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      window.dispatchEvent(new CustomEvent("messages-updated"));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Contact Inquiries
            </h1>
            {unreadCount > 0 && (
              <Badge variant="warning" size="sm">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Messages sent from your public portfolio contact form
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : messages.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Inbox is clean
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            When recruiters or clients submit inquiries on your site, they will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`p-5 transition cursor-pointer hover:border-blue-500/40 ${
                !msg.is_read
                  ? "border-l-4 border-l-blue-600 bg-blue-50/10 dark:bg-blue-950/10"
                  : ""
              }`}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.is_read) handleMarkAsRead(msg);
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {msg.name || "Anonymous Visitor"}
                    </span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {msg.email}
                    </span>
                    {!msg.is_read && (
                      <Badge variant="warning" size="sm">
                        New
                      </Badge>
                    )}
                    {msg.subject?.includes("[Freelance Inquiry]") && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <Briefcase className="w-2.5 h-2.5" /> Freelance Inquiry
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                    {msg.subject || "No Subject"}
                  </h4>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {msg.message}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dayjs(msg.created_at).format("MMM DD, YYYY · hh:mm A")}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 self-start sm:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                        msg.subject || "Your Inquiry"
                      )}`}
                      className="p-2 rounded-xl text-zinc-500 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      title="Reply by Email"
                    >
                      <Reply className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleMarkAsRead(msg)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-emerald-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    title={msg.is_read ? "Mark unread" : "Mark read"}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Message Reader Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || "Message Details"}
        maxWidth="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            {selectedMessage.subject?.includes("[Freelance Inquiry]") && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> Freelance Project Inquiry
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  Ready for Scope & Proposal
                </span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900 dark:text-white">
                  From: {selectedMessage.name}
                </span>
                <span className="text-zinc-400">
                  {dayjs(selectedMessage.created_at).format("MMM DD, YYYY · hh:mm A")}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {selectedMessage.email}
                  </a>
                </span>
                {selectedMessage.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedMessage.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(selectedMessage.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>

              <div className="flex gap-2">
                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || "Your Project Inquiry"
                    )}`}
                    className="inline-flex items-center justify-center rounded-xl font-bold transition px-4 py-2 text-xs bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                  >
                    <Reply className="w-3.5 h-3.5 mr-1.5" />
                    {selectedMessage.subject?.includes("[Freelance Inquiry]")
                      ? "Send Proposal via Email"
                      : "Reply via Email"}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
