// 国际化支持
window.i18n = {
    currentLanguage: 'zh-CN',
    
    translations: {
        'zh-CN': {
            // 通用
            'save': '保存',
            'cancel': '取消',
            'confirm': '确认',
            'delete': '删除',
            'rename': '重命名',
            'create': '创建',
            'edit': '编辑',
            'close': '关闭',
            'settings': '设置',
            'language': '语言',
            'loading': '加载中...',
            'error': '错误',
            'success': '成功',
            'warning': '警告',
            'info': '信息',
            
            // 文档相关
            'documents': '文档',
            'new_document': '新建文档',
            'document_name': '文档名称',
            'untitled_document': '未命名文档',
            'open_document': '打开文档',
            'save_document': '保存文档',
            'delete_document': '删除文档',
            'rename_document': '重命名文档',
            'document_deleted': '文档已删除',
            'document_saved': '文档已保存',
            'document_created': '文档已创建',
            'document_renamed': '文档已重命名',
            'save_failed': '保存失败',
            'load_failed': '加载失败',
            'create_failed': '创建失败',
            'delete_failed': '删除失败',
            'rename_failed': '重命名失败',
            
            // 编辑器
            'editor': '编辑器',
            'content': '内容',
            'auto_save': '自动保存',
            'unsaved': '未保存',
            'saving': '保存中...',
            'saved': '已保存',
            
            // AI相关
            'ai_assistant': 'AI助手',
            'chat_with_ai': '与AI聊天',
            'send_message': '发送消息',
            'type_message': '输入消息...',
            'ai_response': 'AI回复',
            'ai_edit': 'AI编辑',
            'ai_settings': 'AI设置',
            'select_text_for_ai': '选择文本以使用AI功能',
            'ai_service': 'AI服务',
            'ai_model': 'AI模型',
            'api_key': 'API密钥',
            'api_url': 'API地址',
            'ollama_url': 'OLLAMA地址',
            'online_service': '在线服务',
            'local_service': '本地服务',
            'refresh_models': '刷新模型',
            'regenerate': '重新生成',
            'replace_text': '替换原文',
            'append_text': '追加到末尾',
            'copy_to_clipboard': '复制到剪贴板',
            'selected_text': '选中文本',
            'edit_instruction': '编辑指令',
            'ai_processing': 'AI处理中...',
            'ai_error': 'AI处理失败',
            
            // 设置
            'general_settings': '通用设置',
            'ai_settings': 'AI设置',
            'appearance': '外观',
            'theme': '主题',
            'dark_mode': '深色模式',
            'light_mode': '浅色模式',
            'auto_mode': '自动模式',
            'language_settings': '语言设置',
            'system_language': '系统语言',
            'english': '英文',
            'chinese': '中文',
            'settings_saved': '设置已保存',
            'settings_failed': '设置保存失败',
            
            // 模态框
            'confirm_delete': '确认删除',
            'delete_confirmation': '确定要删除文档 "{name}" 吗？此操作无法撤销。',
            'enter_new_name': '请输入新的文档名称',
            'create_new_document': '创建新文档',
            'document_name_placeholder': '请输入文档名称',
            
            // 快捷键
            'shortcuts': '快捷键',
            'ctrl_s_save': 'Ctrl+S 保存',
            'ctrl_n_new': 'Ctrl+N 新建',
            'ctrl_d_delete': 'Ctrl+D 删除',
            'esc_close': 'ESC 关闭',
            
            // 通知
            'notification': '通知',
            'operation_completed': '操作完成',
            'operation_failed': '操作失败',
            'network_error': '网络错误',
            'please_check_network': '请检查网络连接',
            'invalid_input': '输入无效',
            'please_enter_name': '请输入名称',
            'name_too_long': '名称过长',
            'name_exists': '名称已存在',
            
            // 时间
            'just_now': '刚刚',
            'minutes_ago': '{count}分钟前',
            'hours_ago': '{count}小时前',
            'days_ago': '{count}天前',
            'weeks_ago': '{count}周前',
            'months_ago': '{count}个月前',
            'years_ago': '{count}年前',
            
            // 文件操作
            'export': '导出',
            'import': '导入',
            'download': '下载',
            'upload': '上传',
            'file_format': '文件格式',
            'text_file': '文本文件',
            'markdown_file': 'Markdown文件',
            'json_file': 'JSON文件',
            'csv_file': 'CSV文件',
            
            // 帮助
            'help': '帮助',
            'about': '关于',
            'version': '版本',
            'contact': '联系',
            'feedback': '反馈',
            'documentation': '文档',
            'tutorial': '教程',
            'tips': '提示',
            
            // 状态
            'ready': '就绪',
            'processing': '处理中',
            'completed': '完成',
            'failed': '失败',
            'retry': '重试',
            'cancel': '取消',
            'continue': '继续',
            'back': '返回',
            'next': '下一步',
            'previous': '上一步',
            
            // 其他
            'welcome': '欢迎使用阿泽码字助手',
            'getting_started': '开始使用',
            'quick_tour': '快速导览',
            'features': '功能特性',
            'no_documents': '暂无文档',
            'create_first_document': '创建第一个文档开始写作吧！',
            'loading_documents': '正在加载文档...',
            'empty_editor': '选择一个文档开始编辑',
            'drag_drop': '拖拽文件到此处上传',
            'or_click_to_select': '或点击选择文件',
            'max_file_size': '最大文件大小',
            'supported_formats': '支持格式',
            'file_count': '文件数量',
            'total_size': '总大小',
            'last_modified': '最后修改',
            'created_time': '创建时间',
            'file_size': '文件大小',
            'character_count': '字符数',
            'word_count': '字数',
            'line_count': '行数',
            'reading_time': '阅读时间',
            'estimated_reading_time': '预计阅读时间'
        },
        
        'en-US': {
            // Common
            'save': 'Save',
            'cancel': 'Cancel',
            'confirm': 'Confirm',
            'delete': 'Delete',
            'rename': 'Rename',
            'create': 'Create',
            'edit': 'Edit',
            'close': 'Close',
            'settings': 'Settings',
            'language': 'Language',
            'loading': 'Loading...',
            'error': 'Error',
            'success': 'Success',
            'warning': 'Warning',
            'info': 'Info',
            
            // Document related
            'documents': 'Documents',
            'new_document': 'New Document',
            'document_name': 'Document Name',
            'untitled_document': 'Untitled Document',
            'open_document': 'Open Document',
            'save_document': 'Save Document',
            'delete_document': 'Delete Document',
            'rename_document': 'Rename Document',
            'document_deleted': 'Document deleted',
            'document_saved': 'Document saved',
            'document_created': 'Document created',
            'document_renamed': 'Document renamed',
            'save_failed': 'Save failed',
            'load_failed': 'Load failed',
            'create_failed': 'Create failed',
            'delete_failed': 'Delete failed',
            'rename_failed': 'Rename failed',
            
            // Editor
            'editor': 'Editor',
            'content': 'Content',
            'auto_save': 'Auto Save',
            'unsaved': 'Unsaved',
            'saving': 'Saving...',
            'saved': 'Saved',
            
            // AI related
            'ai_assistant': 'AI Assistant',
            'chat_with_ai': 'Chat with AI',
            'send_message': 'Send Message',
            'type_message': 'Type your message...',
            'ai_response': 'AI Response',
            'ai_edit': 'AI Edit',
            'ai_settings': 'AI Settings',
            'select_text_for_ai': 'Select text to use AI features',
            'ai_service': 'AI Service',
            'ai_model': 'AI Model',
            'api_key': 'API Key',
            'api_url': 'API URL',
            'ollama_url': 'OLLAMA URL',
            'online_service': 'Online Service',
            'local_service': 'Local Service',
            'refresh_models': 'Refresh Models',
            'regenerate': 'Regenerate',
            'replace_text': 'Replace Original',
            'append_text': 'Append to End',
            'copy_to_clipboard': 'Copy to Clipboard',
            'selected_text': 'Selected Text',
            'edit_instruction': 'Edit Instruction',
            'ai_processing': 'AI processing...',
            'ai_error': 'AI processing failed',
            
            // Settings
            'general_settings': 'General Settings',
            'ai_settings': 'AI Settings',
            'appearance': 'Appearance',
            'theme': 'Theme',
            'dark_mode': 'Dark Mode',
            'light_mode': 'Light Mode',
            'auto_mode': 'Auto Mode',
            'language_settings': 'Language Settings',
            'system_language': 'System Language',
            'english': 'English',
            'chinese': 'Chinese',
            'settings_saved': 'Settings saved',
            'settings_failed': 'Settings save failed',
            
            // Modal
            'confirm_delete': 'Confirm Delete',
            'delete_confirmation': 'Are you sure you want to delete document "{name}"? This action cannot be undone.',
            'enter_new_name': 'Please enter new document name',
            'create_new_document': 'Create New Document',
            'document_name_placeholder': 'Please enter document name',
            
            // Shortcuts
            'shortcuts': 'Shortcuts',
            'ctrl_s_save': 'Ctrl+S Save',
            'ctrl_n_new': 'Ctrl+N New',
            'ctrl_d_delete': 'Ctrl+D Delete',
            'esc_close': 'ESC Close',
            
            // Notifications
            'notification': 'Notification',
            'operation_completed': 'Operation completed',
            'operation_failed': 'Operation failed',
            'network_error': 'Network error',
            'please_check_network': 'Please check your network connection',
            'invalid_input': 'Invalid input',
            'please_enter_name': 'Please enter a name',
            'name_too_long': 'Name too long',
            'name_exists': 'Name already exists',
            
            // Time
            'just_now': 'Just now',
            'minutes_ago': '{count} minutes ago',
            'hours_ago': '{count} hours ago',
            'days_ago': '{count} days ago',
            'weeks_ago': '{count} weeks ago',
            'months_ago': '{count} months ago',
            'years_ago': '{count} years ago',
            
            // File operations
            'export': 'Export',
            'import': 'Import',
            'download': 'Download',
            'upload': 'Upload',
            'file_format': 'File Format',
            'text_file': 'Text File',
            'markdown_file': 'Markdown File',
            'json_file': 'JSON File',
            'csv_file': 'CSV File',
            
            // Help
            'help': 'Help',
            'about': 'About',
            'version': 'Version',
            'contact': 'Contact',
            'feedback': 'Feedback',
            'documentation': 'Documentation',
            'tutorial': 'Tutorial',
            'tips': 'Tips',
            
            // Status
            'ready': 'Ready',
            'processing': 'Processing',
            'completed': 'Completed',
            'failed': 'Failed',
            'retry': 'Retry',
            'cancel': 'Cancel',
            'continue': 'Continue',
            'back': 'Back',
            'next': 'Next',
            'previous': 'Previous',
            
            // Other
            'welcome': 'Welcome to Aze Writing Assistant',
            'getting_started': 'Getting Started',
            'quick_tour': 'Quick Tour',
            'features': 'Features',
            'no_documents': 'No documents',
            'create_first_document': 'Create your first document to start writing!',
            'loading_documents': 'Loading documents...',
            'empty_editor': 'Select a document to start editing',
            'drag_drop': 'Drag and drop files here to upload',
            'or_click_to_select': 'or click to select files',
            'max_file_size': 'Max file size',
            'supported_formats': 'Supported formats',
            'file_count': 'File count',
            'total_size': 'Total size',
            'last_modified': 'Last modified',
            'created_time': 'Created time',
            'file_size': 'File size',
            'character_count': 'Character count',
            'word_count': 'Word count',
            'line_count': 'Line count',
            'reading_time': 'Reading time',
            'estimated_reading_time': 'Estimated reading time'
        }
    },
    
    init: function() {
        // 从设置中加载语言
        this.loadLanguage();
        this.applyTranslations();
    },
    
    loadLanguage: function() {
        // 尝试从本地存储加载语言设置
        const savedLanguage = localStorage.getItem('language') || 
                            navigator.language || 
                            'zh-CN';
        
        // 确保语言是支持的
        if (!this.translations[savedLanguage]) {
            this.currentLanguage = 'zh-CN';
        } else {
            this.currentLanguage = savedLanguage;
        }
    },
    
    setLanguage: function(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            this.applyTranslations();
        }
    },
    
    getLanguage: function() {
        return this.currentLanguage;
    },
    
    t: function(key, params = {}) {
        const translation = this.translations[this.currentLanguage][key] || 
                          this.translations['zh-CN'][key] || 
                          key;
        
        // 简单的参数替换
        return translation.replace(/\{([^}]+)\}/g, (match, param) => {
            return params[param] || match;
        });
    },
    
    applyTranslations: function() {
        // 应用所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // 应用带有 data-i18n-title 的元素
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // 应用带有 data-i18n-value 的元素
        document.querySelectorAll('[data-i18n-value]').forEach(element => {
            const key = element.getAttribute('data-i18n-value');
            element.value = this.t(key);
        });
    },
    
    // 动态翻译函数
    translate: function(key, params = {}) {
        return this.t(key, params);
    },
    
    // 获取所有支持的语言
    getSupportedLanguages: function() {
        return Object.keys(this.translations);
    }
};

// 初始化国际化
document.addEventListener('DOMContentLoaded', function() {
    window.i18n.init();
});

// 导出到全局作用域
window.i18n = window.i18n;