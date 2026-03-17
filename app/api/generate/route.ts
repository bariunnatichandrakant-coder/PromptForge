import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { topic, context, tone, targetModel } = await req.json();

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      system: "You are an expert Prompt Engineer. Output ONLY the generated prompt.",
      messages: [
        {
          role: 'user',
          content: `Create an optimized prompt for ${targetModel}. Topic: ${topic}. Tone: ${tone}. Context: ${context || "none"}`
        }
      ]
    });

    let generatedText = "Failed";

    if (message.content && message.content.length > 0) {
      const firstBlock = message.content[0];
      if (firstBlock.type === 'text') {
        generatedText = firstBlock.text;
      }
    }

    return NextResponse.json({ prompt: generatedText });

  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}