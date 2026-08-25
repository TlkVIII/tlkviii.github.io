// Variables
const loader = document.querySelector('.loader-wrapper');
const nav = document.querySelector('nav');
const toggleMenu = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const scrollTopBtn = document.querySelector('.scroll-top');
const mobileNavigationBreakpoint = 980;

// Gestion du mode sombre
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Vérifier si l'utilisateur a déjà une préférence
const currentTheme = localStorage.getItem('theme') || 'dark';

// Appliquer le thème au chargement
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    themeToggle.setAttribute('aria-label', 'Activer le thème clair');
}

// Basculer le thème lorsqu'on clique sur le bouton
themeToggle.addEventListener('click', () => {
    // Vérifier le thème actuel
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';
    
    // Basculer le thème
    if (currentTheme !== 'dark') {
        newTheme = 'dark';
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeToggle.setAttribute('aria-label', 'Activer le thème clair');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        themeToggle.setAttribute('aria-label', 'Activer le thème sombre');
    }
    
    // Appliquer le nouveau thème
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Sauvegarder la préférence de l'utilisateur
    localStorage.setItem('theme', newTheme);
});

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 450);
});

// Navigation fixée lors du défilement
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
        scrollTopBtn.classList.add('active');
    } else {
        nav.classList.remove('scrolled');
        scrollTopBtn.classList.remove('active');
    }
    
    // Animation au défilement
    animateOnScroll();
});

// Menu mobile
toggleMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggleMenu.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    toggleMenu.setAttribute('aria-expanded', String(isOpen));
    toggleMenu.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');

    if (!isOpen) {
        closeMobileDropdowns();
    }
});

// Sous-menus mobile (toggle au clic)
const navDropdowns = document.querySelectorAll('.nav-links .dropdown');

function closeMobileDropdowns() {
    navDropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');

        const trigger = dropdown.querySelector(':scope > a');
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }
    });
}

navDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
        if (window.innerWidth > mobileNavigationBreakpoint) return;
        e.preventDefault();

        const shouldOpen = !dropdown.classList.contains('open');
        closeMobileDropdowns();

        if (shouldOpen) {
            dropdown.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        }
    });
});

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        // En mobile, un clic sur l'entrée parent de dropdown sert uniquement à ouvrir/fermer son sous-menu
        if (window.innerWidth <= mobileNavigationBreakpoint && link.parentElement.classList.contains('dropdown')) {
            return;
        }

        navLinks.classList.remove('active');
        toggleMenu.classList.remove('active');
        toggleMenu.setAttribute('aria-expanded', 'false');
        toggleMenu.setAttribute('aria-label', 'Ouvrir le menu');
        closeMobileDropdowns();
    });
});

// Animation des compétences
function animateSkills() {
    skillProgressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress;
    });
}

// Filtrage des projets
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Activer le bouton sélectionné
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtrer les projets
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Animation au défilement
function animateOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('active');
            
            // Animer les barres de compétences quand la section est visible
            if (element.closest('#competences')) {
                animateSkills();
            }
        }
    });
}

// Formulaire de contact
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    const feedback = contactForm.querySelector(".contact-form-feedback");
    const attachmentInput = contactForm.querySelector("#contact-attachments");
    const attachmentSummary = contactForm.querySelector(".contact-file-summary");
    const maxAttachmentCount = 3;
    const maxAttachmentSize = 5 * 1024 * 1024;
    const maxTotalAttachmentSize = 10 * 1024 * 1024;
    const allowedExtensions = new Set([
        "pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"
    ]);

    const validateAttachments = (files) => {
        if (files.length > maxAttachmentCount) {
            throw new Error("Vous pouvez joindre 3 fichiers maximum.");
        }

        let totalSize = 0;

        files.forEach((file) => {
            const extension = file.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.has(extension)) {
                throw new Error(
                    `Le fichier "${file.name}" n'est pas autorisé. Utilisez un PDF, un document Word ou une image.`
                );
            }

            if (file.size > maxAttachmentSize) {
                throw new Error(
                    `Le fichier "${file.name}" dépasse la limite de 5 Mo.`
                );
            }

            totalSize += file.size;
        });

        if (totalSize > maxTotalAttachmentSize) {
            throw new Error("Le poids total des pièces jointes ne doit pas dépasser 10 Mo.");
        }
    };

    const updateAttachmentSummary = () => {
        const files = Array.from(attachmentInput.files || []);

        if (files.length === 0) {
            attachmentSummary.textContent = "Aucun fichier sélectionné.";
            return;
        }

        attachmentSummary.textContent = files
            .map((file) => `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} Mo)`)
            .join(" · ");
    };

    const encodeAttachment = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = String(reader.result || "");
            const encodedContent = result.split(",")[1];

            if (!encodedContent) {
                reject(new Error(`Impossible de lire le fichier "${file.name}".`));
                return;
            }

            resolve({
                filename: file.name,
                content: encodedContent,
                contentType: file.type || "application/octet-stream"
            });
        };

        reader.onerror = () => {
            reject(new Error(`Impossible de lire le fichier "${file.name}".`));
        };

        reader.readAsDataURL(file);
    });

    attachmentInput.addEventListener("change", () => {
        try {
            validateAttachments(Array.from(attachmentInput.files || []));
            updateAttachmentSummary();

            if (feedback.dataset.state === "error") {
                feedback.textContent = "";
                delete feedback.dataset.state;
            }
        } catch (error) {
            attachmentInput.value = "";
            updateAttachmentSummary();
            feedback.textContent = error.message;
            feedback.dataset.state = "error";
        }
    });

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const submitLabel = submitBtn.querySelector("span");
        const originalText = submitLabel.textContent;
        const formData = new FormData(contactForm);

        if (formData.get("_honey")) {
            return;
        }

        feedback.textContent = "";
        delete feedback.dataset.state;
        submitLabel.textContent = "Envoi en cours...";
        submitBtn.disabled = true;

        try {
            const files = Array.from(attachmentInput.files || []);
            validateAttachments(files);

            const attachments = await Promise.all(files.map(encodeAttachment));
            const response = await fetch(contactForm.dataset.contactUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    subject: formData.get("subject"),
                    message: formData.get("message"),
                    _honey: formData.get("_honey") || "",
                    attachments
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || "Impossible d'envoyer le message."
                );
            }

            contactForm.reset();
            updateAttachmentSummary();
            feedback.textContent =
                "Votre message a bien été envoyé. Merci !";
            feedback.dataset.state = "success";

            if (
                typeof window.gtag === "function" &&
                window["ga-disable-G-RXJNW6WN37"] !== true
            ) {
                window.gtag("event", "contact_message_sent", {
                    attachment_count: attachments.length
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire :", error);
            feedback.textContent = error.message ||
                "Impossible d'envoyer le message. Réessayez ou écrivez à fayed.amourani8@gmail.com.";
            feedback.dataset.state = "error";
        } finally {
            submitLabel.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Animation pour l'effet machine à écrire
const typewriterElement = document.querySelector('.typewriter');
if (typewriterElement) {
    // Sur mobile, on garde un texte fixe pour éviter les sauts de mise en page.
    if (window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typewriterElement.textContent = 'Développeur web & mobile';
    } else {
        const phrases = [
            'Développeur web & mobile',
            'Créateur d’expériences web',
            'Étudiant en BTS SIO SLAM'
        ];
        let phraseIndex = 0;
        let characterIndex = phrases[0].length;
        let isDeleting = true;

        const typewriter = () => {
            const phrase = phrases[phraseIndex];

            if (isDeleting) {
                characterIndex -= 1;
            } else {
                characterIndex += 1;
            }

            typewriterElement.textContent = phrase.slice(0, characterIndex);

            let nextDelay = isDeleting ? 48 : 88;

            if (!isDeleting && characterIndex === phrase.length) {
                isDeleting = true;
                nextDelay = 2400;
            } else if (isDeleting && characterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                nextDelay = 320;
            }

            window.setTimeout(typewriter, nextDelay);
        };

        window.setTimeout(typewriter, 1900);
    }
}

// Animation initiale
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();

    const currentYear = document.querySelector('#current-year');

    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }
});

// Si aucune vidéo de showreel n'a encore été ajoutée, proposer les projets à la place.
const showreelVideo = document.querySelector('#showreel video');

if (showreelVideo) {
    const showreelWrapper = showreelVideo.closest('.video-wrapper');
    const showreelSource = showreelVideo.querySelector('source');
    const displayShowreelFallback = () => {
        showreelWrapper.classList.add('is-unavailable');
    };

    showreelVideo.addEventListener('error', displayShowreelFallback);

    if (showreelSource) {
        showreelSource.addEventListener('error', displayShowreelFallback);
    }
}

// Vérification de l'existence du CV
const cvButton = document.querySelector('a[download]');
if (cvButton) {
    const cvPath = cvButton.getAttribute('href');
    
    // Fonction pour vérifier si le fichier existe
    const checkFileExists = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    };
    
    // Vérifier au chargement de la page
    document.addEventListener('DOMContentLoaded', async () => {
        const fileExists = await checkFileExists(cvPath);
        
        if (!fileExists) {
            cvButton.classList.add('disabled');
            cvButton.setAttribute('title', 'CV en cours de mise à jour');
            cvButton.textContent = 'CV bientôt disponible';
            
            // Empêcher le clic si le fichier n'existe pas
            cvButton.addEventListener('click', (e) => {
                if (cvButton.classList.contains('disabled')) {
                    e.preventDefault();
                    alert('Le CV sera bientôt disponible en téléchargement.');
                }
            });
        }
    });
}

// Détecter les préférences système de l'utilisateur
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Si l'utilisateur n'a pas encore défini de préférence dans le site
if (!localStorage.getItem('theme')) {
    // Utiliser les préférences système
    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Écouter les changements de préférences système
prefersDarkScheme.addEventListener('change', (e) => {
    // Seulement si l'utilisateur n'a pas explicitement choisi un thème
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
});

// Chargement dynamique du parcours
document.addEventListener('DOMContentLoaded', async () => {
    // Sélectionner le conteneur de la timeline
    const timelineContainer = document.querySelector('#parcours .timeline');
    
    if (timelineContainer) {
        try {
            // Charger les données du CV
            const response = await fetch('js/cv-data.json');
            const data = await response.json();
            
            // Vider le conteneur actuel
            timelineContainer.innerHTML = '';
            
            // Remplir avec les données du fichier JSON - FORMATION
            data.education.forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                
                let detailsHTML = '';
                item.details.forEach(detail => {
                    detailsHTML += `<p>${detail}</p>`;
                });
                
                timelineItem.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">
                        <h3>${item.period}</h3>
                    </div>
                    <div class="timeline-content">
                        <h4>${item.title}</h4>
                        ${item.location ? `<p>${item.location}</p>` : ''}
                        ${detailsHTML}
                    </div>
                `;
                
                timelineContainer.appendChild(timelineItem);
            });
            


            

            



            

            
        } catch (error) {
            console.error('Erreur lors du chargement des données du CV:', error);
        }
    }
});

// Gestion de l'accordéon de la section Parcours
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Ouvrir le premier élément par défaut
    const firstAccordionItem = document.querySelector('.accordion-item');
    if (firstAccordionItem) {
        firstAccordionItem.classList.add('active');
    }
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Récupérer l'élément parent (accordion-item)
            const parent = this.parentElement;
            
            // Vérifier si l'élément est déjà actif
            const isActive = parent.classList.contains('active');
            
            // Fermer tous les accordéons
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Si l'élément n'était pas actif, l'ouvrir
            if (!isActive) {
                parent.classList.add('active');
            }
            
        });
    });
}); 
