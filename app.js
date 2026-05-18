// État de l'application
let currentTemplate = 1;
let currentPhotoBase64 = null;

// Éléments DOM
const elements = {
    fullname: document.getElementById('fullname'),
    jobtitle: document.getElementById('jobtitle'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    location: document.getElementById('location'),
    birthdate: document.getElementById('birthdate'),
    summary: document.getElementById('summary'),
    experience: document.getElementById('experience'),
    education: document.getElementById('education'),
    skills: document.getElementById('skills'),
    languages: document.getElementById('languages'),
    interests: document.getElementById('interests'),
    photoUpload: document.getElementById('photoUpload'),
    photoContainer: document.getElementById('photoContainer'),
    templateSelect: document.getElementById('templateSelect'),
    cvPreview: document.getElementById('cvPreview'),
    downloadBtn: document.getElementById('downloadPdfBtn'),
    resetBtn: document.getElementById('resetBtn')
};

// Template Gallery
const templatesGrid = document.getElementById('templatesGrid');

function initTemplatesGallery() {
    templates.forEach((template, index) => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <div class="template-preview">
                <div class="preview-placeholder" style="background: ${template.color}">
                    <i class="fas fa-file-alt" style="font-size: 3rem; color: white;"></i>
                </div>
            </div>
            <div class="template-info">
                <h3>${template.name}</h3>
                <p>${template.description}</p>
                <span class="template-badge">${template.category}</span>
            </div>
        `;
        card.addEventListener('click', () => {
            elements.templateSelect.value = index + 1;
            currentTemplate = index + 1;
            generateCV();
            showToast(`Template "${template.name}" sélectionné`);
            document.querySelector('#editor').scrollIntoView({ behavior: 'smooth' });
        });
        templatesGrid.appendChild(card);
    });
}

// Génération du CV
function generateCV() {
    const data = {
        fullname: elements.fullname.value || 'Nom Prénom',
        jobtitle: elements.jobtitle.value || 'Titre professionnel',
        email: elements.email.value || 'email@exemple.fr',
        phone: elements.phone.value || '06 00 00 00 00',
        location: elements.location.value || 'Ville, Pays',
        birthdate: elements.birthdate.value || '',
        summary: elements.summary.value || '',
        experience: elements.experience.value || '',
        education: elements.education.value || '',
        skills: elements.skills.value || '',
        languages: elements.languages.value || '',
        interests: elements.interests.value || '',
        photo: currentPhotoBase64
    };
    
    const template = templates[currentTemplate - 1];
    const cvHtml = template.render(data);
    elements.cvPreview.innerHTML = `<div class="cv-content template-${currentTemplate}">${cvHtml}</div>`;
}

// Clic sur le conteneur photo déclenche l'input
elements.photoContainer.addEventListener('click', () => {
    elements.photoUpload.click();
});

// Gestion de la photo
elements.photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showToast("L'image est trop volumineuse (max 5 Mo)", 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (ev) => {
            currentPhotoBase64 = ev.target.result;
            elements.photoContainer.innerHTML = `
                <img src="${currentPhotoBase64}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
            `;
            generateCV();
        };
        reader.readAsDataURL(file);
    }
});

// Sauvegarde automatique
function autoSave() {
    const formData = {};
    Object.keys(elements).forEach(key => {
        if (elements[key] && elements[key].value !== undefined) {
            formData[key] = elements[key].value;
        }
    });
    formData.currentTemplate = currentTemplate;
    formData.currentPhotoBase64 = currentPhotoBase64;
    localStorage.setItem('cvFormData', JSON.stringify(formData));
}

function autoLoad() {
    const saved = localStorage.getItem('cvFormData');
    if (saved) {
        try {
            const formData = JSON.parse(saved);
            Object.keys(formData).forEach(key => {
                if (elements[key] && elements[key].value !== undefined) {
                    elements[key].value = formData[key];
                }
            });
            if (formData.currentTemplate) {
                currentTemplate = formData.currentTemplate;
                elements.templateSelect.value = currentTemplate;
            }
            if (formData.currentPhotoBase64) {
                currentPhotoBase64 = formData.currentPhotoBase64;
                elements.photoContainer.innerHTML = `
                    <img src="${currentPhotoBase64}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
                `;
            }
            generateCV();
        } catch(e) {
            console.error('Erreur chargement sauvegarde:', e);
        }
    }
}

// Réinitialisation
function resetForm() {
    if (confirm('Voulez-vous vraiment réinitialiser tous les champs ?')) {
        Object.keys(elements).forEach(key => {
            if (elements[key] && elements[key].value !== undefined && key !== 'photoUpload') {
                elements[key].value = '';
            }
        });
        currentPhotoBase64 = null;
        elements.photoContainer.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Cliquez pour ajouter</span>
        `;
        currentTemplate = 1;
        elements.templateSelect.value = '1';
        generateCV();
        showToast('Formulaire réinitialisé');
    }
}

// Téléchargement PDF
async function downloadPDF() {
    showToast('Génération du PDF en cours...');
    
    try {
        generateCV();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const element = document.querySelector('.cv-content');
        if (!element) throw new Error('Contenu introuvable');
        
        const filename = `CV_${(elements.fullname.value || 'candidat').replace(/[^a-z0-9]/gi, '_')}.pdf`;
        
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: filename,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, letterRendering: true, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
        showToast('PDF téléchargé avec succès !', 'success');
    } catch (error) {
        console.error('Erreur PDF:', error);
        showToast('Erreur lors de la génération du PDF', 'error');
    }
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Navigation smooth
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Event listeners
const inputs = ['fullname', 'jobtitle', 'email', 'phone', 'location', 'birthdate', 'summary', 'experience', 'education', 'skills', 'languages', 'interests'];
inputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', () => {
            generateCV();
            autoSave();
        });
    }
});

elements.templateSelect.addEventListener('change', (e) => {
    currentTemplate = parseInt(e.target.value);
    generateCV();
    autoSave();
});

elements.downloadBtn.addEventListener('click', downloadPDF);
elements.resetBtn.addEventListener('click', resetForm);

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    initTemplatesGallery();
    autoLoad();
    generateCV();
    
    // Animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.template-card, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Sauvegarde périodique
setInterval(autoSave, 30000);
window.addEventListener('beforeunload', autoSave);