import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import type { Story } from "@/lib/stories";
import { Calendar, MapPin, User, ArrowLeft, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareModal from "@/components/ShareModal";

const StoryDetail = () => {
  const { slug } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("stories").select("*").eq("slug", slug).maybeSingle();
      setStory(data as any);
      setLoading(false);
      if (data) {
        document.title = (data as any).seo_title || (data as any).title;
        await supabase.from("stories").update({ views: ((data as any).views || 0) + 1 }).eq("id", (data as any).id);
      }
    })();
  }, [slug]);

  if (loading) return <Layout><div className="text-center py-20 text-muted-foreground">Loading...</div></Layout>;
  if (!story) return <Layout><div className="text-center py-20"><p className="mb-4">Story not found.</p><Button onClick={() => navigate("/stories")}>Back to Stories</Button></div></Layout>;

  const date = story.published_at ? new Date(story.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <Layout>
      <article className="max-w-4xl mx-auto" style={{ background: story.bg_color || undefined, color: story.text_color || undefined }}>
        <Link to="/stories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-india-orange mb-6">
          <ArrowLeft size={14} /> All Stories
        </Link>

        {story.category && (
          <span className="inline-block px-3 py-1 bg-india-orange text-white text-xs rounded-full font-medium mb-4">{story.category}</span>
        )}
        <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4">{story.title}</h1>
        {story.summary && <p className="text-lg text-muted-foreground mb-6">{story.summary}</p>}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
          {story.author_name && <span className="flex items-center gap-1"><User size={14} />{story.author_name}</span>}
          {date && <span className="flex items-center gap-1"><Calendar size={14} />{date}</span>}
          {story.location && <span className="flex items-center gap-1"><MapPin size={14} />{story.location}</span>}
          {story.ai_generated && <span className="flex items-center gap-1 text-purple-600"><Sparkles size={14} /> AI Generated</span>}
          <Button size="sm" variant="outline" onClick={() => setShareOpen(true)} className="ml-auto"><Share2 size={14} /> Share</Button>
        </div>

        {story.featured_image && (
          <img src={story.featured_image} alt={story.title} className="w-full rounded-2xl mb-8 shadow-xl" />
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-india-orange"
          dangerouslySetInnerHTML={{ __html: story.content || "" }}
        />

        {story.gallery_images && story.gallery_images.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-display font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {story.gallery_images.map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-lg bg-muted">
                  <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </a>
              ))}
            </div>
          </section>
        )}

        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12">
            {story.tags.map((t) => (
              <span key={t} className="px-3 py-1 text-xs rounded-full bg-muted">#{t}</span>
            ))}
          </div>
        )}

        {story.links && story.links.length > 0 && (
          <section className="mt-10 p-5 rounded-xl bg-muted/40 border border-border">
            <h3 className="font-display font-semibold mb-3">References & Links</h3>
            <ul className="space-y-2">
              {story.links.map((l, i) => (
                <li key={i}><a href={l.url} target="_blank" rel="noreferrer" className="text-india-orange hover:underline">{l.label || l.url}</a></li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={{
          title: story.title,
          description: story.summary || "",
          url: typeof window !== "undefined" ? window.location.href : "",
          image: story.featured_image || undefined,
        }}
      />
    </Layout>
  );
};

export default StoryDetail;