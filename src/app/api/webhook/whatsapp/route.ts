async function getGeminiReply(userMessage: string, businessContext: string | null): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "Thanks for your message! We'll get back to you shortly.";

  const systemPrompt = businessContext
    ? `You are a helpful customer service assistant for this business: ${businessContext}. Reply to the customer's WhatsApp message in a friendly, helpful, concise way (2-4 sentences max).`
    : `You are a helpful customer service assistant. Reply concisely (2-4 sentences max).`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nCustomer message: "${userMessage}"\n\nYour reply:` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
        }),
      }
    );
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) return reply.trim();
    console.error("Gemini unexpected response:", JSON.stringify(data));
    return "Thanks for your message! We'll get back to you shortly.";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Thanks for your message! We'll get back to you shortly.";
  }
}
