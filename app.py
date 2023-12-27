# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import pandas as pd  # Assuming you need pandas for processing the data before prediction

# app = Flask(__name__)
# CORS(app)

# # Load your machine learning model from the pkl file
# model = joblib.load('Resume Scanner.pkl')  # Replace 'your_model.pkl' with the actual path to your pkl file

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         # Assuming 'resume' and 'jobDescription' are the keys used in FormData on the frontend
#         resume_file = request.files['resume']
#         job_description_file = request.files['jobDescription']

#         # Process both files as needed, for example, convert them to strings
#         resume_content = resume_file.read().decode('utf-8')
#         job_description_content = job_description_file.read().decode('utf-8')

#         # You might need additional preprocessing here depending on your model requirements
#         # For example, tokenize and vectorize the text data before passing it to the model

#         # Create a DataFrame for your model input
#         input_data = pd.DataFrame({'resume_content': [resume_content], 'job_description_content': [job_description_content]})

#         # Make predictions using your machine learning model
#         match_score = model.predict(input_data)  # Replace with the actual prediction method of your model

#         # Return the match score as JSON
#         return jsonify({'matchScore': match_score})

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': 'Internal Server Error'}), 500
# @app.route('/')
# def check_server():
#     return 'Flask server is running!'

# if __name__ == '__main__':
#     app.run(debug=True,port=5001)
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from docx import Document
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)
CORS(app)

# Load your machine learning model from the pkl file
model = joblib.load('Resume Scanner.pkl')
vectorizer = joblib.load('Resume Scanner.pkl')
  

def read_docx(file):
    doc = Document(file)
    content = [paragraph.text for paragraph in doc.paragraphs]
    return '\n'.join(content)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Assuming 'resume' and 'jobDescription' are the keys used in FormData on the frontend
        resume_file = request.files['resume']
        job_description_file = request.files['jobDescription']

        # Read content from .doc files
        resume_content = read_docx(resume_file)
        job_description_content = read_docx(job_description_file)

        # Vectorize the content using CountVectorizer
        vectorizer = CountVectorizer()
        
        # Vectorize the resume content
        X_resume = vectorizer.transform([resume_content])
        
        # Vectorize the job description content
        X_job_description = vectorizer.transform([job_description_content])

        # Make predictions using your machine learning model
        match_score = model.predict(X_resume, X_job_description)  # Assuming your model supports two inputs

        # Return the match score as JSON
        return jsonify({'matchScore': match_score.tolist()})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/')
def check_server():
    return 'Flask server is running!'

if __name__ == '__main__':
    app.run(debug=True, port=5001)


