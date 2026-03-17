import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Ensure this is in Vercel/Env
});

export async function POST(req: Request) {
  try {
    const { topic, context, tone, targetModel } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Most powerful model for prompt engineering
      max_tokens: 1000,
      system: "You are an expert Prompt Engineer. Your task is to take a user's simple idea and transform it into a highly structured, professional AI prompt. Use brackets for variables like [Insert Date]. Provide ONLY the final generated prompt. Do not include 'Here is your prompt' or any intro/outro text.",
      messages: [{
        role: 'user',
        content: `Create an optimized prompt for ${targetModel || 'ChatGPT/Claude'}.
        
        Task Topic: ${topic}
        Additional Context: ${context || 'General use'}
        Desired Tone: ${tone || 'Professional'}
        
        Output only the final prompt text.`
      }]
    });

    // Extracting the text safely
    const generatedPrompt = message.content[0].type === 'text' ? message.content[0].text : "Generation failed.";

    return NextResponse.json({ prompt: generatedPrompt });
    
  } catch (error: any) {
    console.error("Anthropic API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}