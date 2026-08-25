(function () {
    "use strict";

    const FAVORITES_STORAGE_KEY = "styloMagikFavorites";

    function normalizeText(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function getFavorites() {
        try {
            const savedFavorites = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]");
            return new Set(Array.isArray(savedFavorites) ? savedFavorites : []);
        } catch (error) {
            return new Set();
        }
    }

    function saveFavorites(favorites) {
        try {
            window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
        } catch (error) {
            // Les favoris restent disponibles pendant la visite si le stockage est désactivé.
        }
    }

    function getProductReference(card) {
        const reference = card.querySelector(".product-reference");
        return reference ? reference.textContent.split(":").slice(1).join(":").trim() : "";
    }

    function getProductName(card) {
        const title = card.querySelector("h3");
        return title ? title.textContent.trim() : "";
    }

    function getProductPrice(card) {
        const price = card.querySelector(".price");
        if (!price) return 0;

        const number = price.textContent.replace(/[^\d,.]/g, "").replace(",", ".");
        return Number.parseFloat(number) || 0;
    }

    function initializeFavorites(cards, catalogCards, onFavoritesChanged) {
        const favorites = getFavorites();
        const favoriteButtons = [];
        const favoriteCounters = document.querySelectorAll("[data-favorites-count]");

        function updateFavoriteButtons() {
            favoriteButtons.forEach(function (entry) {
                const active = favorites.has(entry.reference);
                entry.button.classList.toggle("is-favorite", active);
                entry.button.setAttribute("aria-pressed", String(active));
                entry.button.setAttribute(
                    "aria-label",
                    (active ? "Retirer " : "Ajouter ") + entry.name +
                    (active ? " des favoris" : " aux favoris")
                );
                entry.button.innerHTML = active
                    ? '<i class="fas fa-heart" aria-hidden="true"></i>'
                    : '<i class="far fa-heart" aria-hidden="true"></i>';
            });

            const visibleFavoritesCount = catalogCards.filter(function (card) {
                return favorites.has(getProductReference(card));
            }).length;

            favoriteCounters.forEach(function (counter) {
                counter.textContent = String(visibleFavoritesCount);
            });
        }

        cards.forEach(function (card) {
            const reference = getProductReference(card);
            const imageContainer = card.querySelector(".image-container");

            if (!reference || !imageContainer) {
                return;
            }

            const button = document.createElement("button");
            button.type = "button";
            button.className = "shop-favorite-button";

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (favorites.has(reference)) {
                    favorites.delete(reference);
                } else {
                    favorites.add(reference);
                }

                saveFavorites(favorites);
                updateFavoriteButtons();
                onFavoritesChanged();
            });

            imageContainer.appendChild(button);
            favoriteButtons.push({
                button: button,
                reference: reference,
                name: getProductName(card)
            });
        });

        updateFavoriteButtons();
        return favorites;
    }

    function initializeCatalog(cards, favorites, counter) {
        const catalog = document.querySelector(".products-section .product-grid");
        const search = document.querySelector("[data-product-search]");
        const sort = document.querySelector("[data-product-sort]");
        const favoriteFilter = document.querySelector("[data-favorites-filter]");
        const emptyResults = document.querySelector("[data-catalog-empty]");
        const clearFilters = document.querySelector("[data-clear-filters]");
        const initialOrder = new Map();

        cards.forEach(function (card, index) {
            initialOrder.set(card, index);
        });

        function refreshCatalog() {
            if (!catalog) {
                return;
            }

            const term = normalizeText(search ? search.value : "");
            const onlyFavorites = favoriteFilter && favoriteFilter.getAttribute("aria-pressed") === "true";
            let visibleCount = 0;

            const sortedCards = cards.slice().sort(function (first, second) {
                const selectedSort = sort ? sort.value : "recommended";

                if (selectedSort === "price-asc") {
                    return getProductPrice(first) - getProductPrice(second);
                }

                if (selectedSort === "price-desc") {
                    return getProductPrice(second) - getProductPrice(first);
                }

                if (selectedSort === "name") {
                    return getProductName(first).localeCompare(getProductName(second), "fr", {
                        sensitivity: "base"
                    });
                }

                return initialOrder.get(first) - initialOrder.get(second);
            });

            sortedCards.forEach(function (card) {
                const reference = getProductReference(card);
                const searchableText = normalizeText(getProductName(card) + " " + reference);
                const matchesSearch = !term || searchableText.includes(term);
                const matchesFavorites = !onlyFavorites || favorites.has(reference);
                const visible = matchesSearch && matchesFavorites;

                card.hidden = !visible;
                catalog.appendChild(card);

                if (visible) {
                    visibleCount += 1;
                }
            });

            if (counter) {
                const suffix = visibleCount > 1 ? " articles" : " article";
                counter.textContent = term || onlyFavorites
                    ? String(visibleCount) + " / " + String(cards.length) + suffix
                    : String(visibleCount) + suffix;
            }

            if (emptyResults) {
                emptyResults.hidden = visibleCount !== 0;
            }
        }

        if (search) {
            search.addEventListener("input", refreshCatalog);

            document.addEventListener("keydown", function (event) {
                const active = document.activeElement;
                const tag = active && active.tagName ? active.tagName.toLowerCase() : "";

                if (event.key === "/" && tag !== "input" && tag !== "textarea" && tag !== "select") {
                    event.preventDefault();
                    search.focus();
                }

                if (event.key === "Escape" && active === search && search.value) {
                    search.value = "";
                    refreshCatalog();
                }
            });
        }

        if (sort) {
            sort.addEventListener("change", refreshCatalog);
        }

        if (favoriteFilter) {
            favoriteFilter.addEventListener("click", function () {
                const active = favoriteFilter.getAttribute("aria-pressed") !== "true";
                favoriteFilter.setAttribute("aria-pressed", String(active));
                favoriteFilter.classList.toggle("is-active", active);
                refreshCatalog();
            });
        }

        if (clearFilters) {
            clearFilters.addEventListener("click", function () {
                if (search) search.value = "";
                if (sort) sort.value = "recommended";

                if (favoriteFilter) {
                    favoriteFilter.setAttribute("aria-pressed", "false");
                    favoriteFilter.classList.remove("is-active");
                }

                refreshCatalog();
                if (search) search.focus();
            });
        }

        refreshCatalog();
        return refreshCatalog;
    }

    function initializeCartFeedback() {
        document.querySelectorAll(".add-to-cart").forEach(function (button) {
            button.addEventListener("click", function () {
                if (!button.dataset.originalLabel) {
                    button.dataset.originalLabel = button.textContent.trim();
                }

                button.classList.add("is-added");
                button.textContent = "✓ Ajouté au panier";

                if (typeof window.clearTimeout === "function" && button._feedbackTimeout) {
                    window.clearTimeout(button._feedbackTimeout);
                }

                if (typeof window.setTimeout === "function") {
                    button._feedbackTimeout = window.setTimeout(function () {
                        button.textContent = button.dataset.originalLabel;
                        button.classList.remove("is-added");
                    }, 1550);
                }
            });
        });
    }

    function initializeAnimations() {
        const reduced = typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced || typeof window.IntersectionObserver !== "function") {
            return;
        }

        const items = document.querySelectorAll(
            ".shop-section-heading, .category-card, .product-card, .advantage-card, " +
            ".testimonial-card, .contact-container, .shop-editorial"
        );

        const observer = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -15px 0px" });

        items.forEach(function (element, index) {
            element.classList.add("shop-reveal");
            element.style.setProperty("--shop-delay", String(index % 3 * 65) + "ms");
            observer.observe(element);
        });
    }

    function initializeShop() {
        const counter = document.querySelector("[data-product-count]");
        const catalogCards = Array.from(document.querySelectorAll(".products-section .product-card"));
        const allCards = Array.from(document.querySelectorAll(".product-card"));
        let refreshCatalog = function () {};

        if (counter) {
            counter.setAttribute("aria-live", "polite");
            counter.textContent = String(catalogCards.length) +
                " article" + (catalogCards.length > 1 ? "s" : "");
        }

        const favorites = initializeFavorites(allCards, catalogCards, function () {
            refreshCatalog();
        });

        refreshCatalog = initializeCatalog(catalogCards, favorites, counter);
        initializeCartFeedback();
        initializeAnimations();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeShop);
    } else {
        initializeShop();
    }
})();
