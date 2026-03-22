import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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

export async function POST(req: NextRequest) {
  try {
    const { question, customApiKey, customBaseUrl, modelName } = await req.json();

    if (!question) {
      return NextResponse.json({ error: '题目不能为空' }, { status: 400 });
    }

    if (!customApiKey || !customBaseUrl) {
      return NextResponse.json({ error: '请配置 API 地址和密钥' }, { status: 400 });
    }
    
    const clientToUse = new OpenAI({
      apiKey: customApiKey,
      baseURL: customBaseUrl,
    });

    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      {
        role: 'user' as const,
        content: `请为以下题目制定分步教学计划：\n${question}`,
      },
    ];

    const response = await clientToUse.chat.completions.create({
      model: modelName || 'gpt-5.2',
      messages,
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const sanitized = sanitizeLessonPlan(parsed);

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'AI 服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
}

// ─── Sanitization helpers ──────────────────────────────────────────────────

/** Strip outer $...$ or $$...$$ from a pure-LaTeX field */
function stripDollarSigns(str: string): string {
  if (!str) return str;
  const s = str.trim();
  if (s.startsWith('$$') && s.endsWith('$$')) return s.slice(2, -2).trim();
  if (s.startsWith('$') && s.endsWith('$') && s.length > 2) return s.slice(1, -1).trim();
  return s;
}

/** Strip inline $...$ from plain-text fields */
function stripInlineMath(str: string): string {
  if (!str) return str;
  return str.replace(/\$([^$]+)\$/g, '$1');
}

/** Extract trailing $...$ from choice text into its math field */
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

  // Top-level fields
  if (typeof data.formula === 'string') data.formula = stripDollarSigns(data.formula);
  if (typeof data.intro === 'string') data.intro = stripInlineMath(data.intro);
  // conclusion: keep $...$ so MixedText can render inline math

  // Rounds
  if (Array.isArray(data.rounds)) {
    data.rounds = (data.rounds as Round[]).map((r) => {
      const sanitizedRound: Round = { ...r };

      if (typeof r.formula === 'string') sanitizedRound.formula = stripDollarSigns(r.formula);
      if (typeof r.guidance === 'string') sanitizedRound.guidance = stripInlineMath(r.guidance);
      if (typeof r.question === 'string') sanitizedRound.question = stripInlineMath(r.question);
      // feedback_correct / feedback_wrong: keep $...$ for MixedText

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
