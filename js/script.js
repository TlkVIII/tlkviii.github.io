// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour ouvrir la modal
    function openProjectModal(projectPath) {
        const modal = document.getElementById('projectModal');
        const iframe = document.getElementById('projectFrame');
        
        // Ajout de console.log pour le débogage
        console.log('Opening modal with path:', projectPath);
        
        iframe.src = `./${projectPath}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Rendre la fonction accessible globalement
    window.openProjectModal = openProjectModal;

    // Gestionnaires d'événements pour fermer la modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('projectModal');
            const iframe = document.getElementById('projectFrame');
            
            modal.style.display = 'none';
            iframe.src = '';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('projectModal');
        if (event.target === modal) {
            modal.style.display = 'none';
            document.getElementById('projectFrame').src = '';
            document.body.style.overflow = 'auto';
        }
    });
}); 