export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Read the incoming text just to make sure JSON parsing works
    const { text } = await request.json();
    console.log("Received text from frontend:", text);

    // Hardcoded response to isolate the issue
    const reply = "BOOM! You are matching the energy! This is a successful test response.";

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