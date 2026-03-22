# AI 数学老师

一个基于 AI 的智能数学/理科教学助手，采用苏格拉底式问答法引导学生逐步理解题目，而非直接给出答案。

[在线体验](https://ai.studio.apps/your-app-id) | [Bilibili 教程](https://space.bilibili.com/694979371)

***

## 功能特性

### 苏格拉底式教学

- AI 导师通过启发式问答引导学生思考
- 根据题目复杂度自动规划教学步骤（1-5 轮）
- 每轮包含：知识讲解 -> 提问 -> 选项 -> 反馈

### 数学支持

- 支持 LaTeX 数学公式渲染
- 可视化展示解题步骤和公式
- 支持分数、积分、矩阵等各种数学表达式

### 多 API 支持

- OpenAI (GPT 系列)
- Anthropic (Claude 系列)
- Google Gemini
- DeepSeek
- X.AI (Grok)
- SiliconFlow
- MiniMax
- 自定义 API 端点

### 精美界面

- 科幻风格 UI 设计
- 暗色/亮色主题切换
- 流畅的动画效果
- 响应式布局

***

## 界面预览

!\[主界面]\(assets/screenshot-1.png null)

!\[输入题目]\(assets/screenshot-2.png null)

!\[设置面板]\(assets/screenshot-3.png null)

!\[学习过程]\(assets/screenshot-4.png null)

***

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/ai-socratic-tutor.git
cd ai-socratic-tutor

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 <http://localhost:3000> 查看应用。

### 配置 API

1. 点击右上角设置图标
2. 选择 AI 服务商或选择"自定义"
3. 填入 API 地址和密钥
4. 保存设置

***

## 项目结构

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI API 路由
│   ├── page.tsx                  # 主页面
│   └── layout.tsx                # 布局组件
├── components/
│   ├── ChoiceTerminal.tsx        # 选择题终端
│   ├── KineticText.tsx           # 动态文字组件
│   ├── MathBlock.tsx             # 数学公式块
│   ├── MixedText.tsx             # 混合文本组件
│   ├── QuestionInput.tsx         # 问题输入框
│   ├── Scanner.tsx                # 扫描动画
│   ├── SettingsModal.tsx          # 设置弹窗
│   ├── ThemeProvider.tsx          # 主题提供者
│   ├── ThemeToggle.tsx            # 主题切换
│   └── Waveform.tsx              # 波形动画
├── hooks/
│   └── use-mobile.ts             # 移动端检测
├── lib/
│   └── utils.ts                  # 工具函数
└── public/                       # 静态资源
```

***

## 使用流程

1. **输入题目** - 在输入框中输入数学或理科题目
2. **AI 分析** - 系统分析题目复杂度并制定教学计划
3. **分步学习** - AI 导师引导你一步步思考
4. **选择答案** - 通过选择题检验理解
5. **获得反馈** - 即时反馈帮助你纠正思路
6. **总结回顾** - 最后获得完整的解题思路

***

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: Motion (Framer Motion)
- **数学渲染**: KaTeX + react-katex
- **AI**: OpenAI SDK
- **图标**: Lucide React

***

## License

MIT License - 欢迎开源和贡献！

***

## 作者

**许家乐**

- Bilibili: <https://space.bilibili.com/694979371>

***

