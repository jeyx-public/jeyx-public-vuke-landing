// =============================================================
// VUKÉ — Landing scripts
// Mobile menu toggle, smooth anchor scroll, dynamic footer year.
// =============================================================

(() => {
    // ---- Mobile menu ----
    const toggle = document.querySelector('.nav__toggle');
    const mobile = document.getElementById('mobileMenu');

    if (toggle && mobile) {
        toggle.addEventListener('click', () => {
            const open = mobile.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.classList.toggle('is-open', open);
        });

        mobile.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mobile.classList.remove('is-open');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- Footer year ----
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // ---- Smooth anchor scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
})();
