(function () {
    "use strict";

    function initializeJournal() {
        const navigation = document.querySelector(".nav-menu");
        const menuButton = document.querySelector(".photo-menu-toggle");

        if (navigation && menuButton) {
            const closeMenu = function () {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Ouvrir le menu");
            };

            menuButton.addEventListener("click", function (event) {
                event.stopPropagation();
                const open = navigation.classList.toggle("is-open");
                menuButton.setAttribute("aria-expanded", String(open));
                menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
            });

            navigation.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", closeMenu);
            });

            document.addEventListener("click", function (event) {
                if (navigation.classList.contains("is-open") && !navigation.contains(event.target)) {
                    closeMenu();
                }
            });

            window.addEventListener("resize", function () {
                if (window.innerWidth > 760) {
                    closeMenu();
                }
            }, { passive: true });
        }

        const data = window.photoData || {};
        const cameraCount = Array.isArray(data.cameraPhotos) ? data.cameraPhotos.length : 0;
        const phoneCount = Array.isArray(data.phonePhotos) ? data.phonePhotos.length : 0;
        const counters = document.querySelectorAll("[data-photo-count]");

        counters.forEach(function (counter) {
            if (!cameraCount && !phoneCount) {
                return;
            }

            counter.textContent = String(counter.dataset.photoScope === "camera"
                ? cameraCount
                : cameraCount + phoneCount);
        });

        const filters = document.querySelector("#gallery-filters");
        const galleryCount = document.querySelector(".photo-gallery-count [data-photo-count]");

        if (filters && galleryCount) {
            filters.addEventListener("click", function (event) {
                const button = event.target.closest(".filter-btn");

                if (!button) {
                    return;
                }

                const nextCount = button.dataset.filter === "camera"
                    ? cameraCount
                    : button.dataset.filter === "phone"
                        ? phoneCount
                        : cameraCount + phoneCount;

                galleryCount.textContent = String(nextCount);
            });
        }

        const reduced = typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced || typeof window.IntersectionObserver !== "function") {
            return;
        }

        const elements = document.querySelectorAll(
            ".photo-section-heading, .photo-collection-card, .photo-studio-invite, .gallery-item, .upload-area"
        );

        const observer = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -16px 0px" });

        elements.forEach(function (element, index) {
            element.classList.add("journal-reveal");
            element.style.setProperty("--journal-delay", String(index % 3 * 55) + "ms");
            observer.observe(element);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeJournal);
    } else {
        initializeJournal();
    }
})();
