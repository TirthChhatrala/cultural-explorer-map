import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Story } from "@/lib/stories";
import { motion } from "framer-motion";
import { Plus, Edit, Trash, Eye, Send, FileText, BookOpen, Search } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  published: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const MyStories: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "pending">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const load = async () => {
    if (!user?.email) return;
    setLoading(true);
    const { data } = await supabase
      .from("stories")
      .select("*")
      .eq("author_email", user.email)
      .order("updated_at", { ascending: false });
    setStories((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.email]);

  const remove = async (id: string) => {
    if (!confirm("Delete this story permanently?")) return;
    await supabase.from("stories").delete().eq("id", id);
    toast({ title: "Story deleted" });
    load();
  };

  const publish = async (s: Story) => {
    await supabase
      .from("stories")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", s.id);
    toast({ title: "Story published", description: "It is now live on the Stories page." });
    load();
  };

  const unpublish = async (s: Story) => {
    await supabase.from("stories").update({ status: "draft" }).eq("id", s.id);
    toast({ title: "Moved back to draft" });
    load();
  };

  const filtered = stories.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (query && !s.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: stories.length,
    draft: stories.filter((s) => s.status === "draft").length,
    pending: stories.filter((s) => s.status === "pending").length,
    published: stories.filter((s) => s.status === "published").length,
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-india-orange/10 text-india-orange text-xs font-medium mb-3">
              <BookOpen size={14} /> My Stories
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Create Your Stories</h1>
            <p className="text-muted-foreground mt-1">Write, save drafts, and publish your travel & cultural stories.</p>
          </div>
          <Button onClick={() => navigate("/stories/new")} className="bg-india-orange hover:bg-india-orange/90 text-white">
            <Plus size={16} /> New Story
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {([
            { key: "all", label: "All", icon: BookOpen },
            { key: "draft", label: "Drafts", icon: FileText },
            { key: "pending", label: "Pending", icon: Send },
            { key: "published", label: "Published", icon: Eye },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`p-4 rounded-xl border text-left transition-all ${
                filter === t.key
                  ? "border-india-orange bg-india-orange/5 shadow-sm"
                  : "border-border bg-card hover:border-india-orange/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <t.icon size={18} className={filter === t.key ? "text-india-orange" : "text-muted-foreground"} />
                <span className="text-2xl font-semibold">{counts[t.key]}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t.label}</div>
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your stories..."
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading your stories...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <BookOpen className="mx-auto mb-3 text-muted-foreground" size={36} />
            <h3 className="text-lg font-semibold mb-1">No stories yet</h3>
            <p className="text-muted-foreground mb-4">Start writing your first story and share it with the world.</p>
            <Button onClick={() => navigate("/stories/new")} className="bg-india-orange hover:bg-india-orange/90 text-white">
              <Plus size={16} /> Write a Story
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {s.featured_image ? (
                  <img src={s.featured_image} alt={s.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-india-orange/20 to-india-green/20 flex items-center justify-center">
                    <BookOpen className="text-india-orange" size={32} />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[s.status]}`}>
                      {s.status}
                    </span>
                    {s.category && <span className="text-muted-foreground">· {s.category}</span>}
                  </div>
                  <h3 className="font-semibold line-clamp-2 mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{s.summary || "No description"}</p>
                  <div className="text-xs text-muted-foreground mt-auto mb-3">
                    Updated {new Date(s.updated_at).toLocaleDateString()}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.status === "published" ? (
                      <Link
                        to={`/stories/${s.slug}`}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70"
                      >
                        <Eye size={12} /> View
                      </Link>
                    ) : (
                      <button
                        onClick={() => publish(s)}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-india-green/10 text-india-green hover:bg-india-green/20"
                      >
                        <Send size={12} /> Publish
                      </button>
                    )}
                    {s.status === "published" && (
                      <button
                        onClick={() => unpublish(s)}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70"
                      >
                        <FileText size={12} /> Unpublish
                      </button>
                    )}
                    <Link
                      to={`/stories/edit/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70"
                    >
                      <Edit size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => remove(s.id)}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 ml-auto"
                    >
                      <Trash size={12} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyStories;