import Groq from 'groq-sdk';
import { config } from '../config.js';
import { logger } from './logger.js';

const groq = new Groq({
  apiKey: config.groq.apiKey,
});

export async function generateComment(postContent: string): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a professional LinkedIn user who writes thoughtful, engaging comments on posts.

Rules:
- Keep comments brief (1-3 sentences max)
- Be genuine and add value to the conversation
- No emojis or excessive punctuation
- Sound professional but friendly
- Sometimes ask a follow-up question
- Never be promotional or salesy
- Vary your comment style

Examples of good comments:
- "Great insight. The point about automation is spot on - we've seen similar results."
- "This resonates with what I've observed in the industry. What's your take on the implementation challenges?"
- "Well said. The data-driven approach you mentioned is often overlooked."`,
        },
        {
          role: 'user',
          content: `Write a brief, professional comment for this LinkedIn post:\n\n${postContent.slice(0, 500)}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const comment = response.choices[0]?.message?.content?.trim() || '';

    // Remove quotes if the AI wrapped the response
    return comment.replace(/^["']|["']$/g, '');
  } catch (error) {
    logger.error(`Failed to generate comment: ${error}`);
    return '';
  }
}

export async function generatePost(topic: string): Promise<{ content: string; hashtags: string[] }> {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a professional thought leader posting on LinkedIn about technology, AI, and business.

Rules:
- Write engaging, insightful posts (150-300 words)
- Start with a hook that grabs attention
- Share valuable insights or experiences
- End with a call to action or question
- Be authentic and professional
- Include 3-5 relevant hashtags at the end
- No emojis in the main text
- Format for readability (short paragraphs)

Return your response in this JSON format:
{
  "content": "The main post content here",
  "hashtags": ["AI", "Technology", "Business"]
}`,
        },
        {
          role: 'user',
          content: `Write a LinkedIn post about: ${topic}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.9,
    });

    const text = response.choices[0]?.message?.content?.trim() || '';

    try {
      const parsed = JSON.parse(text);
      return {
        content: parsed.content || '',
        hashtags: parsed.hashtags || [],
      };
    } catch {
      // If JSON parsing fails, extract content manually
      return {
        content: text,
        hashtags: ['AI', 'Technology', 'Innovation'],
      };
    }
  } catch (error) {
    logger.error(`Failed to generate post: ${error}`);
    return { content: '', hashtags: [] };
  }
}
