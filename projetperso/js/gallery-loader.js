document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("gallery-grid");
    if (!gallery || !window.photoData) return;

    const pageType = gallery.dataset.page;
    const filtersContainer = document.getElementById("gallery-filters");
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button type="button" class="lightbox-close" aria-label="Fermer l'image">&times;</button>
            <img class="lightbox-image" alt="Apercu de la photo" />
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxClose = lightbox.querySelector(".lightbox-close");

    const openLightbox = (src, alt) => {
        lightboxImage.src = src;
        lightboxImage.alt = alt || "Apercu de la photo";
        lightbox.classList.add("is-open");
        document.body.classList.add("lightbox-open");
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        document.body.classList.remove("lightbox-open");
        lightboxImage.src = "";
    };

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox || event.target === lightboxClose) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });

    gallery.addEventListener("click", (event) => {
        const clickedCard = event.target.closest(".gallery-item");
        if (!clickedCard) return;

        const clickedImage = clickedCard.querySelector("img");
        if (!clickedImage) return;

        const fullSrc = clickedImage.dataset.originalSrc || clickedImage.src;
        openLightbox(fullSrc, clickedImage.alt);
    });

    const toWebJpg = (filename) => filename.replace(/\.[^/.]+$/, ".jpg");
    const phonePhotos = (window.photoData.phonePhotos || []).map((name) => ({
        src: `images/web/${toWebJpg(name)}`,
        originalSrc: `images/${name}`,
        label: "iPhone",
        type: "phone"
    }));
    const cameraPhotos = (window.photoData.cameraPhotos || []).map((name) => ({
        src: `images/appareil-photo/web/${name}`,
        originalSrc: `images/appareil-photo/${name}`,
        label: "Appareil photo",
        type: "camera"
    }));

    const allPhotos = pageType === "photographie"
        ? cameraPhotos
        : [...cameraPhotos, ...phonePhotos];

    const renderPhotos = (photosToRender) => {
        if (!photosToRender.length) {
            gallery.innerHTML = '<div class="gallery-empty">Aucune photo pour ce filtre.</div>';
            return;
        }

        gallery.innerHTML = photosToRender
            .map(
                (photo, index) => `
            <article class="gallery-item">
                <img src="${photo.src}" data-original-src="${photo.originalSrc || ""}" alt="Photo ${index + 1}" loading="lazy" decoding="async" />
                <span class="photo-badge">${photo.label}</span>
            </article>
        `
            )
            .join("");

        gallery.querySelectorAll("img[data-original-src]").forEach((img) => {
            img.addEventListener("error", () => {
                const fallback = img.dataset.originalSrc;
                if (fallback && img.src.indexOf("/web/") !== -1) {
                    img.src = fallback;
                }
            }, { once: true });
        });
    };

    if (!allPhotos.length) {
        gallery.innerHTML = '<div class="gallery-empty">Ajoute des photos dans le dossier images pour les afficher ici.</div>';
        return;
    }

    renderPhotos(allPhotos);

    if (pageType !== "galerie" || !filtersContainer) return;

    filtersContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".filter-btn");
        if (!button) return;

        const selectedFilter = button.dataset.filter;
        const nextPhotos =
            selectedFilter === "camera"
                ? cameraPhotos
                : selectedFilter === "phone"
                    ? phonePhotos
                    : allPhotos;

        filtersContainer.querySelectorAll(".filter-btn").forEach((btn) => {
            btn.classList.toggle("active", btn === button);
        });

        renderPhotos(nextPhotos);
    });
});
