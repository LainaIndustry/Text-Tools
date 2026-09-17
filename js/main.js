/* ============================================
   WordCountPro - Main Global Scripts
   Handles: theme toggle, toast notifications, shared helpers
   ============================================ */

(function () {
    'use strict';

    /* ---------- Theme Toggle ---------- */
    const THEME_KEY = 'wcp-theme';

    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            /* localStorage may be unavailable; ignore */
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    function initTheme() {
        const stored = getStoredTheme();
        if (stored === 'dark' || stored === 'light') {
            applyTheme(stored);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }

        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                const current = document.documentElement.getAttribute('data-theme') || 'light';
                const next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                storeTheme(next);
            });
        }
    }

    /* ---------- Toast Notification ---------- */
    let toastTimer = null;

    function showToast(message, duration) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add('show');

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastTimer = setTimeout(function () {
            toast.classList.remove('show');
        }, duration || 2000);
    }

    /* ---------- Clipboard Helper ---------- */
    function copyToClipboard(text) {
        if (!text) {
            showToast('Nothing to copy');
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showToast('Copied!');
            }).catch(function () {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Copied!');
        } catch (e) {
            showToast('Copy failed. Please copy manually.');
        }
    }

    /* ---------- Download Helper ---------- */
    function downloadText(text, filename) {
        if (!text) {
            showToast('Nothing to download');
            return;
        }

        try {
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'word-counter-text.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 1000);
            showToast('Download started');
        } catch (e) {
            showToast('Download failed');
        }
    }

    /* ---------- Escape HTML (safety) ---------- */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /* ---------- Expose shared API ---------- */
    window.WCP = {
        showToast: showToast,
        copyToClipboard: copyToClipboard,
        downloadText: downloadText,
        escapeHtml: escapeHtml
    };

    /* ---------- Init ---------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
