const [unlocked, setUnlocked] = React.useState(false);
const [passwordInput, setPasswordInput] = React.useState('');
const CORRECT_PASSWORD = 'ugcclub2024'; // change this to whatever you want

if (!unlocked) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <h2>UGC Creators Club — Members Only</h2>
      <p>Enter your member password to access the toolkit.</p>
      <input
        type="password"
        placeholder="Enter password"
        value={passwordInput}
        onChange={e => setPasswordInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && passwordInput === CORRECT_PASSWORD) setUnlocked(true); }}
        style={{ padding: '10px', fontSize: '16px', marginBottom: '10px', width: '250px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <button
        onClick={() => { if (passwordInput === CORRECT_PASSWORD) setUnlocked(true); else alert('Wrong password'); }}
        style={{ padding: '10px 24px', fontSize: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Enter
      </button>
    </div>
  );
}
import { useState } from "react";

const TOOLS = [
  { id: "pricing", label: "💰 Rate Calculator", short: "Rate" },
  { id: "pitch", label: "📩 Pitch Generator", short: "Pitch" },
  { id: "content", label: "🎬 Content Ideas", short: "Ideas" },
];

const SYSTEM_PROMPTS = {
  pricing: `You are a UGC pricing expert. Given campaign details, give a clean, simple rate breakdown.

Format your response EXACTLY like this — no asterisks, no markdown, no symbols:

RATE RANGE
$X – $Y  (one sentence explaining why)

FLOOR RATE
$X — never go below this

WHAT'S DRIVING THE PRICE
List each factor that affects the number with its $ impact, one per line. Keep each to one short line. Example:
3 videos × $150 base = $450
Paid ads 3 months = +$150–200 per video
No exclusivity = +$0
2 revision rounds = included
Standard timeline = no rush fee
Mid-size brand = standard ceiling

IF THEY LOWBALL
One ready-to-send counter-offer line, in quotes.

Keep everything short. No explanations beyond what's needed. Use $ amounts throughout.`,

  pitch: `You are a UGC pitch expert. UGC is about content quality and brand fit — NOT follower count.

Write a pitch email that:
- Opens with something genuinely specific about THIS brand (their campaign, a gap in their content, something you actually noticed) — not a generic compliment
- Introduces the creator through relevant experience or a similar brand they've worked with
- Proposes a specific collaboration idea tied to what the brand is doing
- Shows you understand their customer
- Ends with the CTA the creator specifies — keep it soft and natural, not pushy
- Stays under 150 words

RULES:
No bullet points. No dashes. No asterisks. No markdown. Plain flowing sentences only.
The subject line should sound like how an existing creator or a real client would casually email the brand — not a pitch, not a campaign header. Short, specific, lowercase is fine. Right vibe: "your new spf launch", "quick idea for the reels", "content for the summer campaign". Wrong: "Exciting Collaboration Opportunity", "Partnership Inquiry", "Working Together?".
The email should get to the point fast. No long warm-up.

After the email, on a new line write:
Subject: [subject line]
Why this works: [one or two plain sentences on the personalization angle]`,

  content: `You are a UGC content strategist. Great UGC makes the viewer feel something before the product ever shows up.

Generate 5 video concepts. Each one should be immediately scriptable — a creator should be able to read it and start filming without needing to figure anything out.

Use this exact format for each. No asterisks, no dashes, no markdown:

Concept 1 — [one line title that captures the idea]
Format: [e.g. talking head, voiceover + b-roll, POV, before/after]
Hook: [the exact first sentence or action — what they say or do in the first 2-3 seconds]
Story: [3-4 sentences describing what happens: the setup, the tension or problem, the product moment, and how it ends]
Feeling: [one sentence — what emotion the viewer is left with and why it makes them want the product]

Keep it tight. No fluff. The hook should sound like something a real person says out loud, not an ad.`,
};

const FIELDS = {
  pricing: [
    { key: "deliverables", label: "Deliverables", placeholder: "e.g. 3x 30-sec videos + 2x static photos", type: "text" },
    { key: "usage", label: "Usage Rights", placeholder: "", type: "select", options: [
      { value: "organic_only", label: "Organic only — brand posts it on their own channels" },
      { value: "paid_ads_3mo", label: "Paid ads — up to 3 months" },
      { value: "paid_ads_6mo", label: "Paid ads — up to 6 months" },
      { value: "paid_ads_1yr", label: "Paid ads — up to 1 year" },
      { value: "whitelisting", label: "Whitelisting / dark posting (run from MY handle)" },
      { value: "perpetual", label: "Perpetual / unlimited usage" },
    ]},
    { key: "exclusivity", label: "Exclusivity Requested?", placeholder: "", type: "select", options: [
      { value: "none", label: "No exclusivity" },
      { value: "category_30", label: "Category exclusivity — 30 days" },
      { value: "category_90", label: "Category exclusivity — 90 days" },
      { value: "full_90", label: "Full exclusivity — 90 days" },
    ]},
    { key: "revisions", label: "Revision Rounds", placeholder: "", type: "select", options: [
      { value: "1", label: "1 round" },
      { value: "2", label: "2 rounds (standard)" },
      { value: "3plus", label: "3+ rounds (unusual — flag this)" },
      { value: "unlimited", label: "Unlimited (red flag — add significant fee)" },
    ]},
    { key: "timeline", label: "Turnaround Time", placeholder: "", type: "select", options: [
      { value: "standard", label: "Standard — 7–14 days" },
      { value: "rush_5", label: "Rush — 5 days" },
      { value: "rush_3", label: "Very rush — 3 days or less" },
    ]},
    { key: "brand_size", label: "Brand Size", placeholder: "", type: "select", options: [
      { value: "startup", label: "Startup / small brand (under 10k followers)" },
      { value: "mid", label: "Mid-size brand (10k–100k followers)" },
      { value: "large", label: "Large brand (100k+ or recognisable name)" },
      { value: "enterprise", label: "Enterprise / global brand" },
    ]},
    { key: "niche", label: "Your Niche + Experience Level", placeholder: "e.g. skincare, 5 paid deals done", type: "text" },
  ],
  pitch: [
    { key: "brand", label: "Brand Name", placeholder: "e.g. Glossier, Gymshark", type: "text" },
    { key: "product", label: "Their Product / Current Campaign", placeholder: "e.g. new SPF moisturizer they just launched", type: "text" },
    { key: "brand_observation", label: "Something Specific You Noticed About Them", placeholder: "e.g. their IG is all polished but their TikTok is dead, or they're leaning into 'skin barrier' messaging", type: "text" },
    { key: "niche", label: "Your Niche & Style", placeholder: "e.g. minimalist skincare, everyday wellness", type: "text" },
    { key: "experience", label: "Relevant Experience or Similar Brand", placeholder: "e.g. made 6 videos for a Japanese skincare brand, similar tone and audience", type: "text" },
    { key: "cta", label: "What's Your CTA?", placeholder: "e.g. send over some content ideas, hop on a quick call, share a few concepts", type: "text" },
  ],
  content: [
    { key: "brand", label: "Brand / Product", placeholder: "e.g. collagen supplement for women 30+", type: "text" },
    { key: "content_type", label: "Content Type", placeholder: "", type: "select", options: [
      { value: "testimonial", label: "Testimonial — personal experience / results story" },
      { value: "product_demo", label: "Product demo — show it in action" },
      { value: "before_after", label: "Before & after — transformation story" },
      { value: "problem_solution", label: "Problem → solution — you had this issue, this fixed it" },
      { value: "day_in_the_life", label: "Day in the life — product woven into real routine" },
      { value: "pov", label: "POV — put the viewer in a relatable situation" },
      { value: "myth_bust", label: "Myth buster — common belief vs what actually works" },
      { value: "comparison", label: "Comparison — this vs that (old way vs new way)" },
    ]},
    { key: "emotional_hook", label: "Emotional Angle / Pain Point", placeholder: "e.g. feeling invisible after 30, exhausted and not looking after themselves, wanting to feel confident again", type: "text" },
    { key: "audience", label: "Target Audience", placeholder: "e.g. women 28-40, burned out, health-conscious", type: "text" },
    { key: "platform", label: "Platform", placeholder: "e.g. TikTok, Instagram Reels", type: "text" },
  ],
};

const USAGE_LABELS = {
  organic_only: "Organic only (brand posts on their channels)",
  paid_ads_3mo: "Paid ads — up to 3 months",
  paid_ads_6mo: "Paid ads — up to 6 months",
  paid_ads_1yr: "Paid ads — up to 1 year",
  whitelisting: "Whitelisting / dark posting from my handle",
  perpetual: "Perpetual / unlimited usage",
};
const EXCLUSIVITY_LABELS = {
  none: "No exclusivity",
  category_30: "Category exclusivity — 30 days",
  category_90: "Category exclusivity — 90 days",
  full_90: "Full exclusivity — 90 days",
};
const REVISION_LABELS = {
  "1": "1 round",
  "2": "2 rounds (standard)",
  "3plus": "3+ rounds",
  unlimited: "Unlimited revisions (red flag)",
};
const TIMELINE_LABELS = {
  standard: "Standard — 7–14 days",
  rush_5: "Rush — 5 days",
  rush_3: "Very rush — 3 days or less",
};
const BRAND_LABELS = {
  startup: "Startup / small brand (under 10k followers)",
  mid: "Mid-size brand (10k–100k followers)",
  large: "Large brand (100k+ or recognisable name)",
  enterprise: "Enterprise / global brand",
};

function buildPrompt(tool, values) {
  if (tool === "pricing") {
    return `Please give me a pricing recommendation for this UGC campaign.
Deliverables: ${values.deliverables}
Usage rights: ${USAGE_LABELS[values.usage] || values.usage}
Exclusivity: ${EXCLUSIVITY_LABELS[values.exclusivity] || values.exclusivity}
Revision rounds: ${REVISION_LABELS[values.revisions] || values.revisions}
Turnaround: ${TIMELINE_LABELS[values.timeline] || values.timeline}
Brand size: ${BRAND_LABELS[values.brand_size] || values.brand_size}
My niche + experience: ${values.niche}`;
  }
  if (tool === "pitch") {
    return `Write a personalized UGC pitch email.
Brand: ${values.brand}
Their product / current campaign: ${values.product}
Something specific I noticed about them: ${values.brand_observation}
My niche & style: ${values.niche}
My relevant experience or similar brand I've worked with: ${values.experience}
CTA I want to end with: ${values.cta}`;
  }
  if (tool === "content") {
    return `Please generate 5 UGC video concepts.
Brand / product: ${values.brand}
Content type: ${values.content_type}
Emotional angle / pain point: ${values.emotional_hook}
Target audience: ${values.audience}
Platform: ${values.platform}`;
  }
}

function ToolPanel({ toolId }) {
  const fields = FIELDS[toolId];
  const [values, setValues] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allFilled = fields.every((f) => values[f.key] && values[f.key].trim());

  async function handleGenerate() {
    setLoading(true);
    setResult("");
    setError("");
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: SYSTEM_PROMPTS[toolId],
          messages: [{ role: "user", content: buildPrompt(toolId, values) }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "No response received.";
      setResult(text);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
      {/* Inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "28px 28px 20px" }}>
        {fields.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5e17eb" }}>
              {f.label}
            </label>
            {f.type === "select" ? (
              <select
                value={values[f.key] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                style={{
                  background: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: values[f.key] ? "#111111" : "#aaaaaa",
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235e17eb' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  paddingRight: 32,
                  width: "100%",
                }}
              >
                <option value="" disabled>Select your current rate tier</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                value={values[f.key] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: "#111111",
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#5e17eb")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
            )}
          </div>
        ))}

        <button
          onClick={handleGenerate}
          disabled={!allFilled || loading}
          style={{
            marginTop: 6,
            padding: "13px 20px",
            background: allFilled && !loading
              ? "linear-gradient(135deg, #5e17eb 0%, #a07af5 100%)"
              : "#e8e8e8",
            border: "none",
            borderRadius: 10,
            color: allFilled && !loading ? "#fff" : "#aaaaaa",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: allFilled && !loading ? "pointer" : "not-allowed",
            letterSpacing: "0.03em",
            transition: "all 0.2s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{
                width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff", borderRadius: "50%",
                display: "inline-block", animation: "spin 0.8s linear infinite"
              }} />
              Generating...
            </span>
          ) : toolId === "pricing" ? "Calculate My Rate →"
            : toolId === "pitch" ? "Write My Pitch →"
            : "Generate Ideas →"}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#eeeeee", margin: "0 28px" }} />

      {/* Output */}
      <div style={{ flex: 1, padding: "20px 28px 28px", overflowY: "auto", minHeight: 200 }}>
        {!result && !error && !loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#cccccc", fontSize: 13, textAlign: "center", fontStyle: "italic" }}>
            Fill in the fields above and hit generate
          </div>
        )}
        {error && (
          <div style={{ color: "#f87171", fontSize: 13, padding: 12, background: "rgba(248,113,113,0.08)", borderRadius: 8 }}>
            {error}
          </div>
        )}
        {result && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5e17eb" }}>
                Result
              </span>
              <button
                onClick={handleCopy}
                style={{
                  background: "rgba(94,23,235,0.08)", border: "1px solid rgba(94,23,235,0.2)",
                  borderRadius: 6, padding: "4px 10px", color: "#5e17eb", fontSize: 11,
                  fontFamily: "inherit", cursor: "pointer", fontWeight: 600
                }}
              >
                Copy
              </button>
            </div>
            <div style={{
              fontSize: 13.5, lineHeight: 1.75, color: "#111111",
              whiteSpace: "pre-wrap", fontFamily: "inherit"
            }}>
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("pricing");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f4f4",
      fontFamily: "'Poppins', system-ui, sans-serif",
      color: "#111111",
      padding: "40px 20px",
      backgroundImage: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(94,23,235,0.2); border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp 0.5s ease both" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5e17eb", marginBottom: 12 }}>
            UGC Creators Club
          </div>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800, margin: 0, lineHeight: 1.1,
            background: "linear-gradient(135deg, #111111 0%, #5e17eb 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Your AI Toolkit
          </h1>
          <p style={{ color: "#888888", fontSize: 14, marginTop: 10, marginBottom: 0 }}>
            3 tools to help you price right, pitch better, and create content that converts
          </p>
        </div>

        {/* Tab Bar */}
        <div style={{
          display: "flex", gap: 4, background: "#ffffff",
          borderRadius: 12, padding: 4, marginBottom: 24,
          border: "1px solid #e0e0e0",
          animation: "fadeUp 0.5s ease 0.1s both"
        }}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                flex: 1, padding: "11px 8px",
                background: active === t.id
                  ? "linear-gradient(135deg, rgba(94,23,235,0.3) 0%, rgba(160,122,245,0.2) 100%)"
                  : "transparent",
                border: active === t.id ? "1px solid #5e17eb" : "1px solid transparent",
                borderRadius: 9,
                color: active === t.id ? "#ffffff" : "#888888",
                fontSize: 13,
                fontWeight: active === t.id ? 700 : 500,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tool Card */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: 16,
          overflow: "hidden",
          animation: "fadeUp 0.5s ease 0.2s both",
          backdropFilter: "blur(10px)",
        }}>
          {TOOLS.map((t) => (
            <div key={t.id} style={{ display: active === t.id ? "block" : "none" }}>
              <ToolPanel toolId={t.id} />
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#bbbbbb", fontSize: 12, marginTop: 24 }}>
          Powered by Claude AI · UGC Creators Club members only
        </p>
      </div>
    </div>
  );
}
