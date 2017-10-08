from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/data', methods=['GET', 'POST'])
def add_message():
    content = request.get_json()
    print content
    return 'OK'

if __name__ == "__main__":
    app.run()