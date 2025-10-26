# ⚡ Quick Start Guide - Plagiarism Checker

## 🚀 Super Fast Setup (5 minutes)

### Step 1: Create Project (Copy-Paste This)
```bash
# Create and navigate to project folder
mkdir plagiarism_checker && cd plagiarism_checker

# Create folder structure
mkdir templates static static/css static/js

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate
# OR (Mac/Linux)
source venv/bin/activate

# Install Flask
pip install Flask gunicorn
```

### Step 2: Create Files

**Create these 6 files exactly:**

1. ✅ `app.py` - I provided this code
2. ✅ `plagiarism_engine.py` - I provided this code
3. ✅ `templates/index.html` - I provided this code
4. ✅ `static/css/style.css` - I provided this code
5. ✅ `static/js/script.js` - I provided this code
6. ✅ `requirements.txt` - Create this:

```txt
Flask==3.0.0
gunicorn==21.2.0
```

### Step 3: Run Locally
```bash
python app.py
```

Open browser: **http://localhost:5000**

---

## 🌐 Deploy to Render (FREE - 3 minutes)

### Method 1: Direct from GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub (create repo first on github.com)
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

Then:
1. Go to **render.com** and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Settings:
   - Name: `my-plagiarism-checker`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:app`
5. Click **"Create Web Service"**

**Done!** Your app is live in 2-3 minutes! 🎉

---

## 📋 File Checklist

Make sure you have:
- [ ] `app.py`
- [ ] `plagiarism_engine.py`
- [ ] `requirements.txt`
- [ ] `templates/index.html`
- [ ] `static/css/style.css`
- [ ] `static/js/script.js`

---

## 🎨 Features of Your App

✨ **Futuristic UI:**
- Animated particle background
- Glowing neon effects
- Smooth animations
- Responsive design

🧠 **4 Algorithms:**
1. N-Gram Analysis (Jaccard Similarity)
2. Winnowing (Rabin-Karp Hash)
3. TF-IDF (Cosine Similarity)
4. Dynamic Programming (LCS)

⚡ **Interactive Features:**
- Real-time character count
- Progress animations
- Score visualization
- Keyboard shortcuts (Ctrl+Enter to analyze)

---

## 🎯 Testing Your App

### Test Cases:

**Test 1: High Similarity**
- Doc 1: "Machine learning is transforming artificial intelligence today"
- Doc 2: "Machine learning is transforming artificial intelligence today"
- Expected: ~100% similarity

**Test 2: Moderate Similarity**
- Doc 1: "Machine learning algorithms can process data efficiently"
- Doc 2: "AI systems process information using machine learning techniques"
- Expected: ~40-60% similarity

**Test 3: Low Similarity**
- Doc 1: "The weather is sunny today"
- Doc 2: "Python is a programming language"
- Expected: ~0-10% similarity

---

## 🐛 Troubleshooting

**Problem: "Flask not found"**
```bash
pip install Flask
```

**Problem: "Port 5000 in use"**
Change port in `app.py`:
```python
app.run(debug=True, port=8000)
