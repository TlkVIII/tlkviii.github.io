document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    if (!menuToggle || !navMenu) return;

    const closeMenu = () => {
        navMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        navMenu.classList.toggle('show');
        menuToggle.setAttribute(
            'aria-expanded',
            navMenu.classList.contains('show') ? 'true' : 'false'
        );
    });

    document.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
        if (!navMenu.classList.contains('show')) return;
        if (navMenu.contains(event.target) || menuToggle.contains(event.target)) return;
        closeMenu();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) closeMenu();
    });
});
