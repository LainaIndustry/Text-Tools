/* ============================================
   WordCountPro - Reading Statistics
   Estimates reading time, speaking time, averages, reading level.
   ============================================ */

(function () {
    'use strict';

    const WORDS_PER_MINUTE_READING = 225;   /* documented default */
    const WORDS_PER_MINUTE_SPEAKING = 130;  /* documented default */

    function formatMinutes(minutes) {
        if (minutes < 1) return '< 1 min';
        if (minutes < 60) return Math.round(minutes) + ' min';
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return hours + 'h ' + mins + 'm';
    }

    function computeStats(text) {
        const words = window.WCPCounter.tokenizeWords(text);
        const wordCount = words.length;

        const readingMinutes = wordCount / WORDS_PER_MINUTE_READING;
        const speakingMinutes = wordCount / WORDS_PER_MINUTE_SPEAKING;

        /* Average word length (letters only) */
        let totalLetters = 0;
        words.forEach(function (w) {
            const letters = w.replace(/[^A-Za-z\u00c0-\u024f]/g, '');
            totalLetters += letters.length;
        });
        const avgWordLength = wordCount > 0 ? (totalLetters / wordCount) : 0;

        /* Average sentence length */
        const sentenceCount = window.WCPCounter.countSentences(text);
        const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount) : 0;

        /* Estimated reading level using a simplified Flesch-Kincaid approach.
           We approximate syllables with a vowel-group heuristic. */
        let syllableCount = 0;
        words.forEach(function (w) {
            const cleaned = w.toLowerCase().replace(/[^a-z\u00c0-\u024f]/g, '');
            if (!cleaned) return;
            const groups = cleaned.match(/[aeiouy\u00e0-\u00ff]+/g);
            let syllables = groups ? groups.length : 1;
            if (cleaned.endsWith('e') && syllables > 1) syllables -= 1;
            syllableCount += Math.max(1, syllables);
        });

        let readingLevelLabel = '—';
        if (wordCount >= 20 && sentenceCount >= 1) {
            const grade = 0.39 * (wordCount / sentenceCount) +
                          11.8 * (syllableCount / wordCount) - 15.59;
            if (grade <= 6) readingLevelLabel = 'Easy';
            else if (grade <= 9) readingLevelLabel = 'Fairly easy';
            else if (grade <= 12) readingLevelLabel = 'Standard';
            else if (grade <= 15) readingLevelLabel = 'Fairly difficult';
            else readingLevelLabel = 'Difficult';
        }

        return {
            wordCount: wordCount,
            readingMinutes: readingMinutes,
            speakingMinutes: speakingMinutes,
            avgWordLength: avgWordLength,
            avgSentenceLength: avgSentenceLength,
            readingLevel: readingLevelLabel
        };
    }

    window.WCPReading = {
        computeStats: computeStats,
        WORDS_PER_MINUTE_READING: WORDS_PER_MINUTE_READING,
        WORDS_PER_MINUTE_SPEAKING: WORDS_PER_MINUTE_SPEAKING
    };

    /* ---------- Homepage wiring ---------- */
    function initReadingStats() {
        const el = {
            readingTime: document.getElementById('readingTime'),
            speakingTime: document.getElementById('speakingTime'),
            avgWordLength: document.getElementById('avgWordLength'),
            avgSentenceLength: document.getElementById('avgSentenceLength'),
            readingLevel: document.getElementById('readingLevel')
        };

        if (!el.readingTime) return;

        function render(text) {
            const stats = computeStats(text);

            if (el.readingTime) el.readingTime.textContent = formatMinutes(stats.readingMinutes);
            if (el.speakingTime) el.speakingTime.textContent = formatMinutes(stats.speakingMinutes);
            if (el.avgWordLength) el.avgWordLength.textContent = stats.avgWordLength.toFixed(1);
            if (el.avgSentenceLength) el.avgSentenceLength.textContent = stats.avgSentenceLength.toFixed(1);
            if (el.readingLevel) el.readingLevel.textContent = stats.readingLevel;
        }

        document.addEventListener('wcp:textchange', function (e) {
            render(e.detail.text);
        });

        render('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReadingStats);
    } else {
        initReadingStats();
    }
})();
