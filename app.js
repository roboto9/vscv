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

// Données d'exemple pour les previews
const previewData = {
    fullname: 'Sophie Moreau',
    jobtitle: 'Développeuse Full Stack',
    email: 'sophie@exemple.fr',
    phone: '06 12 34 56 78',
    location: 'Lyon, France',
    birthdate: '15/03/1995',
    summary: 'Développeuse passionnée avec 5 ans d\'expérience dans la création d\'applications web modernes.',
    experience: '2023 - aujourd\'hui : Dev Full Stack - TechCorp\n2021 - 2023 : Dev Front-end - WebAgence\n2020 - 2021 : Stagiaire - StartupHub',
    education: '2021 : Master Web - Université Lyon\n2018 : Licence Informatique - Université Lyon',
    skills: 'JavaScript, React, Node.js, Python, MongoDB',
    languages: 'Français (natif), Anglais (C1)',
    interests: 'Sport, Voyages, Lecture',
    photo: null
};

function initTemplatesGallery() {
    templates.forEach((template, index) => {
        const card = document.createElement('div');
        card.className = 'template-card';
        const renderedCV = template.render(previewData);
        card.innerHTML = `
            <div class="template-preview">
                <div class="template-preview-scaler">
                    <div class="cv-content template-${index + 1}">${renderedCV}</div>
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

// Téléchargement PDF via impression navigateur
function downloadPDF() {
    generateCV();

    const cvElement = document.querySelector('.cv-content');
    if (!cvElement) { showToast('Contenu introuvable', 'error'); return; }

    // Récupère tous les styles de la page (liens externes inclus)
    const styles = Array.from(document.styleSheets).map(sheet => {
        try { return Array.from(sheet.cssRules).map(r => r.cssText).join('\n'); }
        catch(e) { return ''; }
    }).join('\n');

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>CV - ${elements.fullname.value || 'CV'}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ${styles}

        /* ---- Forcer UNE seule page A4 ---- */
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: white; width: 210mm; }

        .cv-content {
            width: 210mm;
            max-width: 210mm;
            min-height: auto !important;
            padding: 10mm 12mm !important;
            margin: 0 !important;
            font-size: 0.80rem !important;
            line-height: 1.35 !important;
            overflow: hidden;
            background: white;
        }
        .cv-content .cv-name  { font-size: 1.5rem !important; }
        .cv-content .cv-job   { font-size: 0.9rem !important; }
        .cv-content .cv-header { padding: 1rem !important; margin-bottom: 1rem !important; border-radius: 10px !important; }
        .cv-content .cv-section { margin: 0.55rem 0 !important; }
        .cv-content .cv-section h3 { font-size: 0.82rem !important; margin-bottom: 0.25rem !important; padding-bottom: 0.2rem !important; }
        .cv-content .cv-text  { font-size: 0.78rem !important; line-height: 1.3 !important; }
        .cv-content .skill-tag { font-size: 0.70rem !important; padding: 0.12rem 0.45rem !important; }
        .cv-content .flex-2cols { gap: 0.8rem !important; }
        .cv-content .skills-list { gap: 0.3rem !important; }

        @page { size: A4 portrait; margin: 0; }
        @media print {
            html, body { width: 210mm; height: 297mm; overflow: hidden; }
            .cv-content { page-break-inside: avoid; break-inside: avoid; }
        }
    </style>
</head>
<body>
    ${cvElement.outerHTML}
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
                window.onafterprint = function() { window.close(); };
            }, 600);
        };
    <\/script>
</body>
</html>\`);
    printWindow.document.close();
    showToast('Fenêtre d\'impression ouverte — choisissez "Enregistrer en PDF"', 'success');
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
