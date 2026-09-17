/* ============================================
   WordCountPro - Reading Time Calculator Page
   ============================================ */

(function () {
    'use strict';

    function initReadingTimePage() {
        const textInput = document.getElementById('textInput');
        if (!textInput) return;

        const el = {
            words: document.getElementById('rtWords'),
            reading: document.getElementById('rtReading'),
            speaking: document.getElementById('rtSpeaking'),
            sentences: document.getElementById('rtSentences'),
            paragraphs: document.getElementById('rtParagraphs'),
            level: document.getElementById('rtLevel')
        };

        function formatMinutes(minutes) {
            if (minutes < 1) return '< 1 min';
            if (minutes < 60) return Math.round(minutes) + ' min';
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return hours + 'h ' + mins + 'm';
        }

        function update() {
            const text = textInput.value;
            const stats = window.WCPReading.computeStats(text);
            const sentences = window.WCPCounter.countSentences(text);
            const paragraphs = window.WCPCounter.countParagraphs(text);

            if (el.words) el.words.textContent = stats.wordCount.toLocaleString();
            if (el.reading) el.reading.textContent = formatMinutes(stats.readingMinutes);
            if (el.speaking) el.speaking.textContent = formatMinutes(stats.speakingMinutes);
            if (el.sentences) el.sentences.textContent = sentences.toLocaleString();
            if (el.paragraphs) el.paragraphs.textContent = paragraphs.toLocaleString();
            if (el.level) el.level.textContent = stats.readingLevel;
        }

        textInput.addEventListener('input', update);
        update();

        document.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const action = btn.getAttribute('data-action');
                if (action === 'clear') {
                    textInput.value = '';
                    update();
                    textInput.focus();
                    window.WCP.showToast('Text cleared');
                } else if (action === 'copy') {
                    window.WCP.copyToClipboard(textInput.value);
                } else if (action === 'download') {
                    window.WCP.downloadText(textInput.value, 'reading-time-text.txt');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReadingTimePage);
    } else {
        initReadingTimePage();
    }
})();
