from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import webbrowser
import threading
import time

# Your existing API key (you should move this to environment variables in production)
api_data = 'sk-proj-0W7UTSnEoJ8UVlJnwO1HT3BlbkFJW3V2wieIvVI7rMZNirBj'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

Model = "gpt-4o"
client = OpenAI(api_key=api_data)

def Reply(question):
    try:
        completion = client.chat.completions.create(
            model=Model,
            messages=[
                {'role': "system", "content": "You are a helpful assistant. Keep responses concise and friendly."},
                {'role': 'user', 'content': question}
            ],
            max_tokens=200
        )
        answer = completion.choices[0].message.content
        return answer
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"

def open_website_delayed(url):
    """Open website after a small delay to allow response to be sent"""
    time.sleep(0.5)
    webbrowser.open(url)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        question = data.get('message', '').lower()
        
        if not question:
            return jsonify({'error': 'No message provided'}), 400
        
        # Handle browser commands
        should_open_site = False
        site_url = ""
        
        if "open youtube" in question:
            should_open_site = True
            site_url = "https://www.youtube.com"
            response = "Opening YouTube for you!"
        elif "open google" in question:
            should_open_site = True
            site_url = "https://www.google.com"
            response = "Opening Google for you!"
        elif "bye" in question or "goodbye" in question:
            response = "Goodbye! Have a great day!"
        else:
            # Get AI response for other questions
            response = Reply(question)
        
        # Open website in background if needed
        if should_open_site:
            threading.Thread(target=open_website_delayed, args=(site_url,)).start()
        
        return jsonify({
            'response': response,
            'action': 'open_site' if should_open_site else None,
            'url': site_url if should_open_site else None
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'message': 'Voice Assistant API is running'})

if __name__ == '__main__':
    print("Starting Voice Assistant API server...")
    print("Server will be available at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)