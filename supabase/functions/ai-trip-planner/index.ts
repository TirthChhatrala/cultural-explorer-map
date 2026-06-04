import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert India travel planner.
Generate a realistic, well-paced, day-by-day itinerary for the user's trip in India.
Recommend optimized routes, attractions, hotels, food, cultural experiences, budget tips, and important travel suggestions.
Respect the user's budget, duration, traveler count, preferences, and transport mode.
Return ONLY valid JSON matching the schema. No markdown, no commentary.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destinations, duration, travelers, budget, currency, preferences, transport, pace, language } = await req.json();

    if (!destinations || !duration) {
      return new Response(JSON.stringify({ error: "destinations and duration are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Plan a trip with the following details:
Destinations: ${Array.isArray(destinations) ? destinations.join(", ") : destinations}
Duration: ${duration} days
Travelers: ${travelers ?? 2}
Budget: ${budget ?? "flexible"} ${currency ?? "INR"} (total)
Preferences: ${(preferences ?? []).join(", ") || "general sightseeing"}
Transport: ${transport ?? "mixed"}
Pace: ${pace ?? "balanced"}
Output language: ${language ?? "English"}

Return JSON with this exact shape:
{
  "title": string,
  "summary": string,
  "totalEstimatedCost": number,
  "currency": string,
  "states": string[],            // Indian state names visited
  "days": [
    {
      "day": number,
      "date": string|null,
      "location": string,
      "travelFrom": string|null,
      "travelTime": string|null,
      "transport": string|null,
      "morning": string,
      "afternoon": string,
      "evening": string,
      "attractions": string[],
      "food": string[],
      "accommodation": { "name": string, "type": string, "estimatedCost": number },
      "dailyCost": number,
      "tips": string[]
    }
  ],
  "budgetBreakdown": {
    "accommodation": number,
    "transport": number,
    "food": number,
    "activities": number,
    "misc": number
  },
  "recommendations": {
    "food": string[],
    "culturalExperiences": string[],
    "mustVisit": string[],
    "nearbyAttractions": string[],
    "budgetTips": string[],
    "importantNotes": string[]
  }
}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const status = resp.status;
      const text = await resp.text();
      console.error("AI gateway error:", status, text);
      const msg =
        status === 429
          ? "Too many requests. Please wait a moment and try again."
          : status === 402
          ? "AI credits exhausted. Please add credits in workspace settings."
          : "The AI planner is unavailable right now.";
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "{}";
    let itinerary: unknown;
    try {
      itinerary = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      itinerary = match ? JSON.parse(match[0]) : { error: "Invalid AI response" };
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-trip-planner error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});