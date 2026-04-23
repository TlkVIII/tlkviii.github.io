// Variables globales
let originalImage = null;
let currentImage = null;
let canvas = null;
let ctx = null;
let currentRotation = 0;
let flipHorizontal = false;
let flipVertical = false;
let currentFilter = 'none';
let eyedropperMode = false;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('imageCanvas');
    ctx = canvas.getContext('2d');
    
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    // Événements de téléchargement
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    imageInput.addEventListener('change', handleFileSelect);
    
    // Événements des contrôles
    setupControls();
});

// Gestion du drag & drop
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#2980b9';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#3498db';
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        loadImage(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

// Chargement de l'image
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            currentImage = img;
            resetTransformations();
            displayImage();
            document.getElementById('editorWrapper').style.display = 'grid';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Affichage de l'image sur le canvas
function displayImage() {
    if (!currentImage) return;
    
    // Calculer les dimensions en gardant les proportions
    const maxWidth = 800;
    const maxHeight = 600;
    let width = currentImage.width;
    let height = currentImage.height;
    
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Appliquer les transformations
    ctx.save();
    
    // Translation au centre pour la rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((currentRotation * Math.PI) / 180);
    
    // Appliquer les miroirs
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    
    // Dessiner l'image
    ctx.drawImage(
        currentImage,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
    );
    
    ctx.restore();
    
    // Appliquer les filtres CSS
    applyFilters();
}

// Application des filtres CSS
function applyFilters() {
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const saturation = document.getElementById('saturation').value;
    const hue = document.getElementById('hue').value;
    const blur = document.getElementById('blur').value;
    
    let filterString = '';
    
    // Filtres de base
    filterString += `brightness(${brightness}%) `;
    filterString += `contrast(${contrast}%) `;
    filterString += `saturate(${saturation}%) `;
    filterString += `hue-rotate(${hue}deg) `;
    
    if (blur > 0) {
        filterString += `blur(${blur}px) `;
    }
    
    // Filtres prédéfinis
    switch(currentFilter) {
        case 'grayscale':
            filterString += 'grayscale(100%) ';
            break;
        case 'sepia':
            filterString += 'sepia(100%) ';
            break;
        case 'vintage':
            filterString += 'sepia(50%) contrast(120%) brightness(110%) ';
            break;
        case 'cool':
            filterString += 'hue-rotate(180deg) saturate(120%) ';
            break;
        case 'warm':
            filterString += 'sepia(30%) saturate(130%) brightness(110%) ';
            break;
    }
    
    canvas.style.filter = filterString.trim();
}

// Configuration des contrôles
function setupControls() {
    // Sliders
    const controls = ['brightness', 'contrast', 'saturation', 'hue', 'blur'];
    controls.forEach(control => {
        const slider = document.getElementById(control);
        const valueDisplay = document.getElementById(control + 'Value');
        
        slider.addEventListener('input', () => {
            if (control === 'blur') {
                valueDisplay.textContent = slider.value + 'px';
            } else if (control === 'hue') {
                valueDisplay.textContent = slider.value + '°';
            } else {
                valueDisplay.textContent = slider.value + '%';
            }
            displayImage();
        });
    });
    
    // Boutons de filtres
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayImage();
        });
    });
    
    // Transformations
    document.getElementById('rotateLeft').addEventListener('click', () => {
        currentRotation -= 90;
        displayImage();
    });
    
    document.getElementById('rotateRight').addEventListener('click', () => {
        currentRotation += 90;
        displayImage();
    });
    
    document.getElementById('flipHorizontal').addEventListener('click', () => {
        flipHorizontal = !flipHorizontal;
        displayImage();
    });
    
    document.getElementById('flipVertical').addEventListener('click', () => {
        flipVertical = !flipVertical;
        displayImage();
    });
    
    // Réinitialiser
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (originalImage) {
            currentImage = originalImage;
            resetTransformations();
            displayImage();
        }
    });
    
    // Télécharger
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);

    // Pipette
    const eyedropperBtn = document.getElementById('eyedropperBtn');
    eyedropperBtn.addEventListener('click', () => {
        eyedropperMode = !eyedropperMode;
        eyedropperBtn.classList.toggle('active', eyedropperMode);
        canvas.classList.toggle('eyedropper-active', eyedropperMode);
    });

    canvas.addEventListener('click', handleEyedropperPick);
}

// Réinitialisation des transformations
function resetTransformations() {
    currentRotation = 0;
    flipHorizontal = false;
    flipVertical = false;
    currentFilter = 'none';
    
    // Réinitialiser les sliders
    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('saturation').value = 100;
    document.getElementById('hue').value = 0;
    document.getElementById('blur').value = 0;
    
    // Réinitialiser les affichages
    document.getElementById('brightnessValue').textContent = '100%';
    document.getElementById('contrastValue').textContent = '100%';
    document.getElementById('saturationValue').textContent = '100%';
    document.getElementById('hueValue').textContent = '0°';
    document.getElementById('blurValue').textContent = '0px';
    
    // Réinitialiser les filtres
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');

    eyedropperMode = false;
    const eyedropperBtn = document.getElementById('eyedropperBtn');
    if (eyedropperBtn) eyedropperBtn.classList.remove('active');
    if (canvas) canvas.classList.remove('eyedropper-active');
}

function handleEyedropperPick(event) {
    if (!eyedropperMode || !canvas || !ctx || !currentImage) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    updatePickedColor(r, g, b);
}

function updatePickedColor(r, g, b) {
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const pickedColorHex = document.getElementById('pickedColorHex');
    const pickedColorRgb = document.getElementById('pickedColorRgb');
    const pickedColorPreview = document.getElementById('pickedColorPreview');

    if (pickedColorHex) pickedColorHex.textContent = `HEX: ${hex}`;
    if (pickedColorRgb) pickedColorRgb.textContent = `RGB: ${r}, ${g}, ${b}`;
    if (pickedColorPreview) pickedColorPreview.style.background = `rgb(${r}, ${g}, ${b})`;
}

function toHex(value) {
    return value.toString(16).padStart(2, '0').toUpperCase();
}

// Téléchargement de l'image
function downloadImage() {
    if (!canvas) return;
    
    // Créer un canvas temporaire pour appliquer tous les filtres
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Dessiner l'image transformée
    tempCtx.save();
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((currentRotation * Math.PI) / 180);
    tempCtx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    tempCtx.drawImage(
        currentImage,
        -tempCanvas.width / 2,
        -tempCanvas.height / 2,
        tempCanvas.width,
        tempCanvas.height
    );
    tempCtx.restore();
    
    // Appliquer les filtres (sauf blur qui nécessite une approche différente)
    const brightness = document.getElementById('brightness').value / 100;
    const contrast = document.getElementById('contrast').value / 100;
    const saturation = document.getElementById('saturation').value / 100;
    const hue = document.getElementById('hue').value;
    
    // Convertir les filtres CSS en manipulation de pixels (simplifié)
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    
    // Appliquer brightness, contrast, saturation
    for (let i = 0; i < data.length; i += 4) {
        // Brightness
        data[i] = Math.min(255, data[i] * brightness);
        data[i + 1] = Math.min(255, data[i + 1] * brightness);
        data[i + 2] = Math.min(255, data[i + 2] * brightness);
        
        // Contrast
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        
        // Saturation (simplifié)
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.min(255, gray + (data[i] - gray) * saturation);
        data[i + 1] = Math.min(255, gray + (data[i + 1] - gray) * saturation);
        data[i + 2] = Math.min(255, gray + (data[i + 2] - gray) * saturation);
    }
    
    tempCtx.putImageData(imageData, 0, 0);
    
    // Télécharger
    tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image-personnalisee.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}


