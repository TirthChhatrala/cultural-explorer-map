import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Story } from "@/lib/stories";
import { slugify, uploadDataUrl } from "@/lib/stories";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Edit, Trash, Star, Eye, Plus } from "lucide-react";
import BackToAdmin from "@/components/BackToAdmin";

const ManageStories = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiLocation, setAiLocation] = useState("");
  const [aiGenImages, setAiGenImages] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("stories").select("*").order("created_at", { ascending: false });
    setStories((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: Story["status"]) => {
    const patch: any = { status };
    if (status === "published") patch.published_at = new Date().toISOString();
    await supabase.from("stories").update(patch).eq("id", id);
    load();
  };

  const toggleFeatured = async (s: Story) => {
    await supabase.from("stories").update({ featured: !s.featured }).eq("id", s.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    await supabase.from("stories").delete().eq("id", id);
    load();
  };

  const generateAI = async () => {
    if (!aiTopic.trim()) { toast({ title: "Enter a topic", variant: "destructive" }); return; }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-story-generator", {
        body: { topic: aiTopic, location: aiLocation, generateImages: aiGenImages },
      });
      if (error) throw error;
      toast({ title: "Generated! Uploading images..." });

      // Upload base64 images to storage to get persistent URLs
      let hero: string | null = null;
      const gallery: string[] = [];
      if (data.hero_image) hero = await uploadDataUrl(data.hero_image);
      else if (data.thumbnail_image) hero = await uploadDataUrl(data.thumbnail_image);
      if (Array.isArray(data.gallery_images)) {
        for (const g of data.gallery_images) {
          try { gallery.push(await uploadDataUrl(g)); } catch {}
        }
      }

      const slug = slugify(data.title || aiTopic);
      const { data: inserted, error: insErr } = await supabase.from("stories").insert({
        title: data.title || aiTopic,
        slug,
        summary: data.summary,
        content: data.content,
        category: data.category || "Culture",
        location: data.location || aiLocation,
        tags: data.tags || [],
        featured_image: hero,
        gallery_images: gallery,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        structured: data.structured,
        ai_generated: true,
        is_admin_generated: true,
        status: "draft",
        author_name: "AI Story Generator",
      }).select().maybeSingle();
      if (insErr) throw insErr;
      toast({ title: "Draft created — review & publish" });
      setAiOpen(false);
      setAiTopic(""); setAiLocation("");
      navigate(`/admin/stories/edit/${(inserted as any).id}`);
    } catch (e: any) {
      toast({ title: "AI generation failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Stories Management</h1>
            <p className="text-muted-foreground">Create, review, and publish stories.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/admin/stories/new")} variant="outline"><Plus size={14} /> New Story</Button>
            <Button onClick={() => setAiOpen(true)} className="bg-india-orange hover:bg-india-orange/90"><Sparkles size={14} /> AI Generate</Button>
          </div>
        </div>

        {loading ? (<div className="text-center py-20 text-muted-foreground">Loading...</div>) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Author</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Featured</th><th className="p-3 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-3">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.category} {s.location ? `· ${s.location}` : ""}</div>
                    </td>
                    <td className="p-3">
                      <select value={s.status} onChange={(e) => setStatus(s.id, e.target.value as any)} className="h-8 rounded border border-input bg-background px-2 text-xs">
                        <option value="draft">Draft</option><option value="pending">Pending</option><option value="scheduled">Scheduled</option><option value="published">Published</option>
                      </select>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.author_name || "—"}</td>
                    <td className="p-3">{s.ai_generated ? <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">AI</span> : <span className="px-2 py-0.5 bg-muted rounded text-xs">Manual</span>}</td>
                    <td className="p-3"><button onClick={() => toggleFeatured(s)}><Star size={16} className={s.featured ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground"} /></button></td>
                    <td className="p-3 text-right space-x-1">
                      <Link to={`/stories/${s.slug}`} className="inline-flex items-center p-2 rounded hover:bg-muted" title="View"><Eye size={14} /></Link>
                      <Link to={`/admin/stories/edit/${s.id}`} className="inline-flex items-center p-2 rounded hover:bg-muted" title="Edit"><Edit size={14} /></Link>
                      <button onClick={() => remove(s.id)} className="p-2 rounded hover:bg-destructive/10 text-destructive" title="Delete"><Trash size={14} /></button>
                    </td>
                  </tr>
                ))}
                {stories.length === 0 && (<tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No stories yet.</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="text-india-orange" /> AI Story Generator</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Topic *</Label><Input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. The hidden temples of Hampi" /></div>
            <div><Label>Location (optional)</Label><Input value={aiLocation} onChange={(e) => setAiLocation(e.target.value)} placeholder="e.g. Karnataka" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={aiGenImages} onChange={(e) => setAiGenImages(e.target.checked)} /> Also generate hero & gallery images (slower)</label>
            <Button onClick={generateAI} disabled={generating} className="w-full bg-india-orange hover:bg-india-orange/90">
              {generating ? "Generating story & images..." : "Generate Story"}
            </Button>
            <p className="text-xs text-muted-foreground">A draft will be created. You can edit, review, schedule, feature, or publish it.</p>
          </div>
        </DialogContent>
      </Dialog>

      <BackToAdmin />
    </div>
  );
};

export default ManageStories;