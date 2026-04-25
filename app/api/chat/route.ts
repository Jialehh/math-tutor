import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';

const SYSTEM_PROMPT = `你是一位专业的启发式数学/理科导师，擅长用苏格拉底式问答引导学生一步步理解题目，而非直接给出答案。

你的任务是为学生制定一个分步教学计划（Lesson Plan）。根据题目的复杂度：
- 简单题（complexity 1-2）：1-2 轮，每轮引导语约 30 字
- 中等题（complexity 3）：2-3 轮，每轮引导语约 40-60 字
- 复杂题（complexity 4-5）：3-5 轮，每轮引导语约 60-100 字，可包含分步推导

每一轮（round）的结构：
1. guidance（本轮AI引导语）：主动讲解一个知识点或解题步骤，对话式、有启发性，可以适当"说多一点"告诉学生思路，但不能直接给出答案
2. formula（可选，本轮涉及的公式）：若本轮需要展示新公式或中间推导结果
3. question（向学生提问）：基于本轮引导，提出一个选择题让学生主动思考
4. choices：3个选项（A/B/C），恰好一个正确，其他为有代表性的错误选项
5. feedback_correct（选对后的反馈）：热情肯定，解释为什么对，并引出下一步（用$...$包裹数学）
6. feedback_wrong（选错后的反馈）：温和纠正，解释为什么错，指出正确思路（用$...$包裹数学）

重要规则：
- formula 和 math 字段：只写纯LaTeX，不加 $ 符号（如：x^2+2x-3）
- intro、guidance、question、choices的text、conclusion 字段：纯文字，不加$符号
- feedback_correct、feedback_wrong：可在文字中用$...$包裹数学（如：$f'(x)=3x^2-3$）
- conclusion：做整体总结，可用$...$包裹数学

严格按照以下JSON格式返回，不要有任何多余文字：
{
  "complexity": 3,
  "totalRounds": 3,
  "intro": "检测到这是...（20-40字纯文字，概括题目类型和难度）",
  "formula": "题目主公式（纯LaTeX，可为空字符串）",
  "rounds": [
    {
      "roundId": 1,
      "guidance": "本轮引导语（有启发性的知识讲解，纯文字，可以说得详细一些）",
      "formula": "本轮涉及的公式（纯LaTeX，可为空字符串）",
      "question": "引导性选择题（纯文字，15-30字，以'你觉得...'或'请问...'开头）",
      "choices": [
        { "id": "A", "text": "纯文字描述", "math": "LaTeX（无$，可为空）" },
        { "id": "B", "text": "纯文字描述", "math": "" },
        { "id": "C", "text": "纯文字描述", "math": "" }
      ],
      "correctId": "A",
      "feedback_correct": "正确反馈（热情+解释，可含$...$数学，40-80字）",
      "feedback_wrong": "错误反馈（温和纠正+引导，可含$...$数学，40-80字）"
    }
  ],
  "conclusion": "综合总结（60-120字，回顾所有步骤，可用$...$包裹数学公式）"
}`;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function buildOpenAIMessages(systemPrompt: string, userQuestion: string): Message[] {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请为以下题目制定分步教学计划：\n${userQuestion}` },
  ];
}

function buildAnthropicMessages(systemPrompt: string, userQuestion: string): { system: string; messages: Message[] } {
  return {
    system: systemPrompt,
    messages: [
      { role: 'user', content: `请为以下题目制定分步教学计划：\n${userQuestion}` },
    ],
  };
}

function buildGeminiContents(systemPrompt: string, userQuestion: string): { system_instruction: { parts: { text: string }[] }; contents: { role: string; parts: { text: string }[] }[] } {
  return {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: `请为以下题目制定分步教学计划：\n${userQuestion}` }],
      },
    ],
  };
}

async function callOpenAIFormat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: Message[],
  authHeader: string,
  authPrefix?: string
): Promise<string> {
  const url = `${baseUrl}/chat/completions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authPrefix) {
    headers[authHeader] = `${authPrefix} ${apiKey}`;
  } else {
    headers[authHeader] = apiKey;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI format error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callAnthropicFormat(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  messages: Message[],
  maxTokens: number = 4096
): Promise<string> {
  const url = `${baseUrl}/messages`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic format error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

async function callGeminiFormat(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemInstruction: { parts: { text: string }[] },
  contents: { role: string; parts: { text: string }[] }[]
): Promise<string> {
  const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      system_instruction: systemInstruction,
      contents,
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini format error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts[0]?.text || '';
}

export async function POST(req: NextRequest) {
  try {
    const { question, customApiKey, customBaseUrl, modelName, selectedProvider } = await req.json();

    if (!question) {
      return NextResponse.json({ error: '题目不能为空' }, { status: 400 });
    }

    if (!customApiKey || !customBaseUrl) {
      return NextResponse.json({ error: '请配置 API 地址和密钥' }, { status: 400 });
    }

    const provider = getProvider(selectedProvider || 'custom');
    const modelToUse = modelName || provider?.defaultModel || 'gpt-5.2';
    const format = provider?.format || 'openai';

    let raw = '';

    switch (format) {
      case 'anthropic':
        const anthropicData = buildAnthropicMessages(SYSTEM_PROMPT, question);
        raw = await callAnthropicFormat(
          customBaseUrl,
          customApiKey,
          modelToUse,
          anthropicData.system,
          anthropicData.messages
        );
        break;

      case 'gemini':
        const geminiData = buildGeminiContents(SYSTEM_PROMPT, question);
        raw = await callGeminiFormat(
          customBaseUrl,
          customApiKey,
          modelToUse,
          geminiData.system_instruction,
          geminiData.contents
        );
        break;

      case 'openai':
      default:
        const openAIMessages = buildOpenAIMessages(SYSTEM_PROMPT, question);
        raw = await callOpenAIFormat(
          customBaseUrl,
          customApiKey,
          modelToUse,
          openAIMessages,
          provider?.authHeader || 'Authorization',
          provider?.authPrefix
        );
        break;
    }

    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const sanitized = sanitizeLessonPlan(parsed);

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI 服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
}

function stripDollarSigns(str: string): string {
  if (!str) return str;
  const s = str.trim();
  if (s.startsWith('$$') && s.endsWith('$$')) return s.slice(2, -2).trim();
  if (s.startsWith('$') && s.endsWith('$') && s.length > 2) return s.slice(1, -1).trim();
  return s;
}

function stripInlineMath(str: string): string {
  if (!str) return str;
  return str.replace(/\$([^$]+)\$/g, '$1');
}

function extractMathFromText(text: string, existingMath: string): { text: string; math: string } {
  if (existingMath) return { text, math: stripDollarSigns(existingMath) };
  const match = text.match(/^(.*?)\s*(\$[^$]+\$)\s*$/);
  if (match) return { text: match[1].trim(), math: match[2].slice(1, -1).trim() };
  return { text, math: '' };
}

type Choice = { id: string; text: string; math?: string };
type Round = {
  roundId: number;
  guidance: string;
  formula?: string;
  question: string;
  choices: Choice[];
  correctId: string;
  feedback_correct: string;
  feedback_wrong: string;
};

function sanitizeLessonPlan(data: Record<string, unknown>) {
  if (!data) return data;

  if (typeof data.formula === 'string') data.formula = stripDollarSigns(data.formula);
  if (typeof data.intro === 'string') data.intro = stripInlineMath(data.intro);

  if (Array.isArray(data.rounds)) {
    data.rounds = (data.rounds as Round[]).map((r) => {
      const sanitizedRound: Round = { ...r };

      if (typeof r.formula === 'string') sanitizedRound.formula = stripDollarSigns(r.formula);
      if (typeof r.guidance === 'string') sanitizedRound.guidance = stripInlineMath(r.guidance);
      if (typeof r.question === 'string') sanitizedRound.question = stripInlineMath(r.question);

      if (Array.isArray(r.choices)) {
        sanitizedRound.choices = r.choices.map((c) => {
          const ex = extractMathFromText(c.text || '', c.math || '');
          return { ...c, text: ex.text, math: ex.math };
        });
      }

      return sanitizedRound;
    });
  }

  return data;
}
