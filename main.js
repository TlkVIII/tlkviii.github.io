// Code pour changer entre les options SISR et SLAM
document.addEventListener('DOMContentLoaded', function() {
    const pathBtns = document.querySelectorAll('.path-btn');
    const pathContents = document.querySelectorAll('.path-content');
    
    pathBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            pathBtns.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Masquer tous les contenus
            pathContents.forEach(content => content.classList.remove('active'));
            
            // Afficher le contenu correspondant
            const path = this.getAttribute('data-path');
            document.querySelector(`.path-content.${path}`).classList.add('active');
        });
    });
}); 