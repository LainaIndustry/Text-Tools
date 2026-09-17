/* ============================================
   WordCountPro - Text Cleaner Page
   ============================================ */

(function () {
    'use strict';

    function initTextCleanerPage() {
        const textInput = document.getElementById('textInput');
        if (!textInput) return;

        const output = document.getElementById('outputBox');

        function renderOutput(text) {
            if (!output) return;
            output.textContent = text || '';
        }

        document.querySelectorAll('[data-clean]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const mode = btn.getAttribute('data-clean');
                const text = textInput.value;
                if (!text) {
                    window.WCP.showToast('Please enter some text first');
                    return;
                }

                let result = text;
                switch (mode) {
                    case 'spaces':
                        result = window.WCPTextTools.removeExtraSpaces(text);
                        break;
                    case 'blanklines':
                        result = text.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim();
                        break;
                    case 'all':
                        result = window.WCPTextTools.removeExtraSpaces(text)
                            .replace(/\n{3,}/g, '\n\n');
                        break;
                    default:
                        return;
                }
                renderOutput(result);
            });
        });

        document.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const action = btn.getAttribute('data-action');
                const text = textInput.value;
                if (action === 'clear') {
                    textInput.value = '';
                    renderOutput('');
                    textInput.focus();
                    window.WCP.showToast('Text cleared');
                } else if (action === 'copy') {
                    window.WCP.copyToClipboard(output && output.textContent ? output.textContent : text);
                } else if (action === 'download') {
                    window.WCP.downloadText(output && output.textContent ? output.textContent : text, 'cleaned-text.txt');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTextCleanerPage);
    } else {
        initTextCleanerPage();
    }
})();
