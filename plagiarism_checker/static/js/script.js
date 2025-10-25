/* ============================================================================
   FUTURISTIC PLAGIARISM CHECKER - JAVASCRIPT
   Save as: static/js/script.js
   ============================================================================ */

// ============================================================================
// PARTICLE ANIMATION
// ============================================================================

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============================================================================
// CHARACTER COUNTER
// ============================================================================

const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const count1 = document.getElementById('count1');
const count2 = document.getElementById('count2');

function updateCharCount() {
    count1.textContent = `${text1.value.length} characters`;
    count2.textContent = `${text2.value.length} characters`;
}

text1.addEventListener('input', updateCharCount);
text2.addEventListener('input', updateCharCount);

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

async function checkPlagiarism() {
    const doc1 = text1.value.trim();
    const doc2 = text2.value.trim();

    if (!doc1 || !doc2) {
        showNotification('Please enter text in both documents!', 'error');
        return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';

    try {
        const response = await fetch('/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text1: doc1,
                text2: doc2
            })
        });

        const data = await response.json();

        if (data.success) {
            setTimeout(() => {
                displayResults(data.results);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('results').style.display = 'block';
            }, 1500);
        } else {
            throw new Error(data.error || 'Analysis failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error analyzing documents. Please try again.', 'error');
        document.getElementById('loading').style.display = 'none';
    }
}

function displayResults(results) {
    // Update overall score
    const overallScore = results.overallScore;
    const scoreElement = document.getElementById('overallScore');
    const scoreCircle = document.getElementById('scoreCircle');
    
    scoreElement.textContent = `${overallScore.toFixed(1)}%`;
    
    // Animate circle
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (overallScore / 100) * circumference;
    scoreCircle.style.strokeDashoffset = offset;
    
    // Update verdict
    updateVerdict(overallScore);
    
    // Update metrics
    updateMetric('ngram', results.ngramSimilarity);
    updateMetric('fingerprint', results.fingerprintSimilarity);
    updateMetric('cosine', results.cosineSimilarity);
    
    // Update common words
    document.getElementById('commonWords').textContent = results.longestCommonWords;
    const commonPercent = Math.min((results.longestCommonWords / 20) * 100, 100);
    document.getElementById('commonBar').style.width = `${commonPercent}%`;
    
    // Update common text
    document.getElementById('commonText').textContent = results.longestCommonText;
}

function updateMetric(name, value) {
    const scoreElement = document.getElementById(`${name}Score`);
    const barElement = document.getElementById(`${name}Bar`);
    
    scoreElement.textContent = `${value.toFixed(1)}%`;
    barElement.style.width = `${value}%`;
}

function updateVerdict(score) {
    const titleElement = document.getElementById('verdictTitle');
    const textElement = document.getElementById('verdictText');
    
    if (score > 70) {
        titleElement.textContent = '⚠️ High Similarity Detected';
        titleElement.style.color = 'var(--danger)';
        textElement.textContent = 'Significant content overlap detected. High likelihood of plagiarism.';
    } else if (score > 30) {
        titleElement.textContent = '⚡ Moderate Similarity';
        titleElement.style.color = 'var(--warning)';
        textElement.textContent = 'Some common content detected. Possible paraphrasing or shared references.';
    } else {
        titleElement.textContent = '✅ Low Similarity';
        titleElement.style.color = 'var(--success)';
        textElement.textContent = 'Documents are mostly original with minimal overlap.';
    }
}

function loadSample() {
    text1.value = `Artificial intelligence is transforming the world. Machine learning algorithms can now process vast amounts of data and find patterns that humans might miss. Deep learning networks have revolutionized computer vision and natural language processing. These technologies are being applied in healthcare, finance, education, and many other fields.`;

    text2.value = `Machine learning algorithms can process vast amounts of data and identify patterns. Artificial intelligence is changing how we work and live. Deep learning has made significant advances in computer vision and language understanding. The impact of AI is being felt across healthcare, financial services, and education sectors.`;

    updateCharCount();
    showNotification('Sample documents loaded successfully!', 'success');
}

function clearAll() {
    text1.value = '';
    text2.value = '';
    document.getElementById('results').style.display = 'none';
    updateCharCount();
    showNotification('All data cleared!', 'success');
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'error' ? '❌' : '✅'}</span>
        <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(10, 14, 39, 0.95);
            border: 2px solid;
            border-radius: 10px;
            padding: 15px 25px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .notification-success {
            border-color: var(--success);
        }

        .notification-error {
            border-color: var(--danger);
        }

        .notification-icon {
            font-size: 1.5em;
        }

        .notification-message {
            color: var(--light);
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.1em;
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// ============================================================================
// ADD SVG GRADIENT DEFINITION
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    const svg = document.querySelector('.score-svg');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'scoreGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#00f0ff;stop-opacity:1');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#7b2ff7;stop-opacity:1');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
    }
});

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        checkPlagiarism();
    }
    
    // Ctrl/Cmd + L to load sample
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        loadSample();
    }
    
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearAll();
    }
});

// ============================================================================
// SMOOTH SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all metric cards
document.querySelectorAll('.metric-card, .algo-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

console.log('%c🚀 Plagiarism Checker AI Initialized', 'color: #00f0ff; font-size: 16px; font-weight: bold;');
console.log('%cKeyboard Shortcuts:', 'color: #7b2ff7; font-size: 14px; font-weight: bold;');
console.log('%c• Ctrl/Cmd + Enter: Analyze', 'color: #8892b0; font-size: 12px;');
console.log('%c• Ctrl/Cmd + L: Load Sample', 'color: #8892b0; font-size: 12px;');
console.log('%c• Ctrl/Cmd + K: Clear All', 'color: #8892b0; font-size: 12px;');