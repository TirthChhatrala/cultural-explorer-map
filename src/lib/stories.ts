import { supabase } from "@/integrations/supabase/client";

export type Story = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  featured_image: string | null;
  gallery_images: string[];
  tags: string[];
  category: string | null;
  location: string | null;
  links: { label: string; url: string }[];
  text_color: string | null;
  bg_color: string | null;
  author_name: string | null;
  author_email: string | null;
  is_admin_generated: boolean;
  ai_generated: boolean;
  status: "draft" | "pending" | "scheduled" | "published";
  featured: boolean;
  scheduled_at: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  structured: any;
  views: number;
  created_at: string;
  updated_at: string;
};

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || "story"
  ) + "-" + Math.random().toString(36).slice(2, 7);
}

const YEAR = 60 * 60 * 24 * 365;

export async function uploadStoryImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("stories").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = await supabase.storage.from("stories").createSignedUrl(path, YEAR);
  if (!data?.signedUrl) throw new Error("Failed to sign URL");
  return data.signedUrl;
}

export async function uploadDataUrl(dataUrl: string, ext = "png"): Promise<string> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const path = `ai/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("stories").upload(path, blob, {
    cacheControl: "31536000",
    upsert: false,
    contentType: blob.type || "image/png",
  });
  if (error) throw error;
  const { data } = await supabase.storage.from("stories").createSignedUrl(path, YEAR);
  if (!data?.signedUrl) throw new Error("Failed to sign URL");
  return data.signedUrl;
}

export const STORY_CATEGORIES = [
  "Travel",
  "Culture",
  "Food",
  "History",
  "Festivals",
  "Adventure",
  "Spirituality",
  "Nature",
  "People",
];