// Variables
const loader = document.querySelector('.loader-wrapper');
const nav = document.querySelector('nav');
const toggleMenu = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const scrollTopBtn = document.querySelector('.scroll-top');

// Gestion du mode sombre
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Vérifier si l'utilisateur a déjà une préférence
const currentTheme = localStorage.getItem('theme') || 'light';

// Appliquer le thème au chargement
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
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
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
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
    }, 1000);
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
});

// Sous-menus mobile (toggle au clic)
const navDropdowns = document.querySelectorAll('.nav-links .dropdown');
navDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        e.preventDefault();

        const isOpen = dropdown.classList.contains('open');
        navDropdowns.forEach(item => item.classList.remove('open'));
        if (!isOpen) {
            dropdown.classList.add('open');
        }
    });
});

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        // En mobile, un clic sur l'entrée parent de dropdown sert uniquement à ouvrir/fermer son sous-menu
        if (window.innerWidth <= 768 && link.parentElement.classList.contains('dropdown')) {
            return;
        }

        navLinks.classList.remove('active');
        toggleMenu.classList.remove('active');
        navDropdowns.forEach(item => item.classList.remove('open'));
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
                card.style.display = 'block';
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
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulation d'envoi
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Votre message a été envoyé avec succès!');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Animation pour l'effet machine à écrire
const typewriterElement = document.querySelector('.typewriter');
if (typewriterElement) {
    // Sur mobile, on garde un texte fixe pour éviter les sauts de mise en page.
    if (window.innerWidth <= 768) {
        typewriterElement.textContent = 'Développeur Web';
    } else {
    const phrases = ['Développeur Web'];
    let i = 0;
    let j = 0;
    let currentPhrase = [];
    let isDeleting = false;
    let isEnd = false;

    function typewriter() {
        isEnd = false;
        if (i < phrases.length) {
            
            if (!isDeleting && j <= phrases[i].length) {
                currentPhrase.push(phrases[i][j]);
                j++;
                typewriterElement.innerHTML = currentPhrase.join('');
            }

            if (isDeleting && j <= phrases[i].length) {
                currentPhrase.pop();
                j--;
                typewriterElement.innerHTML = currentPhrase.join('');
            }

            if (j == phrases[i].length) {
                isEnd = true;
                isDeleting = true;
            }

            if (isDeleting && j === 0) {
                currentPhrase = [];
                isDeleting = false;
                i++;
                if (i === phrases.length) {
                    i = 0;
                }
            }
        }
        
        const spedUp = 80;
        const normalSpeed = 120;
        const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed;
        setTimeout(typewriter, time);
    }

    typewriter();
    }
}

// Animation initiale
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
});

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
        console.log('Premier accordéon ouvert:', firstAccordionItem.querySelector('h3').textContent);
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
            
            // Debug: afficher dans la console
            console.log('Accordéon cliqué:', parent.querySelector('h3').textContent, 'Actif:', parent.classList.contains('active'));
        });
    });
    
    // Debug: afficher tous les accordéons trouvés
    console.log('Accordéons trouvés:', accordionHeaders.length);
    
    // Vérifier que tous les accordéons sont bien initialisés
    document.querySelectorAll('.accordion-item').forEach((item, index) => {
        console.log(`Accordéon ${index + 1}:`, item.querySelector('h3').textContent, 'Classe active:', item.classList.contains('active'));
    });
}); 