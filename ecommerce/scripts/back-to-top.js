document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton =
        document.getElementById('back-to-top') || document.querySelector('.scroll-top');
    if (!backToTopButton) return;

    const showThreshold = 300;

    const updateVisibility = () => {
        if (window.scrollY > showThreshold) {
            backToTopButton.classList.add('visible', 'active');
        } else {
            backToTopButton.classList.remove('visible', 'active');
        }
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    backToTopButton.addEventListener('click', function (event) {
        if (backToTopButton.tagName.toLowerCase() === 'a') {
            event.preventDefault();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
