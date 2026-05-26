export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Read the incoming text from the frontend
    const { userText } = await request.json();

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

    // Call the real Anthropic Claude API using the correct structure
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
        messages: [
          {
            role: "user",
            content: `You are Tony Robbins, the ultimate motivational speaker. Respond with intense energy and actionable insight. Keep it brief (1-3 sentences max): "${userText}"`
          }
        ]
      })
    });

    const data = await response.json();
    
    // Pass the exact structure the frontend is looking for
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