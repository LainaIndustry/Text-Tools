/* ============================================
   WordCountPro - Character Counter Page
   ============================================ */

(function () {
    'use strict';

    function initCharacterCounterPage() {
        const textInput = document.getElementById('textInput');
        if (!textInput) return;

        const el = {
            total: document.getElementById('charTotal'),
            noSpaces: document.getElementById('charNoSpaces'),
            letters: document.getElementById('charLetters'),
            digits: document.getElementById('charDigits'),
            punctuation: document.getElementById('charPunctuation'),
            words: document.getElementById('charWords')
        };

        function update() {
            const text = textInput.value;
            const total = text.length;
            const noSpaces = text.replace(/\s/g, '').length;
            const letters = (text.match(/[A-Za-z\u00c0-\u024f]/g) || []).length;
            const digits = (text.match(/[0-9]/g) || []).length;
            const punctuation = (text.match(/[^\w\s\u00c0-\u024f]/g) || []).length;
            const words = window.WCPCounter.countWords(text);

            if (el.total) el.total.textContent = total.toLocaleString();
            if (el.noSpaces) el.noSpaces.textContent = noSpaces.toLocaleString();
            if (el.letters) el.letters.textContent = letters.toLocaleString();
            if (el.digits) el.digits.textContent = digits.toLocaleString();
            if (el.punctuation) el.punctuation.textContent = punctuation.toLocaleString();
            if (el.words) el.words.textContent = words.toLocaleString();
        }

        textInput.addEventListener('input', update);
        update();

        /* Wire action buttons */
        document.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const action = btn.getAttribute('data-action');
                if (action === 'clear') {
                    textInput.value = '';
                    update();
                    window.WCP.showToast('Text cleared');
                    textInput.focus();
                } else if (action === 'copy') {
                    window.WCP.copyToClipboard(textInput.value);
                } else if (action === 'download') {
                    window.WCP.downloadText(textInput.value, 'character-count-text.txt');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCharacterCounterPage);
    } else {
        initCharacterCounterPage();
    }
})();
