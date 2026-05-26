export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Read userText and systemPrompt exactly as index.html sends them
    const { userText, systemPrompt } = await request.json();

    // Grab the API key from Netlify
    const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        content: [{ text: "API key is missing in Netlify settings!" }] 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call Anthropic Claude with the correct parameters
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
        system: systemPrompt, // Use the system prompt from index.html
        messages: [
          {
            role: "user",
            content: userText // Use userText from index.html
          }
        ]
      })
    });

    const data = await response.json();
    
    // Return the data directly so index.html can parse data.content[0].text
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