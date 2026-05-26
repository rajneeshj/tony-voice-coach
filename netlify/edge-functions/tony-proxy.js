export default async (request, context) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Read the user's spoken text from the incoming request
    const { text } = await request.json();
    
    // Grab the API key you saved in your Netlify settings
    const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Send the prompt directly to Anthropic's Claude
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
            content: `You are Tony Robbins, the ultimate motivational speaker and life coach. Respond to this user with intense energy, passion, and actionable insight. Keep it brief (1-3 sentences max) so it sounds natural when spoken aloud: "${text}"`
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data.content[0].text;

    // Send Tony's response back to your index.html frontend
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};