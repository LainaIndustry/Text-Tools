/* ============================================
   WordCountPro - Keyword Density
   Analyzes word frequency, ignores stop words and punctuation.
   ============================================ */

(function () {
    'use strict';

    /* Common English stop words to exclude from density analysis */
    const STOP_WORDS = new Set([
        'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for',
        'from', 'has', 'have', 'he', 'her', 'his', 'i', 'if', 'in', 'into',
        'is', 'it', 'its', 'me', 'my', 'no', 'not', 'of', 'on', 'or', 'our',
        'she', 'so', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
        'they', 'this', 'to', 'was', 'we', 'were', 'what', 'when', 'where',
        'which', 'who', 'will', 'with', 'you', 'your', 'am', 'do', 'does',
        'did', 'doing', 'done', 'been', 'being', 'had', 'having', 'can',
        'could', 'should', 'would', 'may', 'might', 'must', 'shall', 'about',
        'above', 'after', 'again', 'against', 'all', 'also', 'any', 'because',
        'before', 'below', 'between', 'both', 'each', 'few', 'more', 'most',
        'other', 'some', 'such', 'than', 'too', 'very', 'just', 'only', 'own',
        'same', 'up', 'down', 'out', 'off', 'over', 'under', 'once', 'here',
        'how', 'why', 'while', 'during', 'through', 'before', 'after', 'am'
    ]);

    function normalizeWord(word) {
        /* Strip leading/trailing punctuation, lowercase */
        return word
            .toLowerCase()
            .replace(/^[^a-z0-9\u00c0-\u024f]+|[^a-z0-9\u00c0-\u024f]+$/gi, '');
    }

    function analyze(text, limit) {
        const maxKeywords = limit || 15;
        if (!text || !text.trim()) {
            return { totalWords: 0, keywords: [] };
        }

        const rawTokens = text.trim().split(/\s+/);
        const counts = Object.create(null);
        let countedWords = 0;

        rawTokens.forEach(function (token) {
            const word = normalizeWord(token);
            if (!word) return;
            if (word.length < 2) return;
            if (STOP_WORDS.has(word)) return;

            countedWords++;
            counts[word] = (counts[word] || 0) + 1;
        });

        const totalWords = rawTokens.length;
        const entries = Object.keys(counts).map(function (word) {
            return {
                word: word,
                count: counts[word],
                density: totalWords > 0 ? (counts[word] / totalWords) * 100 : 0
            };
        });

        entries.sort(function (a, b) {
            if (b.count !== a.count) return b.count - a.count;
            return a.word.localeCompare(b.word);
        });

        return {
            totalWords: totalWords,
            countedWords: countedWords,
            keywords: entries.slice(0, maxKeywords)
        };
    }

    window.WCPKeyword = {
        analyze: analyze,
        STOP_WORDS: STOP_WORDS
    };

    /* ---------- Homepage wiring ---------- */
    function initKeywordDensity() {
        const tbody = document.getElementById('keywordBody');
        if (!tbody) return;

        function render(text) {
            const result = analyze(text, 15);

            /* Clear safely */
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            if (!result.keywords.length) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.setAttribute('colspan', '3');
                td.className = 'empty-row';
                td.textContent = 'Start typing to see keyword density.';
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }

            const fragment = document.createDocumentFragment();

            result.keywords.forEach(function (entry) {
                const tr = document.createElement('tr');

                const tdWord = document.createElement('td');
                tdWord.className = 'kw-word';
                tdWord.textContent = entry.word;

                const tdCount = document.createElement('td');
                tdCount.textContent = entry.count.toLocaleString();

                const tdDensity = document.createElement('td');
                tdDensity.textContent = entry.density.toFixed(2) + '%';

                tr.appendChild(tdWord);
                tr.appendChild(tdCount);
                tr.appendChild(tdDensity);
                fragment.appendChild(tr);
            });

            tbody.appendChild(fragment);
        }

        document.addEventListener('wcp:textchange', function (e) {
            render(e.detail.text);
        });

        /* Initial render */
        render('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKeywordDensity);
    } else {
        initKeywordDensity();
    }
})();
