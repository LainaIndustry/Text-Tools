/* ============================================
   WordCountPro - Case Converter Page
   ============================================ */

(function () {
    'use strict';

    function initCaseConverterPage() {
        const textInput = document.getElementById('textInput');
        if (!textInput) return;

        const output = document.getElementById('outputBox');

        function renderOutput(text) {
            if (!output) return;
            output.textContent = text || '';
        }

        function handleAction(action) {
            const text = textInput.value;
            if (!text) {
                window.WCP.showToast('Please enter some text first');
                return;
            }

            let result = text;
            switch (action) {
                case 'uppercase':
                    result = window.WCPTextTools.toUpperCase(text);
                    break;
                case 'lowercase':
                    result = window.WCPTextTools.toLowerCase(text);
                    break;
                case 'titlecase':
                    result = window.WCPTextTools.toTitleCase(text);
                    break;
                case 'sentencecase':
                    result = window.WCPTextTools.toSentenceCase(text);
                    break;
                default:
                    return;
            }
            renderOutput(result);
        }

        document.querySelectorAll('[data-case]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                handleAction(btn.getAttribute('data-case'));
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
                    const outputText = output && output.textContent ? output.textContent : text;
                    window.WCP.copyToClipboard(outputText);
                } else if (action === 'download') {
                    const outputText = output && output.textContent ? output.textContent : text;
                    window.WCP.downloadText(outputText, 'case-converted-text.txt');
                } else if (action === 'apply') {
                    if (output && output.textContent) {
                        textInput.value = output.textContent;
                        renderOutput('');
                        window.WCP.showToast('Applied to input');
                    } else {
                        window.WCP.showToast('No output to apply');
                    }
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCaseConverterPage);
    } else {
        initCaseConverterPage();
    }
})();
