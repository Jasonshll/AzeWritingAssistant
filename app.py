import os
import json
import uuid
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_from_directory
import webbrowser
import threading
import time
import werkzeug.serving

app = Flask(__name__)

# 配置
DOCUMENTS_DIR = 'documents'
if not os.path.exists(DOCUMENTS_DIR):
    os.makedirs(DOCUMENTS_DIR)

# 全局变量
current_documents = {}

# 路由定义
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/documents', methods=['GET'])
def get_documents():
    """获取所有文档列表"""
    documents = []
    for filename in os.listdir(DOCUMENTS_DIR):
        if filename.endswith('.txt'):
            file_path = os.path.join(DOCUMENTS_DIR, filename)
            stat = os.stat(file_path)
            documents.append({
                'id': filename.replace('.txt', ''),
                'name': filename.replace('.txt', '').replace('_', ' '),
                'last_modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'size': stat.st_size
            })
    
    # 按最后修改时间排序
    documents.sort(key=lambda x: x['last_modified'], reverse=True)
    return jsonify(documents)

@app.route('/api/documents/<doc_id>', methods=['GET'])
def get_document(doc_id):
    """获取单个文档内容"""
    filename = f"{doc_id}.txt"
    file_path = os.path.join(DOCUMENTS_DIR, filename)
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'Document not found'}), 404
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    return jsonify({'content': content})

@app.route('/api/documents/<doc_id>', methods=['POST'])
def save_document(doc_id):
    """保存文档内容"""
    try:
        data = request.get_json()
        content = data.get('content', '')
        
        filename = f"{doc_id}.txt"
        file_path = os.path.join(DOCUMENTS_DIR, filename)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents', methods=['POST'])
def create_document():
    """创建新文档"""
    try:
        data = request.get_json()
        name = data.get('name', '未命名文档')
        
        # 生成唯一ID
        doc_id = str(uuid.uuid4())
        filename = f"{doc_id}.txt"
        file_path = os.path.join(DOCUMENTS_DIR, filename)
        
        # 创建空文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('')
        
        return jsonify({'id': doc_id, 'name': name})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/<doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    """删除文档"""
    try:
        filename = f"{doc_id}.txt"
        file_path = os.path.join(DOCUMENTS_DIR, filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Document not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/<doc_id>/rename', methods=['PUT'])
def rename_document(doc_id):
    """重命名文档"""
    try:
        data = request.get_json()
        new_name = data.get('name')
        
        if not new_name:
            return jsonify({'error': 'Name is required'}), 400
        
        old_filename = f"{doc_id}.txt"
        old_path = os.path.join(DOCUMENTS_DIR, old_filename)
        
        # 生成新的ID（基于新名称）
        new_id = new_name.replace(' ', '_')
        new_filename = f"{new_id}.txt"
        new_path = os.path.join(DOCUMENTS_DIR, new_filename)
        
        # 检查新文件名是否已存在
        if os.path.exists(new_path) and old_path != new_path:
            return jsonify({'error': 'A document with this name already exists'}), 400
        
        # 重命名文件
        if os.path.exists(old_path):
            os.rename(old_path, new_path)
            return jsonify({'success': True, 'new_id': new_id})
        else:
            return jsonify({'error': 'Document not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models')
def get_models():
    """获取可用AI模型"""
    service_type = request.args.get('service', 'online')
    
    if service_type == 'ollama':
        try:
            import requests
            ollama_url = request.args.get('url', 'http://localhost:11434')
            response = requests.get(f"{ollama_url}/api/tags", timeout=5)
            
            if response.status_code == 200:
                models = response.json().get('models', [])
                return jsonify([{'id': m['name'], 'name': m['name']} for m in models])
            else:
                return jsonify([])
        except Exception as e:
            return jsonify([])
    else:
        # 在线模型列表
        models = [
            {'id': 'gpt-3.5-turbo', 'name': 'GPT-3.5 Turbo'},
            {'id': 'gpt-4', 'name': 'GPT-4'},
            {'id': 'gpt-4-turbo', 'name': 'GPT-4 Turbo'},
            {'id': 'claude-3-haiku', 'name': 'Claude 3 Haiku'},
            {'id': 'claude-3-sonnet', 'name': 'Claude 3 Sonnet'},
            {'id': 'claude-3-opus', 'name': 'Claude 3 Opus'}
        ]
        return jsonify(models)

@app.route('/api/chat', methods=['POST'])
def chat():
    """AI聊天接口"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        model = data.get('model', 'gpt-3.5-turbo')
        service_type = data.get('service_type', 'online')
        api_key = data.get('api_key', '')
        api_url = data.get('api_url', 'https://api.openai.com/v1/chat/completions')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        if service_type == 'ollama':
            # 使用本地OLLAMA
            import requests
            ollama_url = data.get('ollama_url', 'http://localhost:11434')
            
            ollama_payload = {
                'model': model,
                'prompt': message,
                'stream': True
            }
            
            def generate():
                try:
                    response = requests.post(
                        f"{ollama_url}/api/generate",
                        json=ollama_payload,
                        stream=True,
                        timeout=30
                    )
                    
                    for line in response.iter_lines():
                        if line:
                            try:
                                decoded_line = line.decode('utf-8')
                                json_data = json.loads(decoded_line)
                                if 'response' in json_data:
                                    yield f"data: {json.dumps({'content': json_data['response']})}\n\n"
                            except:
                                continue
                    
                    yield "data: [DONE]\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
            return app.response_class(generate(), mimetype='text/plain')
        
        else:
            # 使用在线API
            if not api_key:
                # 演示模式，返回模拟数据
                def generate_demo():
                    demo_response = "这是一个演示响应。在实际使用中，请配置您的API密钥或使用本地OLLAMA服务。"
                    for char in demo_response:
                        yield f"data: {json.dumps({'content': char})}\n\n"
                        time.sleep(0.05)
                    yield "data: [DONE]\n\n"
                
                return app.response_class(generate_demo(), mimetype='text/plain')
            
            # 实际API调用
            import requests
            
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'model': model,
                'messages': [
                    {'role': 'user', 'content': message}
                ],
                'stream': True
            }
            
            def generate():
                try:
                    response = requests.post(
                        api_url,
                        headers=headers,
                        json=payload,
                        stream=True,
                        timeout=30
                    )
                    
                    for line in response.iter_lines():
                        if line:
                            decoded_line = line.decode('utf-8')
                            if decoded_line.startswith('data: '):
                                yield f"{decoded_line}\n\n"
                    
                    yield "data: [DONE]\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
            return app.response_class(generate(), mimetype='text/plain')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['GET'])
def get_settings():
    """获取用户设置"""
    try:
        settings_file = 'settings.json'
        if os.path.exists(settings_file):
            with open(settings_file, 'r', encoding='utf-8') as f:
                settings = json.load(f)
        else:
            settings = {
                'language': 'zh-CN',
                'chatAiService': {'type': 'online'},
                'floatingAiService': {'type': 'online'}
            }
        
        return jsonify(settings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['POST'])
def save_settings():
    """保存用户设置"""
    try:
        settings = request.get_json()
        
        with open('settings.json', 'w', encoding='utf-8') as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shutdown', methods=['POST'])
def shutdown():
    """关闭服务器"""
    def shutdown_server():
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()
    
    shutdown_server()
    return jsonify({'message': 'Server shutting down...'})

if __name__ == '__main__':
    def open_browser():
        time.sleep(1.5)
        webbrowser.open('http://localhost:5000')
    
    # 在新线程中打开浏览器
    threading.Thread(target=open_browser, daemon=True).start()
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        print("程序已关闭")