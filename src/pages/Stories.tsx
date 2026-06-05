import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Story, STORY_CATEGORIES } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PenSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 9;

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [page, setPage] = useState(1);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (!error) setStories((data as any) || []);
      setLoading(false);
    })();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 30);
  }, [stories]);

  const allLocations = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((s) => s.location && set.add(s.location));
    return Array.from(set);
  }, [stories]);

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      if (category && s.category !== category) return false;
      if (tag && !(s.tags || []).includes(tag)) return false;
      if (location && s.location !== location) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.title.toLowerCase().includes(q) && !(s.summary || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [stories, category, tag, location, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Stories</h1>
          <p className="text-muted-foreground">Travel & cultural stories from across India.</p>
        </div>
        <div className="flex gap-2">
          {isAuthenticated && (
            <Button onClick={() => navigate("/stories/new")} className="bg-india-orange hover:bg-india-orange/90">
              <PenSquare size={16} /> Write a Story
            </Button>
          )}
          {isAdmin && (
            <Button variant="outline" onClick={() => navigate("/admin/stories")}>Manage Stories</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search stories..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All categories</option>
          {STORY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All locations</option>
          {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => { setTag(""); setPage(1); }} className={`px-3 py-1 text-xs rounded-full border ${tag === "" ? "bg-india-orange text-white border-india-orange" : "border-border hover:bg-muted"}`}>All tags</button>
          {allTags.map((t) => (
            <button key={t} onClick={() => { setTag(t === tag ? "" : t); setPage(1); }} className={`px-3 py-1 text-xs rounded-full border ${tag === t ? "bg-india-orange text-white border-india-orange" : "border-border hover:bg-muted"}`}>#{t}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading stories...</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No stories found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Stories;