(function () {
    "use strict";

    function initializeShop() {
        const counter = document.querySelector("[data-product-count]");
        const products = document.querySelectorAll(".products-section .product-card");

        if (counter) {
            counter.textContent = String(products.length) + " article" + (products.length > 1 ? "s" : "");
        }

        const reduced = typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced || typeof window.IntersectionObserver !== "function") {
            return;
        }

        const items = document.querySelectorAll(
            ".shop-section-heading, .category-card, .product-card, .advantage-card, .testimonial-card, .contact-container"
        );

        const observer = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -18px 0px" });

        items.forEach(function (element, index) {
            element.classList.add("shop-reveal");
            element.style.setProperty("--shop-delay", String(index % 3 * 65) + "ms");
            observer.observe(element);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeShop);
    } else {
        initializeShop();
    }
})();
