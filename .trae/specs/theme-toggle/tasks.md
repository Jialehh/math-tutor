# Tasks

- [x] Task 1: 创建主题上下文管理器 ThemeProvider
  - [x] SubTask 1.1: 创建 ThemeProvider 组件，使用 React Context 管理主题状态
  - [x] SubTask 1.2: 定义 theme 类型（light/dark）和切换函数
  - [x] SubTask 1.3: 使用 useEffect 同步主题到 HTML 根元素

- [ ] Task 2: 创建主题切换按钮组件 ThemeToggle
  - [ ] SubTask 2.1: 使用 motion/react 实现旋转动画
  - [ ] SubTask 2.2: 添加太阳/月亮图标切换
  - [ ] SubTask 2.3: 实现深浅模式下的视觉样式

- [ ] Task 3: 在页面中集成 ThemeProvider 和 ThemeToggle
  - [ ] SubTask 3.1: 在 page.tsx 顶部添加 ThemeProvider 包裹
  - [ ] SubTask 3.2: 在页面合适位置添加 ThemeToggle 按钮
  - [ ] SubTask 3.3: 定义深色和浅色模式的 CSS 变量/Tailwind 类

- [ ] Task 4: 在 AI 教学面板中显示用户输入的题目
  - [ ] SubTask 4.1: 在 AI 面板顶部添加题目显示区域
  - [ ] SubTask 4.2: 样式化题目显示框，保持与整体风格一致
  - [ ] SubTask 4.3: 深色/浅色模式下样式适配

- [ ] Task 5: 适配所有现有组件支持深色/浅色模式
  - [ ] SubTask 5.1: Scanner 组件主题适配
  - [ ] SubTask 5.2: QuestionInput 组件主题适配
  - [ ] SubTask 5.3: AI Avatar 和其他面板组件主题适配

# Task Dependencies
- Task 3 依赖 Task 1 和 Task 2
- Task 4 依赖 Task 1
- Task 5 可以在 Task 3 完成后并行进行
