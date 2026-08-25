(function () {
    "use strict";

    const root = document.documentElement;
    const reducedMotion = typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = typeof window.matchMedia === "function" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const compactScreen = typeof window.innerWidth === "number" && window.innerWidth <= 680;
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

    function setupAmbientParticles() {
        const hosts = document.querySelectorAll(".hero, .project-hero");
        const particleCount = compactScreen ? 9 : 22;

        hosts.forEach(function (host) {
            const field = document.createElement("div");

            field.className = "motion-particle-field";
            field.setAttribute("aria-hidden", "true");

            for (let index = 0; index < particleCount; index += 1) {
                const particle = document.createElement("span");
                const left = (index * 47 + 13) % 97;
                const top = (index * 31 + 17) % 92;

                particle.className = "motion-particle";
                particle.style.setProperty("--particle-left", String(left) + "%");
                particle.style.setProperty("--particle-top", String(top) + "%");
                particle.style.setProperty("--particle-size", String(index % 5 === 0 ? 4 : index % 3 === 0 ? 3 : 2) + "px");
                particle.style.setProperty("--particle-delay", String((index % 8) * -0.7) + "s");
                particle.style.setProperty("--particle-duration", String(4.4 + index % 6 * 0.8) + "s");
                particle.style.setProperty("--particle-drift", String((index % 4 - 1.5) * 13) + "px");
                field.appendChild(particle);
            }

            host.appendChild(field);
        });
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
            ".skill-icon, " +
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

    function setupCursorHalo() {
        if (!finePointer || compactScreen) {
            return;
        }

        const halo = document.createElement("div");
        let pointerX = 0;
        let pointerY = 0;
        let queued = false;

        halo.className = "motion-cursor-halo";
        halo.setAttribute("aria-hidden", "true");
        document.body.appendChild(halo);

        window.addEventListener("pointermove", function (event) {
            pointerX = event.clientX;
            pointerY = event.clientY;
            halo.classList.add("motion-cursor-active");

            if (event.target && typeof event.target.closest === "function") {
                if (event.target.closest("a, button, .motion-interactive-card")) {
                    halo.classList.add("motion-cursor-hovering");
                } else {
                    halo.classList.remove("motion-cursor-hovering");
                }
            }

            if (queued) {
                return;
            }

            queued = true;
            scheduleFrame(function () {
                halo.style.transform = "translate3d(" + String(pointerX) + "px, " + String(pointerY) + "px, 0)";
                queued = false;
            });
        }, { passive: true });

        window.addEventListener("blur", function () {
            halo.classList.remove("motion-cursor-active");
        });
    }

    function setupMagneticButtons() {
        if (!finePointer || compactScreen) {
            return;
        }

        const buttons = document.querySelectorAll(
            ".btn-primary, .detail-button-primary, .theme-toggle, .detail-theme-toggle"
        );

        buttons.forEach(function (button) {
            button.classList.add("motion-magnetic-button");

            button.addEventListener("pointermove", function (event) {
                const bounds = button.getBoundingClientRect();

                if (!bounds.width || !bounds.height) {
                    return;
                }

                const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
                const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;

                button.style.setProperty("--magnetic-x", String(Math.max(-7, Math.min(7, x)).toFixed(2)) + "px");
                button.style.setProperty("--magnetic-y", String(Math.max(-6, Math.min(6, y)).toFixed(2)) + "px");
            }, { passive: true });

            button.addEventListener("pointerleave", function () {
                button.style.setProperty("--magnetic-x", "0px");
                button.style.setProperty("--magnetic-y", "0px");
            });
        });
    }

    function setupNumericCounters() {
        const elements = document.querySelectorAll(
            ".about-stat-card > strong, .hero-floating-projects strong"
        );
        const counters = [];

        elements.forEach(function (element) {
            const original = element.textContent.trim();
            const match = original.match(/^(\d+)(.*)$/);

            if (!match) {
                return;
            }

            counters.push({
                element: element,
                target: Number(match[1]),
                suffix: match[2]
            });
        });

        if (!counters.length) {
            return;
        }

        function animateCounter(counter) {
            let firstFrame = null;

            function render(timestamp) {
                const time = typeof timestamp === "number" ? timestamp : Date.now();

                if (firstFrame === null) {
                    firstFrame = time;
                }

                const progress = Math.min((time - firstFrame) / 1150, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                counter.element.textContent = String(Math.round(counter.target * eased)) + counter.suffix;

                if (progress < 1) {
                    scheduleFrame(render);
                }
            }

            scheduleFrame(render);
        }

        if (typeof window.IntersectionObserver !== "function") {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                const counter = counters.find(function (item) {
                    return item.element === entry.target;
                });

                if (counter) {
                    animateCounter(counter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(function (counter) {
            observer.observe(counter.element);
        });
    }

    function setupProjectAccents() {
        const visual = document.querySelector(".project-visual-skillup");
        const stage = document.querySelector(".project-stage");

        if (visual) {
            const symbols = ["</>", "{ }", "01", "✦", "//"];

            symbols.forEach(function (symbol, index) {
                const accent = document.createElement("span");

                accent.className = "motion-code-symbol";
                accent.textContent = symbol;
                accent.setAttribute("aria-hidden", "true");
                accent.style.setProperty("--code-left", String(13 + index * 18) + "%");
                accent.style.setProperty("--code-top", String(index % 2 === 0 ? 23 : 71) + "%");
                accent.style.setProperty("--code-delay", String(index * -0.9) + "s");
                visual.appendChild(accent);
            });
        }

        if (stage) {
            const orb = document.createElement("span");

            orb.className = "motion-stage-orb";
            orb.setAttribute("aria-hidden", "true");
            stage.appendChild(orb);
        }
    }

    createScrollProgress();

    if (reducedMotion) {
        return;
    }

    setupAmbientParticles();
    setupHeroEntrance();
    setupScrollReveals();
    setupInteractiveCards();
    setupSubtleTilt();
    setupCursorHalo();
    setupMagneticButtons();
    setupNumericCounters();
    setupProjectAccents();
})();
