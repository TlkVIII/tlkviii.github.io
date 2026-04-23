document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    if (!header) return;

    const fixedLogo = document.querySelector('.fixed-logo');
    const scrollThreshold = 100;
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function () {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        const hasPassedThreshold = currentScrollY > scrollThreshold;

        if (isScrollingDown && hasPassedThreshold) {
            header.classList.add('hidden');
            if (fixedLogo) fixedLogo.classList.add('visible');
        } else {
            header.classList.remove('hidden');
            if (fixedLogo) fixedLogo.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    });
});
