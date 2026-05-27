module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userText, systemPrompt } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        content: [{ text: "API key is missing in Vercel settings!" }]
      });
    }

    // Using the original baseline model identifier for the 2023-06-01 API version
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-v1",
        max_tokens: 150,
        system: systemPrompt,
        messages: [{ role: "user", content: userText }]
      })
    });

    const data = await response.json();

    // If Anthropic returns an error object, structure it so the frontend can display it safely
    if (data.type === 'error' || data.error) {
      return res.status(200).json({
        content: [{ text: "Anthropic API Error: " + (data.error.message || "Unknown error") }]
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(200).json({
      content: [{ text: "Server Error: " + error.message }]
    });
  }
};