import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const TEXT_MODEL = "google/gemini-3-flash-preview";
const IMAGE_MODEL = "google/gemini-2.5-flash-image";

async function generateStructured(topic: string, location: string) {
  const system = `You are a professional travel and cultural writer. Produce a high-quality, engaging blog story about Indian travel/cultural topics. Output ONLY valid JSON.`;
  const userPrompt = `Write a complete cultural & travel story about: "${topic}"${location ? ` (Location: ${location})` : ""}.

Return a JSON object with this exact shape:
{
  "title": "compelling SEO-friendly title",
  "summary": "2-3 sentence hook summary",
  "category": "one of: Travel, Culture, Food, History, Festivals, Adventure, Spirituality, Nature, People",
  "location": "best matching location/state",
  "tags": ["6-10 relevant tags"],
  "sections": {
    "introduction": "2-3 paragraphs",
    "history": "2-3 paragraphs",
    "culture": "2-3 paragraphs",
    "traditions": "2-3 paragraphs",
    "food": "2-3 paragraphs",
    "festivals": "1-2 paragraphs",
    "attractions": "list of 5-8 attractions with brief descriptions",
    "travel_tips": "5-7 practical bullet tips",
    "interesting_facts": "5-7 fascinating facts",
    "conclusion": "1-2 paragraphs"
  },
  "seo": { "title": "<60 chars", "description": "<160 chars" },
  "image_prompts": {
    "hero": "vivid prompt for hero image",
    "thumbnail": "square thumbnail prompt",
    "gallery": ["3 distinct gallery image prompts"]
  }
}`;

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Text generation failed (${r.status}): ${t}`);
  }
  const data = await r.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content);
}

async function generateImage(prompt: string): Promise<string | null> {
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!r.ok) {
      console.error("Image gen failed", r.status, await r.text());
      return null;
    }
    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    return b64 ? `data:image/png;base64,${b64}` : null;
  } catch (e) {
    console.error("Image error", e);
    return null;
  }
}

function sectionsToHtml(s: any): string {
  const part = (title: string, body: string) =>
    `<h2>${title}</h2>${body
      .split(/\n\n+/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("")}`;
  const list = (title: string, body: string) => {
    const items = body.split(/\n+/).filter(Boolean).map((l) => `<li>${l.replace(/^[-*•\d.\s]+/, "").trim()}</li>`).join("");
    return `<h2>${title}</h2><ul>${items}</ul>`;
  };
  let html = "";
  if (s.introduction) html += part("Introduction", s.introduction);
  if (s.history) html += part("History", s.history);
  if (s.culture) html += part("Culture", s.culture);
  if (s.traditions) html += part("Traditions", s.traditions);
  if (s.food) html += part("Food & Cuisine", s.food);
  if (s.festivals) html += part("Festivals", s.festivals);
  if (s.attractions) html += typeof s.attractions === "string" ? list("Top Attractions", s.attractions) : `<h2>Top Attractions</h2><ul>${(s.attractions as string[]).map((a) => `<li>${a}</li>`).join("")}</ul>`;
  if (s.travel_tips) html += typeof s.travel_tips === "string" ? list("Travel Tips", s.travel_tips) : `<h2>Travel Tips</h2><ul>${(s.travel_tips as string[]).map((a) => `<li>${a}</li>`).join("")}</ul>`;
  if (s.interesting_facts) html += typeof s.interesting_facts === "string" ? list("Interesting Facts", s.interesting_facts) : `<h2>Interesting Facts</h2><ul>${(s.interesting_facts as string[]).map((a) => `<li>${a}</li>`).join("")}</ul>`;
  if (s.conclusion) html += part("Conclusion", s.conclusion);
  return html;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    const { topic, location = "", generateImages = true } = await req.json();
    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const structured = await generateStructured(topic, location);
    const html = sectionsToHtml(structured.sections || {});

    let hero: string | null = null;
    let thumbnail: string | null = null;
    let gallery: string[] = [];
    if (generateImages && structured.image_prompts) {
      const ip = structured.image_prompts;
      const tasks: Promise<any>[] = [];
      if (ip.hero) tasks.push(generateImage(ip.hero).then((u) => (hero = u)));
      if (ip.thumbnail) tasks.push(generateImage(ip.thumbnail).then((u) => (thumbnail = u)));
      if (Array.isArray(ip.gallery)) {
        for (const p of ip.gallery.slice(0, 3)) tasks.push(generateImage(p).then((u) => { if (u) gallery.push(u); }));
      }
      await Promise.all(tasks);
    }

    return new Response(JSON.stringify({
      title: structured.title,
      summary: structured.summary,
      category: structured.category,
      location: structured.location || location,
      tags: structured.tags || [],
      content: html,
      structured,
      seo_title: structured.seo?.title,
      seo_description: structured.seo?.description,
      hero_image: hero,
      thumbnail_image: thumbnail,
      gallery_images: gallery,
      image_prompts: structured.image_prompts,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-story-generator error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});