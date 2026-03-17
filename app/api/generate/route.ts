import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const { topic, context, tone, model } = await req.json();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Create an optimized prompt for ${model}.

Task: ${topic}
Context: ${context || 'None'}
Tone: ${tone}

Output ONLY the final prompt, no explanation.`
    }]
  });

  return Response.json({
    prompt: message.content[0].type 
  });
}