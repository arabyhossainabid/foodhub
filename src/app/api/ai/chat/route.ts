import { NextRequest, NextResponse } from 'next/server';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'OpenRouter API key is not configured' },
        { status: 500 },
      );
    }

    const body = await req.json();
    const messages = (body?.messages || []) as ChatMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Messages are required' },
        { status: 400 },
      );
    }

    const systemPrompt: ChatMessage = {
      role: 'system',
      content:
        'You are FoodHub assistant. Help users with meal recommendations, dietary guidance, delivery questions, offers, and order flow. Keep answers concise, practical, and friendly.',
    };

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'FoodHub Assistant',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [systemPrompt, ...messages],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, message: 'OpenRouter request failed', error: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'No response content from AI provider' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        content,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process AI chat request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
