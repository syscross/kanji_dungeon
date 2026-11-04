const PROVIDERS = {
  gemini: {
    name: "★ Google Gemini API (Recommended — free tier)",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyLabel: "Get Free Gemini API Key ↗",
    models: [
      { id: "gemini-flash-lite-latest", label: "gemini-flash-lite-latest (Fast & Free Default)" },
      { id: "gemini-2.5-flash-lite", label: "gemini-2.5-flash-lite" },
      { id: "gemini-2.5-flash", label: "gemini-2.5-flash (Balanced)" },
      { id: "gemini-2.5-pro", label: "gemini-2.5-pro (High Reasoning)" }
    ]
  },
  anthropic: {
    name: "Anthropic Claude API (Direct CORS)",
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyLabel: "Get Anthropic API Key ↗",
    models: [
      { id: "claude-haiku-4-5", label: "claude-haiku-4-5 (Ultra Fast & Cheap)" },
      { id: "claude-sonnet-4-5", label: "claude-sonnet-4-5 (Flagship TRPG GM)" }
    ]
  },
  openai: {
    name: "OpenAI API (ChatGPT Direct)",
    keyUrl: "https://platform.openai.com/api-keys",
    keyLabel: "Get OpenAI API Key ↗",
    endpoint: "https://api.openai.com/v1/chat/completions",
    models: [
      { id: "gpt-4o-mini", label: "gpt-4o-mini (Fast & Affordable)" },
      { id: "gpt-4.1-mini", label: "gpt-4.1-mini" },
      { id: "gpt-4.1", label: "gpt-4.1" }
    ]
  },
  deepseek: {
    name: "DeepSeek API (Elite Kanji/CJK & Ultra-Low Cost)",
    keyUrl: "https://platform.deepseek.com/api_keys",
    keyLabel: "Get DeepSeek API Key ↗",
    endpoint: "https://api.deepseek.com/chat/completions",
    models: [
      { id: "deepseek-chat", label: "deepseek-chat (DeepSeek V3 — Best Value for Kanji)" },
      { id: "deepseek-reasoner", label: "deepseek-reasoner (DeepSeek R1)" }
    ]
  },
  groq: {
    name: "Groq Cloud LPU (0.2s Instant Speed)",
    keyUrl: "https://console.groq.com/keys",
    keyLabel: "Get Free Groq API Key ↗",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    models: [
      { id: "llama-3.3-70b-versatile", label: "llama-3.3-70b-versatile (Instant LPU)" },
      { id: "qwen-qwq-32b", label: "qwen-qwq-32b (Strong CJK & Kanji)" }
    ]
  },
  xai: {
    name: "xAI Grok API",
    keyUrl: "https://console.x.ai/",
    keyLabel: "Get xAI Grok Key ↗",
    endpoint: "https://api.x.ai/v1/chat/completions",
    models: [
      { id: "grok-3-mini", label: "grok-3-mini (Fast)" },
      { id: "grok-3", label: "grok-3" }
    ]
  },
  openrouter: {
    name: "OpenRouter API (200+ Models)",
    keyUrl: "https://openrouter.ai/keys",
    keyLabel: "Get OpenRouter Key ↗",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      { id: "google/gemini-2.5-flash-lite", label: "google/gemini-2.5-flash-lite" },
      { id: "anthropic/claude-haiku-4.5", label: "anthropic/claude-haiku-4.5" },
      { id: "deepseek/deepseek-chat-v3-0324:free", label: "deepseek/deepseek-chat-v3 (Free)" }
    ]
  },
  custom: {
    name: "Custom OpenAI-Compatible (Ollama / LM Studio / vLLM)",
    keyUrl: "https://ollama.com/",
    keyLabel: "Local / Custom Endpoint Info ↗",
    endpoint: "http://localhost:11434/v1/chat/completions",
    models: [
      { id: "qwen2.5:14b", label: "qwen2.5:14b (Ollama Local)" },
      { id: "llama3.2", label: "llama3.2 (Ollama Local)" }
    ]
  },
  free_keyless: {
    name: "🔌 Trial — no key (shared free server, ~1 reply / 45 s)",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyLabel: "Optional: Get Personal Gemini Key ↗",
    models: [
      { id: "openai", label: "Shared public model (offline GM when busy)" }
    ]
  }
};

/*
 * Single entry point for every AI call.
 *  prompt      — full prompt text (sent as one user message)
 *  expectJson  — parse the reply as JSON (judge turns) or return raw text (hints)
 *  opts.temperature — sampling temperature (judge turns use a lower value for consistency)
 */
async function callLLM(prompt, expectJson = true, opts = {}) {
  const { provider, apiKey, model, customEndpoint } = config;
  const temperature = opts.temperature ?? (expectJson ? 0.6 : 0.7);
  const systemPrompt = prompt;

  // 1. Free Keyless Mode (Tries Pollinations Free OpenAI Endpoint -> Seamless Fallback to Built-in Engine)
  if (provider === "free_keyless") {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      const r = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: "openai",
          messages: [{ role: "user", content: systemPrompt }],
          // The shared model reasons before answering; without headroom it truncates the JSON.
          max_tokens: 2500,
          reasoning_effort: "low"
        })
      });
      clearTimeout(timer);
      if (r.ok) {
        const data = await r.json();
        const txt = data.choices[0].message.content.trim();
        return expectJson ? parseJsonSafe(txt) : txt;
      }
    } catch (_) {
      // Fallback to instant local Kanji engine if free public endpoint is busy
    }
    return localKanjiEngine(expectJson);
  }

  if (!apiKey && provider !== "custom") {
    throw new Error("API Key is missing. Open Settings or switch to '⚡ Free Keyless' mode!");
  }

  if (provider === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: expectJson ? { responseMimeType: "application/json", temperature } : { temperature }
    };
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`Gemini HTTP ${r.status}: ${await r.text()}`);
    const data = await r.json();
    const txt = data.candidates[0].content.parts[0].text;
    return expectJson ? parseJsonSafe(txt) : txt;
  }

  if (provider === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        temperature,
        messages: [{ role: "user", content: systemPrompt }]
      })
    });
    if (!r.ok) throw new Error(`Anthropic HTTP ${r.status}: ${await r.text()}`);
    const data = await r.json();
    const txt = data.content[0].text.trim();
    return expectJson ? parseJsonSafe(txt) : txt;
  }

  const pInfo = PROVIDERS[provider] || PROVIDERS.openrouter;
  const endpoint = provider === "custom" ? (customEndpoint || pInfo.endpoint) : pInfo.endpoint;
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const r = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: systemPrompt }],
      temperature
    })
  });
  if (!r.ok) throw new Error(`${provider.toUpperCase()} HTTP ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const txt = data.choices[0].message.content.trim();
  return expectJson ? parseJsonSafe(txt) : txt;
}

/* Lenient JSON extraction: strips code fences, grabs the outer object, tolerates trailing commas. */
function parseJsonSafe(txt) {
  const cleaned = String(txt).replace(/```json|```/gi, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  const body = match ? match[0] : cleaned;
  try {
    return JSON.parse(body);
  } catch (_) {
    return JSON.parse(body.replace(/,\s*([}\]])/g, "$1").replace(/[“”]/g, '"'));
  }
}
