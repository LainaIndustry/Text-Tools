/* ============================================
   WordCountPro - Keyword Density Page
   ============================================ */

(function () {
    'use strict';

    function initKeywordDensityPage() {
        const textInput = document.getElementById('textInput');
        const tbody = document.getElementById('keywordBody');
        if (!textInput || !tbody) return;

        const totalWordsEl = document.getElementById('totalWords');
        const uniqueWordsEl = document.getElementById('uniqueWords');
        const topKeywordEl = document.getElementById('topKeyword');

        function render() {
            const text = textInput.value;
            const result = window.WCPKeyword.analyze(text, 25);

            /* Clear table safely */
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
            } else {
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

            if (totalWordsEl) totalWordsEl.textContent = result.totalWords.toLocaleString();
            if (uniqueWordsEl) uniqueWordsEl.textContent = result.keywords.length.toLocaleString();
            if (topKeywordEl) {
                topKeywordEl.textContent = result.keywords.length ? result.keywords[0].word : '—';
            }
        }

        textInput.addEventListener('input', render);
        render();

        document.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const action = btn.getAttribute('data-action');
                if (action === 'clear') {
                    textInput.value = '';
                    render();
                    textInput.focus();
                    window.WCP.showToast('Text cleared');
                } else if (action === 'copy') {
                    window.WCP.copyToClipboard(textInput.value);
                } else if (action === 'download') {
                    window.WCP.downloadText(textInput.value, 'keyword-density-text.txt');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKeywordDensityPage);
    } else {
        initKeywordDensityPage();
    }
})();
