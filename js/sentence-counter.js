/* ============================================
   WordCountPro - Sentence Counter Page
   ============================================ */

(function () {
    'use strict';

    function initSentenceCounterPage() {
        const input = document.getElementById('textInput');
        if (!input) return;

        const els = {
            sentences: document.getElementById('scSentences'),
            words: document.getElementById('scWords'),
            chars: document.getElementById('scChars'),
            avg: document.getElementById('scAvg')
        };

        function update() {
            const text = input.value;
            const s = window.WCPCounter.countSentences(text);
            const w = window.WCPCounter.countWords(text);
            const c = window.WCPCounter.countCharacters(text);
            const avg = s > 0 ? (w / s) : 0;

            if (els.sentences) els.sentences.textContent = s.toLocaleString();
            if (els.words) els.words.textContent = w.toLocaleString();
            if (els.chars) els.chars.textContent = c.toLocaleString();
            if (els.avg) els.avg.textContent = avg.toFixed(1);
        }

        input.addEventListener('input', update);
        update();

        document.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const a = btn.getAttribute('data-action');
                if (a === 'clear') {
                    input.value = '';
                    update();
                    input.focus();
                    window.WCP.showToast('Text cleared');
                } else if (a === 'copy') {
                    window.WCP.copyToClipboard(input.value);
                } else if (a === 'download') {
                    window.WCP.downloadText(input.value, 'sentence-counter-text.txt');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSentenceCounterPage);
    } else {
        initSentenceCounterPage();
    }
})();
