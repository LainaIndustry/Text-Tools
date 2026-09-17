/* ============================================
   WordCountPro - Text Tools
   Handles: uppercase, lowercase, title case, sentence case,
            remove extra spaces, clear, copy, download
   ============================================ */

(function () {
    'use strict';

    /* ---------- Transformations ---------- */

    function toUpperCase(text) {
        return text.toUpperCase();
    }

    function toLowerCase(text) {
        return text.toLowerCase();
    }

    function toTitleCase(text) {
        if (!text) return '';
        return text.replace(/\w\S*/g, function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
    }

    function toSentenceCase(text) {
        if (!text) return '';
        /* Lowercase everything, then capitalize first letter of each sentence */
        const lowered = text.toLowerCase();
        return lowered.replace(/(^\s*\w|[.!?]\s+\w)/g, function (match) {
            return match.toUpperCase();
        });
    }

    function removeExtraSpaces(text) {
        if (!text) return '';
        return text
            .replace(/[ \t]+/g, ' ')        /* collapse horizontal whitespace */
            .replace(/ *\n */g, '\n')        /* trim around newlines */
            .replace(/\n{3,}/g, '\n\n')      /* max one blank line */
            .trim();
    }

    /* ---------- Public API ---------- */
    window.WCPTextTools = {
        toUpperCase: toUpperCase,
        toLowerCase: toLowerCase,
        toTitleCase: toTitleCase,
        toSentenceCase: toSentenceCase,
        removeExtraSpaces: removeExtraSpaces
    };

    /* ---------- Homepage action button wiring ---------- */
    function initTextTools() {
        const textInput = document.getElementById('textInput');
        if (!textInput) return;

        const buttons = document.querySelectorAll('[data-action]');

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const action = btn.getAttribute('data-action');
                const text = textInput.value;

                switch (action) {
                    case 'clear':
                        textInput.value = '';
                        textInput.focus();
                        refresh();
                        window.WCP.showToast('Text cleared');
                        break;

                    case 'copy':
                        window.WCP.copyToClipboard(text);
                        break;

                    case 'download':
                        window.WCP.downloadText(text, 'word-counter-text.txt');
                        break;

                    case 'uppercase':
                        if (!text) { window.WCP.showToast('No text to convert'); return; }
                        textInput.value = toUpperCase(text);
                        refresh();
                        break;

                    case 'lowercase':
                        if (!text) { window.WCP.showToast('No text to convert'); return; }
                        textInput.value = toLowerCase(text);
                        refresh();
                        break;

                    case 'titlecase':
                        if (!text) { window.WCP.showToast('No text to convert'); return; }
                        textInput.value = toTitleCase(text);
                        refresh();
                        break;

                    case 'sentencecase':
                        if (!text) { window.WCP.showToast('No text to convert'); return; }
                        textInput.value = toSentenceCase(text);
                        refresh();
                        break;

                    case 'removeSpaces':
                        if (!text) { window.WCP.showToast('No text to clean'); return; }
                        textInput.value = removeExtraSpaces(text);
                        refresh();
                        break;

                    default:
                        break;
                }
            });
        });

        function refresh() {
            if (window.WCPCounter && typeof window.WCPCounter.refresh === 'function') {
                window.WCPCounter.refresh();
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTextTools);
    } else {
        initTextTools();
    }
})();
