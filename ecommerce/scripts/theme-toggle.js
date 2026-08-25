document.addEventListener('DOMContentLoaded', function () {
    const storageKey = 'themeMode';
    const body = document.body;
    const savedMode = localStorage.getItem(storageKey);
    const mode = savedMode === 'night' ? 'night' : 'day';

    body.classList.remove('theme-day', 'theme-night');
    body.classList.add(`theme-${mode}`);

    const button = document.createElement('button');
    button.className = 'theme-toggle-btn theme-toggle-nav';
    button.type = 'button';
    button.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';

    const updateLabel = () => {
        const isNight = body.classList.contains('theme-night');
        const label = isNight ? 'Activer le mode jour' : 'Activer le mode nuit';
        const icon = button.querySelector('i');

        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);

        if (icon) {
            icon.className = isNight ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    button.addEventListener('click', function () {
        const isNight = body.classList.contains('theme-night');
        body.classList.toggle('theme-night', !isNight);
        body.classList.toggle('theme-day', isNight);
        localStorage.setItem(storageKey, isNight ? 'day' : 'night');
        updateLabel();
    });

    updateLabel();
    const userActions = document.querySelector('.user-actions');

    if (userActions) {
        userActions.insertBefore(button, userActions.firstChild);
    } else {
        document.body.appendChild(button);
    }
});
