// Fonctionnalité d'aperçu du panier (VERSION CORRIGÉE)
document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'cart';
    const LEGACY_STORAGE_KEY = 'cartItems';

    function getCartItems() {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(current)) return current;
        const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
        if (Array.isArray(legacy)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
            return legacy;
        }
        return [];
    }

    function setCartItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(items));
    }

    // Vérifier que les éléments existent
    const cartIcon = document.querySelector('.cart-icon');
    const cartPreview = document.getElementById('cart-preview');
    const cartToast = document.getElementById('cart-toast');
    
    // S'assurer que les éléments nécessaires existent
    if (!cartIcon || !cartPreview) {
        console.error('Éléments du panier manquants');
        return; // Sortir si les éléments nécessaires ne sont pas trouvés
    }
    
    const cartPreviewItems = document.getElementById('cart-preview-items');
    const cartPreviewCount = document.querySelector('.cart-preview-count');
    const cartPreviewTotalAmount = document.querySelector('.cart-preview-total-amount');
    const cartContainer = document.querySelector('.cart-container');
    
    // Variable pour suivre l'état de l'aperçu
    let isPreviewVisible = false;
    
    console.log('Initialisation de l\'aperçu du panier');
    
    // Test d'affichage forcé (enlever en production)
    window.showCartPreview = function() {
        cartPreview.classList.add('active');
        console.log('Aperçu du panier forcé');
    };
    
    // Forcer la mise à jour initiale
    setTimeout(function() {
        updateCartCount();
        console.log('Compteur du panier mis à jour');
    }, 500);
    
    // === GESTION DES ÉVÉNEMENTS ===
    
    // 1. Clic sur l'icône du panier
    cartIcon.addEventListener('click', function(e) {
        console.log('Clic sur l\'icône du panier');
        // Ne pas naviguer vers la page panier au premier clic
        if (!cartPreview.classList.contains('active')) {
            e.preventDefault();
            e.stopPropagation();
            updateCartPreview();
            cartPreview.classList.add('active');
            isPreviewVisible = true;
            console.log('Aperçu du panier affiché');
        }
    });
    
    // 2. Survol du panier
    if (cartContainer) {
        cartContainer.addEventListener('mouseenter', function() {
            console.log('Survol du conteneur panier');
            updateCartPreview();
            cartPreview.classList.add('active');
            isPreviewVisible = true;
        });
        
        cartContainer.addEventListener('mouseleave', function() {
            console.log('Fin du survol du conteneur panier');
            setTimeout(() => {
                if (!isPreviewVisible) {
                    cartPreview.classList.remove('active');
                }
            }, 200);
        });
    }
    
    // 3. Fermeture au clic extérieur
    document.addEventListener('click', function(e) {
        if (isPreviewVisible && cartPreview.classList.contains('active') && 
            !cartContainer.contains(e.target) && 
            (!cartToast || !cartToast.contains(e.target))) {
            console.log('Clic extérieur - fermeture du panier');
            cartPreview.classList.remove('active');
            isPreviewVisible = false;
        }
    });
    
    // === FONCTIONS ===
    
    // Mise à jour de l'aperçu du panier
    function updateCartPreview() {
        console.log('Mise à jour de l\'aperçu du panier');
        try {
            // Obtenir les articles du panier depuis le stockage local
            const cartItems = getCartItems();
            console.log('Articles du panier:', cartItems.length);
            
            // Mettre à jour le nombre d'articles
            const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
            if (cartPreviewCount) cartPreviewCount.textContent = totalItems;
            
            // Afficher le contenu approprié selon si le panier est vide ou non
            if (cartItems.length === 0) {
                cartPreviewItems.innerHTML = `
                    <div class="cart-preview-empty">
                        <i class="fas fa-shopping-basket"></i>
                        <p>Votre panier est vide</p>
                    </div>
                `;
                if (cartPreviewTotalAmount) cartPreviewTotalAmount.textContent = '€0.00';
            } else {
                // Calculer le total
                const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
                if (cartPreviewTotalAmount) cartPreviewTotalAmount.textContent = `€${total.toFixed(2)}`;
                
                // Générer le HTML pour chaque article
                cartPreviewItems.innerHTML = cartItems.map(item => `
                    <div class="cart-preview-item" data-id="${item.id || '0'}">
                        <img src="${item.image || '/Images/default-product.png'}" alt="${item.name || 'Produit'}">
                        <div class="cart-preview-item-details">
                            <h4 class="cart-preview-item-name">${item.name || 'Produit sans nom'}</h4>
                            <span class="cart-preview-item-price">€${(item.price || 0).toFixed(2)}</span>
                            <span class="cart-preview-item-quantity">Qté: ${item.quantity || 1}</span>
                        </div>
                        <button class="cart-preview-item-remove" data-id="${item.id || '0'}" aria-label="Retirer du panier">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
                
                // Attacher les gestionnaires d'événements pour les boutons de suppression
                document.querySelectorAll('.cart-preview-item-remove').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const itemId = this.getAttribute('data-id');
                        removeFromCart(itemId);
                    });
                });
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'aperçu du panier:', error);
            // Afficher un message d'erreur dans l'aperçu
            cartPreviewItems.innerHTML = `
                <div class="cart-preview-empty">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Une erreur est survenue</p>
                </div>
            `;
        }
    }
    
    // Supprimer un article du panier
    function removeFromCart(itemId) {
        try {
            console.log('Suppression de l\'article:', itemId);
            let cartItems = getCartItems();
            cartItems = cartItems.filter(item => (item.id || '0') !== itemId);
            setCartItems(cartItems);
            
            // Mettre à jour l'aperçu et le compteur
            updateCartPreview();
            updateCartCount();
        } catch (error) {
            console.error('Erreur lors de la suppression d\'un article:', error);
        }
    }
    
    // Mettre à jour le nombre d'articles dans l'icône du panier
    function updateCartCount() {
        try {
            const cartItems = getCartItems();
            const cartCount = document.querySelector('.cart-count');
            if (!cartCount) return;
            
            const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
            
            // Animation si le panier n'est pas vide
            if (totalItems > 0) {
                cartCount.classList.add('cart-added-animation');
                setTimeout(() => {
                    cartCount.classList.remove('cart-added-animation');
                }, 500);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compteur:', error);
        }
    }
    
    // Intercepter les clics sur "Ajouter au panier"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            try {
                console.log('Clic sur Ajouter au panier');
                // Obtenir les informations sur le produit
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('h3')?.textContent || 'Produit';
                    const productPriceText = productCard.querySelector('.price')?.textContent || '€0';
                    const productPrice = parseFloat(productPriceText.replace('€', '')) || 0;
                    const productImage = productCard.querySelector('img')?.src || '/Images/default-product.png';
                    const productId = Date.now().toString(); // Identifiant temporaire unique
                    
                    console.log('Produit détecté:', productName, productPrice);
                    
                    // Ajouter au panier
                    addToCart({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                    
                    // Afficher la notification toast et ouvrir l'aperçu du panier
                    showCartNotification(`"${productName}" ajouté au panier`);
                    
                    // Ouvrir automatiquement l'aperçu du panier lors de l'ajout
                    setTimeout(() => {
                        updateCartPreview();
                        cartPreview.classList.add('active');
                        isPreviewVisible = true;
                    }, 300);
                }
            } catch (error) {
                console.error('Erreur lors de l\'ajout au panier:', error);
            }
        }
    });
    
    // Ajouter un produit au panier
    function addToCart(product) {
        try {
            let cartItems = getCartItems();
            
            // Vérifier si le produit est déjà dans le panier
            const existingItemIndex = cartItems.findIndex(item => 
                item.name === product.name && item.price === product.price
            );
            
            if (existingItemIndex !== -1) {
                // Incrémenter la quantité si le produit existe déjà
                cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + (product.quantity || 1);
            } else {
                // Ajouter le nouveau produit
                cartItems.push(product);
            }
            
            // Enregistrer dans le stockage local
            setCartItems(cartItems);
            console.log('Panier mis à jour:', cartItems.length, 'articles');
            
            // Mettre à jour l'aperçu et le compteur
            updateCartPreview();
            updateCartCount();
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
        }
    }
    
    // Afficher la notification d'ajout au panier
    function showCartNotification(message) {
        if (!cartToast) return;
        
        const textElement = cartToast.querySelector('.cart-toast-text');
        if (textElement) textElement.textContent = message;
        
        cartToast.classList.add('show');
        console.log('Notification affichée:', message);
        
        // Animation de l'icône du panier
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) cartCount.classList.add('cart-added-animation');
        
        // Masquer après 3 secondes
        setTimeout(() => {
            cartToast.classList.remove('show');
            if (cartCount) cartCount.classList.remove('cart-added-animation');
        }, 3000);
    }
    
    // Initialiser l'affichage
    updateCartCount();
    console.log('Initialisation terminée');
}); 