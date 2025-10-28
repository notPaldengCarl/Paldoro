import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Safeplace — a chill, empathetic, validating AI friend.
                         Be kind, human, short, but deeply comforting.
                         Someone said: "${message}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    // 👇 Add this to inspect the real structure
    console.log("🪷 Gemini RAW RESPONSE:", JSON.stringify(data, null, 2));

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      return NextResponse.json({ text: reply });
    } else {
      return NextResponse.json({
        text: "Sorry, I couldn’t get a response right now 🥺",
      });
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({
      text: "⚠️ Failed to connect to Gemini.",
    });
  }
}
