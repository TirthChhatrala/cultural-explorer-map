import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import RichTextEditor from "@/components/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { slugify, uploadStoryImage, STORY_CATEGORIES, type Story } from "@/lib/stories";
import { Save, Upload, X, Plus } from "lucide-react";

interface Props { adminMode?: boolean }

const StoryEditor: React.FC<Props> = ({ adminMode }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Travel");
  const [location, setLocation] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [linksStr, setLinksStr] = useState("");
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [textColor, setTextColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [status, setStatus] = useState<Story["status"]>("published");
  const [scheduledAt, setScheduledAt] = useState("");
  const [featuredFlag, setFeaturedFlag] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("stories").select("*").eq("id", id).maybeSingle();
      if (data) {
        const s = data as any as Story;
        setTitle(s.title); setSummary(s.summary || ""); setCategory(s.category || "Travel");
        setLocation(s.location || ""); setTagsStr((s.tags || []).join(", "));
        setLinksStr((s.links || []).map((l) => `${l.label}|${l.url}`).join("\n"));
        setContent(s.content || ""); setFeatured(s.featured_image || "");
        setGallery(s.gallery_images || []); setTextColor(s.text_color || "");
        setBgColor(s.bg_color || ""); setSeoTitle(s.seo_title || "");
        setSeoDesc(s.seo_description || ""); setStatus(s.status);
        setScheduledAt(s.scheduled_at ? s.scheduled_at.slice(0, 16) : "");
        setFeaturedFlag(s.featured);
      }
      setLoading(false);
    })();
  }, [id, isAuthenticated, navigate]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "featured" | "gallery") => {
    const files = e.target.files; if (!files) return;
    try {
      const urls = await Promise.all(Array.from(files).map(uploadStoryImage));
      if (target === "featured") setFeatured(urls[0]);
      else setGallery((g) => [...g, ...urls]);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  const save = async () => {
    if (!title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
      const links = linksStr.split("\n").map((l) => { const [label, url] = l.split("|"); return { label: (label || "").trim(), url: (url || "").trim() }; }).filter((l) => l.url);
      const payload: any = {
        title, summary, content, category, location,
        tags, links,
        featured_image: featured || null,
        gallery_images: gallery,
        text_color: textColor || null, bg_color: bgColor || null,
        seo_title: seoTitle || null, seo_description: seoDesc || null,
        status, featured: featuredFlag,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        published_at: status === "published" ? new Date().toISOString() : null,
        author_name: user?.name || "Anonymous",
        author_email: user?.email || null,
        is_admin_generated: !!isAdmin && adminMode,
      };
      let res;
      if (id) {
        res = await supabase.from("stories").update(payload).eq("id", id).select().maybeSingle();
      } else {
        payload.slug = slugify(title);
        res = await supabase.from("stories").insert(payload).select().maybeSingle();
      }
      if (res.error) throw res.error;
      toast({ title: "Story saved" });
      navigate(`/stories/${(res.data as any).slug}`);
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-20 text-muted-foreground">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-display font-bold mb-6">{id ? "Edit Story" : "Write a Story"}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="An unforgettable journey..." />
            </div>
            <div>
              <Label>Short Description</Label>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
            </div>
            <div>
              <Label>Content</Label>
              <RichTextEditor value={content} onChange={setContent} textColor={textColor} bgColor={bgColor} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-4 rounded-lg border border-border space-y-3">
              <h3 className="font-semibold">Publish</h3>
              {isAdmin && adminMode ? (
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              ) : (
                <>
                  <select value={status === "scheduled" || status === "pending" ? "draft" : status} onChange={(e) => setStatus(e.target.value as any)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Now</option>
                  </select>
                  <div className="text-xs text-muted-foreground">Drafts stay private. Published stories appear on the public Stories page.</div>
                </>
              )}
              {status === "scheduled" && (
                <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              )}
              {isAdmin && adminMode && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={featuredFlag} onChange={(e) => setFeaturedFlag(e.target.checked)} /> Feature on homepage
                </label>
              )}
              <Button onClick={save} disabled={saving} className="w-full bg-india-orange hover:bg-india-orange/90">
                <Save size={14} /> {saving ? "Saving..." : "Save Story"}
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-border space-y-3">
              <h3 className="font-semibold">Featured Image</h3>
              {featured && <img src={featured} alt="" className="w-full aspect-video object-cover rounded-md" />}
              <label className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-dashed border-input cursor-pointer text-sm hover:bg-muted">
                <Upload size={14} /> {featured ? "Replace" : "Upload"}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleUpload(e, "featured")} />
              </label>
            </div>

            <div className="p-4 rounded-lg border border-border space-y-3">
              <h3 className="font-semibold">Gallery</h3>
              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-md" />
                      <button type="button" onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-dashed border-input cursor-pointer text-sm hover:bg-muted">
                <Plus size={14} /> Add images
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => handleUpload(e, "gallery")} />
              </label>
            </div>

            <div className="p-4 rounded-lg border border-border space-y-3">
              <h3 className="font-semibold">Details</h3>
              <div><Label>Category</Label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  {STORY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kerala" /></div>
              <div><Label>Tags (comma-separated)</Label><Input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="culture, food" /></div>
              <div><Label>Links (label|url per line)</Label><Textarea value={linksStr} onChange={(e) => setLinksStr(e.target.value)} rows={3} placeholder="Official site|https://..." /></div>
            </div>

            <div className="p-4 rounded-lg border border-border space-y-3">
              <h3 className="font-semibold">Colors</h3>
              <div className="flex items-center gap-3"><Label className="w-24">Text</Label><input type="color" value={textColor || "#000000"} onChange={(e) => setTextColor(e.target.value)} /><button type="button" className="text-xs text-muted-foreground" onClick={() => setTextColor("")}>reset</button></div>
              <div className="flex items-center gap-3"><Label className="w-24">Background</Label><input type="color" value={bgColor || "#ffffff"} onChange={(e) => setBgColor(e.target.value)} /><button type="button" className="text-xs text-muted-foreground" onClick={() => setBgColor("")}>reset</button></div>
            </div>

            <div className="p-4 rounded-lg border border-border space-y-3">
              <h3 className="font-semibold">SEO</h3>
              <div><Label>SEO Title</Label><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={60} /></div>
              <div><Label>SEO Description</Label><Textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} maxLength={160} rows={2} /></div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default StoryEditor;