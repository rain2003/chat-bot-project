from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import json
from mtranslate import translate
from parrot import Parrot
import warnings
nahihua = "I'm sorry, I don't understand that."
# Suppress warnings
warnings.filterwarnings("ignore")

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS
# Load your custom JSON data for responses
try:
    with open('response.json', 'r', encoding='utf-8') as file:
        responses_data = json.load(file)
except FileNotFoundError:
    responses_data = {'intents': []}

# Initialize the recognizer
r = sr.Recognizer()

# Initialize Parrot Paraphrase model
parrot = Parrot(model_tag="prithivida/parrot_paraphraser_on_T5")

# Function to translate text to English
def translate_to_english(text):
    try:
        translated_text = translate(text, 'en')
        return translated_text if translated_text else text  # Return the translated text if available, else return the original text
    except Exception as e:
        print(f"Translation error: {e}")
        return None  # Return None if translation fails

# Function to paraphrase text using Parrot Paraphrase
def paraphrase_text(text):
    try:
        para_phrases = parrot.augment(input_phrase=text, use_gpu=False)
        if para_phrases:
            return para_phrases[0][0]  # Return only the paraphrased text
        else:
            print("Paraphrasing failed: No paraphrases generated.")
            return text  # Return the original text
    except Exception as e:
        print(f"Paraphrasing error: {e}")
        return text  # Return the original text in case of error

# Function to check if a pattern is present in the user input
def is_pattern_present(patterns, user_input):
    return any(pattern.lower() in user_input.lower() for pattern in patterns)

# Function to get the response based on user input
# Function to get the response based on user input
# Function to get the response based on user input
def get_response(user_input):
    global neededtext
    user_input_str = str(user_input)  # Convert user input to string

    if not user_input_str:
        return [nahihua], user_input_str

    user_input_english = translate_to_english(user_input_str)
    if user_input_english is None:
        return [nahihua], user_input_str

    for intent in responses_data['intents']:
        if is_pattern_present(intent['patterns'], user_input_english):
            return intent['responses'], user_input_str

    # Translate the default response to English
    translated_default_response = translate_to_english(nahihua)

    # Check if translation failed
    if translated_default_response is None:
        return [nahihua], user_input_str
    else:
        # Store translated text in global variable
        neededtext = translated_default_response
        return [translated_default_response], user_input_str



# Define API endpoint to handle messages
@app.route('/api', methods=['POST'])
def handle_message():
    data = request.json
    message = data.get('question')
    
    responses, _ = get_response(message)
    translateText = translate_to_english(message)
    print(translateText)
    if (translateText == message and responses[0] == nahihua):
        return jsonify({'answer' : nahihua})
    elif (responses[0] == nahihua):
        return jsonify({'answer':translateText})
    return jsonify({'answer': responses[0]})

if __name__ == '__main__':
    app.run(port=5000)
