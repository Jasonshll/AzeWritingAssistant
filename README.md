# 阿泽码字助手

一个基于Web的AI辅助写作工具，支持文档管理、AI聊天、国际化等功能。

## 功能特性

### 📝 文档管理
- **新建文档**: 快速创建新的写作项目
- **文档列表**: 直观的文档管理界面，支持按时间排序
- **实时保存**: 自动保存功能，防止意外丢失
- **重命名/删除**: 完整的文档生命周期管理

### 🤖 AI助手
- **聊天对话**: 与AI进行自然语言对话
- **AI编辑**: 选中文字后使用AI进行智能编辑
- **多模型支持**: 支持OpenAI API和本地OLLAMA服务
- **流式响应**: 实时显示AI回复内容

### 🌐 国际化
- **多语言支持**: 中文和英文界面
- **实时切换**: 无需重启即可切换语言

### 🎨 界面特色
- **现代化设计**: 清晰直观的用户界面
- **响应式布局**: 适配不同屏幕尺寸
- **深色模式**: 支持深色主题
- **快捷键支持**: 常用操作的键盘快捷键

## 安装与运行

### 环境要求
- Python 3.7+
- Flask 2.3.3+
- 现代浏览器

### 快速开始

1. **克隆项目**
```bash
git clone https://github.com/Jasonshll/AzeWritingAssistant.git
cd AzeWritingAssistant
```

2. **安装依赖**
```bash
pip install -r requirements.txt
```

3. **运行应用**
```bash
python app.py
```

4. **访问应用**
浏览器自动打开 http://localhost:5000

### Docker运行（可选）
```bash
docker build -t aze-writing-assistant .
docker run -p 5000:5000 aze-writing-assistant
```

## 使用指南

### 基本操作

#### 文档操作
1. **新建文档**: 点击左侧"新建文档"按钮
2. **打开文档**: 点击文档列表中的文档名称
3. **保存文档**: Ctrl+S 或自动保存
4. **重命名**: 右键文档或点击重命名图标
5. **删除文档**: 点击删除图标确认删除

#### AI聊天
1. **打开聊天**: 点击右侧AI助手图标
2. **发送消息**: 输入消息后按Enter或点击发送
3. **切换模型**: 在设置中选择不同的AI服务

#### AI编辑
1. **选中文字**: 在编辑器中选中要处理的文字
2. **打开AI编辑**: 点击悬浮AI按钮或右键菜单
3. **输入提示**: 告诉AI如何处理选中的文字
4. **应用结果**: 选择替换、追加或复制AI生成的内容

### 设置配置

#### OpenAI API
1. 打开设置（右上角齿轮图标）
2. 选择"在线API"服务类型
3. 输入API地址（如：https://api.openai.com/v1/chat/completions）
4. 输入API密钥
5. 选择模型（如：gpt-3.5-turbo）

#### 本地OLLAMA
1. 确保已安装并运行OLLAMA
2. 在设置中选择"本地OLLAMA"服务类型
3. 输入OLLAMA地址（默认：http://localhost:11434）
4. 点击"刷新模型"获取可用模型
5. 选择要使用的模型

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+S | 保存当前文档 |
| Ctrl+N | 新建文档 |
| Ctrl+Z | 撤销 |
| Ctrl+Y | 重做 |

## 技术架构

### 前端技术
- **HTML5**: 语义化标记
- **CSS3**: 现代样式和动画
- **JavaScript**: 交互逻辑
- **Font Awesome**: 图标库

### 后端技术
- **Flask**: Python Web框架
- **RESTful API**: 标准的API设计
- **文件存储**: 本地文本文件存储
- **流式响应**: 支持AI回复的实时显示

### 部署架构
- **本地运行**: 单机版应用
- **跨平台**: 支持Windows、macOS、Linux
- **零配置**: 开箱即用

## 开发计划

### 即将推出
- [ ] 文档版本历史
- [ ] 多人协作编辑
- [ ] 云端同步
- [ ] 更多AI模型支持
- [ ] 插件系统

### 长期规划
- [ ] 移动端应用
- [ ] 富文本编辑
- [ ] 语音输入
- [ ] 模板库
- [ ] 导出多种格式

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

遇到问题或有建议？请通过以下方式联系我们：

- **Issues**: [GitHub Issues](https://github.com/Jasonshll/AzeWritingAssistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Jasonshll/AzeWritingAssistant/discussions)

## 致谢

感谢所有贡献者和开源社区的支持！

---

**阿泽码字助手** - 让写作更高效，让创作更轻松！