import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StoryCard from "@/components/StoryCard";
import type { Story } from "@/lib/stories";
import { ArrowRight } from "lucide-react";

const LatestStoriesSection = () => {
  const [stories, setStories] = useState<Story[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("stories")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(2);
      setStories((data as any) || []);
    })();
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Latest Stories</h2>
          <p className="text-muted-foreground">Fresh travel & cultural reads.</p>
        </div>
        <Link to="/stories" className="text-india-orange font-medium flex items-center gap-1 hover:gap-2 transition-all">
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)}
      </div>
    </section>
  );
};

export default LatestStoriesSection;