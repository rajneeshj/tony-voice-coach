export default async (request, context) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // 1. Grab the user's spoken text from the incoming frontend request
    const { userText, systemPrompt } = await request.json();

    // 2. Fetch the API key securely from Netlify's system memory
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key missing on server." }), {
        status: 500,
        headers: { "content-type": "application/json" }
      });
    }

    // 3. Make the secure server-to-server call to Anthropic
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
        messages: [{ role: "user", content: userText }]
      })
    });

    const data = await response.json();
    
    // 4. Send the response back to your browser page
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "content-type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};