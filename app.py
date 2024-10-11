from flask import Flask, request, jsonify, render_template
import joblib

# Load the saved model and vectorizer
model = joblib.load('fake_news_detection_model.pkl')
tfidf_vectorizer = joblib.load('tfidf_vectorizer.pkl')

app = Flask(__name__)

# Serve the frontend at the root endpoint
@app.route('/')
def index():
    return render_template('index.html')

# API to predict fake news
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    # Preprocess the input text using the loaded vectorizer
    text = [data['text']]
    transformed_text = tfidf_vectorizer.transform(text)
    
    # Make a prediction using the model
    prediction = model.predict(transformed_text)
    result = 'Fake' if prediction[0] == 'Fake' else 'Real'
    
    return jsonify({'prediction': result})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000)) 
    app.run(host='0.0.0.0', port=port)