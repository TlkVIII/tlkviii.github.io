document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    if (body.classList.contains('dark-theme')) {
        if (icon.classList.contains('fa-moon')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        // Change l'icône
        if (body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}); 