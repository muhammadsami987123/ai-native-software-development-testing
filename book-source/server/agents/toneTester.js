import { GoogleGenerativeAI } from '@google/generative-ai';

export class ToneTester {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Project domain keywords and topics
    this.projectDomain = {
      keywords: [
        'AI', 'artificial intelligence', 'agent', 'agentic', 'python', 'typescript',
        'spec-driven', 'specification', 'development', 'programming', 'code',
        'gemini', 'claude', 'openai', 'MCP', 'model context protocol',
        'docusaurus', 'documentation', 'book', 'chapter', 'tutorial',
        'API', 'backend', 'frontend', 'react', 'node', 'express',
        'docker', 'kubernetes', 'deployment', 'architecture',
        'prompt', 'context', 'engineering', 'co-learning', 'colearning'
      ],
      topics: [
        'AI-Driven Development',
        'AI-Native Development',
        'Python Programming',
        'TypeScript Programming',
        'Spec-Driven Development',
        'Agentic AI Systems',
        'OpenAI Agents SDK',
        'Google Gemini',
        'MCP Protocol',
        'Realtime Agents',
        'Voice Agents',
        'Containerization',
        'Event-Driven Architecture'
      ]
    };
  }

  async testTone(query, projectContext) {
    try {
      // Quick keyword-based pre-check
      const quickCheck = this.quickToneCheck(query);

      // If high confidence from quick check, return early
      if (quickCheck.confidence > 0.8) {
        return quickCheck;
      }

      // Use Gemini for more nuanced tone detection
      const prompt = `You are a Tone Detection Agent. Determine if a user query is "in-tone" (related to the project context) or "out-of-tone" (unrelated).

PROJECT DOMAIN: AI Native Software Development
- A book and platform about AI-driven development, Python, TypeScript, agentic AI systems
- Topics include: Spec-driven development, OpenAI Agents SDK, Google Gemini, MCP, realtime agents, voice agents, containerization, event-driven architecture
- Keywords: AI, agent, agentic, python, typescript, spec-driven, development, programming, gemini, claude, MCP, docusaurus, documentation

PROJECT CONTEXT AVAILABLE:
${projectContext.summary || 'Limited context available'}

USER QUERY: "${query}"

Analyze if this query is:
1. IN-TONE: Directly related to the project, its codebase, documentation, or domain topics
2. OUT-OF-TONE: Unrelated or only tangentially related to the project

Return a JSON object with this exact structure:
{
  "isInTone": boolean,
  "confidence": number (0.0 to 1.0),
  "reasoning": "brief explanation"
}

Return ONLY valid JSON, no additional text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Extract JSON
      let jsonText = text;
      if (text.includes('```json')) {
        jsonText = text.split('```json')[1].split('```')[0].trim();
      } else if (text.includes('```')) {
        jsonText = text.split('```')[1].split('```')[0].trim();
      }

      const toneResult = JSON.parse(jsonText);

      return {
        isInTone: toneResult.isInTone !== undefined ? toneResult.isInTone : true,
        confidence: toneResult.confidence !== undefined ? Math.max(0, Math.min(1, toneResult.confidence)) : 0.7,
        reasoning: toneResult.reasoning || 'Analyzed using AI model'
      };
    } catch (error) {
      console.error('Error in ToneTester:', error);
      // Fallback to quick check
      return this.quickToneCheck(query);
    }
  }

  quickToneCheck(query) {
    const lowerQuery = query.toLowerCase();
    let matchCount = 0;
    let totalKeywords = this.projectDomain.keywords.length;

    // Check for keyword matches
    for (const keyword of this.projectDomain.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    // Check for topic matches
    for (const topic of this.projectDomain.topics) {
      if (lowerQuery.includes(topic.toLowerCase())) {
        matchCount += 2; // Topics are weighted higher
      }
    }

    // Calculate confidence (0-1 scale)
    const keywordScore = matchCount / (totalKeywords * 0.3); // Normalize
    const confidence = Math.min(1.0, keywordScore);

    // Determine if in-tone (threshold: 0.3)
    const isInTone = confidence > 0.3;

    return {
      isInTone,
      confidence: Math.max(0.1, Math.min(1.0, confidence)),
      reasoning: `Quick check: ${matchCount} keyword/topic matches found`
    };
  }
}
