from flask import Flask, render_template, request
import subprocess
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/send', methods=['POST'])
def send():
    target = request.form['target']
    header = request.form['header']
    delay = request.form['delay']
    message_file = request.files['message_file']
    
    # Save uploaded file
    file_path = f'messages.txt'
    message_file.save(file_path)

    # Call Node script
    subprocess.Popen([
        'node', 'sender.js',
        target, header, delay, file_path
    ])

    return 'Message sending started!'

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
