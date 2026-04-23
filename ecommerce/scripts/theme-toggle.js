document.addEventListener('DOMContentLoaded', function () {
    const storageKey = 'themeMode';
    const body = document.body;
    const savedMode = localStorage.getItem(storageKey);
    const mode = savedMode === 'day' ? 'day' : 'night';

    body.classList.remove('theme-day', 'theme-night');
    body.classList.add(`theme-${mode}`);

    const button = document.createElement('button');
    button.className = 'theme-toggle-btn';
    button.type = 'button';

    const updateLabel = () => {
        const isNight = body.classList.contains('theme-night');
        button.textContent = isNight ? 'Mode Jour' : 'Mode Nuit';
    };

    button.addEventListener('click', function () {
        const isNight = body.classList.contains('theme-night');
        body.classList.toggle('theme-night', !isNight);
        body.classList.toggle('theme-day', isNight);
        localStorage.setItem(storageKey, isNight ? 'day' : 'night');
        updateLabel();
    });

    updateLabel();
    document.body.appendChild(button);
});
