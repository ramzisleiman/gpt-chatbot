import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    return NextResponse.json({
      response: chatResponse.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { response: 'Something went wrong. Check the server logs.' },
      { status: 500 }
    );
  }
}
