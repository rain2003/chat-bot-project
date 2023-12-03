from flask import Flask, jsonify, request
from flask_cors import CORS  
from bardapi import Bard  
import os

os.environ["_BARD_API_KEY"] = "Your API key"

app = Flask(__name__)
CORS(app)  

@app.route('/api', methods=["POST"])
def qa():
    if request.method == "POST":
        data = request.get_json()
        question = data.get("question")

        bard_response = Bard().get_answer(str(question))
        response = bard_response['content']

        response_data = {"question": question, "answer": response}
        return jsonify(response_data)

if __name__ == "__main__":
    app.run(debug=True)
