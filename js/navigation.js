/* ============================================
   WordCountPro - Navigation (CORRECTED)
   Handles: mobile menu toggle, dropdowns, keyboard accessibility
   ============================================ */

(function () {
    'use strict';

    function initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const primaryNav = document.getElementById('primaryNav');
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

        /* ---------- Mobile menu toggle ---------- */
        if (navToggle && primaryNav) {
            navToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', String(!expanded));
                primaryNav.classList.toggle('open', !expanded);
            });
        }

        /* ---------- Dropdown toggles ---------- */
        dropdownToggles.forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const parent = toggle.closest('.has-dropdown');
                if (!parent) return;

                const isOpen = parent.classList.contains('open');

                /* Close other open dropdowns */
                document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
                    if (item !== parent) {
                        item.classList.remove('open');
                        const btn = item.querySelector('.dropdown-toggle');
                        if (btn) btn.setAttribute('aria-expanded', 'false');
                    }
                });

                /* Toggle current */
                parent.classList.toggle('open', !isOpen);
                toggle.setAttribute('aria-expanded', String(!isOpen));
            });
        });

        /* ---------- Close dropdowns when clicking outside ---------- */
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.has-dropdown')) {
                document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
                    item.classList.remove('open');
                    const btn = item.querySelector('.dropdown-toggle');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
            }
        });

        /* ---------- Keyboard: Escape closes dropdowns / menu ---------- */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                /* Close dropdowns */
                document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
                    item.classList.remove('open');
                    const btn = item.querySelector('.dropdown-toggle');
                    if (btn) {
                        btn.setAttribute('aria-expanded', 'false');
                        btn.focus();
                    }
                });

                /* Close mobile menu */
                if (navToggle && primaryNav && primaryNav.classList.contains('open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    primaryNav.classList.remove('open');
                    navToggle.focus();
                }
            }
        });

        /* ---------- Close mobile menu when a link is clicked ---------- */
        if (primaryNav) {
            primaryNav.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    if (window.innerWidth <= 900 && primaryNav.classList.contains('open')) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        primaryNav.classList.remove('open');
                    }
                });
            });
        }

        /* ---------- Reset nav state on window resize ---------- */
        let resizeTimer = null;
        window.addEventListener('resize', function () {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (window.innerWidth > 900 && primaryNav) {
                    /* Desktop: ensure mobile menu is closed */
                    primaryNav.classList.remove('open');
                    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                }
            }, 150);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();
