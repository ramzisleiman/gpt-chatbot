import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { message }: { message: string } = await req.json();

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const response = chatResponse.choices[0].message.content;
    return NextResponse.json({ response });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ response: '⚠️ API call failed' }, { status: 500 });
  }
}
