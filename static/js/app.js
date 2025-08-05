// 全局变量
let currentDocumentId = null;
let autoSaveTimer = null;
let isSaving = false;
let chatMessages = [];
let selectedText = '';
let settings = {};

// DOM元素
const editor = document.getElementById('editor');
const documentList = document.getElementById('document-list');
const currentDocName = document.getElementById('current-doc-name');
const saveStatus = document.getElementById('save-status');
const newDocBtn = document.getElementById('new-doc-btn');
const newDocModal = document.getElementById('new-doc-modal');
const renameDocModal = document.getElementById('rename-doc-modal');
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const settingsModal = document.getElementById('settings-modal');
const aiEditModal = document.getElementById('ai-edit-modal');
const overlay = document.getElementById('overlay');
const aiPanel = document.getElementById('ai-panel');
const floatingAiBtn = document.getElementById('floating-ai-btn');

// 初始化
async function init() {
    await loadSettings();
    await loadDocuments();
    setupEventListeners();
    setupAutoSave();
    setupCloseHandler();
    
    // 如果有URL参数，打开指定文档
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');
    if (docId) {
        await openDocument(docId);
    }
}

// 设置关闭处理
function setupCloseHandler() {
    // 页面关闭时发送关闭请求
    window.addEventListener('beforeunload', function(e) {
        if (isSaving) {
            // 如果有未保存的内容，使用同步XHR发送关闭请求
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/shutdown', false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({}));
            } catch (error) {
                console.error('关闭请求发送失败:', error);
            }
        }
    });

    // 页面可见性变化时的处理
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时延迟5秒后关闭
            setTimeout(() => {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/shutdown', false);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({}));
                } catch (error) {
                    console.error('延迟关闭请求发送失败:', error);
                }
            }, 5000);
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 文档操作
    newDocBtn.addEventListener('click', showNewDocModal);
    editor.addEventListener('input', handleEditorInput);
    editor.addEventListener('keydown', handleEditorKeydown);
    
    // 模态框事件
    document.getElementById('close-new-doc-modal').addEventListener('click', hideModal);
    document.getElementById('cancel-new-doc').addEventListener('click', hideModal);
    document.getElementById('confirm-new-doc').addEventListener('click', createNewDocument);
    
    document.getElementById('close-rename-modal').addEventListener('click', hideModal);
    document.getElementById('cancel-rename').addEventListener('click', hideModal);
    document.getElementById('confirm-rename').addEventListener('click', renameDocument);
    
    document.getElementById('close-delete-modal').addEventListener('click', hideModal);
    document.getElementById('cancel-delete').addEventListener('click', hideModal);
    document.getElementById('confirm-delete').addEventListener('click', deleteDocument);
    
    document.getElementById('close-settings-modal').addEventListener('click', hideModal);
    document.getElementById('cancel-settings').addEventListener('click', hideModal);
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    
    document.getElementById('close-ai-edit-modal').addEventListener('click', hideModal);
    document.getElementById('ai-edit-replace').addEventListener('click', () => applyAiEdit('replace'));
    document.getElementById('ai-edit-append').addEventListener('click', () => applyAiEdit('append'));
    document.getElementById('ai-edit-copy').addEventListener('click', () => applyAiEdit('copy'));
    document.getElementById('ai-edit-regenerate').addEventListener('click', regenerateAiEdit);
    
    // AI面板事件
    document.getElementById('toggle-ai-panel').addEventListener('click', toggleAiPanel);
    document.getElementById('send-btn').addEventListener('click', sendChatMessage);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // 设置相关
    document.getElementById('settings-btn').addEventListener('click', showSettingsModal);
    document.getElementById('save-settings-btn').addEventListener('click', saveAiSettings);
    
    // AI服务切换
    document.getElementById('ai-service-type').addEventListener('change', handleAiServiceChange);
    document.getElementById('refresh-models-btn').addEventListener('click', loadOllamaModels);
    
    // 浮动AI按钮
    floatingAiBtn.addEventListener('click', showAiEditModal);
    
    // 编辑器文本选择
    editor.addEventListener('mouseup', handleTextSelection);
    editor.addEventListener('keyup', handleTextSelection);
    
    // 设置标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchSettingsTab(tab);
        });
    });
    
    // 语言切换
    document.getElementById('language-select').addEventListener('change', handleLanguageChange);
    document.getElementById('settings-language').addEventListener('change', (e) => {
        settings.language = e.target.value;
    });
    
    // 点击遮罩关闭模态框
    overlay.addEventListener('click', hideModal);
    
    // 键盘快捷键
    document.addEventListener('keydown', handleGlobalKeydown);
}

// 设置自动保存
function setupAutoSave() {
    autoSaveTimer = setInterval(() => {
        if (currentDocumentId && !isSaving) {
            saveCurrentDocument();
        }
    }, 2000);
}

// 加载文档列表
async function loadDocuments() {
    try {
        const response = await fetch('/api/documents');
        const documents = await response.json();
        
        renderDocumentList(documents);
        
        // 如果没有文档，创建一个新文档
        if (documents.length === 0) {
            await createNewDocument(true);
        } else {
            // 打开最新的文档
            await openDocument(documents[0].id);
        }
    } catch (error) {
        console.error('加载文档失败:', error);
        showNotification('加载文档失败', 'error');
    }
}

// 渲染文档列表
function renderDocumentList(documents) {
    documentList.innerHTML = '';
    
    documents.forEach(doc => {
        const docItem = document.createElement('div');
        docItem.className = 'document-item';
        docItem.dataset.id = doc.id;
        
        const date = new Date(doc.last_modified);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        docItem.innerHTML = `
            <div class="document-info">
                <div class="document-name">${doc.name}</div>
                <div class="document-meta">${formattedDate} ${formattedTime}</div>
            </div>
            <div class="document-actions">
                <button class="btn-icon" title="重命名" onclick="showRenameModal('${doc.id}', '${doc.name}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="删除" onclick="showDeleteModal('${doc.id}', '${doc.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        docItem.addEventListener('click', (e) => {
            if (!e.target.closest('.document-actions')) {
                openDocument(doc.id);
            }
        });
        
        documentList.appendChild(docItem);
    });
}

// 打开文档
async function openDocument(docId) {
    try {
        const response = await fetch(`/api/documents/${docId}`);
        const data = await response.json();
        
        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }
        
        // 保存当前文档
        if (currentDocumentId) {
            await saveCurrentDocument();
        }
        
        currentDocumentId = docId;
        editor.value = data.content || '';
        
        // 更新UI
        const docItem = document.querySelector(`[data-id="${docId}"]`);
        if (docItem) {
            currentDocName.textContent = docItem.querySelector('.document-name').textContent;
        }
        
        // 更新活动状态
        document.querySelectorAll('.document-item').forEach(item => {
            item.classList.remove('active');
        });
        docItem?.classList.add('active');
        
        updateSaveStatus('已保存');
        
    } catch (error) {
        console.error('打开文档失败:', error);
        showNotification('打开文档失败', 'error');
    }
}

// 创建新文档
async function createNewDocument(silent = false) {
    if (!silent) {
        const nameInput = document.getElementById('new-doc-name');
        const name = nameInput.value.trim() || '未命名文档';
        
        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name })
            });
            
            const data = await response.json();
            
            if (data.error) {
                showNotification(data.error, 'error');
                return;
            }
            
            hideModal();
            await loadDocuments();
            await openDocument(data.id);
            
        } catch (error) {
            console.error('创建文档失败:', error);
            showNotification('创建文档失败', 'error');
        }
    } else {
        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: '未命名文档' })
            });
            
            const data = await response.json();
            
            if (!data.error) {
                await loadDocuments();
                await openDocument(data.id);
            }
            
        } catch (error) {
            console.error('创建默认文档失败:', error);
        }
    }
}

// 保存当前文档
async function saveCurrentDocument() {
    if (!currentDocumentId) return;
    
    isSaving = true;
    updateSaveStatus('保存中...');
    
    try {
        const response = await fetch(`/api/documents/${currentDocumentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: editor.value })
        });
        
        const data = await response.json();
        
        if (data.success) {
            updateSaveStatus('已保存');
        } else {
            updateSaveStatus('保存失败');
            showNotification('保存失败', 'error');
        }
        
    } catch (error) {
        console.error('保存文档失败:', error);
        updateSaveStatus('保存失败');
        showNotification('保存文档失败', 'error');
    } finally {
        isSaving = false;
    }
}

// 重命名文档
async function renameDocument() {
    const nameInput = document.getElementById('rename-doc-input');
    const newName = nameInput.value.trim();
    
    if (!newName) {
        showNotification('请输入文档名称', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/documents/${currentDocumentId}/rename`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName })
        });
        
        const data = await response.json();
        
        if (data.success) {
            hideModal();
            await loadDocuments();
            if (data.new_id) {
                currentDocumentId = data.new_id;
            }
            currentDocName.textContent = newName;
            showNotification('重命名成功', 'success');
        } else {
            showNotification(data.error || '重命名失败', 'error');
        }
        
    } catch (error) {
        console.error('重命名文档失败:', error);
        showNotification('重命名文档失败', 'error');
    }
}

// 删除文档
async function deleteDocument() {
    try {
        const response = await fetch(`/api/documents/${currentDocumentId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            hideModal();
            await loadDocuments();
            
            // 清空编辑器
            editor.value = '';
            currentDocumentId = null;
            currentDocName.textContent = '未命名文档';
            
            showNotification('删除成功', 'success');
        } else {
            showNotification(data.error || '删除失败', 'error');
        }
        
    } catch (error) {
        console.error('删除文档失败:', error);
        showNotification('删除文档失败', 'error');
    }
}

// 处理编辑器输入
function handleEditorInput() {
    updateSaveStatus('未保存');
}

// 处理编辑器键盘事件
function handleEditorKeydown(e) {
    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCurrentDocument();
    }
}

// 处理全局键盘事件
function handleGlobalKeydown(e) {
    // Ctrl+N 新建文档
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showNewDocModal();
    }
}

// 处理文本选择
function handleTextSelection() {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();
    
    if (selectedText) {
        // 显示浮动AI按钮
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        floatingAiBtn.style.display = 'flex';
        floatingAiBtn.style.top = `${rect.top + window.scrollY - 40}px`;
        floatingAiBtn.style.left = `${rect.right + window.scrollX}px`;
    } else {
        floatingAiBtn.style.display = 'none';
    }
}

// 显示模态框
function showModal(modal) {
    modal.classList.add('show');
    overlay.classList.add('show');
}

// 隐藏模态框
function hideModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    overlay.classList.remove('show');
}

// 显示新建文档模态框
function showNewDocModal() {
    document.getElementById('new-doc-name').value = '';
    showModal(newDocModal);
}

// 显示重命名模态框
function showRenameModal(docId, docName) {
    currentDocumentId = docId;
    document.getElementById('rename-doc-input').value = docName;
    showModal(renameDocModal);
}

// 显示删除确认模态框
function showDeleteModal(docId, docName) {
    currentDocumentId = docId;
    document.getElementById('delete-doc-name').textContent = docName;
    showModal(deleteConfirmModal);
}

// 更新保存状态
function updateSaveStatus(status) {
    saveStatus.textContent = status;
    saveStatus.className = `save-status ${status === '保存中...' ? 'saving' : status === '已保存' ? 'saved' : ''}`;
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '4px',
        color: 'white',
        fontSize: '0.875rem',
        zIndex: '9999',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        backgroundColor: type === 'success' ? '#28a745' : 
                        type === 'error' ? '#dc3545' : 
                        type === 'warning' ? '#ffc107' : '#007bff'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 切换AI面板
function toggleAiPanel() {
    aiPanel.classList.toggle('collapsed');
    const icon = document.querySelector('#toggle-ai-panel i');
    icon.className = aiPanel.classList.contains('collapsed') ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
}

// 发送聊天消息
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chat-messages');
    
    // 添加用户消息
    addChatMessage(message, 'user');
    input.value = '';
    
    try {
        const serviceType = document.getElementById('ai-service-type').value;
        const model = document.getElementById('ai-model').value;
        const apiKey = document.getElementById('api-key').value;
        const apiUrl = document.getElementById('api-url').value;
        const ollamaUrl = document.getElementById('ollama-url').value;
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                model,
                service_type: serviceType,
                api_key: apiKey,
                api_url: apiUrl,
                ollama_url: ollamaUrl
            })
        });
        
        if (!response.ok) {
            throw new Error('请求失败');
        }
        
        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';
        
        // 创建助手消息容器
        const assistantMessageDiv = addChatMessage('', 'assistant');
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const json = JSON.parse(data);
                        if (json.content) {
                            assistantMessage += json.content;
                            assistantMessageDiv.textContent = assistantMessage;
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('发送消息失败:', error);
        addChatMessage('发送消息失败，请检查网络连接或设置', 'error');
    }
}

// 添加聊天消息
function addChatMessage(text, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

// 显示AI编辑模态框
function showAiEditModal() {
    if (!selectedText) {
        showNotification('请先选择文本', 'warning');
        return;
    }
    
    document.getElementById('selected-text-preview').textContent = selectedText;
    document.getElementById('ai-edit-instruction').value = '';
    document.getElementById('ai-edit-response').textContent = '';
    showModal(aiEditModal);
    
    // 隐藏浮动按钮
    floatingAiBtn.style.display = 'none';
}

// 应用AI编辑
async function applyAiEdit(action) {
    const response = document.getElementById('ai-edit-response').textContent;
    
    if (!response) {
        showNotification('请先生成AI回复', 'warning');
        return;
    }
    
    switch (action) {
        case 'replace':
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(response));
                selection.removeAllRanges();
            }
            break;
            
        case 'append':
            editor.value += '\n\n' + response;
            break;
            
        case 'copy':
            navigator.clipboard.writeText(response);
            showNotification('已复制到剪贴板', 'success');
            break;
    }
    
    hideModal();
    updateSaveStatus('未保存');
}

// 重新生成AI编辑
async function regenerateAiEdit() {
    const instruction = document.getElementById('ai-edit-instruction').value;
    
    if (!instruction) {
        showNotification('请输入编辑指令', 'warning');
        return;
    }
    
    try {
        const serviceType = document.getElementById('ai-service-type').value;
        const model = document.getElementById('ai-model').value;
        const apiKey = document.getElementById('api-key').value;
        const apiUrl = document.getElementById('api-url').value;
        const ollamaUrl = document.getElementById('ollama-url').value;
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `请根据以下指令处理这段文本：\n\n原文：${selectedText}\n\n指令：${instruction}`,
                model,
                service_type: serviceType,
                api_key: apiKey,
                api_url: apiUrl,
                ollama_url: ollamaUrl
            })
        });
        
        if (!response.ok) {
            throw new Error('请求失败');
        }
        
        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';
        
        const responseDiv = document.getElementById('ai-edit-response');
        responseDiv.textContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const json = JSON.parse(data);
                        if (json.content) {
                            aiResponse += json.content;
                            responseDiv.textContent = aiResponse;
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('生成AI回复失败:', error);
        showNotification('生成AI回复失败', 'error');
    }
}

// 加载设置
async function loadSettings() {
    try {
        const response = await fetch('/api/settings');
        settings = await response.json();
        
        // 应用设置
        document.getElementById('settings-language').value = settings.language || 'zh-CN';
        document.getElementById('language-select').value = settings.language || 'zh-CN';
        
        // 应用语言
        if (window.i18n) {
            window.i18n.setLanguage(settings.language || 'zh-CN');
        }
        
    } catch (error) {
        console.error('加载设置失败:', error);
        settings = {
            language: 'zh-CN',
            chatAiService: { type: 'online' },
            floatingAiService: { type: 'online' }
        };
    }
}

// 保存设置
async function saveSettings() {
    const newSettings = {
        language: document.getElementById('settings-language').value,
        chatAiService: {
            type: document.getElementById('settings-chat-service-type').value
        },
        floatingAiService: {
            type: document.getElementById('settings-floating-service-type').value
        }
    };
    
    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSettings)
        });
        
        const data = await response.json();
        
        if (data.success) {
            settings = newSettings;
            hideModal();
            showNotification('设置已保存', 'success');
            
            // 应用语言设置
            if (window.i18n) {
                window.i18n.setLanguage(settings.language);
            }
            
            // 重新加载设置
            await loadSettings();
        } else {
            showNotification('保存设置失败', 'error');
        }
        
    } catch (error) {
        console.error('保存设置失败:', error);
        showNotification('保存设置失败', 'error');
    }
}

// 保存AI设置
async function saveAiSettings() {
    const serviceType = document.getElementById('ai-service-type').value;
    const model = document.getElementById('ai-model').value;
    const apiKey = document.getElementById('api-key').value;
    const apiUrl = document.getElementById('api-url').value;
    const ollamaUrl = document.getElementById('ollama-url').value;
    
    // 保存到本地存储
    localStorage.setItem('aiServiceType', serviceType);
    localStorage.setItem('aiModel', model);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('ollamaUrl', ollamaUrl);
    
    showNotification('AI设置已保存', 'success');
}

// 加载AI设置
function loadAiSettings() {
    document.getElementById('ai-service-type').value = localStorage.getItem('aiServiceType') || 'online';
    document.getElementById('ai-model').value = localStorage.getItem('aiModel') || 'gpt-3.5-turbo';
    document.getElementById('api-key').value = localStorage.getItem('apiKey') || '';
    document.getElementById('api-url').value = localStorage.getItem('apiUrl') || 'https://api.openai.com/v1/chat/completions';
    document.getElementById('ollama-url').value = localStorage.getItem('ollamaUrl') || 'http://localhost:11434';
    
    handleAiServiceChange();
}

// 处理AI服务切换
function handleAiServiceChange() {
    const serviceType = document.getElementById('ai-service-type').value;
    
    if (serviceType === 'ollama') {
        document.getElementById('online-api-group').style.display = 'none';
        document.getElementById('api-key-group').style.display = 'none';
        document.getElementById('ollama-group').style.display = 'block';
        loadOllamaModels();
    } else {
        document.getElementById('online-api-group').style.display = 'block';
        document.getElementById('api-key-group').style.display = 'block';
        document.getElementById('ollama-group').style.display = 'none';
        loadOnlineModels();
    }
}

// 加载OLLAMA模型
async function loadOllamaModels() {
    const ollamaUrl = document.getElementById('ollama-url').value;
    const modelSelect = document.getElementById('ai-model');
    
    try {
        const response = await fetch(`/api/models?service=ollama&url=${encodeURIComponent(ollamaUrl)}`);
        const models = await response.json();
        
        modelSelect.innerHTML = '';
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });
        
        if (models.length === 0) {
            showNotification('无法连接到OLLAMA，请确保服务已启动', 'warning');
        }
        
    } catch (error) {
        console.error('加载OLLAMA模型失败:', error);
        showNotification('加载OLLAMA模型失败', 'error');
    }
}

// 加载在线模型
async function loadOnlineModels() {
    const modelSelect = document.getElementById('ai-model');
    
    try {
        const response = await fetch('/api/models?service=online');
        const models = await response.json();
        
        modelSelect.innerHTML = '';
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('加载在线模型失败:', error);
        showNotification('加载在线模型失败', 'error');
    }
}

// 显示设置模态框
function showSettingsModal() {
    // 加载当前设置到表单
    document.getElementById('settings-language').value = settings.language || 'zh-CN';
    document.getElementById('settings-chat-service-type').value = settings.chatAiService?.type || 'online';
    document.getElementById('settings-floating-service-type').value = settings.floatingAiService?.type || 'online';
    
    showModal(settingsModal);
}

// 切换设置标签
function switchSettingsTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-panel`).classList.add('active');
}

// 处理语言切换
function handleLanguageChange(e) {
    const language = e.target.value;
    
    // 更新设置
    settings.language = language;
    
    // 应用语言
    if (window.i18n) {
        window.i18n.setLanguage(language);
    }
    
    // 保存设置
    fetch('/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
    loadAiSettings();
});

// 导出到全局作用域（用于调试）
window.app = {
    currentDocumentId,
    saveCurrentDocument,
    loadDocuments,
    openDocument,
    createNewDocument,
    renameDocument,
    deleteDocument,
    sendChatMessage,
    showAiEditModal,
    applyAiEdit,
    regenerateAiEdit
};