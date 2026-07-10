import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Meta calls this to verify the webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token) {
    const config = await prisma.botConfig.findFirst({
      where: { verifyToken: token },
    });

    if (config) {
      return new NextResponse(challenge, { status: 200 });
    }
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// Call Gemini AI to generate a smart reply
async function getGeminiReply(
  userMessage: string,
  businessContext: string | null
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return "Thanks for your message! We'll get back to you shortly.";
  }

  const systemPrompt = businessContext
    ? `You are a helpful customer service assistant for this business: ${businessContext}. Reply to the customer's WhatsApp message in a friendly, helpful, and concise way. Keep replies short (2-4 sentences max), suitable for WhatsApp chat.`
    : `You are a helpful customer service assistant. Reply to the customer's WhatsApp message in a friendly, helpful, and concise way. Keep replies short (2-4 sentences max), suitable for WhatsApp chat.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nCustomer message: "${userMessage}"\n\nYour reply:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      return reply.trim();
    }

    console.error("Gemini API unexpected response:", JSON.stringify(data));
    return "Thanks for your message! We'll get back to you shortly.";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Thanks for your message! We'll get back to you shortly.";
  }
}

// POST - Meta sends incoming messages here
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const phoneNumberId = value?.metadata?.phone_number_id;
    const message = value?.messages?.[0];

    if (!phoneNumberId || !message) {
      return NextResponse.json({ success: true });
    }

    const from = message.from;
    const messageText = message.text?.body || "";

    const botConfig = await prisma.botConfig.findFirst({
      where: { phoneNumberId },
      include: { user: true },
    });

    if (!botConfig || !botConfig.isActive || !botConfig.accessToken) {
      return NextResponse.json({ success: true });
    }

    if (!botConfig.user.isApproved) {
      return NextResponse.json({ success: true });
    }

    let replyText: string;

    if (botConfig.aiEnabled && messageText) {
      // AI-powered smart reply using Gemini
      replyText = await getGeminiReply(messageText, botConfig.businessContext);
    } else {
      // Fixed welcome message
      replyText =
        botConfig.welcomeMessage ||
        "Hi! Thanks for messaging us. We'll get back to you shortly.";
    }

    await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${botConfig.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: replyText },
        }),
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ success: true });
  }
}
