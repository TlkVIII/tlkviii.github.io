document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".main-header");
    let lastScrollY = window.scrollY;

    const backToTopBtn = document.createElement("button");
    backToTopBtn.type = "button";
    backToTopBtn.className = "back-to-top";
    backToTopBtn.setAttribute("aria-label", "Retour en haut");
    backToTopBtn.textContent = "↑";
    document.body.appendChild(backToTopBtn);

    const onScroll = () => {
        const currentScrollY = window.scrollY;

        if (header) {
            const isScrollingDown = currentScrollY > lastScrollY;
            const passedHeader = currentScrollY > 120;
            header.classList.toggle("nav-hidden", isScrollingDown && passedHeader);
        }

        backToTopBtn.classList.toggle("is-visible", currentScrollY > 280);
        lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
