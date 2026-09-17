/* ============================================
   WordCountPro - FAQ Accordion
   ============================================ */

(function () {
    'use strict';

    function initFaq() {
        const faqList = document.getElementById('faqList');
        if (!faqList) return;

        const items = faqList.querySelectorAll('.faq-item');

        items.forEach(function (item) {
            const button = item.querySelector('.faq-question');
            if (!button) return;

            button.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');

                /* Optional: close others for a cleaner accordion */
                items.forEach(function (other) {
                    if (other !== item && other.classList.contains('open')) {
                        other.classList.remove('open');
                        const otherBtn = other.querySelector('.faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                item.classList.toggle('open', !isOpen);
                button.setAttribute('aria-expanded', String(!isOpen));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaq);
    } else {
        initFaq();
    }
})();
