import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, context, tone, targetModel } = await req.json();

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      system: "You are an expert Prompt Engineer. Output ONLY the generated prompt.",
      messages: [{
        role: 'user',
        content: `Create an optimized prompt for ${targetModel}. Topic: ${topic}. Tone: ${tone}.`
      }]
    });

    // We name it generatedText here...
    const generatedText = message.content[0].type === 'text' ? message.content[0].text : "Failed";

    // ...and we use generatedText here. They match perfectly now!
    return NextResponse.json({ prompt: generatedText });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}