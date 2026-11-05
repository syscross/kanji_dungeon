/*
 * GM engines. Order here is the order in the settings dropdown.
 * Model lists are presets only — any model ID can be typed in.
 */
/*
 * GM engines. Order here is the order in the settings dropdown.
 * Model lists are presets only — any model ID can be typed in freely.
 */
const PROVIDERS = {
  gemini: {
    name: "Google · Gemini — recommended, free tier",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyLabel: "aistudio.google.com ↗",
    models: [
      { id: "gemini-4-argon", label: "gemini-4-argon · flagship reasoning (2026)" },
      { id: "gemini-3.8-flash", label: "gemini-3.8-flash · standard fast & smart" },
      { id: "gemini-3.6-flash", label: "gemini-3.6-flash · stable multimodal" },
      { id: "gemini-3.5-flash-lite", label: "gemini-3.5-flash-lite · ultra fast & light" },
      { id: "gemini-flash-lite-latest", label: "gemini-flash-lite-latest · auto latest" },
      { id: "gemini-2.5-flash", label: "gemini-2.5-flash · legacy fallback" }
    ]
  },
  anthropic: {
    name: "Anthropic · Claude",
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyLabel: "console.anthropic.com ↗",
    models: [
      { id: "claude-haiku-5-5", label: "claude-haiku-5-5 · ultra fast & adaptive (2026)" },
      { id: "claude-sonnet-5-5", label: "claude-sonnet-5-5 · flagship balanced" },
      { id: "claude-opus-5-5", label: "claude-opus-5-5 · supreme reasoning" },
      { id: "claude-opus-fable", label: "claude-opus-fable · deep narrative & TRPG persona" },
      { id: "claude-3-7-sonnet", label: "claude-3-7-sonnet · hybrid thinking" }
    ]
  },
  openai: {
    name: "OpenAI",
    keyUrl: "https://platform.openai.com/api-keys",
    keyLabel: "platform.openai.com ↗",
    endpoint: "https://api.openai.com/v1/chat/completions",
    models: [
      { id: "gpt-5-mini", label: "gpt-5-mini · fast reasoning" },
      { id: "gpt-5", label: "gpt-5 · flagship" },
      { id: "o4-mini", label: "o4-mini · deep reasoning" },
      { id: "gpt-4.1", label: "gpt-4.1 · balanced" },
      { id: "gpt-4o", label: "gpt-4o · multimodal" }
    ]
  },
  deepseek: {
    name: "DeepSeek",
    keyUrl: "https://platform.deepseek.com/api_keys",
    keyLabel: "platform.deepseek.com ↗",
    endpoint: "https://api.deepseek.com/chat/completions",
    models: [
      { id: "deepseek-chat", label: "deepseek-chat · fast & capable" },
      { id: "deepseek-reasoner", label: "deepseek-reasoner · chain-of-thought" }
    ]
  },
  groq: {
    name: "Groq",
    keyUrl: "https://console.groq.com/keys",
    keyLabel: "console.groq.com ↗",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    models: [
      { id: "llama-3.3-70b-versatile", label: "llama-3.3-70b-versatile · lightning" },
      { id: "mixtral-8x7b-32768", label: "mixtral-8x7b-32768" }
    ]
  },
  xai: {
    name: "xAI · Grok",
    keyUrl: "https://console.x.ai/",
    keyLabel: "console.x.ai ↗",
    endpoint: "https://api.x.ai/v1/chat/completions",
    models: [
      { id: "grok-3", label: "grok-3 · flagship" },
      { id: "grok-3-mini", label: "grok-3-mini · fast" }
    ]
  },
  openrouter: {
    name: "OpenRouter",
    keyUrl: "https://openrouter.ai/keys",
    keyLabel: "openrouter.ai ↗",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      { id: "google/gemini-4-argon", label: "google/gemini-4-argon" },
      { id: "google/gemini-3.8-flash", label: "google/gemini-3.8-flash" },
      { id: "anthropic/claude-haiku-5.5", label: "anthropic/claude-haiku-5.5" },
      { id: "anthropic/claude-opus-fable", label: "anthropic/claude-opus-fable" },
      { id: "deepseek/deepseek-chat", label: "deepseek/deepseek-chat" },
      { id: "auto", label: "auto · OpenRouter best fit" }
    ]
  },
  custom: {
    name: "Local · OpenAI-compatible (Ollama, LM Studio…)",
    keyUrl: "https://ollama.com/",
    keyLabel: "ollama.com ↗",
    endpoint: "http://localhost:11434/v1/chat/completions",
    models: [
      { id: "qwen2.5:14b", label: "qwen2.5:14b" },
      { id: "llama3.3", label: "llama3.3" },
      { id: "mistral", label: "mistral" }
    ]
  },
  free_keyless: {
    name: "Trial · no key — shared server, ~1 reply / 45 s",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyLabel: "aistudio.google.com ↗",
    models: [{ id: "openai", label: "shared model · offline judge when busy" }]
  },
  offline: {
    name: "No AI · offline judge — counts kanji only",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyLabel: "aistudio.google.com ↗",
    models: [{ id: "offline", label: "offline judge" }]
  }
};

/* Providers that need no key. */
const KEYLESS_PROVIDERS = ["free_keyless", "offline", "custom"];

/*
 * Single entry point for every AI call.
 *  prompt      — full prompt text (sent as one user message)
 *  expectJson  — parse the reply as JSON (judge turns) or return raw text (hints)
 *  opts.temperature — sampling temperature where the provider accepts one
 *  opts.summon      — passed to the offline judge (the god plays the whole hand)
 */
async function callLLM(prompt, expectJson = true, opts = {}) {
  const { provider, apiKey, model, customEndpoint } = config;
  const temperature = opts.temperature ?? (expectJson ? 0.6 : 0.7);
  const systemPrompt = prompt;

  if (provider === "offline") return localKanjiEngine(expectJson, opts);

  // Trial: shared public endpoint, falling back to the offline judge when it is busy.
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
      // busy / rate-limited — fall through to the offline judge
    }
    return localKanjiEngine(expectJson, opts);
  }

  if (!apiKey && provider !== "custom") {
    throw new Error("No API key for this provider. Open Settings, or switch to Trial / No AI.");
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
      // Current Claude models reject sampling params; thinking is adaptive, so keep effort low
      // for snappy turns and leave max_tokens headroom for it.
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        output_config: { effort: "low" },
        messages: [{ role: "user", content: systemPrompt }]
      })
    });
    if (!r.ok) throw new Error(`Anthropic HTTP ${r.status}: ${await r.text()}`);
    const data = await r.json();
    if (data.stop_reason === "refusal") throw new Error("Claude declined this turn (refusal).");
    const textBlock = (data.content || []).find(b => b.type === "text");
    const txt = (textBlock ? textBlock.text : "").trim();
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
