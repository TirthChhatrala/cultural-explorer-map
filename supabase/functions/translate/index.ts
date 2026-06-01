// Translate UI strings to a target language using Lovable AI Gateway.
// Input: { items: [{ key, text }], targetLanguage: "Hindi", targetCode: "hi" }
// Output: { translations: { [key]: "translated text" } }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Item { key: string; text: string }
interface Body {
  items: Item[];
  targetLanguage: string;
  targetCode: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as Body;
    if (!body?.items?.length || !body.targetLanguage) {
      return new Response(JSON.stringify({ error: 'items[] and targetLanguage are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (body.targetCode === 'en') {
      const translations: Record<string, string> = {};
      for (const it of body.items) translations[it.key] = it.text;
      return new Response(JSON.stringify({ translations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = body.items.map(i => ({ key: i.key, text: i.text }));

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content:
              `You are a professional UI translator for an Indian cultural travel app. ` +
              `Translate the "text" field of each item into ${body.targetLanguage}. ` +
              `Preserve emojis, numbers, punctuation, and English proper nouns (state names, festival names, etc.) when they are commonly kept in the target language. ` +
              `Keep translations short and natural for UI buttons and headings. ` +
              `Return ONLY a JSON object: {"translations":{"<key>":"<translated text>", ...}} with no commentary.`,
          },
          { role: 'user', content: JSON.stringify({ targetLanguage: body.targetLanguage, items: payload }) },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited, please try again shortly.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits required.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error('AI gateway error', aiRes.status, errText);
      return new Response(JSON.stringify({ error: 'AI translation failed' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ai = await aiRes.json();
    const content = ai?.choices?.[0]?.message?.content ?? '{}';
    let parsed: { translations?: Record<string, string> } = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }
    const translations = parsed.translations || {};

    // Fallback: any missing keys -> original English text
    for (const it of body.items) {
      if (!translations[it.key]) translations[it.key] = it.text;
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('translate error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});