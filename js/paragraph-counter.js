/* ============================================
   WordCountPro - Paragraph Counter Page
   ============================================ */

(function () {
    'use strict';

    function initParagraphCounterPage() {
        const input = document.getElementById('textInput');
        if (!input) return;

        const els = {
            paragraphs: document.getElementById('pcParagraphs'),
            words: document.getElementById('pcWords'),
            sentences: document.getElementById('pcSentences'),
            avg: document.getElementById('pcAvg')
        };

        function update() {
            const text = input.value;
            const p = window.WCPCounter.countParagraphs(text);
            const w = window.WCPCounter.countWords(text);
            const s = window.WCPCounter.countSentences(text);
            const avg = p > 0 ? (w / p) : 0;

            if (els.paragraphs) els.paragraphs.textContent = p.toLocaleString();
            if (els.words) els.words.textContent = w.toLocaleString();
            if (els.sentences) els.sentences.textContent = s.toLocaleString();
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
                    window.WCP.downloadText(input.value, 'paragraph-counter-text.txt');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParagraphCounterPage);
    } else {
        initParagraphCounterPage();
    }
})();
