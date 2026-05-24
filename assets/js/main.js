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

    // ---- Fade carousels ----
    // Any element marked [data-carousel] rotates its children with the
    // .is-active class on a fixed interval (default 5s, override via
    // data-interval="ms"). Pauses on hover and while the tab is hidden.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('[data-carousel]').forEach(root => {
        const slides = Array.from(root.children).filter(el => el.matches('.way__slide, [data-slide]'));
        if (slides.length < 2) return;

        const interval = Math.max(1500, parseInt(root.dataset.interval, 10) || 5000);
        let index = slides.findIndex(s => s.classList.contains('is-active'));
        if (index < 0) {
            index = 0;
            slides[0].classList.add('is-active');
        }

        let timer = null;
        const advance = () => {
            slides[index].classList.remove('is-active');
            index = (index + 1) % slides.length;
            slides[index].classList.add('is-active');
        };
        const start = () => {
            if (reduceMotion || timer) return;
            timer = setInterval(advance, interval);
        };
        const stop = () => {
            if (timer) { clearInterval(timer); timer = null; }
        };

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        document.addEventListener('visibilitychange', () => {
            document.hidden ? stop() : start();
        });

        start();
    });
})();
