/* ============================================
   WordCountPro - Word Counter
   Core counting engine + main homepage tool wiring
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       Counting Engine (exposed for reuse)
       ============================================ */

    function tokenizeWords(text) {
        if (!text) return [];
        return text.trim().split(/\s+/).filter(function (token) {
            return token.length > 0;
        });
    }

    function countWords(text) {
        return tokenizeWords(text).length;
    }

    function countCharacters(text) {
        return text ? text.length : 0;
    }

    function countCharactersNoSpaces(text) {
        if (!text) return 0;
        /* Remove all whitespace characters */
        return text.replace(/\s/g, '').length;
    }

    function countSentences(text) {
        if (!text || !text.trim()) return 0;

        /* Collapse repeated punctuation, count sentence-ending marks */
        const normalized = text.replace(/([.!?])\1+/g, '$1');
        const matches = normalized.match(/[.!?]+(\s|$)/g);
        const count = matches ? matches.length : 0;

        /* If text has content but no ending punctuation, count as 1 sentence */
        if (count === 0 && normalized.trim().length > 0) {
            return 1;
        }
        return count;
    }

    function countParagraphs(text) {
        if (!text || !text.trim()) return 0;
        const blocks = text.split(/\n\s*\n/);
        return blocks.filter(function (block) {
            return block.trim().length > 0;
        }).length;
    }

    function estimatePages(wordCount, wordsPerPage) {
        const wpp = wordsPerPage || 250;
        if (wordCount === 0) return 0;
        return Math.max(1, Math.ceil(wordCount / wpp));
    }

    /* Public API */
    window.WCPCounter = {
        tokenizeWords: tokenizeWords,
        countWords: countWords,
        countCharacters: countCharacters,
        countCharactersNoSpaces: countCharactersNoSpaces,
        countSentences: countSentences,
        countParagraphs: countParagraphs,
        estimatePages: estimatePages
    };

    /* ============================================
       Homepage Tool Wiring
       ============================================ */

    function initWordCounter() {
        const textInput = document.getElementById('textInput');
        if (!textInput) return;

        const el = {
            words: document.getElementById('statWords'),
            chars: document.getElementById('statChars'),
            charsNoSpace: document.getElementById('statCharsNoSpace'),
            sentences: document.getElementById('statSentences'),
            paragraphs: document.getElementById('statParagraphs'),
            pages: document.getElementById('statPages')
        };

        /* Debounce to keep typing smooth on very large texts */
        let debounceTimer = null;

        function updateStats() {
            const text = textInput.value;

            const words = countWords(text);
            const chars = countCharacters(text);
            const charsNoSpace = countCharactersNoSpaces(text);
            const sentences = countSentences(text);
            const paragraphs = countParagraphs(text);
            const pages = estimatePages(words, 250);

            if (el.words) el.words.textContent = words.toLocaleString();
            if (el.chars) el.chars.textContent = chars.toLocaleString();
            if (el.charsNoSpace) el.charsNoSpace.textContent = charsNoSpace.toLocaleString();
            if (el.sentences) el.sentences.textContent = sentences.toLocaleString();
            if (el.paragraphs) el.paragraphs.textContent = paragraphs.toLocaleString();
            if (el.pages) el.pages.textContent = pages.toLocaleString();

            /* Fire custom event so other modules (keyword density, reading stats) update */
            document.dispatchEvent(new CustomEvent('wcp:textchange', {
                detail: { text: text, words: words }
            }));
        }

        function scheduleUpdate() {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updateStats, 120);
        }

        textInput.addEventListener('input', scheduleUpdate);

        /* Initial run */
        updateStats();

        /* Expose update for programmatic refreshes */
        window.WCPCounter.refresh = updateStats;
        window.WCPCounter.getText = function () {
            return textInput.value;
        };
        window.WCPCounter.setText = function (value) {
            textInput.value = value;
            updateStats();
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWordCounter);
    } else {
        initWordCounter();
    }
})();
