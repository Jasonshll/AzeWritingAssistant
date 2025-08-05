# 阿泽码字助手

一个专为网文写作者设计的AI辅助文档编辑器，集成OpenAI格式API和本地Ollama服务支持。

## ✨ 主要功能

### 📄 文档管理
- **左侧文档列表**：可隐藏侧边栏，支持快速切换文档
- **文档操作**：右键菜单支持重命名、删除文档
- **自动保存**：每30秒自动保存当前文档
- **快捷键支持**：Ctrl+S保存，Ctrl+N新建文档

### 🤖 AI助手
- **右侧AI聊天**：可隐藏侧边栏，支持多模型选择
- **浮动AI按钮**：可拖拽的悬浮按钮，选中文字后快速调用AI
- **AI编辑模式**：
  - 选中文字后点击浮动按钮
  - 输入提示词进行AI编辑
  - 支持替换、复制、接续三种操作
  - 实时生成，可随时停止

### 🎯 写作优化
- **专注写作**：简洁的编辑器界面
- **代码字体**：等宽字体适合写作
- **响应式设计**：支持移动端和桌面端

### 📸 程序截图

![程序截图](https://github.com/Jasonshll/AzeWritingAssistant/blob/main/%E7%A8%8B%E5%BA%8F%E6%88%AA%E5%9B%BE.png)

## 🚀 快速开始

### 安装依赖
```bash
pip install -r requirements.txt
```

### 启动应用
```bash
python app.py
```

### 访问应用
打开浏览器访问：http://localhost:5000

## 📁 项目结构

```
阿泽码字助手/
├── app.py                 # Flask主应用
├── requirements.txt       # 项目依赖
├── documents/            # 文档存储目录
├── templates/
│   └── index.html        # 主页面模板
├── static/
│   ├── css/
│   │   └── style.css     # 样式文件
│   └── js/
│       └── app.js        # 前端交互逻辑
└── README.md             # 项目说明
```

## ⚙️ 配置说明

### AI模型配置
目前支持以下模型：
- GPT-3.5 Turbo
- GPT-4
- Llama 2
- Code Llama

### 自定义AI API
要连接真实的AI API，请修改`app.py`中的`/api/chat`端点：

```python
# 替换模拟回复为真实API调用
import openai
openai.api_key = "your-api-key"

# 在chat()函数中添加真实API调用
response = openai.ChatCompletion.create(
    model=model,
    messages=[{"role": "user", "content": message}]
)
```

### Ollama集成
要使用本地Ollama服务：

```python
import requests

# 在chat()函数中添加Ollama调用
response = requests.post('http://localhost:11434/api/generate', json={
    'model': model,
    'prompt': message,
    'stream': False
})
```

## 🎨 使用技巧

### 文档管理
1. **新建文档**：点击左侧"新建文档"按钮
2. **快速切换**：点击文档列表中的文档
3. **重命名**：右键文档 → 重命名
4. **删除**：右键文档 → 删除

### AI写作辅助
1. **通用聊天**：在右侧AI助手中直接对话
2. **选中编辑**：
   - 在编辑器中选中文字
   - 点击浮动AI按钮
   - 输入编辑指令
   - 选择操作方式

### 快捷键
- `Ctrl+S`：保存当前文档
- `Ctrl+N`：新建文档
- `Ctrl+Enter`：在AI编辑框中快速生成

## 🛠️ 开发计划

- [ ] 支持Markdown格式
- [ ] 添加写作统计功能
- [ ] 集成更多AI模型
- [ ] 添加云同步功能
- [ ] 支持导出多种格式
- [ ] 添加写作目标设置

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 详见LICENSE文件