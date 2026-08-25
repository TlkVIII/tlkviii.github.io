(function () {
    "use strict";

    const button = document.querySelector(".detail-theme-toggle");

    if (!button) {
        return;
    }

    const icon = button.querySelector("i");

    function updateTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        button.setAttribute(
            "aria-label",
            theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
        );

        if (icon) {
            icon.classList.toggle("fa-sun", theme === "dark");
            icon.classList.toggle("fa-moon", theme !== "dark");
        }
    }

    updateTheme(document.documentElement.getAttribute("data-theme") || "dark");

    button.addEventListener("click", function () {
        const theme = document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";

        updateTheme(theme);

        try {
            localStorage.setItem("theme", theme);
        } catch (error) {
            // Le thème reste utilisable lorsque le stockage est indisponible.
        }
    });

    const scrollTopButton = document.querySelector(".project-scroll-top");

    if (!scrollTopButton) {
        return;
    }

    function updateScrollTopVisibility() {
        scrollTopButton.classList.toggle("is-visible", window.scrollY > 300);
    }

    scrollTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
    updateScrollTopVisibility();
})();
