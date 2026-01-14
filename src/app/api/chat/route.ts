import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Lazy-initialize Groq client to avoid build-time errors
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

// ALLONE knowledge base - this is the context the AI will use
const ALLONE_KNOWLEDGE = `
# About ALLONE

ALLONE is a technology company specializing in AI automation solutions for businesses. We help companies transform their operations through intelligent automation systems.

## Our Services

### 1. AI Chatbots
We build custom AI chatbots that handle customer support, lead qualification, and sales assistance 24/7.
- Reduce response times by 90%
- Handle unlimited concurrent conversations
- Integrate with existing systems (CRM, helpdesk, etc.)
- Support multiple languages
- Learn and improve over time

### 2. Custom AI Solutions
We develop tailored AI solutions for specific business needs:
- Document processing and extraction
- Predictive analytics
- Recommendation systems
- Computer vision applications
- Natural language processing

### 3. Workflow Automation
We automate repetitive business processes:
- Data entry and migration
- Report generation
- Email processing
- Invoice handling
- Lead routing and assignment

### 4. Website Development
Modern, high-performance websites with AI integration:
- Next.js / React applications
- E-commerce platforms
- Admin dashboards
- API development
- Real-time features

### 5. Strategy & Consulting
We help businesses develop their AI strategy:
- AI readiness assessment
- Process optimization
- Technology selection
- Implementation roadmap
- Training and support

## Why Choose ALLONE

- **Expertise**: Deep experience in AI and automation
- **Custom Solutions**: Tailored to your specific needs
- **Fast Delivery**: Rapid implementation and iteration
- **Ongoing Support**: We're with you for the long term
- **Proven Results**: Measurable ROI for our clients

## How We Work

1. **Discovery**: We learn about your business and challenges
2. **Strategy**: We design the optimal solution
3. **Build**: We develop and test the solution
4. **Deploy**: We launch and monitor performance
5. **Optimize**: We continuously improve based on data

## Contact

To get started with ALLONE:
- Visit our website: allone.ge
- Email: hello@allone.ge
- Schedule a consultation through our contact page

## Pricing

We offer flexible pricing models:
- Project-based pricing for specific implementations
- Monthly retainers for ongoing support
- Custom enterprise agreements

Contact us for a personalized quote based on your needs.
`;

const SYSTEM_PROMPT = `You are the ALLONE AI Assistant, a helpful and knowledgeable representative of ALLONE, an AI automation company.

Your role is to:
1. Answer questions about ALLONE's services, capabilities, and approach
2. Help potential clients understand how AI automation can benefit their business
3. Guide users toward scheduling a consultation or contacting the team
4. Be friendly, professional, and concise

Use the following knowledge base to answer questions:

${ALLONE_KNOWLEDGE}

Guidelines:
- Keep responses concise and helpful (2-4 sentences for simple questions)
- If asked about specific pricing, mention that pricing is customized and encourage them to contact us
- If asked about something outside ALLONE's services, politely redirect to what we can help with
- Always be positive and solution-oriented
- If unsure about something specific, offer to connect them with the team
- Use a warm, professional tone`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const client = getGroqClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 }
      );
    }

    // Build conversation with system prompt
    const conversationMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Call Groq API
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      reply,
      usage: completion.usage,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
