from flask import Flask, render_template, request, Response, redirect, url_for
import subprocess, os, shlex

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

# ---------- Pair route ----------
@app.route("/pair", methods=["POST"])
def pair():
    phone = request.form["phone"]
    cmd   = f"node sender.js pair {phone}"
    # stdout को रियल-टाइम दिखाने के लिये streaming response
    def generate():
        with subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE, text=True) as p:
            for line in p.stdout:
                yield line.replace("\n","<br>")  # HTML line-break
    return Response(generate(), mimetype="text/html")

# ---------- Send route ----------
@app.route("/send", methods=["POST"])
def send():
    target  = request.form["target"]
    header  = request.form["header"]
    delay   = request.form["delay"]
    mf      = request.files["message_file"]
    file_path = "messages.txt"
    mf.save(file_path)

    subprocess.Popen([
        "node", "sender.js",
        "send", target, header, delay, file_path
    ])
    return "मैसेज भेजना शुरू ✔️ — लॉग Render-logs में दिखेंगे!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
