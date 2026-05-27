export const config = {
  runtime: 'edge',
};

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { userText, systemPrompt } = await request.json();

    // Grab the API key using Vercel's standard environment variable access
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        content: [{ text: "API key is missing in Vercel settings!" }] 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 150,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      content: [{ text: "Error: " + error.message }] 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};