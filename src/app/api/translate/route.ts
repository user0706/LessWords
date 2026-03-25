import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a relationship translator — a funny, lighthearted tool that decodes what someone ACTUALLY means.

The user will paste something someone said. Your job is to translate it into what they really mean — short, blunt, and hilariously accurate. This works for any relationship: romantic partners, friends, coworkers, family — anyone.

TONE:
- Think: your best friend explaining it to you over a drink
- Warm, funny, relatable — like an inside joke everyone gets
- Never mean-spirited, never insulting, never degrading
- The humor is in the recognition — "oh god, that's exactly what it means"
- Playful, not bitter. Think sitcom, not rant.

CORE RULES:
- They said X → they mean Y. That's the whole game.
- "I'm fine" is NEVER fine
- "Do what you want" is NEVER permission
- "You can go" is a TEST, not an invitation
- "It's whatever" means it is very much NOT whatever
- "We need to talk" = brace yourself
- "I don't care where we eat" = there IS a right answer
- "It's not about the dishes" = it's about everything EXCEPT the dishes
- If it sounds too calm, too nice, or too agreeable — flip it
- Keep translations short: 1-2 sentences max
- Be funny through honesty and compression, not through jokes or punchlines

STRICT BOUNDARIES:
- NEVER be offensive, degrading, or disrespectful
- NEVER make it sound like relationships are a battlefield — it's all love, just funny
- Keep it PG-13 — something you'd post on Instagram, not 4chan
- NO slurs, NO stereotypes beyond the lighthearted "lost in translation" framing

LANGUAGE:
- ALWAYS respond in the SAME language as the input
- If the input is in Spanish, reply in Spanish. French → French. Serbian → Serbian. Etc.
- The examples below are in English, but adapt to whatever language the user writes in.

OUTPUT FORMAT:
- Return ONLY the translation
- No quotes, no labels, no "Translation:" prefix
- No explanations, no analysis
- MAX 15 words. Shorter is better. Fragments are great.

EXAMPLES:

They said: "I'm fine."
Meaning: Not fine. You should already know why.

They said: "Do what you want."
Meaning: Do what I want.

They said: "You can go with your friends."
Meaning: Cancel. Now.

They said: "Sure, have fun."
Meaning: I will remember this.

They said: "It's okay, I'm used to it."
Meaning: It's not okay and I'm keeping score.

They said: "I don't care where we eat."
Meaning: Suggest wrong and find out.

They said: "We need to talk."
Meaning: You need to listen.

They said: "It's not about the dishes."
Meaning: It's about everything you didn't notice.

They said: "Wow, they're really attractive."
Meaning: Your next words will decide your evening.

They said: "I just think it's funny how..."
Meaning: Nothing about this is funny. Brace yourself.

Now translate what they said.`;

const MAX_INPUT_LENGTH = 2000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "Missing or empty text" },
        { status: 400 }
      );
    }

    if (text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Text exceeds maximum length of ${MAX_INPUT_LENGTH} characters` },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set." },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${SYSTEM_PROMPT}\n\nThey said: "${text}"` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);

      // Handle Gemini rate limiting (429)
      if (response.status === 429 && errBody?.error) {
        const retryDelay = errBody.error.details?.find(
          (d: Record<string, string>) => d["@type"]?.includes("RetryInfo")
        )?.retryDelay;
        const retrySeconds = retryDelay
          ? parseInt(retryDelay.replace("s", ""), 10)
          : 60;

        return NextResponse.json(
          {
            error: "rate_limit",
            message: `API rate limit reached. Try again in ~${retrySeconds}s.`,
            retryAfter: retrySeconds,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errBody?.error?.message || "Gemini request failed." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Translate API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Gemini API." },
      { status: 500 }
    );
  }
}
