// Built-in fetch support in Vercel Node runtime

module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  console.log("Incoming request body:", req.body);
  try {
    const { userText, systemPrompt } = req.body;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        content: [{ text: "API key is missing in Vercel settings!" }]
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
        model: "claude-3-haiku-20240307",
        max_tokens: 150,
        system: systemPrompt,
        messages: [{ role: "user", content: userText }]
      })
    });

    console.log("Anthropic API Response Status:", response.status);
const data = await response.json();
console.log("Anthropic API Response Body:", JSON.stringify(data));
return res.status(200).json(data);

  } catch (error) {
     console.error("Anthropic API Error Details:", error);
     return res.status(200).json({
     content: [{ text: "Error: " + error.message }]
    });
  }
};