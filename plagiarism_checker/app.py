from flask import Flask, render_template, request, jsonify
from plagiarism_engine import PlagiarismChecker
import os

app = Flask(__name__)
checker = PlagiarismChecker()

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/check', methods=['POST'])
def check_plagiarism():
    """API endpoint for plagiarism checking"""
    try:
        data = request.get_json()
        text1 = data.get('text1', '')
        text2 = data.get('text2', '')
        
        if not text1 or not text2:
            return jsonify({'error': 'Both documents are required'}), 400
        
        # Run plagiarism check
        results = checker.comprehensive_check(text1, text2)
        
        # Convert to percentage and format
        response = {
            'success': True,
            'results': {
                'ngramSimilarity': round(results['ngram_similarity'] * 100, 2),
                'fingerprintSimilarity': round(results['fingerprint_similarity'] * 100, 2),
                'cosineSimilarity': round(results['cosine_similarity'] * 100, 2),
                'longestCommonWords': results['longest_common_words'],
                'longestCommonText': results['longest_common_text'],
                'overallScore': round(results['overall_score'] * 100, 2)
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)