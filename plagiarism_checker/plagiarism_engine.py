import re
from collections import Counter, defaultdict
from typing import List, Set, Tuple, Dict
import math

class PlagiarismChecker:
    """Multi-algorithm plagiarism detection system"""
    
    def __init__(self):
        self.documents = {}
    
    def preprocess(self, text: str) -> List[str]:
        """Tokenize and clean text"""
        text = re.sub(r'[^\w\s]', '', text.lower())
        words = text.split()
        return [w for w in words if w]
    
    def get_ngrams(self, words: List[str], n: int = 3) -> Set[str]:
        """Generate n-grams from word list"""
        ngrams = set()
        for i in range(len(words) - n + 1):
            ngram = ' '.join(words[i:i+n])
            ngrams.add(ngram)
        return ngrams
    
    def jaccard_similarity(self, set1: Set, set2: Set) -> float:
        """Calculate Jaccard similarity coefficient"""
        if not set1 or not set2:
            return 0.0
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        return intersection / union if union > 0 else 0.0
    
    def check_ngram_similarity(self, text1: str, text2: str, n: int = 3) -> float:
        """Compare two texts using n-gram overlap"""
        words1 = self.preprocess(text1)
        words2 = self.preprocess(text2)
        ngrams1 = self.get_ngrams(words1, n)
        ngrams2 = self.get_ngrams(words2, n)
        return self.jaccard_similarity(ngrams1, ngrams2)
    
    def rolling_hash(self, words: List[str], window_size: int = 5) -> List[int]:
        """Generate rolling hash fingerprints"""
        base = 101
        mod = 10**9 + 7
        hashes = []
        
        for i in range(len(words) - window_size + 1):
            window = words[i:i+window_size]
            h = 0
            for j, word in enumerate(window):
                h = (h + hash(word) * pow(base, j, mod)) % mod
            hashes.append(h)
        
        return hashes
    
    def winnowing(self, hashes: List[int], window: int = 4) -> Set[int]:
        """Select minimum hash in each window"""
        fingerprints = set()
        for i in range(len(hashes) - window + 1):
            min_hash = min(hashes[i:i+window])
            fingerprints.add(min_hash)
        return fingerprints
    
    def check_fingerprint_similarity(self, text1: str, text2: str) -> float:
        """Compare documents using fingerprinting"""
        words1 = self.preprocess(text1)
        words2 = self.preprocess(text2)
        
        if len(words1) < 5 or len(words2) < 5:
            return 0.0
        
        hashes1 = self.rolling_hash(words1)
        hashes2 = self.rolling_hash(words2)
        fp1 = self.winnowing(hashes1)
        fp2 = self.winnowing(hashes2)
        
        return self.jaccard_similarity(fp1, fp2)
    
    def longest_common_substring(self, text1: str, text2: str) -> Tuple[int, str]:
        """Find longest common substring using dynamic programming"""
        words1 = self.preprocess(text1)
        words2 = self.preprocess(text2)
        m, n = len(words1), len(words2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        max_len = 0
        end_pos = 0
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if words1[i-1] == words2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                    if dp[i][j] > max_len:
                        max_len = dp[i][j]
                        end_pos = i
        
        lcs = ' '.join(words1[end_pos - max_len:end_pos]) if max_len > 0 else ''
        return max_len, lcs
    
    def compute_tf(self, words: List[str]) -> Dict[str, float]:
        """Term Frequency"""
        tf = Counter(words)
        total = len(words)
        return {word: count/total for word, count in tf.items()}
    
    def compute_idf(self, documents: List[List[str]]) -> Dict[str, float]:
        """Inverse Document Frequency"""
        n_docs = len(documents)
        df = defaultdict(int)
        
        for doc in documents:
            unique_words = set(doc)
            for word in unique_words:
                df[word] += 1
        
        idf = {word: math.log(n_docs / (1 + freq)) for word, freq in df.items()}
        return idf
    
    def cosine_similarity_tfidf(self, text1: str, text2: str) -> float:
        """Calculate cosine similarity using TF-IDF vectors"""
        words1 = self.preprocess(text1)
        words2 = self.preprocess(text2)
        
        if not words1 or not words2:
            return 0.0
        
        idf = self.compute_idf([words1, words2])
        tf1 = self.compute_tf(words1)
        tf2 = self.compute_tf(words2)
        
        tfidf1 = {word: tf * idf.get(word, 0) for word, tf in tf1.items()}
        tfidf2 = {word: tf * idf.get(word, 0) for word, tf in tf2.items()}
        
        all_words = set(tfidf1.keys()) | set(tfidf2.keys())
        
        dot_product = sum(tfidf1.get(w, 0) * tfidf2.get(w, 0) for w in all_words)
        mag1 = math.sqrt(sum(v**2 for v in tfidf1.values()))
        mag2 = math.sqrt(sum(v**2 for v in tfidf2.values()))
        
        if mag1 == 0 or mag2 == 0:
            return 0.0
        
        return dot_product / (mag1 * mag2)
    
    def comprehensive_check(self, text1: str, text2: str) -> Dict:
        """Run all plagiarism detection methods"""
        results = {
            'ngram_similarity': self.check_ngram_similarity(text1, text2, n=3),
            'fingerprint_similarity': self.check_fingerprint_similarity(text1, text2),
            'cosine_similarity': self.cosine_similarity_tfidf(text1, text2),
        }
        
        lcs_len, lcs_text = self.longest_common_substring(text1, text2)
        results['longest_common_words'] = lcs_len
        results['longest_common_text'] = lcs_text if lcs_text else 'No common text found'
        
        results['overall_score'] = (
            results['ngram_similarity'] * 0.3 +
            results['fingerprint_similarity'] * 0.2 +
            results['cosine_similarity'] * 0.5
        )
        
        return results