import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

let groq: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

export async function POST(request: NextRequest) {
  try {
    const client = getGroqClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Transcription service not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert File to the format Groq expects
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
      response_format: 'text',
    });

    return NextResponse.json({
      text: transcription,
    });

  } catch (error) {
    console.error('Transcription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to transcribe audio',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
