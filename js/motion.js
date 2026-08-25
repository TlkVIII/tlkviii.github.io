(function () {
    "use strict";

    const root = document.documentElement;
    const reducedMotion = typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = typeof window.matchMedia === "function" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scheduleFrame = typeof window.requestAnimationFrame === "function"
        ? window.requestAnimationFrame.bind(window)
        : function (callback) { callback(); };

    root.classList.add("motion-ready");

    if (reducedMotion) {
        root.classList.add("motion-reduced");
    }

    function createScrollProgress() {
        const progress = document.createElement("div");
        const fill = document.createElement("span");
        let queued = false;

        progress.className = "motion-scroll-progress";
        progress.setAttribute("role", "progressbar");
        progress.setAttribute("aria-label", "Progression de lecture de la page");
        progress.setAttribute("aria-valuemin", "0");
        progress.setAttribute("aria-valuemax", "100");

        fill.className = "motion-scroll-progress-fill";
        progress.appendChild(fill);
        document.body.appendChild(progress);

        function renderProgress() {
            const pageHeight = Math.max(
                root.scrollHeight || 0,
                document.body.scrollHeight || 0
            );
            const scrollableHeight = Math.max(pageHeight - window.innerHeight, 0);
            const percentage = scrollableHeight > 0
                ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
                : 0;

            fill.style.transform = "scaleX(" + percentage.toFixed(4) + ")";
            progress.setAttribute("aria-valuenow", String(Math.round(percentage * 100)));
            queued = false;
        }

        function queueProgress() {
            if (queued) {
                return;
            }

            queued = true;
            scheduleFrame(renderProgress);
        }

        window.addEventListener("scroll", queueProgress, { passive: true });
        window.addEventListener("resize", queueProgress, { passive: true });
        renderProgress();
    }

    function setupHeroEntrance() {
        const introElements = document.querySelectorAll(
            ".hero-copy > *, " +
            ".project-hero > .breadcrumb, " +
            ".project-hero > .project-pill, " +
            ".project-hero > h1, " +
            ".project-hero > .project-intro, " +
            ".project-hero > .hero-actions, " +
            ".project-hero > .project-meta-grid"
        );

        introElements.forEach(function (element, index) {
            element.classList.add("motion-hero-enter");
            element.style.setProperty("--motion-hero-delay", String(Math.min(index, 8) * 85 + 80) + "ms");
        });

        const mainVisual = document.querySelector(".hero-visual");
        const projectStage = document.querySelector(".project-stage");
        const navigation = document.querySelector("nav");

        if (mainVisual) {
            mainVisual.classList.add("motion-stage-enter");
        }

        if (projectStage) {
            projectStage.classList.add("motion-stage-enter");
        }

        if (navigation) {
            navigation.classList.add("motion-nav-enter");
        }
    }

    function setupScrollReveals() {
        const elements = document.querySelectorAll(
            ".section-heading, " +
            ".contact-section-heading, " +
            ".about-text, " +
            ".about-feature-card, " +
            ".about-stat-card, " +
            ".identity-card, " +
            ".identity-quote, " +
            ".bts-description, " +
            ".option-card, " +
            ".veille-card, " +
            ".accordion-item, " +
            ".skill-category, " +
            ".project-card, " +
            ".cv-showcase, " +
            ".showreel-container, " +
            ".contact-info, " +
            ".contact-form-card, " +
            ".detail-section-heading, " +
            ".overview-copy, " +
            ".overview-callout, " +
            ".feature-card, " +
            ".stack-group, " +
            ".challenge-card, " +
            ".visual-card, " +
            ".project-closing, " +
            ".project-meta-grid .meta-item"
        );
        const groupIndexes = new WeakMap();

        if (typeof window.IntersectionObserver !== "function") {
            elements.forEach(function (element) {
                element.classList.add("motion-visible");
            });
            return;
        }

        const observer = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("motion-visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -32px 0px"
        });

        elements.forEach(function (element) {
            const parent = element.parentElement;
            const index = parent ? groupIndexes.get(parent) || 0 : 0;

            if (parent) {
                groupIndexes.set(parent, index + 1);
            }

            element.style.setProperty("--motion-delay", String(Math.min(index, 5) * 75) + "ms");
            element.classList.add("motion-reveal");
            observer.observe(element);
        });
    }

    function setupInteractiveCards() {
        const cards = document.querySelectorAll(
            ".identity-card, " +
            ".option-card, " +
            ".veille-card, " +
            ".skill-category, " +
            ".project-card, " +
            ".about-feature-card, " +
            ".about-stat-card, " +
            ".feature-card, " +
            ".challenge-card, " +
            ".stack-group, " +
            ".overview-callout, " +
            ".visual-card"
        );

        cards.forEach(function (card) {
            card.classList.add("motion-interactive-card");

            if (!finePointer) {
                return;
            }

            card.addEventListener("pointermove", function (event) {
                const bounds = card.getBoundingClientRect();

                card.style.setProperty("--motion-pointer-x", String(event.clientX - bounds.left) + "px");
                card.style.setProperty("--motion-pointer-y", String(event.clientY - bounds.top) + "px");
            }, { passive: true });
        });
    }

    function setupSubtleTilt() {
        if (!finePointer) {
            return;
        }

        const surfaces = document.querySelectorAll(".hero-logo-frame, .project-stage");

        surfaces.forEach(function (surface) {
            surface.classList.add("motion-tilt");

            surface.addEventListener("pointermove", function (event) {
                const bounds = surface.getBoundingClientRect();

                if (!bounds.width || !bounds.height) {
                    return;
                }

                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;

                surface.style.setProperty("--motion-tilt-x", String((-y * 4).toFixed(2)) + "deg");
                surface.style.setProperty("--motion-tilt-y", String((x * 4).toFixed(2)) + "deg");
            }, { passive: true });

            surface.addEventListener("pointerleave", function () {
                surface.style.setProperty("--motion-tilt-x", "0deg");
                surface.style.setProperty("--motion-tilt-y", "0deg");
            });
        });
    }

    createScrollProgress();

    if (reducedMotion) {
        return;
    }

    setupHeroEntrance();
    setupScrollReveals();
    setupInteractiveCards();
    setupSubtleTilt();
})();
