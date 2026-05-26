// =============================================================
// VUKÉ — Landing scripts
// Mobile menu toggle, smooth anchor scroll, dynamic footer year.
// =============================================================

(() => {
    // ---- Mobile menu (right-side slide-out drawer) ----
    const toggle = document.querySelector('.nav__toggle');
    const mobile = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('navBackdrop');

    if (toggle && mobile) {
        const setMenuState = (open) => {
            mobile.classList.toggle('is-open', open);
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            mobile.setAttribute('aria-hidden', String(!open));
            backdrop?.classList.toggle('is-open', open);
            document.body.classList.toggle('menu-open', open);
        };

        toggle.addEventListener('click', () => {
            setMenuState(!mobile.classList.contains('is-open'));
        });

        mobile.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => setMenuState(false));
        });

        mobile.querySelector('.nav__mobile-close')?.addEventListener('click', () => setMenuState(false));

        backdrop?.addEventListener('click', () => setMenuState(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobile.classList.contains('is-open')) {
                setMenuState(false);
            }
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

    // ---- Auto-rotating horizontal carousels (mobile only) ----
    // Generic helper: rotates the children of a horizontal scroll container,
    // centering each item inside the container via scrollLeft (never touching
    // the page's vertical scroll). Pauses permanently on user interaction.
    const mobileQuery = window.matchMedia('(max-width: 960px)');
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const setupAutoCarousel = (grid, itemSelector, interval) => {
        if (!grid) return;
        const items = grid.querySelectorAll(itemSelector);
        if (items.length < 2) return;

        let timer = null;
        let index = 0;
        let userInteracted = false;

        const advance = () => {
            if (userInteracted) return;
            index = (index + 1) % items.length;
            const item = items[index];
            const target = item.offsetLeft + (item.offsetWidth / 2) - (grid.clientWidth / 2);
            grid.scrollTo({ left: target, behavior: 'smooth' });
        };

        const start = () => {
            if (timer || !mobileQuery.matches || reduceMotionQuery.matches) return;
            timer = setInterval(advance, interval);
        };

        const stop = () => {
            if (timer) { clearInterval(timer); timer = null; }
        };

        const handleInteraction = () => { userInteracted = true; stop(); };

        grid.addEventListener('touchstart', handleInteraction, { passive: true });
        grid.addEventListener('mousedown', handleInteraction);
        grid.addEventListener('wheel', handleInteraction, { passive: true });
        mobileQuery.addEventListener('change', e => { e.matches ? start() : stop(); });

        start();
    };

    setupAutoCarousel(document.querySelector('.values__grid'), '.value', 3000);
    setupAutoCarousel(document.querySelector('.how__steps'), '.step', 4500);

    // ---- Sales simulator ----
    // Live calculator: perfumes/day × 30 days × profit-per-unit (varies by product).
    const simSlider = document.getElementById('ventasDia');
    if (simSlider) {
        const DAYS_PER_MONTH = 30;
        const valueDisplay = document.querySelector('.simulator__value');
        const stepButtons = document.querySelectorAll('.simulator__step');
        const monthlySalesEl = document.querySelector('[data-result="monthlySales"]');
        const monthlyEarningsEl = document.querySelector('[data-result="monthlyEarnings"]');
        const productCards = document.querySelectorAll('.simulator__product');
        const productTabs = document.querySelectorAll('.simulator__tab');
        const formatARS = n => '$ ' + n.toLocaleString('es-AR');

        const getActiveProfit = () => {
            const active = document.querySelector('.simulator__product.is-active');
            return active ? parseInt(active.dataset.profit, 10) : 0;
        };

        const updateSim = () => {
            const perDay = parseInt(simSlider.value, 10);
            const monthly = perDay * DAYS_PER_MONTH;
            const earnings = monthly * getActiveProfit();

            if (valueDisplay) valueDisplay.textContent = perDay;
            if (monthlySalesEl) monthlySalesEl.textContent = monthly;
            if (monthlyEarningsEl) monthlyEarningsEl.textContent = formatARS(earnings);

            const min = parseInt(simSlider.min, 10);
            const max = parseInt(simSlider.max, 10);
            stepButtons.forEach(btn => {
                const step = parseInt(btn.dataset.step, 10);
                btn.disabled = (step < 0 && perDay <= min) || (step > 0 && perDay >= max);
            });
        };

        simSlider.addEventListener('input', updateSim);

        stepButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.dataset.step, 10);
                const current = parseInt(simSlider.value, 10);
                const min = parseInt(simSlider.min, 10);
                const max = parseInt(simSlider.max, 10);
                const next = Math.min(max, Math.max(min, current + step));
                if (next !== current) {
                    simSlider.value = next;
                    updateSim();
                }
            });
        });

        productTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.product;
                productTabs.forEach(t => {
                    const active = t === tab;
                    t.classList.toggle('is-active', active);
                    t.setAttribute('aria-selected', String(active));
                });
                productCards.forEach(card => {
                    card.classList.toggle('is-active', card.dataset.product === target);
                });
                updateSim();
            });
        });

        updateSim();
    }

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
